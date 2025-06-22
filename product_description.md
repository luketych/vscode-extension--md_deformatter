# 🧠 VSCode Extension: Markdown Simplifier for LLM Ingestion

## 📌 Overview

This extension helps developers and AI researchers prepare Markdown files (`.md`) for better LLM (Large Language Model) ingestion. It automatically strips away formatting like bold, italic, code blocks, and headers while keeping the original sentence content intact — making the files easier to search, tokenize, and chunk.

The tool **does not summarize or alter the language**, only **removes Markdown syntax**. It’s perfect for turning structured `.md` documentation into clean, unformatted `.txt` files for vector databases, embeddings, and pre-processing pipelines.

---

## ✅ Key Features

- 🔍 Accepts any folder containing `.md` files
- 📁 Outputs plain `.txt` versions to a target directory
- 🧹 Removes all Markdown formatting (e.g., `**bold**` → `bold`)
- 🔄 Preserves folder structure in output
- ⚙️ Optional: preview before converting
- 🧠 Ideal for pre-LLM ingestion workflows

---

## 🧭 User Flow

When the user activates the extension:

1. **Prompt for Source Directory**:  
   > “Choose the folder containing your `.md` files.”

2. **Prompt for Output Directory**:  
   > “Choose where the cleaned `.txt` files should be saved.”

3. **Run the Conversion Process**:
   - For each `.md` file, convert to `.txt` by removing Markdown formatting.
   - Preserve file hierarchy.
   - Show a status/progress bar.

4. **Notify Upon Completion**:  
   > “All Markdown files have been simplified and saved to [output path].”

---

## 🛠️ How It Works Internally

- Uses a Markdown parser (e.g., [`markdown-it`](https://github.com/markdown-it/markdown-it) or [`showdown`](https://github.com/showdownjs/showdown)) to strip formatting.
- Alternatively, shell out to [`pandoc`](https://pandoc.org) if installed, using:
  ```bash
  pandoc input.md -f markdown -t plain -o output.txt
  ```

- Processes files recursively (including subfolders).
- Skips non-Markdown files.
- Optionally supports “dry-run” mode for testing.

---

## 📂 Example

### Input (`source/docs/example.md`)

```markdown
# What is FeathersJS?

**FeathersJS** is a minimalist, real-time framework for building RESTful and socket-based APIs.

## Benefits

- Lightweight
- **Real-time**
- Easy to integrate with any frontend
```

### Output (`output/docs/example.txt`)

```
What is FeathersJS?

FeathersJS is a minimalist, real-time framework for building RESTful and socket-based APIs.

Benefits

- Lightweight
- Real-time
- Easy to integrate with any frontend
```

---

## 🧩 Extension Configuration (Optional)

```jsonc
{
  "markdownSimplifier.sourceDirectory": "./docs",
  "markdownSimplifier.outputDirectory": "./output",
  "markdownSimplifier.previewChanges": true
}
```

---

## 🔒 Security Considerations

- Only processes files inside the user-specified directory.
- No network activity or telemetry.
- No data is stored externally.

---

## 🏁 Goals

This extension is intended to help developers:
- Improve **token efficiency** when feeding notes/docs to LLMs
- Reduce preprocessing time
- Standardize documentation for embeddings or vector search
