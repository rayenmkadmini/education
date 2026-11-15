export interface QualityCheckResult {
    target: string;
    commandExecuted: string;
    exitCode: number | null;
    success: boolean;
    durationMs: number;
    output: string;
}
export declare function runQualityChecksHandler(args: {
    target: 'test' | 'lint' | 'build' | 'typecheck' | 'compliance';
}): Promise<QualityCheckResult>;
//# sourceMappingURL=quality.d.ts.map