import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'

export async function POST(request, { params }) {
  try {
    const { id } = params
    
    // Récupérer la commande
    const { data: order, error: orderError } = await supabaseServer
      .from('orders')
      .select('*')
      .eq('id', id)
      .single()
    
    if (orderError || !order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 })
    }
    
    // Vérifier que la commande peut être annulée
    if (order.status === 'cancelled') {
      return NextResponse.json({ success: false, error: 'Order already cancelled' }, { status: 400 })
    }
    
    if (order.status === 'delivered') {
      return NextResponse.json({ success: false, error: 'Cannot cancel delivered order' }, { status: 400 })
    }
    
    // Mettre à jour le statut de la commande
    const { data: updatedOrder, error: updateError } = await supabaseServer
      .from('orders')
      .update({ 
        status: 'cancelled',
        updated_at: new Date().toISOString(),
        notes: order.notes ? `${order.notes}\n\n[Annulée le ${new Date().toLocaleString('fr-FR')}]` : `[Annulée le ${new Date().toLocaleString('fr-FR')}]`
      })
      .eq('id', id)
      .select()
      .single()
    
    if (updateError) throw updateError
    
    // TODO: Intégrer avec Stripe/PayPal pour le remboursement automatique
    // Pour l'instant, on enregistre juste l'annulation
    // Le remboursement devra être fait manuellement ou via l'API de paiement
    
    return NextResponse.json({ 
      success: true, 
      order: updatedOrder,
      refundAmount: order.total_amount,
      message: `Commande annulée. Remboursement de ${order.total_amount.toFixed(2)}$ CAD requis.`
    })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

