#!/bin/bash

###############################################################################
# MiniMax TTS - Generate 30-Second Calling Hour Audio
###############################################################################
#
# This script generates a 30-second audio message for "calling hour"
# and saves the audio URL from the webhook response.
#
# Usage:
#   ./generate-calling-hour-audio.sh
#
###############################################################################

# Configuration
WEBHOOK_URL="https://callwaitingai.app.n8n.cloud/webhook/minimax-tts"

# 30-second calling hour message
MESSAGE="Calling hour notification. This is your scheduled calling hour. \
Please be ready to receive important calls during this designated time period. \
The calling hour has now officially begun. Please ensure your phone line is available \
and you are prepared to handle incoming business calls. Your calling hour is now active \
and will continue as scheduled. Thank you for your attention to this notification. \
Please remain available for the duration of this calling hour period."

echo "🎙️  MiniMax TTS - Calling Hour Audio Generator"
echo "================================================"
echo ""
echo "📍 Webhook: $WEBHOOK_URL"
echo "📝 Message length: ${#MESSAGE} characters"
echo ""
echo "⏳ Generating audio..."
echo ""

# Make the request
RESPONSE=$(curl -s -X POST "$WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d "{\"message\": $(echo "$MESSAGE" | jq -R -s .)}" \
  -w "\n%{http_code}")

# Extract status code and body
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

echo "📊 HTTP Status: $HTTP_CODE"
echo ""

# Check if response is valid
if [ -z "$BODY" ]; then
    echo "❌ ERROR: Empty response from webhook"
    echo ""
    echo "Possible causes:"
    echo "  1. Workflow is not activated in n8n"
    echo "  2. Webhook path doesn't match"
    echo "  3. Network/connectivity issue"
    echo ""
    echo "Fix: Go to https://callwaitingai.app.n8n.cloud and activate the workflow"
    exit 1
fi

# Pretty print the response
echo "📦 Response:"
echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"
echo ""

# Check for success
if echo "$BODY" | jq -e '.success == true' > /dev/null 2>&1; then
    echo "✅ SUCCESS! Audio generated successfully!"
    echo ""

    # Extract audio URL
    AUDIO_URL=$(echo "$BODY" | jq -r '.audio_url')
    DURATION=$(echo "$BODY" | jq -r '.duration')

    echo "🔗 Audio URL: $AUDIO_URL"
    echo "⏱️  Duration: ${DURATION}s"
    echo ""

    # Save to file
    echo "$AUDIO_URL" > calling-hour-audio-url.txt
    echo "💾 Audio URL saved to: calling-hour-audio-url.txt"
    echo ""

    # Provide download instructions
    echo "📥 To download the audio file:"
    echo "   curl -o calling-hour.mp3 \"$AUDIO_URL\""
    echo ""
    echo "🎧 To play the audio (if you have mpg123):"
    echo "   mpg123 calling-hour.mp3"
    echo ""

elif echo "$BODY" | jq -e '.base_resp.status_code == 2049' > /dev/null 2>&1; then
    echo "❌ ERROR: Invalid API Key"
    echo ""
    echo "The MiniMax JWT token in your n8n workflow has expired or is invalid."
    echo ""
    echo "🔧 How to fix:"
    echo "   1. Go to: https://platform.minimaxi.com/user-center/basic-information/interface-key"
    echo "   2. Log in with: odiabackend@gmail.com"
    echo "   3. Generate a new API key/JWT token"
    echo "   4. Copy the token"
    echo "   5. Go to: https://callwaitingai.app.n8n.cloud"
    echo "   6. Open your workflow"
    echo "   7. Find the 'Call MiniMax TTS API' node"
    echo "   8. Update the Authorization header:"
    echo "      Name: Authorization"
    echo "      Value: Bearer YOUR_NEW_TOKEN_HERE"
    echo "   9. Save and activate the workflow"
    echo "   10. Run this script again"
    echo ""
    exit 1

elif echo "$BODY" | jq -e '.success == false' > /dev/null 2>&1; then
    echo "❌ ERROR: Request failed"
    echo ""

    ERROR_MSG=$(echo "$BODY" | jq -r '.error // "Unknown error"')
    ERROR_CODE=$(echo "$BODY" | jq -r '.error_code // "N/A"')

    echo "Error message: $ERROR_MSG"
    echo "Error code: $ERROR_CODE"
    echo ""

    exit 1
else
    echo "⚠️  WARNING: Unexpected response format"
    echo ""
    echo "This might mean:"
    echo "  1. The workflow structure is different than expected"
    echo "  2. The API returned an unexpected format"
    echo ""
    exit 1
fi

echo "🎉 Done!"
