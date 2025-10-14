#!/usr/bin/env bash

# CallWaiting AI - Production Bootstrap Script
# This script brings up the complete n8n + Redis stack and runs basic validation tests

set -euo pipefail

echo "🚀 CallWaiting AI - Production Bootstrap"
echo "========================================"

# --------- CONFIG (EDIT THESE) ----------
export N8N_BASE_URL="${N8N_BASE_URL:-https://n8n.odia.dev}"
export SUPABASE_URL="${SUPABASE_URL:-https://bcufohulqrceytkrqpgd.supabase.co}"
export SUPABASE_SERVICE_KEY="${SUPABASE_SERVICE_KEY:-CHANGE_ME}"
export FLW_VERIF_HASH="${FLW_VERIF_HASH:-CHANGE_ME}"            # From Flutterwave dashboard
export ALERT_EMAIL="${ALERT_EMAIL:-callwaitingai@gmail.com}"
export SMTP_HOST="${SMTP_HOST:-smtp.gmail.com}"
export SMTP_PORT="${SMTP_PORT:-587}"
export SMTP_USER="${SMTP_USER:-callwaitingai@gmail.com}"
export SMTP_PASS="${SMTP_PASS:-CHANGE_ME_APP_PASSWORD}"
export CALENDLY_LINK="${CALENDLY_LINK:-https://calendly.com/odiadev-ai/callwaiting-demo}"

# --------- FILES ----------
mkdir -p callwaiting-backend && cd callwaiting-backend

cat > .env <<EOF
# n8n core
N8N_HOST=0.0.0.0
N8N_PORT=5678
WEBHOOK_URL=${N8N_BASE_URL}
N8N_EDITOR_BASE_URL=${N8N_BASE_URL}
N8N_PROTOCOL=https
N8N_ENCRYPTION_KEY=$(openssl rand -hex 32)

# security
NODES_EXCLUDE=@n8n/n8n-nodes-base.nodeExecuteCommand,@n8n/n8n-nodes-base.writeBinaryFile,@n8n/n8n-nodes-base.readBinaryFile

# queue mode
EXECUTIONS_MODE=queue
QUEUE_BULL_REDIS_HOST=redis
QUEUE_BULL_REDIS_PORT=6379

# app secrets
SUPABASE_URL=${SUPABASE_URL}
SUPABASE_SERVICE_KEY=${SUPABASE_SERVICE_KEY}
FLW_VERIF_HASH=${FLW_VERIF_HASH}
SMTP_HOST=${SMTP_HOST}
SMTP_PORT=${SMTP_PORT}
SMTP_USER=${SMTP_USER}
SMTP_PASS=${SMTP_PASS}
ALERT_EMAIL=${ALERT_EMAIL}
CALENDLY_LINK=${CALENDLY_LINK}
EOF

cat > docker-compose.yml <<'EOF'
version: "3.8"
services:
  n8n:
    image: n8nio/n8n:latest
    env_file: .env
    environment:
      - NODE_ENV=production
    ports:
      - "5678:5678"
    depends_on:
      - redis
    restart: unless-stopped
  redis:
    image: redis:7-alpine
    restart: unless-stopped
EOF

echo "[+] Bringing up n8n + redis..."
docker compose up -d
sleep 5

echo "[i] Ensure your Flutterwave dashboard Webhook URL points to: ${N8N_BASE_URL}/webhook/flutterwave"
echo "[i] Ensure your Leads form posts to: ${N8N_BASE_URL}/webhook/leads_callwaiting"
echo "[i] Now running two sanity checks against your payment webhook endpoint..."

# Minimal live tests (signature presence vs mismatch)
FLW_WEBHOOK="${N8N_BASE_URL%/}/webhook/flutterwave"
PAYLOAD='{"event":"charge.completed","data":{"id":123456,"amount":300,"currency":"USD","status":"successful","tx_ref":"demo-123","customer":{"name":"Demo User","email":"demo@example.com"}}}'

echo "[test] Valid secret header -> expect HTTP 200"
curl -s -o /dev/null -w "%{http_code}\n" \
  -H "Content-Type: application/json" \
  -H "verif-hash: ${FLW_VERIF_HASH}" \
  -X POST "${FLW_WEBHOOK}" -d "${PAYLOAD}"

echo "[test] Wrong secret header -> expect 401/403"
curl -s -o /dev/null -w "%{http_code}\n" \
  -H "Content-Type: application/json" \
  -H "verif-hash: WRONGSECRET" \
  -X POST "${FLW_WEBHOOK}" -d "${PAYLOAD}"

echo "[✓] Bootstrap finished. Import your n8n workflows, set Supabase schema, and re-run tests."
echo ""
echo "Next steps:"
echo "1. Import n8n workflows from n8n_workflows/ directory"
echo "2. Run Supabase schema from db/supabase_schema_hardened.sql"
echo "3. Configure Flutterwave webhook URL and secret hash"
echo "4. Test complete payment flow with real $1 payment"
echo "5. Verify email deliverability with SPF/DKIM/DMARC"
