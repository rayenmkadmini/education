import { spawn } from 'child_process';
import { getWorkspacePaths, redactSensitiveData } from '../security.js';
import { McpSecurityError } from '../types.js';
export async function runQualityChecksHandler(args) {
    const paths = getWorkspacePaths();
    // Strict whitelist mapping: only approved executable commands and args
    const commandMap = {
        test: {
            cmd: 'npm',
            args: ['test'],
            cwd: paths.studioDir,
        },
        lint: {
            cmd: 'npm',
            args: ['run', 'lint'],
            cwd: paths.studioDir,
        },
        build: {
            cmd: 'npm',
            args: ['run', 'build'],
            cwd: paths.studioDir,
        },
        typecheck: {
            cmd: 'npx',
            args: ['tsc', '--noEmit'],
            cwd: paths.studioDir,
        },
        compliance: {
            cmd: 'python3',
            args: ['bac-ai-mcp/scripts/test_compliance.py'],
            cwd: paths.workspaceRoot,
        },
    };
    const selected = commandMap[args.target];
    if (!selected) {
        throw new McpSecurityError(`Target "${args.target}" is not an approved quality check target.`);
    }
    const startTime = Date.now();
    const maxOutputChars = 50000;
    const timeoutMs = 60000;
    return new Promise((resolve) => {
        let outputBuffer = '';
        let timedOut = false;
        const child = spawn(selected.cmd, selected.args, {
            cwd: selected.cwd,
            env: {
                ...process.env,
                NODE_ENV: 'test',
                CI: 'true',
            },
            shell: false, // Prevents shell injection
        });
        const timer = setTimeout(() => {
            timedOut = true;
            child.kill('SIGKILL');
        }, timeoutMs);
        const appendData = (data) => {
            if (outputBuffer.length < maxOutputChars) {
                outputBuffer += data.toString('utf8');
                if (outputBuffer.length >= maxOutputChars) {
                    outputBuffer += '\n[OUTPUT TRUNCATED: Exceeded 50KB limit]';
                }
            }
        };
        child.stdout.on('data', appendData);
        child.stderr.on('data', appendData);
        child.on('error', (err) => {
            clearTimeout(timer);
            const durationMs = Date.now() - startTime;
            resolve({
                target: args.target,
                commandExecuted: `${selected.cmd} ${selected.args.join(' ')}`,
                exitCode: -1,
                success: false,
                durationMs,
                output: redactSensitiveData(`Failed to start process: ${err.message}`),
            });
        });
        child.on('close', (code) => {
            clearTimeout(timer);
            const durationMs = Date.now() - startTime;
            const cleanOutput = redactSensitiveData(outputBuffer);
            if (timedOut) {
                resolve({
                    target: args.target,
                    commandExecuted: `${selected.cmd} ${selected.args.join(' ')}`,
                    exitCode: -2,
                    success: false,
                    durationMs,
                    output: cleanOutput + '\n[ERROR: Quality check timed out after 60 seconds.]',
                });
            }
            else {
                resolve({
                    target: args.target,
                    commandExecuted: `${selected.cmd} ${selected.args.join(' ')}`,
                    exitCode: code,
                    success: code === 0,
                    durationMs,
                    output: cleanOutput,
                });
            }
        });
    });
}
//# sourceMappingURL=quality.js.map