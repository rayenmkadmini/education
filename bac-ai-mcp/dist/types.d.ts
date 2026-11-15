import { z } from 'zod';
/**
 * Autonomy policy levels as specified in BAC AI Tunisia Security Architecture:
 * - LEVEL_1: Read-only operations, safe to execute automatically.
 * - LEVEL_2: Controlled local write operations (new tasks, drafts with backup).
 * - LEVEL_3: Strictly human-supervised actions (publish, git, deploy, external networks).
 */
export declare enum AutonomyLevel {
    LEVEL_1 = "LEVEL_1_AUTOMATIC",
    LEVEL_2 = "LEVEL_2_LOCAL_PROTECTED_WRITE",
    LEVEL_3 = "LEVEL_3_HUMAN_APPROVAL_MANDATORY"
}
/**
 * Custom MCP error classes for fine-grained security and validation handling.
 */
export declare class McpSecurityError extends Error {
    constructor(message: string);
}
export declare class McpValidationError extends Error {
    constructor(message: string);
}
export declare class McpNotFoundError extends Error {
    constructor(message: string);
}
export declare const GetProjectStatusSchema: z.ZodObject<{}, "strict", z.ZodTypeAny, {}, {}>;
export declare const SearchKnowledgeSchema: z.ZodObject<{
    query: z.ZodOptional<z.ZodString>;
    subject: z.ZodOptional<z.ZodString>;
    classification: z.ZodOptional<z.ZodString>;
    isOfficialOnly: z.ZodOptional<z.ZodBoolean>;
    limit: z.ZodDefault<z.ZodNumber>;
}, "strict", z.ZodTypeAny, {
    limit: number;
    query?: string | undefined;
    subject?: string | undefined;
    classification?: string | undefined;
    isOfficialOnly?: boolean | undefined;
}, {
    query?: string | undefined;
    subject?: string | undefined;
    classification?: string | undefined;
    isOfficialOnly?: boolean | undefined;
    limit?: number | undefined;
}>;
export declare const ReadKnowledgeFileSchema: z.ZodObject<{
    documentId: z.ZodString;
}, "strict", z.ZodTypeAny, {
    documentId: string;
}, {
    documentId: string;
}>;
export declare const ListTasksSchema: z.ZodObject<{
    status: z.ZodDefault<z.ZodEnum<["PENDING", "COMPLETED", "ALL"]>>;
    subject: z.ZodOptional<z.ZodString>;
    contentType: z.ZodOptional<z.ZodString>;
    limit: z.ZodDefault<z.ZodNumber>;
}, "strict", z.ZodTypeAny, {
    status: "PENDING" | "COMPLETED" | "ALL";
    limit: number;
    subject?: string | undefined;
    contentType?: string | undefined;
}, {
    status?: "PENDING" | "COMPLETED" | "ALL" | undefined;
    subject?: string | undefined;
    limit?: number | undefined;
    contentType?: string | undefined;
}>;
export declare const GetTaskSchema: z.ZodObject<{
    taskId: z.ZodString;
}, "strict", z.ZodTypeAny, {
    taskId: string;
}, {
    taskId: string;
}>;
export declare const ListDraftsSchema: z.ZodObject<{
    status: z.ZodDefault<z.ZodEnum<["DRAFT", "PENDING_REVIEW", "ALL"]>>;
    subject: z.ZodOptional<z.ZodString>;
    contentType: z.ZodOptional<z.ZodString>;
    limit: z.ZodDefault<z.ZodNumber>;
}, "strict", z.ZodTypeAny, {
    status: "ALL" | "DRAFT" | "PENDING_REVIEW";
    limit: number;
    subject?: string | undefined;
    contentType?: string | undefined;
}, {
    status?: "ALL" | "DRAFT" | "PENDING_REVIEW" | undefined;
    subject?: string | undefined;
    limit?: number | undefined;
    contentType?: string | undefined;
}>;
export declare const ReadDraftSchema: z.ZodObject<{
    draftId: z.ZodString;
}, "strict", z.ZodTypeAny, {
    draftId: string;
}, {
    draftId: string;
}>;
export declare const GetQualityReportSchema: z.ZodObject<{
    reportName: z.ZodOptional<z.ZodString>;
}, "strict", z.ZodTypeAny, {
    reportName?: string | undefined;
}, {
    reportName?: string | undefined;
}>;
export declare const GetAuditLogSchema: z.ZodObject<{
    limit: z.ZodDefault<z.ZodNumber>;
    action: z.ZodOptional<z.ZodString>;
}, "strict", z.ZodTypeAny, {
    limit: number;
    action?: string | undefined;
}, {
    limit?: number | undefined;
    action?: string | undefined;
}>;
export declare const CreateTaskSchema: z.ZodObject<{
    taskId: z.ZodString;
    subject: z.ZodString;
    chapter: z.ZodString;
    contentType: z.ZodEnum<["COURS", "SERIE", "DEVOIR", "CORRIGE", "FICHE_SYNTHESE"]>;
    instructions: z.ZodString;
    durationMinutes: z.ZodDefault<z.ZodNumber>;
    totalPoints: z.ZodDefault<z.ZodNumber>;
    difficulty: z.ZodDefault<z.ZodEnum<["INITIATION", "STANDARD", "BAC_OFFICIEL", "EXCELLENCE"]>>;
    sourceReferences: z.ZodArray<z.ZodObject<{
        fileName: z.ZodString;
        pageRange: z.ZodOptional<z.ZodString>;
        conceptNote: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        fileName: string;
        pageRange?: string | undefined;
        conceptNote?: string | undefined;
    }, {
        fileName: string;
        pageRange?: string | undefined;
        conceptNote?: string | undefined;
    }>, "many">;
}, "strict", z.ZodTypeAny, {
    subject: string;
    contentType: "COURS" | "SERIE" | "DEVOIR" | "CORRIGE" | "FICHE_SYNTHESE";
    taskId: string;
    chapter: string;
    instructions: string;
    durationMinutes: number;
    totalPoints: number;
    difficulty: "INITIATION" | "STANDARD" | "BAC_OFFICIEL" | "EXCELLENCE";
    sourceReferences: {
        fileName: string;
        pageRange?: string | undefined;
        conceptNote?: string | undefined;
    }[];
}, {
    subject: string;
    contentType: "COURS" | "SERIE" | "DEVOIR" | "CORRIGE" | "FICHE_SYNTHESE";
    taskId: string;
    chapter: string;
    instructions: string;
    sourceReferences: {
        fileName: string;
        pageRange?: string | undefined;
        conceptNote?: string | undefined;
    }[];
    durationMinutes?: number | undefined;
    totalPoints?: number | undefined;
    difficulty?: "INITIATION" | "STANDARD" | "BAC_OFFICIEL" | "EXCELLENCE" | undefined;
}>;
export declare const WriteDraftSchema: z.ZodObject<{
    draftId: z.ZodString;
    taskId: z.ZodString;
    subject: z.ZodString;
    chapter: z.ZodString;
    contentType: z.ZodEnum<["COURS", "SERIE", "DEVOIR", "CORRIGE", "FICHE_SYNTHESE"]>;
    totalPoints: z.ZodDefault<z.ZodNumber>;
    status: z.ZodDefault<z.ZodEnum<["DRAFT", "PENDING_REVIEW"]>>;
    content: z.ZodRecord<z.ZodString, z.ZodAny>;
}, "strict", z.ZodTypeAny, {
    status: "DRAFT" | "PENDING_REVIEW";
    subject: string;
    contentType: "COURS" | "SERIE" | "DEVOIR" | "CORRIGE" | "FICHE_SYNTHESE";
    taskId: string;
    draftId: string;
    chapter: string;
    totalPoints: number;
    content: Record<string, any>;
}, {
    subject: string;
    contentType: "COURS" | "SERIE" | "DEVOIR" | "CORRIGE" | "FICHE_SYNTHESE";
    taskId: string;
    draftId: string;
    chapter: string;
    content: Record<string, any>;
    status?: "DRAFT" | "PENDING_REVIEW" | undefined;
    totalPoints?: number | undefined;
}>;
export declare const RunQualityChecksSchema: z.ZodObject<{
    target: z.ZodEnum<["test", "lint", "build", "typecheck", "compliance"]>;
}, "strict", z.ZodTypeAny, {
    target: "test" | "lint" | "build" | "typecheck" | "compliance";
}, {
    target: "test" | "lint" | "build" | "typecheck" | "compliance";
}>;
//# sourceMappingURL=types.d.ts.map