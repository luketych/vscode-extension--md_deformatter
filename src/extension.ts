import * as vscode from 'vscode';
import { MarkdownConverter } from './markdownConverter';

export function activate(context: vscode.ExtensionContext) {
    console.log('Markdown Simplifier extension is now active!');

    let disposable = vscode.commands.registerCommand('markdown-simplifier.convertFiles', async () => {
        const converter = new MarkdownConverter();
        await converter.convertFiles();
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {
    console.log('Markdown Simplifier extension is now deactivated');
}