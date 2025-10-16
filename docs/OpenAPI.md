# CallWaiting AI - API Reference

Complete API reference for the CallWaiting AI MDP backend.

---

## Authentication

Most endpoints require authentication via **Supabase session cookies**.

For agent webhooks, use the **X-AGENT-KEY** header with the agent-specific API key.

---

## Endpoints

### 1. Create Agent

**`POST /api/create-agent`**

Create a new AI voice agent with custom prompt and voice.

**Authentication:** Required (Supabase session)

**Request Body:**
```json
{
  "name": "string",
  "systemPrompt": "string",
  "voiceId": "professional_f" | "professional_m" | "soft_f" | "warm_m"
}
```

**Success Response (201):**
```json
{
  "agentId": "550e8400-e29b-41d4-a716-446655440000",
  "apiKey": "agt_a1b2c3d4e5f6...",
  "webhookUrl": "https://app.com/api/agent/550e8400/webhook",
  "name": "My AI Receptionist",
  "voiceId": "professional_f"
}
```

**Error Responses:**

- **401 Unauthorized**
  ```json
  { "error": "Unauthorized" }
  ```

- **422 Unprocessable Entity**
  ```json
  { "error": "Missing required fields: name, systemPrompt, voiceId" }
  ```
  ```json
  { "error": "Invalid voiceId. Must be one of: professional_f, professional_m, soft_f, warm_m" }
  ```

- **500 Internal Server Error**
  ```json
  { "error": "Failed to create agent" }
  ```

---

### 2. Generate Voice (TTS)

**`POST /api/generate-voice`**

Convert text to speech using MiniMax TTS.

**Authentication:** Required (Supabase session)

**Request Body:**
```json
{
  "text": "string",
  "voiceId": "professional_f" | "professional_m" | "soft_f" | "warm_m"
}
```

**Success Response (200):**
```json
{
  "audioUrl": "https://cdn.minimax.com/audio/xyz.mp3",
  "duration": 4.2
}
```

**Error Responses:**

- **401 Unauthorized**
  ```json
  { "error": "Unauthorized" }
  ```

- **402 Payment Required**
  ```json
  { "error": "Quota exceeded. Please upgrade your plan." }
  ```

- **422 Unprocessable Entity**
  ```json
  { "error": "Missing required fields: text, voiceId" }
  ```

- **500 Internal Server Error**
  ```json
  { "error": "TTS generation failed" }
  ```

---

### 3. Usage Report

**`GET /api/usage-report`**

Get current usage and quota information for the authenticated user.

**Authentication:** Required (Supabase session)

**Success Response (200):**
```json
{
  "minutesUsed": 45,
  "minutesQuota": 60,
  "remaining": 15,
  "plan": "trial"
}
```

**Error Responses:**

- **401 Unauthorized**
  ```json
  { "error": "Unauthorized" }
  ```

- **500 Internal Server Error**
  ```json
  { "error": "Internal server error" }
  ```

---

### 4. Create Payment Link

**`POST /api/create-payment-link`**

Generate a Flutterwave payment link for plan upgrade.

**Authentication:** Required (Supabase session)

**Request Body:**
```json
{
  "plan": "basic" | "pro" | "enterprise"
}
```

**Success Response (200):**
```json
{
  "paymentLink": "https://checkout.flutterwave.com/pay/xyz123",
  "txRef": "cw_abc123_1234567890_xyz"
}
```

**Error Responses:**

- **401 Unauthorized**
  ```json
  { "error": "Unauthorized" }
  ```

- **404 Not Found**
  ```json
  { "error": "User profile not found" }
  ```

- **422 Unprocessable Entity**
  ```json
  { "error": "Invalid plan. Must be one of: basic, pro, enterprise" }
  ```
  ```json
  { "error": "Cannot purchase trial plan" }
  ```

- **500 Internal Server Error**
  ```json
  { "error": "Failed to create payment link" }
  ```

---

### 5. Flutterwave Webhook

**`POST /api/flutterwave-webhook`**

Receive payment confirmation from Flutterwave.

**Authentication:** Webhook signature verification via `verif-hash` header

**Request Body:** (Flutterwave payload)
```json
{
  "event": "charge.completed",
  "data": {
    "id": 12345,
    "tx_ref": "cw_abc123_1234567890_xyz",
    "status": "successful",
    "amount": 2900,
    "currency": "NGN",
    "customer": {
      "email": "user@example.com",
      "id": "12345"
    }
  }
}
```

**Success Response (200):**
```json
{ "status": "success" }
```

