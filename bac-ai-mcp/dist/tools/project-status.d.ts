export declare function getProjectStatusHandler(): {
    projectName: string;
    academicYear: string;
    targetAudience: string;
    status: string;
    autonomyPolicy: {
        level1: string;
        level2: string;
        level3: string;
    };
    workflowMetrics: {
        pendingTasks: number;
        completedTasks: number;
        activeDrafts: number;
        historicalBackups: number;
        indexedKnowledgeDocuments: number;
        catalogVersion: string;
        availableReportsCount: number;
    };
    allowedRoots: string[];
};
//# sourceMappingURL=project-status.d.ts.map