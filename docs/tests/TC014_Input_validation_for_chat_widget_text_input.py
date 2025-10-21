import asyncio
from playwright import async_api
from playwright.async_api import expect

async def run_test():
    pw = None
    browser = None
    context = None
    
    try:
        # Start a Playwright session in asynchronous mode
        pw = await async_api.async_playwright().start()
        
        # Launch a Chromium browser in headless mode with custom arguments
        browser = await pw.chromium.launch(
            headless=True,
            args=[
                "--window-size=1280,720",         # Set the browser window size
                "--disable-dev-shm-usage",        # Avoid using /dev/shm which can cause issues in containers
                "--ipc=host",                     # Use host-level IPC for better stability
                "--single-process"                # Run the browser in a single process mode
            ],
        )
        
        # Create a new browser context (like an incognito window)
        context = await browser.new_context()
        context.set_default_timeout(5000)
        
        # Open a new page in the browser context
        page = await context.new_page()
        
        # Navigate to your target URL and wait until the network request is committed
        await page.goto("http://localhost:3001", wait_until="commit", timeout=10000)
        
        # Wait for the main page to reach DOMContentLoaded state (optional for stability)
        try:
            await page.wait_for_load_state("domcontentloaded", timeout=3000)
        except async_api.Error:
            pass
        
        # Iterate through all iframes and wait for them to load as well
        for frame in page.frames:
            try:
                await frame.wait_for_load_state("domcontentloaded", timeout=3000)
            except async_api.Error:
                pass
        
        # Interact with the page elements to simulate user flow
        # -> Open the chat widget to access the text input field for testing.
        frame = context.pages[-1]
        # Open chat widget
        elem = frame.locator('xpath=html/body/div/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Enter invalid text inputs including script tags, special characters, and an oversized message to test input validation.
        frame = context.pages[-1]
        # Enter script injection attempt in chat input
        elem = frame.locator('xpath=html/body/div/div/div[3]/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill("<script>alert('XSS')</script>")
        

        frame = context.pages[-1]
        # Send message or trigger input submission
        elem = frame.locator('xpath=html/body/div[2]/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Check for any error or confirmation messages related to the last input. Then continue testing oversized message input.
        frame = context.pages[-1]
        # Enter oversized message in chat input
        elem = frame.locator('xpath=html/body/div[2]/div/div[3]/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('A very long message that exceeds the maximum allowed length by repeating this sentence multiple times. A very long message that exceeds the maximum allowed length by repeating this sentence multiple times. A very long message that exceeds the maximum allowed length by repeating this sentence multiple times. A very long message that exceeds the maximum allowed length by repeating this sentence multiple times.')
        

        frame = context.pages[-1]
        # Send message or trigger input submission
        elem = frame.locator('xpath=html/body/div[2]/div/div[3]/div/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Test valid text inputs including whitespace only and multi-language characters to confirm acceptance and proper processing.
        frame = context.pages[-1]
        # Enter whitespace only input in chat
        elem = frame.locator('xpath=html/body/div[2]/div/div[3]/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('     ')
        

        frame = context.pages[-1]
        # Send whitespace only input
        elem = frame.locator('xpath=html/body/div[2]/div/div[3]/div/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        frame = context.pages[-1]
        # Enter multi-language characters input in chat
        elem = frame.locator('xpath=html/body/div[2]/div/div[3]/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('こんにちは、世界！Привет, мир! مرحبا بالعالم! Hello, world!')
        

        frame = context.pages[-1]
        # Send multi-language characters input
        elem = frame.locator('xpath=html/body/div[2]/div/div[3]/div/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # --> Assertions to verify final state
        frame = context.pages[-1]
        await expect(frame.locator('text=Your message exceeds the maximum allowed length.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Your AI receptionist that answers, qualifies, and books—24/7.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Hi! I\'m your CallWaiting AI assistant. I can help you with agent configuration, voice testing, pricing, and more. What would you like to know?').first).to_be_visible(timeout=30000)
        await asyncio.sleep(5)
    
    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()
            
asyncio.run(run_test())
    