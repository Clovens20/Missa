import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'

export async function POST(request) {
  try {
    const body = await request.json()
    const { productIds } = body
    
    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'productIds doit être un tableau non vide' 
      }, { status: 400 })
    }
    
    // Supprimer les produits en une seule requête
    const { error, count } = await supabaseServer
      .from('products')
      .delete()
      .in('id', productIds)
    
    if (error) {
      console.error('Supabase delete error:', error)
      throw error
    }
    
    return NextResponse.json({ 
      success: true, 
      deletedCount: productIds.length,
      message: `${productIds.length} produit(s) supprimé(s) avec succès`
    })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Erreur lors de la suppression multiple' 
    }, { status: 500 })
  }
}

