#!/bin/bash

# ElectiQ Cloud Run Deployment Script
# Usage: ./deploy.sh [PROJECT_ID]

PROJECT_ID=$1

if [ -z "$PROJECT_ID" ]; then
    echo "Usage: ./deploy.sh [PROJECT_ID]"
    exit 1
fi

echo "🚀 Starting ElectiQ Deployment to Google Cloud Run..."

# 1. Build the container
echo "🏗️ Building container image..."
gcloud builds submit --tag gcr.io/$PROJECT_ID/electiq-app

# 2. Deploy to Cloud Run
echo "🌍 Deploying to Cloud Run..."
gcloud run deploy electiq-app \
    --image gcr.io/$PROJECT_ID/electiq-app \
    --platform managed \
    --region asia-south1 \
    --allow-unauthenticated \
    --set-env-vars GOOGLE_API_KEY=YOUR_KEY_HERE

echo "✅ Deployment complete! Check your Cloud Run console for the service URL."
