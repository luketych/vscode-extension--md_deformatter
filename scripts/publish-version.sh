#!/bin/bash

# Script to help with version publishing
# Usage: ./scripts/publish-version.sh [patch|minor|major]

VERSION_TYPE=${1:-patch}

echo "Publishing $VERSION_TYPE version..."

# Update version in package.json
npm version $VERSION_TYPE --no-git-tag-version

# Get the new version
NEW_VERSION=$(node -p "require('./package.json').version")

# Commit the version change
git add package.json package-lock.json
git commit -m "Bump version to $NEW_VERSION"

# Create and push tag
git tag "v$NEW_VERSION"
git push origin main
git push origin "v$NEW_VERSION"

echo "Version $NEW_VERSION published! GitHub Actions will now automatically publish to VSCode Marketplace."
echo "Check the Actions tab in your repository to monitor the publishing process."