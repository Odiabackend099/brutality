#!/bin/bash

# CallWaiting AI Backend Deployment Script
# This script automates the deployment process

set -e  # Exit on any error

echo "🚀 CallWaiting AI Backend Deployment Script"
echo "=========================================="

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "❌ .env file not found!"
    echo "Please copy env.example to .env and fill in your values:"
    echo "cp env.example .env"
    echo "nano .env"
    exit 1
fi

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running!"
    echo "Please start Docker and try again."
    exit 1
fi

# Check if Docker Compose is available
if ! command -v docker-compose &> /dev/null; then
    echo "❌ docker-compose not found!"
    echo "Please install Docker Compose and try again."
    exit 1
fi

echo "✅ Prerequisites check passed"

# Pull latest images
echo "📥 Pulling latest Docker images..."
docker-compose pull

# Start services
echo "🚀 Starting services..."
docker-compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check service status
echo "📊 Checking service status..."
docker-compose ps

# Show logs
echo "📋 Recent logs:"
docker-compose logs --tail=20

echo ""
echo "🎉 Deployment completed!"
echo ""
echo "Next steps:"
echo "1. Set up SSL certificate (if not using Cloudflare):"
echo "   sudo certbot --nginx -d n8n.odia.dev"
echo ""
echo "2. Run Supabase schema:"
echo "   Copy contents of db/supabase_schema_hardened.sql to Supabase SQL Editor"
echo ""
echo "3. Import n8n workflows:"
echo "   - Access n8n at https://n8n.odia.dev"
echo "   - Import n8n_workflows/payment_workflow_hardened.json"
echo "   - Import n8n_workflows/leads_workflow_cors.json"
echo "   - Configure credentials"
echo ""
echo "4. Configure Flutterwave webhook:"
echo "   URL: https://n8n.odia.dev/webhook/flutterwave"
echo ""
echo "5. Test the system following the README.md testing protocol"
echo ""
echo "📖 For detailed instructions, see README.md"
echo "🔒 Remember to rotate the Supabase service_role key!"
