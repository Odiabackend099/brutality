/**
 * Test Mode Utilities for CallWaiting AI
 * Handles test admin mode functionality and payment bypassing
 */

export interface TestModeUser {
  id: string;
  email: string;
  role: string;
  test_mode: boolean;
}

/**
 * Check if test mode is enabled globally
 */
export function isTestModeEnabled(): boolean {
  return process.env.TEST_MODE === 'true';
}

/**
 * Check if a user is a test admin user
 */
export function isTestAdminUser(user: any): boolean {
  return user?.user_metadata?.role === 'test-admin' || 
         user?.user_metadata?.test_mode === true ||
         user?.role === 'test-admin' ||
         user?.test_mode === true;
}

/**
 * Check if payment should be bypassed for a user
 */
export function shouldBypassPayment(user: any): boolean {
  if (!isTestModeEnabled()) {
    return false;
  }
  
  return isTestAdminUser(user);
}

/**
 * Get test mode configuration
 */
export function getTestModeConfig() {
  return {
    enabled: isTestModeEnabled(),
    adminPassword: process.env.TEST_ADMIN_PASSWORD,
    testPhoneNumber: process.env.TEST_PHONE_NUMBER || '+1234567890',
    testVoiceId: 'moss_audio_a59cd561-ab87-11f0-a74c-2a7a0b4baedc', // Marcus
    testAgentName: 'Test AI Agent',
    testBusinessName: 'Test Business'
  };
}

/**
 * Validate test mode access
 */
export function validateTestModeAccess(request: Request): boolean {
  if (!isTestModeEnabled()) {
    return false;
  }

  // Additional security checks can be added here
  const origin = request.headers.get('origin');
  const userAgent = request.headers.get('user-agent');
  
  // Only allow from localhost in development
  if (process.env.NODE_ENV === 'development') {
    return Boolean(origin?.includes('localhost') || origin?.includes('127.0.0.1'));
  }
  
  // In production, add additional security checks
  return true;
}

/**
 * Create test mode response
 */
export function createTestModeResponse(data: any, message: string = 'Test mode response') {
  return {
    success: true,
    test_mode: true,
    message,
    data,
    timestamp: new Date().toISOString()
  };
}

/**
 * Log test mode activity
 */
export function logTestModeActivity(activity: string, userId?: string, details?: any) {
  if (isTestModeEnabled()) {
    console.log(`[TEST_MODE] ${activity}`, {
      userId,
      details,
      timestamp: new Date().toISOString()
    });
  }
}
