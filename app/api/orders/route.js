import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'

function generateOrderNumber() {
  return 'MISSA-' + Date.now().toString().slice(-8)
}

export async function GET() {
  try {
    const { data: orders, error } = await supabaseServer
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    
    // Convertir les noms de colonnes pour compatibilité frontend
    const formattedOrders = orders.map(o => ({
      _id: o.id,
      orderNumber: o.order_number,
      customer: o.customer,
      items: o.items,
      shippingCost: o.shipping_cost,
      discount: o.discount,
      promoCode: o.promo_code,
      totalAmount: o.total_amount,
      status: o.status,
      trackingNumber: o.tracking_number,
      shippingCarrier: o.shipping_carrier,
      trackingUrl: o.tracking_url,
      notes: o.notes,
      createdAt: o.created_at,
      updatedAt: o.updated_at
    }))
    
    return NextResponse.json({ success: true, orders: formattedOrders })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    
    const orderData = {
      order_number: generateOrderNumber(),
      customer: body.customer,
      items: body.items,
      shipping_cost: body.shippingCost,
      discount: body.discount || 0,
      promo_code: body.promoCode || null,
      total_amount: body.totalAmount,
      status: 'pending'
    }
    
    const { data, error } = await supabaseServer
      .from('orders')
      .insert(orderData)
      .select()
      .single()
    
    if (error) throw error
    
    // Envoyer l'email de confirmation au client
    try {
      // Utiliser l'URL de base ou construire depuis la requête
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
        (request.headers.get('host') ? `https://${request.headers.get('host')}` : 'http://localhost:3000')
      
      const emailRes = await fetch(`${baseUrl}/api/orders/send-confirmation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order: {
            orderNumber: data.order_number,
            customer: body.customer,
            items: body.items,
            shippingCost: body.shippingCost,
            discount: body.discount || 0,
            totalAmount: body.totalAmount
          },
          language: body.customer?.language || 'fr'
        })
      })
      
      if (!emailRes.ok) {
        const emailError = await emailRes.json()
        console.error('Failed to send confirmation email:', emailError)
        // Ne pas faire échouer la commande si l'email échoue
      } else {
        console.log('✅ Confirmation email sent successfully')
      }
    } catch (emailError) {
      console.error('Error sending confirmation email:', emailError)
      // Ne pas faire échouer la commande si l'email échoue
    }
    
    return NextResponse.json({ 
      success: true, 
      orderId: data.id,
      orderNumber: data.order_number
    })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
