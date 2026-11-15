export interface WorkspacePaths {
    workspaceRoot: string;
    knowledgeDir: string;
    tasksPendingDir: string;
    tasksCompletedDir: string;
    draftsActiveDir: string;
    draftsBackupsDir: string;
    docsDir: string;
    reportsDir: string;
    logsDir: string;
    catalogJsonPath: string;
    studioDir: string;
}
/**
 * Resolves and verifies canonical paths within BAC AI Tunisia workspace.
 */
export declare function getWorkspacePaths(overrideRoot?: string): WorkspacePaths;
/**
 * Ensures a relative or absolute path does not escape allowed workspace directories
 * and does not point to forbidden sensitive files.
 */
export declare function assertSafePath(targetPath: string, allowedRoots: string[]): string;
/**
 * Strictly prevents any write operation to the read-only knowledge repository.
 */
export declare function assertNotKnowledgeRepo(targetPath: string, paths: WorkspacePaths): void;
/**
 * Redacts common sensitive tokens, keys, and credentials from output.
 */
export declare function redactSensitiveData(input: string): string;
/**
 * Deep redaction for JSON objects.
 */
export declare function sanitizeObject<T>(obj: T): T;
/**
 * Payload size check.
 */
export declare function assertPayloadSize(payload: unknown, maxBytes?: number): void;
//# sourceMappingURL=security.d.ts.map