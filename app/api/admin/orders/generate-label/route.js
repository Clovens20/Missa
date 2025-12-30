import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'

export async function POST(request) {
  try {
    const { orderId } = await request.json()
    
    // Récupérer la commande
    const { data: order, error } = await supabaseServer
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single()
    
    if (error || !order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 })
    }
    
    // Formater les données pour le frontend
    const formattedOrder = {
      _id: order.id,
      orderNumber: order.order_number,
      customer: order.customer,
      items: order.items,
      shippingCost: order.shipping_cost,
      discount: order.discount,
      totalAmount: order.total_amount,
      trackingNumber: order.tracking_number,
      shippingCarrier: order.shipping_carrier,
      createdAt: order.created_at
    }
    
    return NextResponse.json({ success: true, order: formattedOrder })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

