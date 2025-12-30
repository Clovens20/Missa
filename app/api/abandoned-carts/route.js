import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'

export async function POST(request) {
  try {
    const body = await request.json()
    const { email, name, language = 'fr', cartItems, totalAmount } = body

    if (!email || !email.includes('@')) {
      return NextResponse.json({ 
        success: false, 
        error: 'Email invalide' 
      }, { status: 400 })
    }

    // Vérifier si un panier abandonné existe déjà pour cet email aujourd'hui
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const { data: existing, error: checkError } = await supabaseServer
      .from('abandoned_carts')
      .select('id')
      .eq('email', email.toLowerCase().trim())
      .gte('created_at', today.toISOString())
      .maybeSingle()

    if (checkError && checkError.code !== 'PGRST116') {
      throw checkError
    }

    if (existing) {
      // Mettre à jour le panier abandonné existant
      const { error: updateError } = await supabaseServer
        .from('abandoned_carts')
        .update({
          name: name || null,
          language: language,
          cart_items: cartItems || null,
          total_amount: totalAmount || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', existing.id)

      if (updateError) throw updateError

      return NextResponse.json({ 
        success: true, 
        message: 'Panier abandonné mis à jour',
        isUpdate: true
      })
    } else {
      // Créer un nouveau panier abandonné
      const { data: newCart, error: insertError } = await supabaseServer
        .from('abandoned_carts')
        .insert({
          email: email.toLowerCase().trim(),
          name: name || null,
          language: language,
          cart_items: cartItems || null,
          total_amount: totalAmount || null
        })
        .select()
        .single()

      if (insertError) throw insertError

      return NextResponse.json({ 
        success: true, 
        message: 'Email enregistré',
        cartId: newCart.id
      })
    }
  } catch (error) {
    console.error('Abandoned cart error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Erreur lors de l\'enregistrement' 
    }, { status: 500 })
  }
}

export async function GET() {
  try {
    const { data: abandonedCarts, error } = await supabaseServer
      .from('abandoned_carts')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    
    return NextResponse.json({ 
      success: true, 
      abandonedCarts: abandonedCarts || [] 
    })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 })
  }
}

