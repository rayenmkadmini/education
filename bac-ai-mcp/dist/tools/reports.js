import fs from 'fs';
import path from 'path';
import { getWorkspacePaths, assertSafePath } from '../security.js';
import { McpNotFoundError } from '../types.js';
export function getQualityReportHandler(args) {
    const paths = getWorkspacePaths();
    if (!fs.existsSync(paths.docsDir)) {
        return { availableReports: [], total: 0 };
    }
    // Find all .md files under docs/
    const findReports = (dir) => {
        const results = [];
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
            const full = path.join(dir, entry.name);
            if (entry.isDirectory()) {
                results.push(...findReports(full));
            }
            else if (entry.name.endsWith('.md')) {
                const stat = fs.statSync(full);
                results.push({
                    name: entry.name,
                    relativePath: path.relative(paths.docsDir, full),
                    fullPath: full,
                    sizeBytes: stat.size,
                    modifiedAt: stat.mtime.toISOString(),
                });
            }
        }
        return results;
    };
    const allReports = findReports(paths.docsDir);
    if (!args.reportName) {
        return {
            total: allReports.length,
            reports: allReports.map((r) => ({
                name: r.name,
                path: `docs/${r.relativePath}`,
                sizeBytes: r.sizeBytes,
                modifiedAt: r.modifiedAt,
            })),
        };
    }
    // Look for the specific report by name or relative path
    const target = allReports.find((r) => r.name === args.reportName || r.relativePath === args.reportName || r.name.toLowerCase() === args.reportName?.toLowerCase());
    if (!target) {
        throw new McpNotFoundError(`Quality report "${args.reportName}" was not found in docs directory.`);
    }
    assertSafePath(target.fullPath, [paths.docsDir]);
    const content = fs.readFileSync(target.fullPath, 'utf8');
    return {
        reportName: target.name,
        path: `docs/${target.relativePath}`,
        sizeBytes: target.sizeBytes,
        modifiedAt: target.modifiedAt,
        content,
    };
}
//# sourceMappingURL=reports.js.map