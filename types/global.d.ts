// Extend the Window interface to include webkitSpeechRecognition
declare global {
  interface Window {
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

import { DefaultSession } from "next-auth";

// Extend NextAuth types
declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user: {
      id: string;
      provider?: string;
    } & DefaultSession["user"];
  }

  interface JWT {
    accessToken?: string;
    userId?: string;
    provider?: string;
  }
}

export {};
