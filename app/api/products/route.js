import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'

export async function GET(request) {
  try {
    // Headers de cache pour améliorer les performances
    const cacheControl = request.headers.get('cache-control') || 'public, s-maxage=60, stale-while-revalidate=300'
    
    // Vérifier si on veut tous les produits (pour l'admin) ou seulement les actifs (pour le site)
    const { searchParams } = new URL(request.url)
    const allProducts = searchParams.get('all') === 'true'
    
    let query = supabaseServer
      .from('products')
      .select('*')
    
    // Si on ne demande pas tous les produits, filtrer seulement les actifs
    if (!allProducts) {
      query = query.eq('is_active', true)
    }
    
    query = query.order('created_at', { ascending: false })
    
    const { data: products, error } = await query
    
    if (error) throw error
    
    // Convertir les noms de colonnes snake_case vers camelCase pour compatibilité frontend
    const formattedProducts = products.map(p => ({
      _id: p.id,
      name_fr: p.name_fr,
      name_en: p.name_en,
      description_fr: p.description_fr,
      description_en: p.description_en,
      category: p.category,
      price: p.price,
      promoPrice: p.promo_price,
      weight: p.weight,
      stock: p.stock,
      minStock: p.min_stock,
      isCustomizable: p.is_customizable,
      isActive: p.is_active,
      images: p.images || []
    }))
    
    const response = NextResponse.json({ success: true, products: formattedProducts })
    
    // Headers de cache
    response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300')
    response.headers.set('CDN-Cache-Control', 'public, s-maxage=60')
    response.headers.set('Vercel-CDN-Cache-Control', 'public, s-maxage=60')
    
    return response
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    
    // Convertir camelCase vers snake_case pour Supabase
    const productData = {
      name_fr: body.name_fr,
      name_en: body.name_en,
      description_fr: body.description_fr,
      description_en: body.description_en,
      category: body.category,
      price: body.price,
      promo_price: body.promoPrice || null,
      weight: body.weight,
      stock: body.stock,
      min_stock: body.minStock,
      is_customizable: body.isCustomizable,
      is_active: body.isActive !== undefined ? body.isActive : true,
      images: body.images || []
    }
    
    const { data, error } = await supabaseServer
      .from('products')
      .insert(productData)
      .select()
      .single()
    
    if (error) throw error
    
    return NextResponse.json({ success: true, productId: data.id })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
