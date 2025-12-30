import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'

// GET - Récupérer les avis d'un produit
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')
    
    if (!productId) {
      return NextResponse.json({ 
        success: false, 
        error: 'productId est requis' 
      }, { status: 400 })
    }
    
    const { data: reviews, error } = await supabaseServer
      .from('product_reviews')
      .select('*')
      .eq('product_id', productId)
      .eq('is_approved', true) // Seulement les avis approuvés
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Supabase query error:', error)
      throw error
    }
    
    // Calculer la note moyenne
    const averageRating = reviews && reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0
    
    return NextResponse.json({ 
      success: true, 
      reviews: reviews || [],
      averageRating: Math.round(averageRating * 10) / 10,
      totalReviews: reviews?.length || 0
    })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Erreur lors de la récupération des avis' 
    }, { status: 500 })
  }
}

// POST - Ajouter un avis
export async function POST(request) {
  try {
    const body = await request.json()
    const { productId, rating, name, email, comment } = body
    
    if (!productId || !rating || !name || !comment) {
      return NextResponse.json({ 
        success: false, 
        error: 'productId, rating, name et comment sont requis' 
      }, { status: 400 })
    }
    
    if (rating < 1 || rating > 5) {
      return NextResponse.json({ 
        success: false, 
        error: 'La note doit être entre 1 et 5' 
      }, { status: 400 })
    }
    
    const { data, error } = await supabaseServer
      .from('product_reviews')
      .insert({
        product_id: productId,
        rating: parseInt(rating),
        name: name.trim(),
        email: email?.trim() || null,
        comment: comment.trim(),
        is_approved: true // Auto-approuver pour l'instant (peut être modifié plus tard)
      })
      .select()
      .single()
    
    if (error) {
      console.error('Supabase insert error:', error)
      throw error
    }
    
    return NextResponse.json({ 
      success: true, 
      review: data,
      message: 'Avis ajouté avec succès'
    })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Erreur lors de l\'ajout de l\'avis' 
    }, { status: 500 })
  }
}

