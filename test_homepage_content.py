#!/usr/bin/env python3
"""
Homepage content test for CallWaiting AI
Checks what content is actually present on the homepage
"""

import asyncio
from playwright.async_api import async_playwright

async def test_homepage_content():
    """Test homepage content"""
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)
        context = await browser.new_context()
        page = await context.new_page()
        
        print("🔍 Analyzing homepage content...")
        
        try:
            # Navigate to homepage
            await page.goto("http://localhost:3001")
            await page.wait_for_load_state("networkidle")
            
            # Get page title
            title = await page.title()
            print(f"📄 Page Title: {title}")
            
            # Get all visible text content
            print("\n📝 Visible text content:")
            text_content = await page.evaluate("""
                () => {
                    const walker = document.createTreeWalker(
                        document.body,
                        NodeFilter.SHOW_TEXT,
                        null,
                        false
                    );
                    
                    const texts = [];
                    let node;
                    while (node = walker.nextNode()) {
                        const text = node.textContent.trim();
                        if (text.length > 3) {
                            texts.push(text);
                        }
                    }
                    return texts.slice(0, 20); // First 20 text elements
                }
            """)
            
            for i, text in enumerate(text_content, 1):
                print(f"  {i}. {text}")
            
            # Check for specific elements
            print("\n🔍 Checking for specific elements:")
            
            # Check for headings
            headings = await page.locator("h1, h2, h3").count()
            print(f"  Headings found: {headings}")
            
            # Check for buttons
            buttons = await page.locator("button, a[role='button']").count()
            print(f"  Buttons found: {buttons}")
            
            # Check for navigation
            nav_elements = await page.locator("nav, [role='navigation']").count()
            print(f"  Navigation elements: {nav_elements}")
            
            # Check for any error messages
            errors = await page.locator("text=error, text=Error, text=404, text=500").count()
            print(f"  Error messages: {errors}")
            
            # Take a screenshot for debugging
            await page.screenshot(path="homepage_debug.png")
            print("📸 Screenshot saved as homepage_debug.png")
            
            # Check console errors
            console_logs = []
            page.on("console", lambda msg: console_logs.append(f"{msg.type}: {msg.text}"))
            
            await page.reload()
            await page.wait_for_load_state("networkidle")
            
            print(f"\n🖥️ Console logs ({len(console_logs)}):")
            for log in console_logs[:10]:  # First 10 logs
                print(f"  {log}")
            
        except Exception as e:
            print(f"❌ Error: {str(e)}")
            
        finally:
            await browser.close()

if __name__ == "__main__":
    asyncio.run(test_homepage_content())
