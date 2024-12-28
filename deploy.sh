#!/bin/bash

# Exit the script if any command fails
set -e

echo "Building CSS..."
npm run build:css

echo "Building the site..."
npm run build

echo "Adding changes to Git..."
git add .

echo "Committing changes..."
git commit -m "Deploy updates"

echo "Pushing to GitHub..."
git push origin main

echo "Deployment successful!"