export declare function listDraftsHandler(args: {
    status?: 'DRAFT' | 'PENDING_REVIEW' | 'ALL';
    subject?: string;
    contentType?: string;
    limit?: number;
}): {
    total: number;
    returned: number;
    drafts: any[];
};
export declare function readDraftHandler(args: {
    draftId: string;
}): {
    draftId: any;
    taskId: any;
    version: any;
    status: any;
    subject: any;
    chapter: any;
    contentType: any;
    totalPoints: any;
    createdAt: any;
    updatedAt: any;
    content: any;
};
export declare function writeDraftHandler(args: {
    draftId: string;
    taskId: string;
    subject: string;
    chapter: string;
    contentType: 'COURS' | 'SERIE' | 'DEVOIR' | 'CORRIGE' | 'FICHE_SYNTHESE';
    totalPoints?: number;
    status: 'DRAFT' | 'PENDING_REVIEW';
    content: Record<string, any>;
}): {
    success: boolean;
    draftId: string;
    version: number;
    status: "DRAFT" | "PENDING_REVIEW";
    backupCreated: boolean;
    backupPath: string | null;
    path: string;
    updatedAt: string;
};
//# sourceMappingURL=drafts.d.ts.map