import fs from 'fs';
import path from 'path';
import { getWorkspacePaths, redactSensitiveData, sanitizeObject } from './security.js';
import { AutonomyLevel } from './types.js';

export interface AuditEntry {
  id: string;
  timestamp: string;
  action: string;
  actor: 'stdio' | 'http';
  autonomyLevel: AutonomyLevel;
  status: 'SUCCESS' | 'DENIED' | 'ERROR';
  details: Record<string, any>;
  durationMs: number;
}

export class AuditLogger {
  private logFilePath: string;

  constructor(customLogPath?: string) {
    if (customLogPath) {
      this.logFilePath = customLogPath;
    } else {
      const paths = getWorkspacePaths();
      if (!fs.existsSync(paths.logsDir)) {
        fs.mkdirSync(paths.logsDir, { recursive: true });
      }
      this.logFilePath = path.join(paths.logsDir, 'mcp_audit.log');
    }
  }

  /**
   * Appends an audit record atomically in JSONL format.
   */
  public log(entry: Omit<AuditEntry, 'id' | 'timestamp'>): AuditEntry {
    const fullEntry: AuditEntry = {
      id: `AUDIT-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
      timestamp: new Date().toISOString(),
      action: entry.action,
      actor: entry.actor,
      autonomyLevel: entry.autonomyLevel,
      status: entry.status,
      details: sanitizeObject(entry.details),
      durationMs: Math.max(0, entry.durationMs),
    };

    const line = redactSensitiveData(JSON.stringify(fullEntry)) + '\n';
    try {
      const dir = path.dirname(this.logFilePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.appendFileSync(this.logFilePath, line, { encoding: 'utf8', flag: 'a' });
    } catch (err) {
      console.error('[AUDIT-LOGGER-ERROR] Failed to write audit log:', err);
    }

    return fullEntry;
  }

  /**
   * Reads recent audit log entries with optional filtering.
   */
  public getEntries(limit: number = 50, actionFilter?: string): AuditEntry[] {
    if (!fs.existsSync(this.logFilePath)) {
      return [];
    }

    try {
      const content = fs.readFileSync(this.logFilePath, 'utf8');
      const lines = content.trim().split('\n').filter((l) => l.trim().length > 0);
      const entries: AuditEntry[] = [];

      for (let i = lines.length - 1; i >= 0 && entries.length < limit; i--) {
        try {
          const parsed = JSON.parse(lines[i]);
          if (!actionFilter || parsed.action === actionFilter) {
            entries.push(parsed);
          }
        } catch {
          // ignore corrupted lines
        }
      }

      return entries;
    } catch (err) {
      console.error('[AUDIT-LOGGER-ERROR] Failed to read audit log:', err);
      return [];
    }
  }
}

export const defaultAuditLogger = new AuditLogger();
