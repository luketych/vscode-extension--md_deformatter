import * as vscode from 'vscode';
import * as path from 'path';
import { FileHandler } from './fileHandler';
import { MarkdownProcessor } from './markdownProcessor';

export class MarkdownConverter {
    private fileHandler: FileHandler;
    private markdownProcessor: MarkdownProcessor;

    constructor() {
        this.fileHandler = new FileHandler();
        this.markdownProcessor = new MarkdownProcessor();
    }

    async convertFiles(): Promise<void> {
        try {
            // Get source directory
            const sourceUri = await this.selectDirectory('Choose the folder containing your .md files');
            if (!sourceUri) {
                return;
            }

            // Get output directory
            const outputUri = await this.selectDirectory('Choose where the cleaned .txt files should be saved');
            if (!outputUri) {
                return;
            }

            const sourcePath = sourceUri[0].fsPath;
            const outputPath = outputUri[0].fsPath;

            // Get configuration
            const config = vscode.workspace.getConfiguration('markdownSimplifier');
            const previewMode = config.get<boolean>('previewChanges', false);

            // Process files with progress
            await vscode.window.withProgress({
                location: vscode.ProgressLocation.Notification,
                title: 'Converting Markdown files...',
                cancellable: true
            }, async (progress, token) => {
                const mdFiles = await this.fileHandler.findMarkdownFiles(sourcePath);
                
                if (mdFiles.length === 0) {
                    vscode.window.showInformationMessage('No Markdown files found in the selected directory.');
                    return;
                }

                const increment = 100 / mdFiles.length;
                let processedCount = 0;

                for (const mdFile of mdFiles) {
                    if (token.isCancellationRequested) {
                        break;
                    }

                    const relativePath = path.relative(sourcePath, mdFile);
                    progress.report({ 
                        increment, 
                        message: `Processing: ${relativePath}` 
                    });

                    try {
                        const content = await this.fileHandler.readFile(mdFile);
                        const processedContent = this.markdownProcessor.stripMarkdown(content);
                        
                        const outputFile = path.join(
                            outputPath, 
                            relativePath.replace(/\.md$/, '.txt')
                        );

                        if (previewMode) {
                            const originalUri = vscode.Uri.file(mdFile);
                            const convertedDoc = await vscode.workspace.openTextDocument({
                                content: processedContent,
                                language: 'text'
                            });
                            await vscode.commands.executeCommand('vscode.diff', originalUri, convertedDoc.uri, `Preview: ${path.basename(mdFile)}`);
                        } else {
                            await this.fileHandler.writeFile(outputFile, processedContent);
                        }

                        processedCount++;
                    } catch (error) {
                        console.error(`Error processing ${mdFile}:`, error);
                    }
                }

                if (processedCount > 0) {
                    const message = previewMode
                        ? `Previews generated for ${processedCount} file(s).`
                        : `All ${processedCount} Markdown file(s) have been simplified and saved to ${outputPath}`;
                    vscode.window.showInformationMessage(message);
                }
            });

        } catch (error) {
            vscode.window.showErrorMessage(`Error during conversion: ${error}`);
        }
    }

    private async selectDirectory(prompt: string): Promise<vscode.Uri[] | undefined> {
        return await vscode.window.showOpenDialog({
            canSelectFiles: false,
            canSelectFolders: true,
            canSelectMany: false,
            openLabel: 'Select',
            title: prompt
        });
    }
}