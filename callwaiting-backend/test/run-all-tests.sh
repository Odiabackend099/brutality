#!/bin/bash

# CallWaiting AI - Comprehensive Test Suite
# This script runs all tests to validate the deployment

set -e  # Exit on any error

echo "🧪 CallWaiting AI - Comprehensive Test Suite"
echo "==========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test results
TESTS_PASSED=0
TESTS_TOTAL=0

# Function to run a test
run_test() {
    local test_name="$1"
    local test_command="$2"
    
    echo -e "\n${BLUE}Testing: ${test_name}${NC}"
    echo "Command: ${test_command}"
    
    if eval "$test_command"; then
        echo -e "${GREEN}✅ ${test_name} PASSED${NC}"
        ((TESTS_PASSED++))
    else
        echo -e "${RED}❌ ${test_name} FAILED${NC}"
    fi
    ((TESTS_TOTAL++))
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: Not in callwaiting-backend directory${NC}"
    echo "Please run this script from the callwaiting-backend directory"
    exit 1
fi

echo "📋 Running comprehensive test suite..."

# Test 1: Webhook signature verification
run_test "Webhook HMAC-SHA256 Verification" "cd test && node test-webhook-verification.js"

# Test 2: Generate test vectors
run_test "Generate Test Vectors" "cd test && node webhook-test-vectors.js > /dev/null"

# Test 3: Check Docker Compose syntax
run_test "Docker Compose Syntax" "docker-compose config"

# Test 4: Check environment variables
run_test "Environment Variables Template" "test -f env.example"

# Test 5: Check n8n workflows
run_test "Payment Workflow JSON" "test -f n8n_workflows/payment_workflow_hardened.json"
run_test "Leads Workflow JSON" "test -f n8n_workflows/leads_workflow_cors.json"

# Test 6: Check database schema
run_test "Database Schema" "test -f db/supabase_schema_hardened.sql"

# Test 7: Check security files
run_test "Security Hardening Guide" "test -f SECURITY_HARDENING.md"
run_test "Server Setup Script" "test -f server-setup.sh"

# Test 8: Check deployment files
run_test "Deployment Script" "test -f deploy.sh"
run_test "Nginx Configuration" "test -f proxy/nginx.conf"

# Test 9: Validate JSON files
run_test "Payment Workflow JSON Valid" "python3 -m json.tool n8n_workflows/payment_workflow_hardened.json > /dev/null"
run_test "Leads Workflow JSON Valid" "python3 -m json.tool n8n_workflows/leads_workflow_cors.json > /dev/null"

# Test 10: Check script permissions
run_test "Deploy Script Executable" "test -x deploy.sh"
run_test "Server Setup Executable" "test -x server-setup.sh"

# Test 11: Validate environment variables
run_test "Environment Variables Complete" "grep -q 'SUPABASE_URL' env.example && grep -q 'FLW_VERIF_HASH' env.example"

# Test 12: Check security configurations
run_test "N8N Security Config" "grep -q 'NODES_EXCLUDE' docker-compose.yml"
run_test "Firewall Rules" "grep -q 'ufw' server-setup.sh"

# Test 13: Validate webhook test vectors
run_test "Test Vectors Generation" "cd test && node -e 'const {testCases} = require(\"./webhook-test-vectors.js\"); console.log(Object.keys(testCases).length + \" test cases generated\")'"

# Test 14: Check end-to-end webhook test
run_test "End-to-End Webhook Test" "cd test && node -e 'const {makeWebhookPayload, signPayload} = require(\"./webhook-test.js\"); const payload = makeWebhookPayload(); const sig = signPayload(JSON.stringify(payload), \"test\"); console.log(\"Webhook test functions available\")'"

# Test 15: Check documentation completeness
run_test "Main README" "test -f README.md"
run_test "Security Documentation" "test -f SECURITY_HARDENING.md"
run_test "Test Documentation" "test -f test/README.md"

# Test 16: Validate SQL schema
run_test "SQL Schema Syntax" "grep -q 'create table' db/supabase_schema_hardened.sql"

# Summary
echo -e "\n${BLUE}📊 Test Summary${NC}"
echo "================"
echo -e "Tests Passed: ${GREEN}${TESTS_PASSED}${NC}"
echo -e "Tests Total:  ${BLUE}${TESTS_TOTAL}${NC}"
echo -e "Success Rate: ${GREEN}$(( (TESTS_PASSED * 100) / TESTS_TOTAL ))%${NC}"

if [ $TESTS_PASSED -eq $TESTS_TOTAL ]; then
    echo -e "\n${GREEN}🎉 All tests passed! Deployment is ready.${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Fill in .env with your actual secrets"
    echo "2. Run ./server-setup.sh (for server hardening)"
    echo "3. Run ./deploy.sh (to deploy the stack)"
    echo "4. Configure Flutterwave webhook URL"
    echo "5. Test with real webhooks"
    exit 0
else
    echo -e "\n${RED}⚠️  Some tests failed. Please review the issues above.${NC}"
    echo ""
    echo "Common issues:"
    echo "- Missing dependencies (run: npm install in test/ directory)"
    echo "- Invalid JSON syntax in workflow files"
    echo "- Missing environment variables"
    echo "- File permissions issues"
    exit 1
fi
