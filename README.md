# Markdown Deformatter for LLM Ingestion

This VS Code extension strips Markdown formatting from `.md` files to create clean `.txt` files, making them easier to process by Large Language Models (LLMs).

## Features

-   Converts Markdown files to plain text.
-   Removes headers, bold, italics, links, images, and other formatting.
-   Processes an entire directory of Markdown files at once.
-   **Preview Mode**: View a diff of the changes before writing to any files.

## How to Use

There are two primary ways to use this extension: running it directly from the source code for development, or packaging and installing it for general use.

### 1. Running in the Extension Development Host

This method is ideal for testing and development.

1.  **Open the project** in VS Code.
2.  **Install dependencies**: Open a terminal and run `npm install`.
3.  **Start the debugger**: Press `F5` to open a new **Extension Development Host** window. This window runs a temporary instance of VS Code with your extension loaded.
4.  **Run the command**:
    -   In the Extension Development Host window, open the Command Palette (`Cmd+Shift+P` on macOS, `Ctrl+Shift+P` on Windows).
    -   Type `Markdown Deformatter: Convert MD to TXT` and press `Enter`.
    -   Follow the prompts to select your source and output directories.

### 2. Packaging and Installing the Extension (Manual)

To use this extension in your main VS Code editor without publishing it, you can package it into a `.vsix` file and install it manually.

1.  **Install the packaging tool**:
    ```bash
    npm install -g @vscode/vsce
    ```
2.  **Package the extension**:
    -   In your terminal, navigate to the project's root directory.
    -   Run the following command:
        ```bash
        vsce package
        ```
    -   This will create a file named `markdown-deformatter-0.0.1.vsix` (the version may vary).

3.  **Install the `.vsix` file**:
    -   Open your main VS Code window.
    -   Go to the **Extensions** view (click the icon on the sidebar).
    -   Click the **...** menu in the top-right corner of the Extensions view.
    -   Select **Install from VSIX...** and choose the `.vsix` file you just created.

4.  **Use the installed extension**: Once installed, you can run the `Markdown Deformatter: Convert MD to TXT` command from the Command Palette in any of your projects.

### 3. Publishing to the VS Code Marketplace

To make your extension publicly available, you can publish it to the Visual Studio Marketplace. Anyone will be able to find and install it directly from the Extensions view in VS Code.

**Before you start, make sure you have:**
-   Replaced the placeholder `publisher` and `repository` values in your `package.json` file.
-   Created a 128x128 pixel icon at `images/icon.png`.

#### Step 1: Create a Publisher

You need a publisher account to publish extensions. 

1.  Go to the [Visual Studio Marketplace publisher management page](https://marketplace.visualstudio.com/manage/publishers/).
2.  Sign in with your Microsoft account and follow the prompts to create a new publisher. Your **publisher ID** is what you need to use in your `package.json`.

#### Step 2: Get a Personal Access Token (PAT)

To publish from the command line, you need a Personal Access Token (PAT) to authenticate.

1.  Go to your Azure DevOps organization (`https://dev.azure.com/{your-organization}`).
2.  Navigate to **User settings** > **Personal Access Tokens**.
3.  Create a new PAT with the following settings:
    -   **Organization**: `All accessible organizations`
    -   **Scopes**: `Custom defined` > `Marketplace` > `Manage`
4.  Copy the generated token and save it somewhere safe. You won't be able to see it again.

#### Step 3: Publish the Extension

Now you can use the `vsce` command-line tool to publish.

1.  **Log in with your publisher name**:
    ```bash
    vsce login <your-publisher-name>
    ```
    When prompted, paste your Personal Access Token.

2.  **Publish the extension**:
    ```bash
    vsce publish
    ```

If successful, your extension will be available on the Marketplace within a few minutes!

## Configuration

You can customize the extension's behavior through the VS Code settings.

1.  Open **Settings** (`Cmd+,` on macOS, `Ctrl+,` on Windows).
2.  Search for **"Markdown Deformatter"**.

### Available Settings

-   **Preview Changes**: Enable this option to see a diff view of the changes before any files are created. When disabled, the extension will directly create the converted `.txt` files in the output directory.
-   **Source Directory**: (Optional) Set a default source directory for your Markdown files.
-   **Output Directory**: (Optional) Set a default output directory for the converted text files.
