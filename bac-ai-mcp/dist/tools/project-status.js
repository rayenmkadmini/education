import fs from 'fs';
import path from 'path';
import { getWorkspacePaths } from '../security.js';
export function getProjectStatusHandler() {
    const paths = getWorkspacePaths();
    let pendingCount = 0;
    if (fs.existsSync(paths.tasksPendingDir)) {
        pendingCount = fs.readdirSync(paths.tasksPendingDir).filter((f) => f.endsWith('.json')).length;
    }
    let completedCount = 0;
    if (fs.existsSync(paths.tasksCompletedDir)) {
        completedCount = fs.readdirSync(paths.tasksCompletedDir).filter((f) => f.endsWith('.json')).length;
    }
    let activeDraftsCount = 0;
    if (fs.existsSync(paths.draftsActiveDir)) {
        activeDraftsCount = fs.readdirSync(paths.draftsActiveDir).filter((f) => f.endsWith('.json')).length;
    }
    let backupsCount = 0;
    if (fs.existsSync(paths.draftsBackupsDir)) {
        backupsCount = fs.readdirSync(paths.draftsBackupsDir).filter((f) => f.endsWith('.json')).length;
    }
    let totalCatalogDocs = 0;
    let catalogVersion = 'unknown';
    if (fs.existsSync(paths.catalogJsonPath)) {
        try {
            const cat = JSON.parse(fs.readFileSync(paths.catalogJsonPath, 'utf8'));
            totalCatalogDocs = cat.totalDocuments || (cat.documents ? cat.documents.length : 0);
            catalogVersion = cat.catalogVersion || '1.0.0';
        }
        catch {
            // ignore
        }
    }
    const reportsList = [];
    if (fs.existsSync(paths.docsDir)) {
        const listDocs = (dir) => {
            const entries = fs.readdirSync(dir, { withFileTypes: true });
            for (const entry of entries) {
                const full = path.join(dir, entry.name);
                if (entry.isDirectory()) {
                    listDocs(full);
                }
                else if (entry.name.endsWith('.md')) {
                    reportsList.push(path.relative(paths.docsDir, full));
                }
            }
        };
        listDocs(paths.docsDir);
    }
    return {
        projectName: 'BAC AI Tunisia',
        academicYear: '2026-2027',
        targetAudience: 'Baccalauréat Informatique (4ème Sciences de l\'Informatique)',
        status: 'ACTIVE_DEVELOPMENT_PHASE_PILOT_VERIFIED',
        autonomyPolicy: {
            level1: 'Automatic read-only discovery and analysis',
            level2: 'Protected atomic writes with automated backup for tasks and drafts',
            level3: 'Human approval mandatory: Publishing, Git commits/pushes, Supabase migrations, Cloud deployment',
        },
        workflowMetrics: {
            pendingTasks: pendingCount,
            completedTasks: completedCount,
            activeDrafts: activeDraftsCount,
            historicalBackups: backupsCount,
            indexedKnowledgeDocuments: totalCatalogDocs,
            catalogVersion,
            availableReportsCount: reportsList.length,
        },
        allowedRoots: [
            'content/tasks/pending',
            'content/tasks/completed',
            'content/drafts/active',
            'content/drafts/backups',
            'docs',
            'bac info cours exam resourse (READ-ONLY)',
        ],
    };
}
//# sourceMappingURL=project-status.js.map