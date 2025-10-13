# n8n Environment Variables (HARDENED)

## CRITICAL SECURITY NOTE
**The service_role key was exposed in the original plan. You MUST rotate it immediately.**

## Required Environment Variables

Set these in your n8n instance (never in code/docs):

```bash
# Supabase Configuration
SUPABASE_URL=https://bcufohulqrceytkrqpgd.supabase.co
SUPABASE_SERVICE_KEY=<ROTATED_SERVICE_KEY>  # ROTATE THE EXPOSED KEY NOW

# Flutterwave Configuration
FLW_SECRET_KEY=<your_flutterwave_secret_key>  # For verify API calls
FLW_VERIF_HASH=<your_webhook_secret_hash>    # From Flutterwave dashboard

# Email Configuration (Gmail SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=callwaitingai@gmail.com
SMTP_PASS=<gmail_app_password>  # NOT your regular password

# Business Configuration
ALERT_EMAIL=callwaitingai@gmail.com
CALENDLY_LINK=https://calendly.com/odiadev-ai/callwaiting-demo

# n8n Configuration (for queue mode)
EXECUTIONS_MODE=queue
QUEUE_BULL_REDIS_HOST=redis
QUEUE_BULL_REDIS_PORT=6379
WEBHOOK_URL=https://n8n.odia.dev/
```

## Credential Setup in n8n

### 1. Flutterwave Bearer Token
- Type: HTTP Request → Basic Auth
- Username: `FLW_SECRET_KEY`
- Password: (leave empty)
- Add header: `Authorization: Bearer {{$env.FLW_SECRET_KEY}}`

### 2. Supabase Service Role
- Type: Supabase
- URL: `{{$env.SUPABASE_URL}}`
- API Key: `{{$env.SUPABASE_SERVICE_KEY}}` (ROTATED)

### 3. Gmail SMTP
- Type: Email SMTP
- Host: `{{$env.SMTP_HOST}}`
- Port: `{{$env.SMTP_PORT}}`
- Username: `{{$env.SMTP_USER}}`
- Password: `{{$env.SMTP_PASS}}`
- Secure: true

## Security Checklist

- [ ] Rotated the exposed Supabase service_role key
- [ ] All secrets stored as environment variables (not in code)
- [ ] Gmail app password generated (not regular password)
- [ ] Flutterwave webhook secret hash configured
- [ ] n8n credentials configured with env vars
- [ ] Queue mode enabled with Redis
- [ ] Webhook URL matches your domain