**Error Responses:**

- **401 Unauthorized**
  ```json
  { "error": "Invalid signature" }
  ```

- **500 Internal Server Error**
  ```json
  { "error": "Internal server error" }
  ```

---

### 6. Agent Webhook

**`POST /api/agent/:id/webhook`**

Public endpoint for testing AI agent conversations.

**Authentication:** `X-AGENT-KEY` header with agent-specific API key

**Path Parameters:**
- `id` (string) - Agent UUID

**Headers:**
```
X-AGENT-KEY: agt_a1b2c3d4e5f6...
```

**Request Body:**
```json
{
  "message": "What are your business hours?"
}
```

**Success Response (200):**
```json
{
  "replyText": "We're open Monday to Friday, 9 AM to 5 PM.",
  "audioUrl": "https://cdn.minimax.com/audio/reply-xyz.mp3",
  "duration": 4.2
}
```

**Error Responses:**

- **401 Unauthorized**
  ```json
  { "error": "Missing X-AGENT-KEY header" }
  ```
  ```json
  { "error": "Invalid agent ID or API key" }
  ```

- **402 Payment Required**
  ```json
  { "error": "User quota exceeded. Please upgrade plan." }
  ```

- **403 Forbidden**
  ```json
  { "error": "Agent is inactive" }
  ```

- **422 Unprocessable Entity**
  ```json
  { "error": "Missing message field" }
  ```

- **500 Internal Server Error**
  ```json
  { "error": "Failed to generate audio" }
  ```
  ```json
  { "error": "Internal server error" }
  ```

---

## Voice Presets

| ID              | Description                    |
|-----------------|--------------------------------|
| `professional_f`| Female professional voice      |
| `professional_m`| Male professional voice        |
| `soft_f`        | Female soft/warm voice         |
| `warm_m`        | Male warm/friendly voice       |

---

## Plans

| Plan       | Minutes | Amount (NGN) |
|------------|---------|--------------|
| trial      | 60      | 0            |
| basic      | 500     | 2,900        |
| pro        | 5,000   | 7,900        |
| enterprise | 50,000  | 19,900       |

---

## Rate Limits

*To be implemented in production*

Recommended:
- Create Agent: 10/hour per user
- Generate Voice: 100/hour per user
- Agent Webhook: 1000/hour per agent

---

## Webhooks

### Flutterwave Events

The `/api/flutterwave-webhook` endpoint handles:

- `charge.completed` - Payment successful, activates subscription

**Webhook Configuration:**
1. Go to Flutterwave Dashboard → Settings → Webhooks
2. Set URL: `https://your-domain.com/api/flutterwave-webhook`
3. Copy the secret hash to `FLUTTERWAVE_WEBHOOK_SECRET_HASH`

---

## Error Codes

| Status | Meaning                          |
|--------|----------------------------------|
| 200    | Success                          |
| 201    | Resource created                 |
| 401    | Unauthorized (auth required)     |
| 402    | Payment Required (quota exceeded)|
| 403    | Forbidden (inactive resource)    |
| 404    | Not Found                        |
| 422    | Unprocessable Entity (validation)|
| 500    | Internal Server Error            |

---

## cURL Examples

### Create Agent
```bash
curl -X POST https://app.com/api/create-agent \
  -H "Content-Type: application/json" \
  -H "Cookie: sb-access-token=YOUR_TOKEN" \
  -d '{
    "name": "Support Bot",
    "systemPrompt": "You are a helpful customer support agent.",
    "voiceId": "professional_f"
  }'
```

### Generate TTS
```bash
curl -X POST https://app.com/api/generate-voice \
  -H "Content-Type: application/json" \
  -H "Cookie: sb-access-token=YOUR_TOKEN" \
  -d '{
    "text": "Hello, how can I help you today?",
    "voiceId": "professional_f"
  }'
```

### Check Usage
```bash
curl https://app.com/api/usage-report \
  -H "Cookie: sb-access-token=YOUR_TOKEN"
```

### Create Payment Link
```bash
curl -X POST https://app.com/api/create-payment-link \
  -H "Content-Type: application/json" \
  -H "Cookie: sb-access-token=YOUR_TOKEN" \
  -d '{"plan": "basic"}'
```

### Test Agent
```bash
curl -X POST https://app.com/api/agent/AGENT_ID/webhook \
  -H "Content-Type: application/json" \
  -H "X-AGENT-KEY: agt_xxxxxxxxxx" \
  -d '{"message": "What time do you open?"}'
```

---

**Last Updated:** October 2025

