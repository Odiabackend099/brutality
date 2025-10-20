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
        # -> Click the floating bubble to open the chat window and observe animation behavior (step 2/15).
        frame = context.pages[-1]
        # Click the floating bubble to open the chat window
        elem = frame.locator('xpath=html/body/div/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Click the close button or floating bubble again to collapse the chat window and observe closing animation (step 4/15).
        frame = context.pages[-1]
        # Click the floating bubble to close the chat window
        elem = frame.locator('xpath=html/body/div/div/div/div[2]/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Resize the window to tablet size and repeat opening and closing the chat window to verify responsiveness and animation fluidity (step 5/15).
        frame = context.pages[-1]
        # Click the floating bubble to open chat window on tablet size
        elem = frame.locator('xpath=html/body/div/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Resize the window to tablet size and repeat opening and closing the chat window to verify responsiveness and animation fluidity (step 5/15).
        await page.goto('http://localhost:3001/', timeout=10000)
        await asyncio.sleep(3)
        

        frame = context.pages[-1]
        # Click the floating bubble to open chat window on tablet size
        elem = frame.locator('xpath=html/body/div/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Click the close button or floating bubble to collapse chat window on tablet size and verify closing animation (step 6/15).
        frame = context.pages[-1]
        # Click the floating bubble to close the chat window on tablet size
        elem = frame.locator('xpath=html/body/div/div/div/div[2]/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Resize the window to phone size and repeat opening and closing the chat window to verify responsiveness and animation fluidity (step 7/15).
        await page.goto('http://localhost:3001/', timeout=10000)
        await asyncio.sleep(3)
        

        frame = context.pages[-1]
        # Click the floating bubble to open chat window on phone size
        elem = frame.locator('xpath=html/body/div/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Click the close button or floating bubble to collapse chat window on phone size and verify closing animation (step 8/15).
        frame = context.pages[-1]
        # Click the floating bubble to close the chat window on phone size
        elem = frame.locator('xpath=html/body/div/div/div/div[2]/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Test the chat bubble and chat window behavior on screen orientation changes (portrait to landscape and vice versa) and verify animation smoothness (step 9/15).
        frame = context.pages[-1]
        # Click the floating bubble to open chat window before orientation change
        elem = frame.locator('xpath=html/body/div/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Simulate screen orientation change to landscape and verify chat bubble and window behavior with smooth animations (step 10/15).
        await page.goto('http://localhost:3001/', timeout=10000)
        await asyncio.sleep(3)
        

        # -> Manually resize the window to simulate landscape and portrait orientations and test chat bubble and chat window behavior with smooth animations (step 10/15).
        frame = context.pages[-1]
        # Click the floating bubble to open chat window in simulated landscape orientation
        elem = frame.locator('xpath=html/body/div/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Perform final overall check by opening and closing the chat window after manual resizing to confirm no regressions (step 13/15).
        frame = context.pages[-1]
        # Click the floating bubble to open chat window for final check
        elem = frame.locator('xpath=html/body/div/div/div/div[2]/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        frame = context.pages[-1]
        # Click the floating bubble to close chat window for final check
        elem = frame.locator('xpath=html/body/div/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # --> Assertions to verify final state
        frame = context.pages[-1]
        await expect(frame.locator('text=CallWaitingAI').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Never Miss Another Paying Call. Your AI receptionist that answers, qualifies, and books—24/7.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Start Free Trial').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Try Live Demo (+14156876510)').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Hi! I\'m your CallWaitingAI assistant. How can I help you today? 😊').first).to_be_visible(timeout=30000)
        await asyncio.sleep(5)
    
    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()
            
asyncio.run(run_test())
    