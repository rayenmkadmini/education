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
export declare class AuditLogger {
    private logFilePath;
    constructor(customLogPath?: string);
    /**
     * Appends an audit record atomically in JSONL format.
     */
    log(entry: Omit<AuditEntry, 'id' | 'timestamp'>): AuditEntry;
    /**
     * Reads recent audit log entries with optional filtering.
     */
    getEntries(limit?: number, actionFilter?: string): AuditEntry[];
}
export declare const defaultAuditLogger: AuditLogger;
//# sourceMappingURL=audit.d.ts.map