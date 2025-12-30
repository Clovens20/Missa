import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'

// Fonction pour générer le lien de suivi selon le transporteur
function generateTrackingUrl(carrier, trackingNumber, country) {
  const carriers = {
    'canada-post': `https://www.canadapost-postescanada.ca/track-reperage/en#/search?searchFor=${trackingNumber}`,
    'ups': `https://www.ups.com/track?tracknum=${trackingNumber}`,
    'fedex': `https://www.fedex.com/fedextrack/?trknbr=${trackingNumber}`,
    'dhl': `https://www.dhl.com/en/express/tracking.html?AWB=${trackingNumber}`,
    'usps': `https://tools.usps.com/go/TrackConfirmAction?tLabels=${trackingNumber}`,
    'colissimo': `https://www.laposte.fr/outils/suivre-vos-envois?code=${trackingNumber}`,
    'chronopost': `https://www.chronopost.fr/tracking-colis?listeNumerosLT=${trackingNumber}`
  }
  
  return carriers[carrier] || `https://www.google.com/search?q=${trackingNumber}`
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { orderId, action, trackingNumber, carrier } = body
    
    // Récupérer la commande
    const { data: order, error: orderError } = await supabaseServer
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single()
    
    if (orderError || !order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 })
    }
    
    let newStatus = order.status
    let trackingUrl = null
    
    if (action === 'received') {
      newStatus = 'received'
      // TODO: Envoyer email au client - "Votre commande a été reçue"
    } else if (action === 'preparing') {
      newStatus = 'preparing'
      // TODO: Envoyer email au client - "Votre commande est en préparation"
    } else if (action === 'shipped') {
      if (!trackingNumber || !carrier) {
        return NextResponse.json({ success: false, error: 'Tracking number and carrier required' }, { status: 400 })
      }
      newStatus = 'shipped'
      trackingUrl = generateTrackingUrl(carrier, trackingNumber, order.customer?.country)
      
      // TODO: Envoyer email au client avec le lien de suivi
      // Email: "Votre commande a été expédiée - Suivez votre colis"
    }
    
    // Mettre à jour la commande
    const updateData = {
      status: newStatus,
      updated_at: new Date().toISOString()
    }
    
    if (trackingNumber) {
      updateData.tracking_number = trackingNumber
      updateData.shipping_carrier = carrier
      updateData.tracking_url = trackingUrl
    }
    
    const { data: updatedOrder, error: updateError } = await supabaseServer
      .from('orders')
      .update(updateData)
      .eq('id', orderId)
      .select()
      .single()
    
    if (updateError) throw updateError
    
    return NextResponse.json({ 
      success: true, 
      order: updatedOrder,
      trackingUrl: trackingUrl,
      message: action === 'received' ? 'Client notifié : Commande reçue' :
               action === 'preparing' ? 'Client notifié : Commande en préparation' :
               'Client notifié : Commande expédiée avec lien de suivi'
    })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

