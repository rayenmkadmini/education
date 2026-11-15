import { AuditLogger, defaultAuditLogger } from '../audit.js';

export function getAuditLogHandler(
  args: { limit?: number; action?: string },
  customLogger?: AuditLogger
) {
  const logger = customLogger || defaultAuditLogger;
  const limit = Math.min(Math.max(args.limit || 50, 1), 200);
  const entries = logger.getEntries(limit, args.action);

  return {
    totalReturned: entries.length,
    limit,
    actionFilter: args.action || null,
    entries,
  };
}
