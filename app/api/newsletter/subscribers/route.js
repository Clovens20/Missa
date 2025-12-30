import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'

export async function GET() {
  try {
    const { data: subscribers, error } = await supabaseServer
      .from('newsletter_subscribers')
      .select('*')
      .order('subscribed_at', { ascending: false })
    
    if (error) throw error
    
    return NextResponse.json({ 
      success: true, 
      subscribers: subscribers || [] 
    })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 })
  }
}

