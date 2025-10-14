# 🔧 Troubleshoot: Empty Response from n8n

## 🔍 **Current Issue**

Your webhook returns:
- ✅ HTTP 200 OK
- ❌ Content-Length: 0 (empty body)
- ❌ No JSON response

This means the workflow is **receiving** requests but **not responding**.

---

## 🎯 **Quick Fix - Use Diagnostic Workflow**

I've created a simple diagnostic workflow to help identify the issue:

### **Step 1: Import Diagnostic Workflow**

1. **Go to n8n:** https://callwaitingai.app.n8n.cloud

2. **DEACTIVATE** your current workflow (important!)

3. **Import diagnostic workflow:**
   - File: `n8n-workflow-diagnostic.json`
   - This is a simple 4-node workflow that will definitely work

4. **Activate** the diagnostic workflow

5. **Test:**
   ```bash
   node test-webhook.js "Testing diagnostic"
   ```

**Expected result:**
```json
{
  "text": "Hello! I received your message: \"Testing diagnostic\"...",
  "audio_url": "",
  "debug_info": {...}
}
```

If this works, we know:
- ✅ Webhook path is correct
- ✅ n8n can respond properly
- ❌ Your AI workflow has an issue

---

## 🔎 **Common Causes of Empty Response**

### **Cause 1: Multiple Active Workflows**

If you have multiple workflows with the same webhook path, they conflict!

**Fix:**
1. Go to n8n workflows list
2. Find ALL workflows with path `/webhook/tts_minimax`
3. **Deactivate all except one**
4. Test again

### **Cause 2: Workflow Execution Error**

The workflow starts but fails partway through.

**Check:**
1. Go to n8n → "Executions" tab
2. Find the latest execution
3. Look for red X on any node
4. Click the node to see error message

**Common errors:**
- AI Agent node fails (OpenAI issue)
- MiniMax TTS fails (invalid token)
- Extract AI Response gets wrong data structure

### **Cause 3: Missing "Respond to Webhook" Node**

The workflow doesn't have the response node or it's disconnected.

**Fix:**
1. Open workflow
2. Scroll to the end
3. Verify "Respond to Webhook" node exists
4. Verify it's connected to previous node
5. Verify responseMode is set to "responseNode" in Webhook Trigger

### **Cause 4: AI Agent Output Format**

The AI Agent might output data in a different format than expected.

**Debug:**
1. Run workflow in n8n with test data
2. Click on "AI Agent" node after execution
3. Check the output structure
4. Adjust "Extract AI Response" node to match

---

## 🧪 **Debugging Steps**

### **Step 1: Check n8n Executions**

1. Go to n8n
2. Click "Executions" (top menu)
3. Find executions from the webhook
4. Look for:
   - ✅ Green checkmarks = node succeeded
   - ❌ Red X = node failed
   - ⚠️ Yellow = warning

### **Step 2: Test Individual Nodes**

1. Open your workflow
2. Click "Webhook Trigger"
3. Click "Listen for Test Event"
4. Run: `node test-webhook.js "test"`
5. See if data appears in webhook node

6. Click "Execute Node" on each subsequent node
7. See where it fails

### **Step 3: Simplify Workflow**

Start with just the response:

**Minimal Test:**
1. Webhook Trigger
2. Set node (create simple response)
3. Respond to Webhook

If this works, add nodes one at a time:
- Add Extract Input
- Add AI Agent
- Add MiniMax TTS
- etc.

---

## 💡 **Recommended: Start with Working Workflow**

Instead of debugging, start fresh with a workflow that definitely works:

### **Option 1: Diagnostic (Simplest)**
```
File: n8n-workflow-diagnostic.json
```
- 4 nodes, no AI
- Guaranteed to work
- Good for confirming webhook works

### **Option 2: Simple Test (No AI)**
```
File: n8n-workflow-simple-test.json
```
- Echo response
- No OpenAI, no TTS
- Good for testing chat widget integration

### **Option 3: Full AI (When others work)**
```
File: n8n-workflow-openai-http.json
```
- Complete AI + TTS
- Use after confirming webhook works

---

## 🔧 **Fix Your Current Workflow**

If you want to fix your existing workflow, here's what to check:

### **Check 1: Webhook Trigger Settings**

In "Webhook Trigger" node:
- Path: `/webhook/tts_minimax` ✅
- Method: `POST` ✅
- Response Mode: `responseNode` ✅ (IMPORTANT!)

If Response Mode is "lastNode" or something else, change it to "responseNode"

### **Check 2: AI Agent Configuration**

The AI Agent node might be failing. Check:
1. OpenAI credentials are configured
2. Model is set to `gpt-4o-mini`
3. System message is not too long
4. Text input is properly mapped: `={{ $json.chatInput }}`

### **Check 3: Extract AI Response**

The AI Agent outputs data as `$json.output` (not `$json.data.content`)

**Correct mapping:**
```
aiResponseText: "={{ $json.output }}"
```

### **Check 4: All Nodes Connected**

Verify the connection flow:
```
Webhook → Extract Input → Validate → AI Agent
  → Extract AI Response → MiniMax TTS
  → Format Response → Respond to Webhook
```

Every arrow must be connected!

---

## 🎯 **Action Plan**

### **Step 1: Import Diagnostic Workflow**
```bash
# This will prove webhook works
n8n-workflow-diagnostic.json
```

### **Step 2: Test**
```bash
node test-webhook.js "Diagnostic test"
```

### **Step 3: If Diagnostic Works**

Then the issue is in your AI workflow. Options:

**A. Check n8n Execution Logs**
- Find which node is failing
- Fix that specific node

**B. Start Fresh with Working Workflow**
- Import `n8n-workflow-openai-http.json`
- Configure OpenAI credentials
- Test

**C. Rebuild Your Workflow**
- Start with diagnostic
- Add AI Agent step by step
- Test after each addition

---

## 📋 **Quick Checklist**

- [ ] Only ONE workflow active with this webhook path
- [ ] Webhook Trigger has `responseMode: "responseNode"`
- [ ] "Respond to Webhook" node exists and is connected
- [ ] All nodes are connected in sequence
- [ ] No red X errors in execution logs
- [ ] OpenAI credentials configured in n8n
- [ ] MiniMax token is valid

---

## 🆘 **Still Stuck?**

### **Option 1: Use Simple Test Workflow**

The simplest path forward:
1. Deactivate current workflow
2. Import `n8n-workflow-simple-test.json`
3. Activate it
4. Test - it will work immediately
5. Add AI later when webhook is confirmed working

### **Option 2: Share Execution Log**

1. Go to n8n → Executions
2. Click on latest execution
3. Screenshot any errors
4. Share here for specific help

---

## 🎉 **Quick Win**

**Import the diagnostic workflow right now:**

```bash
# It's only 4 nodes and guaranteed to work!
n8n-workflow-diagnostic.json
```

This will:
1. ✅ Confirm webhook is working
2. ✅ Confirm chat widget can receive responses
3. ✅ Give you a working baseline
4. ✅ Show you the correct structure

**Then** we can add AI step by step!

---

**Next:** Import `n8n-workflow-diagnostic.json` and test!
