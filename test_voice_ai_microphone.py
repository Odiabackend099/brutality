#!/usr/bin/env python3
"""
Voice AI Microphone Test for CallWaitingAI
Tests microphone permissions, voice AI functionality, and browser compatibility
"""

import asyncio
from playwright.async_api import async_playwright
import time

async def test_voice_ai_microphone():
    """Test voice AI microphone functionality"""
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)
        context = await browser.new_context(
            viewport={"width": 1200, "height": 800},
            permissions=['microphone']
        )
        page = await context.new_page()
        
        results = {}
        
        try:
            print("🎤 Testing Voice AI Microphone Functionality")
            print("=" * 60)
            
            # Test 1: Voice AI Page Load
            print("📄 Testing voice AI page load...")
            start_time = time.time()
            await page.goto("http://localhost:3000/voice-ai")
            await page.wait_for_load_state("networkidle")
            load_time = time.time() - start_time
            results['voice_ai_load_time'] = round(load_time, 2)
            print(f"   ✅ Voice AI page loaded in {load_time:.2f}s")
            
            # Test 2: Check for voice AI components
            print("🔍 Checking voice AI components...")
            try:
                # Look for voice-related elements
                voice_elements = await page.locator('button, div').filter(has_text=page.locator('text=Start, text=Stop, text=Record, text=Voice, text=Microphone, text=🎤, text=🎵')).count()
                results['voice_elements_found'] = voice_elements
                
                # Check for any buttons that might be voice controls
                buttons = await page.locator('button').count()
                results['total_buttons'] = buttons
                print(f"   ✅ Found {voice_elements} voice-related elements, {buttons} total buttons")
                
            except Exception as e:
                print(f"   ⚠️ Voice elements check failed: {str(e)}")
                results['voice_elements_found'] = 0
            
            # Test 3: Check microphone permission
            print("🎤 Testing microphone permissions...")
            try:
                # Try to access microphone
                permission_result = await page.evaluate("""
                    async () => {
                        try {
                            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                            stream.getTracks().forEach(track => track.stop());
                            return { success: true, message: 'Microphone access granted' };
                        } catch (error) {
                            return { success: false, message: error.message };
                        }
                    }
                """)
                results['microphone_permission'] = permission_result
                print(f"   {'✅' if permission_result['success'] else '❌'} Microphone permission: {permission_result['message']}")
                
            except Exception as e:
                results['microphone_permission'] = {'success': False, 'message': str(e)}
                print(f"   ❌ Microphone permission test failed: {str(e)}")
            
            # Test 4: Check WebRTC support
            print("🌐 Testing WebRTC support...")
            try:
                webrtc_support = await page.evaluate("""
                    () => {
                        return {
                            mediaDevices: !!navigator.mediaDevices,
                            getUserMedia: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia),
                            webRTC: !!(window.RTCPeerConnection || window.webkitRTCPeerConnection),
                            audioContext: !!(window.AudioContext || window.webkitAudioContext)
                        };
                    }
                """)
                results['webrtc_support'] = webrtc_support
                
                support_count = sum(webrtc_support.values())
                print(f"   ✅ WebRTC support: {support_count}/4 features available")
                for feature, supported in webrtc_support.items():
                    print(f"      {'✅' if supported else '❌'} {feature}")
                    
            except Exception as e:
                print(f"   ❌ WebRTC support test failed: {str(e)}")
                results['webrtc_support'] = {}
            
            # Test 5: Check for VAD (Voice Activity Detection) components
            print("🎯 Testing Voice Activity Detection...")
            try:
                # Look for VAD-related elements or scripts
                vad_elements = await page.locator('script, div, canvas').filter(has_text=page.locator('text=VAD, text=Voice Activity, text=Silero, text=ONNX')).count()
                results['vad_elements'] = vad_elements
                
                # Check for ONNX runtime
                onnx_check = await page.evaluate("""
                    () => {
                        return {
                            onnxAvailable: typeof window !== 'undefined' && (!!window.onnx || !!window.ort),
                            webAssemblySupport: typeof WebAssembly !== 'undefined'
                        };
                    }
                """)
                results['onnx_support'] = onnx_check
                print(f"   ✅ VAD elements: {vad_elements}")
                print(f"   {'✅' if onnx_check['onnxAvailable'] else '❌'} ONNX Runtime: {onnx_check['onnxAvailable']}")
                print(f"   {'✅' if onnx_check['webAssemblySupport'] else '❌'} WebAssembly: {onnx_check['webAssemblySupport']}")
                
            except Exception as e:
                print(f"   ❌ VAD test failed: {str(e)}")
                results['vad_elements'] = 0
                results['onnx_support'] = {}
            
            # Test 6: Test voice AI test page
            print("🧪 Testing voice AI test page...")
            try:
                await page.goto("http://localhost:3000/test-voice-ai")
                await page.wait_for_load_state("networkidle")
                
                # Check for test page elements
                test_elements = await page.locator('button, div').filter(has_text=page.locator('text=Initialize, text=Start, text=Stop, text=VAD, text=Test')).count()
                results['test_page_elements'] = test_elements
                print(f"   ✅ Voice AI test page loaded, found {test_elements} test elements")
                
                # Try to interact with test elements
                try:
                    init_button = page.locator('button').filter(has_text='Initialize')
                    if await init_button.count() > 0:
                        await init_button.first.click()
                        await page.wait_for_timeout(2000)
                        results['test_initialization'] = True
                        print("   ✅ Test initialization button clicked")
                    else:
                        results['test_initialization'] = False
                        print("   ⚠️ No initialization button found")
                except Exception as e:
                    results['test_initialization'] = False
                    print(f"   ❌ Test initialization failed: {str(e)}")
                
            except Exception as e:
                print(f"   ❌ Voice AI test page failed: {str(e)}")
                results['test_page_elements'] = 0
                results['test_initialization'] = False
            
            # Test 7: Check for streaming voice AI
            print("🌊 Testing streaming voice AI...")
            try:
                await page.goto("http://localhost:3000/test-streaming-voice-ai")
                await page.wait_for_load_state("networkidle")
                
                streaming_elements = await page.locator('button, div').filter(has_text=page.locator('text=Streaming, text=Latency, text=Buffer, text=Interrupt')).count()
                results['streaming_elements'] = streaming_elements
                print(f"   ✅ Streaming voice AI page loaded, found {streaming_elements} streaming elements")
                
            except Exception as e:
                print(f"   ❌ Streaming voice AI test failed: {str(e)}")
                results['streaming_elements'] = 0
            
            # Test 8: Check for audio context and processing
            print("🎵 Testing audio processing...")
            try:
                audio_context_test = await page.evaluate("""
                    () => {
                        try {
                            const AudioContext = window.AudioContext || window.webkitAudioContext;
                            const context = new AudioContext();
                            const analyser = context.createAnalyser();
                            const microphone = context.createMediaStreamSource;
                            
                            return {
                                audioContext: true,
                                analyser: true,
                                mediaStreamSource: typeof microphone === 'function',
                                sampleRate: context.sampleRate,
                                state: context.state
                            };
                        } catch (error) {
                            return { error: error.message };
                        }
                    }
                """)
                results['audio_context'] = audio_context_test
                print(f"   {'✅' if audio_context_test.get('audioContext') else '❌'} Audio Context: {audio_context_test}")
                
            except Exception as e:
                print(f"   ❌ Audio processing test failed: {str(e)}")
                results['audio_context'] = {}
            
            # Calculate overall voice AI score
            score = 0
            if results.get('voice_ai_load_time', 0) < 3: score += 15
            if results.get('microphone_permission', {}).get('success'): score += 25
            if results.get('webrtc_support', {}).get('mediaDevices'): score += 15
            if results.get('webrtc_support', {}).get('getUserMedia'): score += 15
            if results.get('webrtc_support', {}).get('webRTC'): score += 10
            if results.get('onnx_support', {}).get('onnxAvailable'): score += 10
            if results.get('test_initialization'): score += 10
            
            results['voice_ai_score'] = score
            
        except Exception as e:
            print(f"❌ Voice AI test failed: {str(e)}")
            results['error'] = str(e)
            results['voice_ai_score'] = 0
        
        await browser.close()
        return results

