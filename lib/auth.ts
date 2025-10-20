import { NextAuthOptions } from "next-auth"
import { SupabaseAdapter } from "@auth/supabase-adapter"
import GoogleProvider from "next-auth/providers/google"
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export const authOptions: NextAuthOptions = {
  adapter: SupabaseAdapter({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  }),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      // Persist the OAuth access_token and or the user id to the token right after signin
      if (account) {
        token.accessToken = account.access_token
        token.provider = account.provider
      }
      if (user) {
        token.userId = user.id
      }
      return token
    },
    async session({ session, token }) {
      // Send properties to the client
      session.accessToken = token.accessToken as string
      session.user.id = token.userId as string
      session.user.provider = token.provider as string
      return session
    },
    async signIn({ user, account, profile }) {
      // Custom sign-in logic
      if (account?.provider === 'google') {
        // Verify Google profile
        return !!profile?.email_verified
      }
      return true
    }
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  events: {
    async signIn({ user, account, profile, isNewUser }) {
      console.log('User signed in:', { userId: user.id, email: user.email, provider: account?.provider })
      
      // Create or update user profile
      if (isNewUser && user.email) {
        try {
          await supabase
            .from('profiles')
            .upsert({
              id: user.id,
              email: user.email,
              name: user.name,
              avatar_url: user.image,
              plan_name: 'trial',
              plan_limit: 60,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })
          console.log('User profile created/updated for:', user.email)
        } catch (error) {
          console.error('Failed to create user profile:', error)
        }
      }
    },
    async signOut({ token }) {
      console.log('User signed out:', token?.userId)
    }
  },
  debug: process.env.NODE_ENV === 'development',
}
