# GitHub Actions Setup for VSCode Extension Publishing

This directory contains GitHub Actions workflows for automatically publishing the Markdown Deformatter VSCode extension.

## Workflows

### 1. `publish.yml` - Simple Publish Workflow
- Triggers on pushes to main branch and version tags (v*)
- Automatically publishes to VSCode Marketplace
- Minimal setup, ideal for straightforward publishing

### 2. `ci-cd.yml` - Complete CI/CD Pipeline
- Runs tests and linting before publishing
- Supports pre-release publishing via manual trigger
- Uploads VSIX artifacts for each build
- Only publishes on main branch or version tags

## Setting up VSCE_PAT Secret

To enable automatic publishing, you need to set up a Personal Access Token (PAT) for the VSCode Marketplace:

### Step 1: Create a Personal Access Token in Azure DevOps

1. Go to [Azure DevOps](https://dev.azure.com/)
2. Sign in with the same account you use for the VSCode Marketplace
3. Click on your profile icon → "Personal access tokens"
4. Click "New Token"
5. Configure the token:
   - **Name**: `vsce-publish-token` (or any name you prefer)
   - **Organization**: Select "All accessible organizations"
   - **Expiration**: Set to maximum (1 year) or custom
   - **Scopes**: Click "Show all scopes" and select:
     - **Marketplace**: Check "Acquire" and "Manage"
6. Click "Create" and **copy the token immediately** (you won't see it again!)

### Step 2: Add the Token to GitHub Repository Secrets

1. Go to your GitHub repository: `https://github.com/luketych/vscode-extension--md_deformatter`
2. Navigate to Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Add the secret:
   - **Name**: `VSCE_PAT`
   - **Secret**: Paste the token you copied from Azure DevOps
5. Click "Add secret"

## Usage

### Automatic Publishing

Once the VSCE_PAT secret is configured:

- **On push to main**: Publishes the current version from package.json
- **On version tag**: Publishes with the tag version (e.g., tag `v0.0.4` publishes version `0.0.4`)

### Manual Publishing

You can manually trigger the CI/CD workflow:

1. Go to Actions tab in your repository
2. Select "CI/CD Pipeline"
3. Click "Run workflow"
4. Optionally check "Publish as pre-release" for pre-release versions

### Creating Version Tags

To publish a specific version:

```bash
# Update version in package.json first
npm version patch  # or minor/major

# Create and push tag
git push origin main --tags
```

Or manually:

```bash
git tag v0.0.4
git push origin v0.0.4
```

## Troubleshooting

### Common Issues

1. **"Personal Access Token verification failed"**
   - Ensure the PAT hasn't expired
   - Verify the PAT has correct scopes (Marketplace: Acquire and Manage)
   - Check that the publisher name in package.json matches your marketplace publisher

2. **"Extension not found"**
   - Ensure you've published at least once manually: `vsce publish`
   - Verify the publisher ID is correct in package.json

3. **"Version already exists"**
   - The version in package.json must be higher than the published version
   - Use version tags to explicitly set versions

### Testing Locally

Before pushing, test the workflows locally:

```bash
# Package the extension
vsce package

# Test publishing (dry run)
vsce publish --dry-run
```

## Security Notes

- The VSCE_PAT token is stored securely in GitHub Secrets
- Never commit tokens to the repository
- Rotate tokens annually or if compromised
- The workflows only have access to the token during execution