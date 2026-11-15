import { AuditLogger } from '../audit.js';
export declare function getAuditLogHandler(args: {
    limit?: number;
    action?: string;
}, customLogger?: AuditLogger): {
    totalReturned: number;
    limit: number;
    actionFilter: string | null;
    entries: import("../audit.js").AuditEntry[];
};
//# sourceMappingURL=audit-tool.d.ts.map