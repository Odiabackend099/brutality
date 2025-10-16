#!/bin/bash

echo "🚀 Setting up Demo Supabase Configuration..."

# Create a demo .env.local with working values
cat > .env.local << 'EOF'
# =============================================================================
# SUPABASE - DEMO CONFIGURATION
# =============================================================================
NEXT_PUBLIC_SUPABASE_URL=https://demo-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRlbW8tcHJvamVjdCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNjQwOTk1MjAwLCJleHAiOjE5NTYzNTUyMDB9.demo-key
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRlbW8tcHJvamVjdCIsInJvbGUiOiJzZXJ2aWNlX3JvbGUiLCJpYXQiOjE2NDA5OTUyMDAsImV4cCI6MTk1NjM1NTIwMH0.demo-service-key

# =============================================================================
# FLUTTERWAVE PAYMENT - DEMO
# =============================================================================
FLUTTERWAVE_PUBLIC_KEY=FLWPUBK_TEST-demo-key
FLUTTERWAVE_SECRET_KEY=FLWSECK_TEST-demo-secret
FLUTTERWAVE_ENCRYPTION_KEY=FLWSECK_TEST-demo-encryption
FLUTTERWAVE_WEBHOOK_SECRET_HASH=demo-webhook-hash
NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY=FLWPUBK_TEST-demo-key

# =============================================================================
# MINIMAX TTS - DEMO
# =============================================================================
MINIMAX_API_KEY=demo-minimax-key
MINIMAX_GROUP_ID=demo-group-id

# =============================================================================
# OPENAI - DEMO
# =============================================================================
OPENAI_API_KEY=sk-demo-openai-key

# =============================================================================
# APP CONFIGURATION
# =============================================================================
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

# =============================================================================
# PRICING (in Naira for Nigeria)
# =============================================================================
BASIC_PLAN_AMOUNT=2900
PRO_PLAN_AMOUNT=7900
ENTERPRISE_PLAN_AMOUNT=19900
EOF

echo "✅ Created demo .env.local file"
echo ""
echo "⚠️  NOTE: This is a DEMO configuration with placeholder values."
echo "   For production, you need to:"
echo "   1. Create a real Supabase project"
echo "   2. Get real API keys from Supabase dashboard"
echo "   3. Replace the demo values in .env.local"
echo ""
echo "🔧 The demo configuration will allow the app to build and run,"
echo "   but authentication won't work until you use real Supabase keys."
echo ""
echo "📋 Next steps:"
echo "   1. Run: npm run dev"
echo "   2. Test the application"
echo "   3. Replace with real Supabase keys when ready"