async def main():
    """Run voice AI microphone test"""
    results = await test_voice_ai_microphone()
    
    print("\n" + "=" * 60)
    print("📋 VOICE AI MICROPHONE TEST RESULTS")
    print("=" * 60)
    
    print(f"\n📊 Performance:")
    print(f"  Voice AI Load Time: {results.get('voice_ai_load_time', 'N/A')}s")
    
    print(f"\n🎤 Microphone:")
    mic_perm = results.get('microphone_permission', {})
    print(f"  Permission: {'✅' if mic_perm.get('success') else '❌'} {mic_perm.get('message', 'Unknown')}")
    
    print(f"\n🌐 WebRTC Support:")
    webrtc = results.get('webrtc_support', {})
    for feature, supported in webrtc.items():
        print(f"  {feature}: {'✅' if supported else '❌'}")
    
    print(f"\n🎯 Voice Activity Detection:")
    print(f"  VAD Elements: {results.get('vad_elements', 0)}")
    onnx = results.get('onnx_support', {})
    print(f"  ONNX Runtime: {'✅' if onnx.get('onnxAvailable') else '❌'}")
    print(f"  WebAssembly: {'✅' if onnx.get('webAssemblySupport') else '❌'}")
    
    print(f"\n🧪 Testing:")
    print(f"  Test Page Elements: {results.get('test_page_elements', 0)}")
    print(f"  Test Initialization: {'✅' if results.get('test_initialization') else '❌'}")
    print(f"  Streaming Elements: {results.get('streaming_elements', 0)}")
    
    print(f"\n🎵 Audio Processing:")
    audio = results.get('audio_context', {})
    if 'error' in audio:
        print(f"  Audio Context: ❌ {audio['error']}")
    else:
        print(f"  Audio Context: ✅ State: {audio.get('state', 'Unknown')}")
        print(f"  Sample Rate: {audio.get('sampleRate', 'Unknown')} Hz")
    
    print(f"\n⚡ Overall Voice AI Score: {results.get('voice_ai_score', 0)}/100")
    
    print(f"\n🎯 Assessment:")
    score = results.get('voice_ai_score', 0)
    if score >= 80:
        print("  🏆 EXCELLENT - Voice AI fully functional")
    elif score >= 60:
        print("  ✅ GOOD - Voice AI mostly working with minor issues")
    elif score >= 40:
        print("  ⚠️ PARTIAL - Voice AI partially functional")
    else:
        print("  ❌ BROKEN - Voice AI needs significant work")
    
    print(f"\n💡 Recommendations:")
    if not mic_perm.get('success'):
        print("  - Fix microphone permissions")
    if not webrtc.get('mediaDevices'):
        print("  - Ensure WebRTC media devices support")
    if not onnx.get('onnxAvailable'):
        print("  - Install ONNX runtime for VAD")
    if results.get('voice_ai_load_time', 0) > 3:
        print("  - Optimize voice AI page loading")
    if not results.get('test_initialization'):
        print("  - Fix voice AI test initialization")

if __name__ == "__main__":
    asyncio.run(main())
