import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
dotenv.config()

async function testConnection() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data, error } = await supabase.from('products').select('count')
  if (error) {
    console.error('Connection failed:', error.message)
    process.exit(1)
  }
  console.log('Connection successful! Product count check passed.')
}

testConnection()
