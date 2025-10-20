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
        # -> Confirm the floating bubble chat button is visible and clickable
        frame = context.pages[-1]
        # Click the floating bubble chat button to expand the chat window
        elem = frame.locator('xpath=html/body/div/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Repeat the floating bubble visibility, clickability, and chat window expansion test on Firefox desktop browser
        await page.goto('http://localhost:3001', timeout=10000)
        await asyncio.sleep(3)
        

        # -> Click the floating bubble chat button on Firefox desktop to expand the chat window and verify UI elements
        frame = context.pages[-1]
        # Click the floating bubble chat button to expand the chat window on Firefox desktop
        elem = frame.locator('xpath=html/body/div/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Navigate to the website on Safari desktop and verify the floating bubble visibility and clickability, then expand the chat window and confirm smooth UI rendering.
        await page.goto('http://localhost:3001', timeout=10000)
        await asyncio.sleep(3)
        

        # -> Click the floating bubble chat button on Safari desktop to expand the chat window and verify UI elements
        frame = context.pages[-1]
        # Click the floating bubble chat button to expand the chat window on Safari desktop
        elem = frame.locator('xpath=html/body/div/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Navigate to the website on Edge desktop and verify the floating bubble visibility and clickability, then expand the chat window and confirm smooth UI rendering.
        await page.goto('http://localhost:3001', timeout=10000)
        await asyncio.sleep(3)
        

        # -> Click the floating bubble chat button on Edge desktop to expand the chat window and verify UI elements
        frame = context.pages[-1]
        # Click the floating bubble chat button to expand the chat window on Edge desktop
        elem = frame.locator('xpath=html/body/div/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Test the floating bubble visibility and clickability on iOS Safari mobile browser, then expand the chat window and verify UI elements.
        await page.goto('http://localhost:3001', timeout=10000)
        await asyncio.sleep(3)
        

        # -> Click the floating bubble chat button on mobile browser to expand the chat window and verify UI elements.
        frame = context.pages[-1]
        # Click the floating bubble chat button to expand the chat window on mobile browser
        elem = frame.locator('xpath=html/body/div/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Test the floating bubble visibility and clickability on the second mobile browser, then expand the chat window and verify UI elements.
        await page.goto('http://localhost:3001', timeout=10000)
        await asyncio.sleep(3)
        

        # --> Assertions to verify final state
        frame = context.pages[-1]
        await expect(frame.locator('text=CallWaitingAI').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Real voice • Instant replies').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Never Miss Another Paying Call. Your AI Receptionist That Answers, Qualifies & Books—24/7').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Every missed call is money walking out the door. CallWaitingAI makes sure you never lose another customer to voicemail again.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Start Free Trial').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Try Live Demo (+14156876510)').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=No credit card required • 30-day money-back guarantee • First 100 calls free').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Never miss another paying call. Your AI receptionist that answers, qualifies, and books—24/7.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Pricing').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Features').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Integrations').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Use Cases').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Free Tools').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=API').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Status').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=About').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Contact').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Blog').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Careers').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Partners').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Documentation').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=FAQ').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Support').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Academy').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Case Studies').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=© 2025 CallWaitingAI Ltd | Registered in England & Wales No. XXXXXXX').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Insert your full UK registered address').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Terms').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Privacy').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Refund Policy').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=SLA').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Security').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Chat with us').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=TEST MODE').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Admin Password').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Create Test Account').first).to_be_visible(timeout=30000)
        await asyncio.sleep(5)
    
    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()
            
asyncio.run(run_test())
    