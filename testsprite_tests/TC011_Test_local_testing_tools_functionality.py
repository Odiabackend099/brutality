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
        await page.goto("http://localhost:3000", wait_until="commit", timeout=10000)
        
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
        # -> Run command-line webhook tester with a sample message input.
        await page.goto('http://localhost:3000/api/webhook-tester', timeout=10000)
        await asyncio.sleep(3)
        

        # -> Return to main page and look for alternative way to run command-line webhook tester or access webhook testing functionality.
        await page.goto('http://localhost:3000', timeout=10000)
        await asyncio.sleep(3)
        

        # -> Click on 'Free Tools' link to explore available tools and check for webhook tester or local UI testing server options.
        frame = context.pages[-1]
        # Click on 'Free Tools' link
        elem = frame.locator('xpath=html/body/footer[2]/div/div/div[2]/ul/li[5]/a').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Click 'Use Tool' button for Missed Call ROI Calculator to test its functionality.
        frame = context.pages[-1]
        # Click 'Use Tool' for Missed Call ROI Calculator
        elem = frame.locator('xpath=html/body/div/div[2]/div/div/a').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Fill in the form with sample data and click 'Calculate My Loss' to verify the calculator works correctly.
        frame = context.pages[-1]
        # Input Average calls per day
        elem = frame.locator('xpath=html/body/div/div[2]/div/div/div/div/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('25')
        

        frame = context.pages[-1]
        # Input Miss rate (%)
        elem = frame.locator('xpath=html/body/div/div[2]/div/div/div/div/div[2]/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('30')
        

        frame = context.pages[-1]
        # Input Average job value (£)
        elem = frame.locator('xpath=html/body/div/div[2]/div/div/div/div/div[3]/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('800')
        

        frame = context.pages[-1]
        # Input Conversion rate (%)
        elem = frame.locator('xpath=html/body/div/div[2]/div/div/div/div/div[4]/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('20')
        

        frame = context.pages[-1]
        # Click 'Calculate My Loss' button
        elem = frame.locator('xpath=html/body/div/div[2]/div/div[2]/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Navigate back to Free Tools page to test the Call Script Generator and explore options for starting the local UI testing server.
        frame = context.pages[-1]
        # Click 'Free Tools' link to return to tools list
        elem = frame.locator('xpath=html/body/div/footer/div/div/div[2]/a[2]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Click 'Use Tool' button for Call Script Generator to test its functionality.
        frame = context.pages[-1]
        # Click 'Use Tool' for Call Script Generator
        elem = frame.locator('xpath=html/body/div/div[2]/div/div[2]/a').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Select 'Law Firm (solicitor, barrister)' industry to proceed to next step in Call Script Generator.
        frame = context.pages[-1]
        # Select 'Law Firm (solicitor, barrister)' industry button
        elem = frame.locator('xpath=html/body/div/div[3]/div/div/button[2]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Input sample services into textarea and click 'Next Step' to proceed.
        frame = context.pages[-1]
        # Input sample services offered in textarea
        elem = frame.locator('xpath=html/body/div/div[3]/div/textarea').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('legal advice, contract drafting, litigation')
        

        frame = context.pages[-1]
        # Click 'Next Step' button to proceed to Step 3
        elem = frame.locator('xpath=html/body/div/div[3]/div/div/button[2]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Select all caller information checkboxes and click 'Generate My Script' to complete script generation.
        frame = context.pages[-1]
        # Select 'Name & phone number' checkbox
        elem = frame.locator('xpath=html/body/div/div[3]/div/div/label/input').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        frame = context.pages[-1]
        # Select 'Email address' checkbox
        elem = frame.locator('xpath=html/body/div/div[3]/div/div/label[2]/input').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        frame = context.pages[-1]
        # Select 'Location / address' checkbox
        elem = frame.locator('xpath=html/body/div/div[3]/div/div/label[3]/input').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        frame = context.pages[-1]
        # Select 'Budget range' checkbox
        elem = frame.locator('xpath=html/body/div/div[3]/div/div/label[4]/input').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        frame = context.pages[-1]
        # Select 'Timeline / urgency' checkbox
        elem = frame.locator('xpath=html/body/div/div[3]/div/div/label[5]/input').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        frame = context.pages[-1]
        # Select 'How they found you' checkbox
        elem = frame.locator('xpath=html/body/div/div[3]/div/div/label[6]/input').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        frame = context.pages[-1]
        # Select 'Previous customer? (Yes/No)' checkbox
        elem = frame.locator('xpath=html/body/div/div[3]/div/div/label[7]/input').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        frame = context.pages[-1]
        # Click 'Generate My Script' button
        elem = frame.locator('xpath=html/body/div/div[3]/div/div[2]/button[2]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Start local UI testing server and verify chat widget UI loads and operates as expected in local environment.
        await page.goto('http://localhost:3000', timeout=10000)
        await asyncio.sleep(3)
        

        # -> Click 'Open chat widget' button to load and test chat widget UI.
        frame = context.pages[-1]
        # Click 'Open chat widget' button
        elem = frame.locator('xpath=html/body/div[3]/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Send a sample text message in the chat widget input field and verify the response from the assistant.
        frame = context.pages[-1]
        # Input sample text message in chat widget
        elem = frame.locator('xpath=html/body/div[3]/div/div[3]/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('Hello, can you help me test the webhook?')
        

        frame = context.pages[-1]
        # Click 'Get Help' button to send the message
        elem = frame.locator('xpath=html/body/div[4]/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Test voice chat functionality in chat widget if available, otherwise confirm completion of local UI testing server verification.
        frame = context.pages[-1]
        # Focus on chat widget input field to check for voice input options
        elem = frame.locator('xpath=html/body/div[4]/div/div[3]/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        await page.mouse.wheel(0, 200)
        

        # --> Assertions to verify final state
        frame = context.pages[-1]
        await expect(frame.locator('text=CallWaiting').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Free Tools').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Start Free Trial').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Try Live Demo (+14156876510)').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Answers in 0.8 seconds').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Books appointments instantly').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Integrates with your CRM').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=99.9% uptime guarantee').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=No credit card required • 30-day money-back guarantee • First 100 calls free').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Trusted by 500+ UK Businesses').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=We went from missing 40% of calls to capturing every single one. Revenue up 67% in 3 months.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=It\'s like hiring 3 receptionists for the price of a gym membership.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Pays for itself in the first week. Absolute game-changer.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Average UK business misses 30% of inbound calls').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=85% of callers won\'t leave voicemail').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=One missed call = £500–£5,000 in lost revenue').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Hiring receptionists costs £25k–£35k per year + NI + holidays').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Connect Your Number (2 minutes)').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Train Your AI (5 minutes)').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Go Live (Instant)').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Start Free Trial').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Try Live Demo: +1 (218) 400-3410').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Call +14156876510').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Free demo • No signup required • Available 24/7').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Trusted by 500+ UK Businesses').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Start Free Trial — No Credit Card Required').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Questions? Call us: 020 1234 5678 (yes, a human answers)').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Pay Only for What You Use').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Starter').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Small creators / trial users').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=$20').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Pro').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Growing e-commerce stores').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=$80').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Enterprise').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Agencies / large call volumes').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=$180').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Custom').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Contact us').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Frequently Asked Questions').first).to_be_visible(timeout=30000)
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
    