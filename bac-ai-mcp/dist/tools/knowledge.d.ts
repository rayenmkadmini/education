export declare function searchKnowledgeHandler(args: {
    query?: string;
    subject?: string;
    classification?: string;
    isOfficialOnly?: boolean;
    limit?: number;
}): {
    totalMatches: number;
    documents: never[];
    returnedCount?: undefined;
} | {
    totalMatches: number;
    returnedCount: number;
    documents: {
        id: string;
        filename: string;
        classification: string;
        subject: string;
        academicYear: string;
        session: string;
        pageCount: number;
        isOfficial: boolean;
        extractionStatus: string;
        snippet: string;
    }[];
};
export declare function readKnowledgeFileHandler(args: {
    documentId: string;
}): {
    documentId: string;
    filename: string;
    classification: string;
    subject: string;
    academicYear: string;
    isOfficial: boolean | undefined;
    pageCount: number | undefined;
    extractionStatus: string | undefined;
    snippet: string;
    extractedData: any;
    readOnlyNotice: string;
};
//# sourceMappingURL=knowledge.d.ts.map