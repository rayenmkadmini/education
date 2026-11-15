import { defaultAuditLogger } from '../audit.js';
export function getAuditLogHandler(args, customLogger) {
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
//# sourceMappingURL=audit-tool.js.map