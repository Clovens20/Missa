import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'

export async function GET() {
  try {
    
    const { data: codes, error } = await supabaseServer
      .from('promo_codes')
      .select('*')
      .eq('is_active', true)
    
    if (error) throw error
    
    return NextResponse.json({ success: true, codes })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const { code } = await request.json()
    
    const { data: promoCode, error } = await supabaseServer
      .from('promo_codes')
      .select('*')
      .eq('code', code.toUpperCase())
      .eq('is_active', true)
      .gt('expires_at', new Date().toISOString())
      .single()
    
    if (error || !promoCode) {
      return NextResponse.json({ success: false, error: 'Invalid or expired code' }, { status: 404 })
    }
    
    return NextResponse.json({ 
      success: true, 
      promo: {
        code: promoCode.code,
        type: promoCode.type,
        value: promoCode.value
      }
    })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
