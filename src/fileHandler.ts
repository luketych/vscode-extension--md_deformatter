import * as fs from 'fs/promises';
import { Stats } from 'fs';
import * as path from 'path';

export class FileHandler {
    async findMarkdownFiles(directory: string): Promise<string[]> {
        const mdFiles: string[] = [];
        
        async function walk(dir: string): Promise<void> {
            try {
                const entries = await fs.readdir(dir, { withFileTypes: true });
                
                for (const entry of entries) {
                    const fullPath = path.join(dir, entry.name);
                    
                    if (entry.isDirectory()) {
                        // Skip node_modules and hidden directories
                        if (!entry.name.startsWith('.') && entry.name !== 'node_modules') {
                            await walk(fullPath);
                        }
                    } else if (entry.isFile() && entry.name.endsWith('.md')) {
                        mdFiles.push(fullPath);
                    }
                }
            } catch (error) {
                console.error(`Error reading directory ${dir}:`, error);
            }
        }
        
        await walk(directory);
        return mdFiles.sort();
    }

    async readFile(filePath: string): Promise<string> {
        try {
            const content = await fs.readFile(filePath, 'utf-8');
            return content;
        } catch (error) {
            throw new Error(`Failed to read file ${filePath}: ${error}`);
        }
    }

    async writeFile(filePath: string, content: string): Promise<void> {
        try {
            // Ensure directory exists
            const dir = path.dirname(filePath);
            await this.ensureDirectory(dir);
            
            // Write file
            await fs.writeFile(filePath, content, 'utf-8');
        } catch (error) {
            throw new Error(`Failed to write file ${filePath}: ${error}`);
        }
    }

    private async ensureDirectory(dir: string): Promise<void> {
        try {
            await fs.access(dir);
        } catch {
            // Directory doesn't exist, create it
            await fs.mkdir(dir, { recursive: true });
        }
    }

    async fileExists(filePath: string): Promise<boolean> {
        try {
            await fs.access(filePath);
            return true;
        } catch {
            return false;
        }
    }

    async getFileStats(filePath: string): Promise<Stats> {
        return await fs.stat(filePath);
    }
}