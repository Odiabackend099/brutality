'use client';

import React from 'react';

export default function TestChatPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Chat Widget Test Page</h1>
        
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Instructions</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Look for the chat widget in the bottom right corner of the page</li>
            <li>Click the "Chat with us" button to open the chat interface</li>
            <li>Try sending a message to test the chat functionality</li>
            <li>Check if the chat widget properly expands and collapses</li>
            <li>Verify that messages are displayed correctly</li>
          </ul>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Page Content</h2>
          <p className="mb-4">
            This is a test page to verify that the ChatWidget component is working correctly.
            The chat widget should appear in the bottom right corner of the screen.
          </p>
          <p>
            If you can see the chat widget and interact with it, the component is working properly.
            If not, there may be an issue with the implementation that needs to be addressed.
          </p>
        </div>
      </div>
    </div>
  );
}