#!/usr/bin/env python3
"""
Simple Mobile Performance Test for CallWaitingAI
Tests core mobile functionality without complex locators
"""

import asyncio
from playwright.async_api import async_playwright
import time

async def test_mobile_core_functionality():
    """Test core mobile functionality"""
    async with async_playwright() as p:
        # Test iPhone viewport
        browser = await p.chromium.launch(headless=False)
        context = await browser.new_context(
            viewport={"width": 390, "height": 844},
            user_agent='Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15'
        )
        page = await context.new_page()
        
        results = {}
        
        try:
            print("📱 Testing Mobile Core Functionality")
            print("=" * 50)
            
            # Test 1: Homepage Load
            print("🏠 Testing homepage load...")
            start_time = time.time()
            await page.goto("http://localhost:3000")
            await page.wait_for_load_state("networkidle")
            load_time = time.time() - start_time
            results['homepage_load_time'] = round(load_time, 2)
            print(f"   ✅ Loaded in {load_time:.2f}s")
            
            # Test 2: Check if main content is visible
            print("👀 Checking main content visibility...")
            h1_count = await page.locator('h1').count()
            buttons_count = await page.locator('button').count()
            links_count = await page.locator('a').count()
            results['content_elements'] = {
                'headings': h1_count,
                'buttons': buttons_count,
                'links': links_count
            }
            print(f"   ✅ Found {h1_count} headings, {buttons_count} buttons, {links_count} links")
            
            # Test 3: Test navigation
            print("🧭 Testing navigation...")
            try:
                await page.click('a[href*="tools"]', timeout=5000)
                await page.wait_for_load_state("networkidle")
                current_url = page.url
                results['navigation_works'] = 'tools' in current_url
                print(f"   ✅ Navigation to tools: {results['navigation_works']}")
            except Exception as e:
                results['navigation_works'] = False
                print(f"   ❌ Navigation failed: {str(e)}")
            
            # Test 4: Test calculator page
            print("📊 Testing calculator page...")
            start_time = time.time()
            await page.goto("http://localhost:3000/tools/missed-call-calculator")
            await page.wait_for_load_state("networkidle")
            calc_load_time = time.time() - start_time
            results['calculator_load_time'] = round(calc_load_time, 2)
            print(f"   ✅ Calculator loaded in {calc_load_time:.2f}s")
            
            # Test 5: Test calculator functionality
            print("🧮 Testing calculator inputs...")
            try:
                # Find input fields and select elements
                inputs = await page.locator('input[type="number"], input[placeholder*="calls"], input[placeholder*="minutes"], input[placeholder*="£"], input[placeholder*="%"], select').all()
                
                if len(inputs) >= 5:
                    await inputs[0].fill('25')   # calls per day
                    await inputs[1].fill('30')   # miss rate
                    await inputs[2].fill('800')  # average job value
                    await inputs[3].fill('20')   # conversion rate
                    # Handle select element for industry
                    element_type = await inputs[4].evaluate('el => el.tagName')
                    if element_type == 'SELECT':
                        await inputs[4].select_option(index=1)
                    else:
                        await inputs[4].fill('Construction')  # fallback for input field
                    
                    await page.wait_for_timeout(1000)
                    results['calculator_inputs_work'] = True
                    print("   ✅ Calculator inputs working")
                else:
                    results['calculator_inputs_work'] = False
                    print(f"   ⚠️ Only found {len(inputs)} input fields")
            except Exception as e:
                results['calculator_inputs_work'] = False
                print(f"   ❌ Calculator inputs failed: {str(e)}")
            
            # Test 6: Test voice AI page
            print("🎤 Testing voice AI page...")
            start_time = time.time()
            await page.goto("http://localhost:3000/voice-ai")
            await page.wait_for_load_state("networkidle")
            voice_load_time = time.time() - start_time
            results['voice_ai_load_time'] = round(voice_load_time, 2)
            print(f"   ✅ Voice AI loaded in {voice_load_time:.2f}s")
            
            # Test 7: Check mobile-specific elements
            print("📱 Checking mobile responsiveness...")
            try:
                # Check if text is readable (not too small)
                text_elements = await page.locator('h1, h2, h3, p').count()
                results['text_elements_count'] = text_elements
                
                # Check for touch-friendly buttons
                buttons = await page.locator('button').all()
                large_buttons = 0
                for button in buttons[:5]:  # Check first 5 buttons
                    try:
                        box = await button.bounding_box()
                        if box and (box['width'] >= 44 or box['height'] >= 44):
                            large_buttons += 1
                    except:
                        pass
                results['touch_friendly_buttons'] = large_buttons
                print(f"   ✅ Found {text_elements} text elements, {large_buttons} touch-friendly buttons")
                
            except Exception as e:
                print(f"   ⚠️ Mobile responsiveness check failed: {str(e)}")
            
            # Test 8: Performance metrics
            print("⚡ Collecting performance metrics...")
            try:
                metrics = await page.evaluate("""
                    () => {
                        const navigation = performance.getEntriesByType('navigation')[0];
                        return {
                            domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
                            loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
                            firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime || 0,
                            firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0
                        };
                    }
                """)
                results['performance_metrics'] = metrics
                print(f"   ✅ Performance metrics collected")
            except Exception as e:
                print(f"   ⚠️ Performance metrics failed: {str(e)}")
            
            # Calculate overall score
            score = 0
            if results['homepage_load_time'] < 2: score += 25
            if results['navigation_works']: score += 20
            if results['calculator_load_time'] < 2: score += 20
            if results['voice_ai_load_time'] < 3: score += 15
            if results['calculator_inputs_work']: score += 10
            if results.get('touch_friendly_buttons', 0) > 2: score += 10
            
            results['overall_score'] = score
            
        except Exception as e:
            print(f"❌ Test failed: {str(e)}")
            results['error'] = str(e)
            results['overall_score'] = 0
        
        await browser.close()
        return results

