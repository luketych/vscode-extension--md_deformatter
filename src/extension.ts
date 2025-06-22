import * as vscode from 'vscode';
import * as path from 'path';
import { MarkdownConverter } from './markdownConverter';

let fileWatcher: vscode.FileSystemWatcher | undefined;
let autoConvertEnabled = false;
const converter = new MarkdownConverter();
const debounceTimers = new Map<string, NodeJS.Timeout>();

export function activate(context: vscode.ExtensionContext) {
    console.log('Markdown Deformatter extension is now active!');

    // Register the main convert command
    let convertCommand = vscode.commands.registerCommand('markdown-deformatter.convertFiles', async () => {
        await converter.convertFiles();
    });

    // Register the toggle auto-convert command
    let toggleCommand = vscode.commands.registerCommand('markdown-deformatter.toggleAutoConvert', async () => {
        const config = vscode.workspace.getConfiguration('markdownDeformatter');
        const currentState = config.get<boolean>('autoConvertEnabled', false);
        await config.update('autoConvertEnabled', !currentState, vscode.ConfigurationTarget.Global);
        
        const newState = !currentState;
        vscode.window.showInformationMessage(`Auto-convert ${newState ? 'enabled' : 'disabled'}`);
        
        // Update the auto-convert based on new state
        if (newState) {
            startFileWatcher(context);
        } else {
            stopFileWatcher();
        }
    });

    context.subscriptions.push(convertCommand);
    context.subscriptions.push(toggleCommand);

    // Check if auto-convert is enabled on startup
    const config = vscode.workspace.getConfiguration('markdownDeformatter');
    if (config.get<boolean>('autoConvertEnabled', false)) {
        startFileWatcher(context);
    }

    // Listen for configuration changes
    context.subscriptions.push(vscode.workspace.onDidChangeConfiguration(e => {
        if (e.affectsConfiguration('markdownDeformatter.autoConvertEnabled')) {
            const config = vscode.workspace.getConfiguration('markdownDeformatter');
            if (config.get<boolean>('autoConvertEnabled', false)) {
                startFileWatcher(context);
            } else {
                stopFileWatcher();
            }
        } else if (e.affectsConfiguration('markdownDeformatter.watchedDirectory')) {
            // Restart watcher if watched directory changes
            if (autoConvertEnabled) {
                stopFileWatcher();
                startFileWatcher(context);
            }
        }
    }));
}

function startFileWatcher(context: vscode.ExtensionContext) {
    stopFileWatcher(); // Stop any existing watcher first

    const config = vscode.workspace.getConfiguration('markdownDeformatter');
    const watchedDir = config.get<string>('watchedDirectory', 'descriptions');
    
    // Create glob pattern for the watched directory
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders || workspaceFolders.length === 0) {
        vscode.window.showWarningMessage('No workspace folder found. Auto-convert requires an open workspace.');
        return;
    }

    // Support both absolute and relative paths
    let watchPattern: string;
    if (path.isAbsolute(watchedDir)) {
        watchPattern = path.join(watchedDir, '**/*.md');
    } else {
        watchPattern = path.join(workspaceFolders[0].uri.fsPath, watchedDir, '**/*.md');
    }

    // Create a RelativePattern for the file watcher
    const relativePattern = new vscode.RelativePattern(workspaceFolders[0], `${watchedDir}/**/*.md`);

    fileWatcher = vscode.workspace.createFileSystemWatcher(relativePattern);
    autoConvertEnabled = true;

    // Handle file creation
    fileWatcher.onDidCreate(uri => {
        handleFileChange(uri.fsPath, 'created');
    });

    // Handle file changes
    fileWatcher.onDidChange(uri => {
        handleFileChange(uri.fsPath, 'changed');
    });

    context.subscriptions.push(fileWatcher);
    
    const statusMessage = `Auto-convert watching: ${watchedDir}`;
    vscode.window.setStatusBarMessage(statusMessage, 5000);
}

function stopFileWatcher() {
    if (fileWatcher) {
        fileWatcher.dispose();
        fileWatcher = undefined;
        autoConvertEnabled = false;
    }
    
    // Clear all pending debounce timers
    debounceTimers.forEach(timer => clearTimeout(timer));
    debounceTimers.clear();
}

function handleFileChange(filePath: string, changeType: 'created' | 'changed') {
    // Clear existing timer for this file if any
    const existingTimer = debounceTimers.get(filePath);
    if (existingTimer) {
        clearTimeout(existingTimer);
    }

    // Set a new debounce timer
    const timer = setTimeout(async () => {
        debounceTimers.delete(filePath);
        
        const config = vscode.workspace.getConfiguration('markdownDeformatter');
        const outputDir = config.get<string>('autoConvertOutputDirectory', '');
        const watchedDir = config.get<string>('watchedDirectory', 'descriptions');
        
        // Determine the source directory for preserving folder structure
        const workspaceFolders = vscode.workspace.workspaceFolders;
        let sourceDir: string | undefined;
        
        if (workspaceFolders && workspaceFolders.length > 0) {
            if (path.isAbsolute(watchedDir)) {
                sourceDir = watchedDir;
            } else {
                sourceDir = path.join(workspaceFolders[0].uri.fsPath, watchedDir);
            }
        }
        
        // Convert the file with source directory to preserve folder structure
        await converter.convertSingleFile(filePath, outputDir || undefined, sourceDir);
    }, 500); // 500ms debounce delay

    debounceTimers.set(filePath, timer);
}

export function deactivate() {
    stopFileWatcher();
    console.log('Markdown Deformatter extension is now deactivated');
}