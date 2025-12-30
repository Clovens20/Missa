import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'

export async function PUT(request, { params }) {
  try {
    const { id } = params
    const body = await request.json()
    
    const updateData = {
      updated_at: new Date().toISOString()
    }
    
    // Mapper les champs camelCase vers snake_case
    if (body.status !== undefined) updateData.status = body.status
    if (body.notes !== undefined) updateData.notes = body.notes
    if (body.customer !== undefined) updateData.customer = body.customer
    if (body.items !== undefined) updateData.items = body.items
    if (body.shippingCost !== undefined) updateData.shipping_cost = body.shippingCost
    if (body.discount !== undefined) updateData.discount = body.discount
    if (body.totalAmount !== undefined) updateData.total_amount = body.totalAmount
    if (body.trackingNumber !== undefined) updateData.tracking_number = body.trackingNumber
    if (body.shippingCarrier !== undefined) updateData.shipping_carrier = body.shippingCarrier
    if (body.trackingUrl !== undefined) updateData.tracking_url = body.trackingUrl
    
    const { data, error } = await supabaseServer
      .from('orders')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 })
      }
      throw error
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
