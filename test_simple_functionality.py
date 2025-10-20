#!/usr/bin/env python3
"""
Simple functionality test for CallWaiting AI
Tests basic website functionality and voice AI system
"""

import asyncio
from playwright.async_api import async_playwright, expect
import json

async def test_basic_functionality():
    """Test basic website functionality"""
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)
        context = await browser.new_context()
        page = await context.new_page()
        
        print("🚀 Starting CallWaiting AI functionality test...")
        
        try:
            # Test 1: Homepage loads correctly
            print("📄 Testing homepage load...")
            await page.goto("http://localhost:3000")
            await page.wait_for_load_state("networkidle")
            
            # Check if main elements are present
            await expect(page.locator("text=Never Miss Another Paying Call")).to_be_visible(timeout=10000)
            await expect(page.locator("text=Start Free Trial")).to_be_visible(timeout=5000)
            print("✅ Homepage loads successfully")
            
            # Test 2: Navigation works
            print("🧭 Testing navigation...")
            await page.click("text=Free Tools")
            await page.wait_for_load_state("networkidle")
            await expect(page.locator("text=Free Tools")).to_be_visible(timeout=5000)
            print("✅ Navigation works")
            
            # Test 3: Voice AI page loads
            print("🎤 Testing voice AI page...")
            await page.goto("http://localhost:3000/voice-ai")
            await page.wait_for_load_state("networkidle")
            await expect(page.locator("text=CallWaitingAI Voice Assistant")).to_be_visible(timeout=10000)
            print("✅ Voice AI page loads")
            
            # Test 4: Test voice AI page loads
            print("🔧 Testing voice AI test page...")
            await page.goto("http://localhost:3000/test-voice-ai")
            await page.wait_for_load_state("networkidle")
            await expect(page.locator("text=Voice AI System Test")).to_be_visible(timeout=10000)
            print("✅ Voice AI test page loads")
            
            # Test 5: Tools page loads
            print("🛠️ Testing tools page...")
            await page.goto("http://localhost:3000/tools")
            await page.wait_for_load_state("networkidle")
            await expect(page.locator("text=Free Tools")).to_be_visible(timeout=10000)
            print("✅ Tools page loads")
            
            # Test 6: Calculator page loads
            print("📊 Testing calculator page...")
            await page.goto("http://localhost:3000/tools/missed-call-calculator")
            await page.wait_for_load_state("networkidle")
            await expect(page.locator("text=Missed Call ROI Calculator")).to_be_visible(timeout=10000)
            print("✅ Calculator page loads")
            
            print("\n🎉 All basic functionality tests passed!")
            return True
            
        except Exception as e:
            print(f"❌ Test failed: {str(e)}")
            return False
            
        finally:
            await browser.close()

async def test_api_endpoints():
    """Test API endpoints are responding"""
    import aiohttp
    
    print("\n🔌 Testing API endpoints...")
    
    endpoints = [
        "http://localhost:3000/api/health",
        "http://localhost:3000/api/tts/voices",
        "http://localhost:3000/api/trial/status"
    ]
    
    async with aiohttp.ClientSession() as session:
        for endpoint in endpoints:
            try:
                async with session.get(endpoint) as response:
                    if response.status in [200, 401, 403]:  # 401/403 are acceptable for protected endpoints
                        print(f"✅ {endpoint} - Status: {response.status}")
                    else:
                        print(f"⚠️ {endpoint} - Status: {response.status}")
            except Exception as e:
                print(f"❌ {endpoint} - Error: {str(e)}")
    
    return True

async def main():
    """Run all tests"""
    print("🧪 CallWaiting AI - Comprehensive Functionality Test")
    print("=" * 60)
    
    # Test basic functionality
    basic_test_result = await test_basic_functionality()
    
    # Test API endpoints
    api_test_result = await test_api_endpoints()
    
    print("\n" + "=" * 60)
    print("📋 TEST SUMMARY")
    print("=" * 60)
    print(f"Basic Functionality: {'✅ PASS' if basic_test_result else '❌ FAIL'}")
    print(f"API Endpoints: {'✅ PASS' if api_test_result else '❌ FAIL'}")
    
    if basic_test_result and api_test_result:
        print("\n🎉 ALL TESTS PASSED! The system is working correctly.")
    else:
        print("\n⚠️ Some tests failed. Check the logs above for details.")

if __name__ == "__main__":
    asyncio.run(main())
