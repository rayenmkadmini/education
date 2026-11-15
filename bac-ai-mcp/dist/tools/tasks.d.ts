export declare function listTasksHandler(args: {
    status?: 'PENDING' | 'COMPLETED' | 'ALL';
    subject?: string;
    contentType?: string;
    limit?: number;
}): {
    total: number;
    returned: number;
    tasks: any[];
};
export declare function getTaskHandler(args: {
    taskId: string;
}): any;
export declare function createTaskHandler(args: {
    taskId: string;
    subject: string;
    chapter: string;
    contentType: 'COURS' | 'SERIE' | 'DEVOIR' | 'CORRIGE' | 'FICHE_SYNTHESE';
    instructions: string;
    durationMinutes?: number;
    totalPoints?: number;
    difficulty?: string;
    sourceReferences: Array<{
        fileName: string;
        pageRange?: string;
        conceptNote?: string;
    }>;
}): {
    success: boolean;
    taskId: string;
    status: string;
    createdAt: string;
    path: string;
};
//# sourceMappingURL=tasks.d.ts.map