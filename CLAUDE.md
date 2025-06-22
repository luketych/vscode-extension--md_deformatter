# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a VSCode extension project called "Markdown Deformatter for LLM Ingestion" that strips Markdown formatting from `.md` files and outputs clean `.txt` files for better LLM processing.

## Key Development Tasks

### Initial Setup Commands
```bash
# Initialize VSCode extension project
yo code

# Install dependencies (once package.json exists)
npm install

# Install VSCode extension development tools if needed
npm install -g yo generator-code
```

### Build and Development Commands
```bash
# Compile TypeScript
npm run compile

# Watch mode for development
npm run watch

# Run tests
npm test

# Package extension
vsce package

# Lint TypeScript files
npm run lint
```

### Testing Extension
```bash
# Open extension in new VSCode window
# Press F5 in VSCode or run:
code --extensionDevelopmentPath=.
```

## Architecture Overview

### Core Components
- **Extension Entry Point**: `src/extension.ts` - Registers commands and activates the extension
- **Markdown Processor**: Core logic for stripping Markdown formatting
- **File Handler**: Manages recursive directory traversal and file I/O operations
- **UI Components**: VSCode API integrations for folder selection and progress display

### Key Dependencies
- VSCode Extension API for UI interactions
- Markdown parser (either `markdown-it`, `showdown`, or shell out to `pandoc`)
- File system utilities for recursive processing

### Extension Workflow
1. User activates command via Command Palette
2. Extension prompts for source directory (containing `.md` files)
3. Extension prompts for output directory
4. Processes each `.md` file recursively:
   - Parses Markdown content
   - Strips all formatting syntax
   - Preserves plain text content
   - Saves as `.txt` with same directory structure
5. Shows progress and completion notification

### VSCode Extension Manifest Structure
- `package.json`: Defines extension metadata, commands, and activation events
- `contributes.commands`: Register the main conversion command
- `contributes.configuration`: Optional settings for default directories and preview mode

## Implementation Notes

- Use `vscode.window.showOpenDialog` for directory selection
- Implement progress tracking with `vscode.window.withProgress`
- Handle errors gracefully with `vscode.window.showErrorMessage`
- Support both synchronous and asynchronous file processing
- Maintain original file structure in output directory