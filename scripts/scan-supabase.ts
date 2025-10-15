// Script to scan Supabase backend and report current state
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://bcufohulqrceytkrqpgd.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJjdWZvaHVscXJjZXl0a3JxcGdkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1MTA2NTUsImV4cCI6MjA3NTA4NjY1NX0.rc9-fFpLsTyESK-222zYVKGVx-R5mwb9Xi005p_bwoI'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function scanBackend() {
  console.log('🔍 Scanning Supabase Backend...\n')
  console.log('Project URL:', supabaseUrl)
  console.log('Project Ref: bcufohulqrceytkrqpgd\n')

  // Check payments table
  console.log('📊 Checking payments_callwaiting table...')
  try {
    const { data, error, count } = await supabase
      .from('payments_callwaiting')
      .select('*', { count: 'exact', head: true })

    if (error) {
      console.log('❌ Error:', error.message)
      if (error.message.includes('does not exist')) {
        console.log('⚠️  Table does not exist yet\n')
      }
    } else {
      console.log(`✅ Table exists with ${count} records\n`)
    }
  } catch (e) {
    console.log('❌ Failed to query:', e.message, '\n')
  }

  // Check leads table
  console.log('📊 Checking leads_callwaiting table...')
  try {
    const { data, error, count } = await supabase
      .from('leads_callwaiting')
      .select('*', { count: 'exact', head: true })

    if (error) {
      console.log('❌ Error:', error.message)
      if (error.message.includes('does not exist')) {
        console.log('⚠️  Table does not exist yet\n')
      }
    } else {
      console.log(`✅ Table exists with ${count} records\n`)
    }
  } catch (e) {
    console.log('❌ Failed to query:', e.message, '\n')
  }

  // Check call logs table
  console.log('📊 Checking call_logs table...')
  try {
    const { data, error, count } = await supabase
      .from('call_logs')
      .select('*', { count: 'exact', head: true })

    if (error) {
      console.log('❌ Error:', error.message)
      if (error.message.includes('does not exist')) {
        console.log('⚠️  Table does not exist yet (will be created in Week 3)\n')
      }
    } else {
      console.log(`✅ Table exists with ${count} records\n`)
    }
  } catch (e) {
    console.log('❌ Failed to query:', e.message, '\n')
  }

  // Check auth users
  console.log('👤 Checking auth status...')
  try {
    const { data: { session }, error } = await supabase.auth.getSession()
    if (session) {
      console.log('✅ User authenticated:', session.user.email, '\n')
    } else {
      console.log('⚠️  No active session (auth not set up yet)\n')
    }
  } catch (e) {
    console.log('⚠️  Auth check skipped (requires user login)\n')
  }

  console.log('🎯 Summary:')
  console.log('- Supabase project is active')
  console.log('- Run database migrations to create tables')
  console.log('- Deploy Edge Functions for security layer')
  console.log('- See SECURITY_SETUP_GUIDE.md for next steps')
}

scanBackend().catch(console.error)
