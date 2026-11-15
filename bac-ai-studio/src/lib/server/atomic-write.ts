import fs from 'fs/promises';
import path from 'path';

/**
 * Writes data to a file atomically:
 * 1. Writes to a unique temporary file in the same directory.
 * 2. Flushes to disk.
 * 3. Atomically renames the temporary file to the final destination.
 */
export async function atomicWriteFile(targetPath: string, content: string): Promise<void> {
  const dir = path.dirname(targetPath);
  await fs.mkdir(dir, { recursive: true });

  const tempPath = `${targetPath}.tmp.${Date.now()}.${Math.floor(Math.random() * 100000)}`;

  try {
    await fs.writeFile(tempPath, content, { encoding: 'utf-8', flag: 'w' });
    await fs.rename(tempPath, targetPath);
  } catch (err) {
    // Clean up temporary file if write or rename failed
    try {
      await fs.unlink(tempPath);
    } catch {
      // Ignore cleanup error if file was never created
    }
    throw err;
  }
}

/**
 * Reads a JSON file safely.
 */
export async function readJsonFile<T>(filePath: string): Promise<T> {
  const raw = await fs.readFile(filePath, { encoding: 'utf-8' });
  return JSON.parse(raw) as T;
}

/**
 * Checks if a file exists on disk.
 */
export async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Creates a backup copy of an existing file into the target backup path.
 */
export async function createBackupCopy(sourcePath: string, backupPath: string): Promise<void> {
  const backupDir = path.dirname(backupPath);
  await fs.mkdir(backupDir, { recursive: true });
  await fs.copyFile(sourcePath, backupPath);
}