async def main():
    """Run mobile performance test"""
    results = await test_mobile_core_functionality()
    
    print("\n" + "=" * 50)
    print("📋 MOBILE PERFORMANCE RESULTS")
    print("=" * 50)
    
    print(f"\n📊 Performance Metrics:")
    print(f"  Homepage Load Time: {results.get('homepage_load_time', 'N/A')}s")
    print(f"  Calculator Load Time: {results.get('calculator_load_time', 'N/A')}s")
    print(f"  Voice AI Load Time: {results.get('voice_ai_load_time', 'N/A')}s")
    
    print(f"\n🎯 Functionality:")
    print(f"  Navigation Works: {'✅' if results.get('navigation_works') else '❌'}")
    print(f"  Calculator Inputs: {'✅' if results.get('calculator_inputs_work') else '❌'}")
    
    print(f"\n📱 Mobile Features:")
    if 'content_elements' in results:
        ce = results['content_elements']
        print(f"  Content Elements: {ce.get('headings', 0)} headings, {ce.get('buttons', 0)} buttons, {ce.get('links', 0)} links")
    print(f"  Touch-Friendly Buttons: {results.get('touch_friendly_buttons', 0)}")
    print(f"  Text Elements: {results.get('text_elements_count', 0)}")
    
    print(f"\n⚡ Performance Score:")
    print(f"  Overall Score: {results.get('overall_score', 0)}/100")
    
    if 'performance_metrics' in results:
        pm = results['performance_metrics']
        print(f"  DOM Content Loaded: {pm.get('domContentLoaded', 0):.0f}ms")
        print(f"  Load Complete: {pm.get('loadComplete', 0):.0f}ms")
        print(f"  First Paint: {pm.get('firstPaint', 0):.0f}ms")
        print(f"  First Contentful Paint: {pm.get('firstContentfulPaint', 0):.0f}ms")
    
    print(f"\n🎯 Assessment:")
    score = results.get('overall_score', 0)
    if score >= 80:
        print("  🏆 EXCELLENT - Mobile-ready for production")
    elif score >= 60:
        print("  ✅ GOOD - Minor optimizations recommended")
    else:
        print("  ⚠️ NEEDS WORK - Mobile optimization required")
    
    print(f"\n💡 Recommendations:")
    if results.get('homepage_load_time', 0) > 2:
        print("  - Optimize homepage loading speed")
    if not results.get('navigation_works'):
        print("  - Fix navigation functionality")
    if not results.get('calculator_inputs_work'):
        print("  - Fix calculator input functionality")
    if results.get('touch_friendly_buttons', 0) < 3:
        print("  - Improve touch target sizes")

if __name__ == "__main__":
    asyncio.run(main())
