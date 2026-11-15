export declare function getQualityReportHandler(args: {
    reportName?: string;
}): {
    availableReports: never[];
    total: number;
    reports?: undefined;
    reportName?: undefined;
    path?: undefined;
    sizeBytes?: undefined;
    modifiedAt?: undefined;
    content?: undefined;
} | {
    total: number;
    reports: {
        name: string;
        path: string;
        sizeBytes: number;
        modifiedAt: string;
    }[];
    availableReports?: undefined;
    reportName?: undefined;
    path?: undefined;
    sizeBytes?: undefined;
    modifiedAt?: undefined;
    content?: undefined;
} | {
    reportName: string;
    path: string;
    sizeBytes: number;
    modifiedAt: string;
    content: string;
    availableReports?: undefined;
    total?: undefined;
    reports?: undefined;
};
//# sourceMappingURL=reports.d.ts.map