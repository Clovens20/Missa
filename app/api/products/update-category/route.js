import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'

// Route pour mettre à jour la catégorie des produits vers "objets-art"
export async function POST(request) {
  try {
    const { productNames } = await request.json()
    
    // Si aucun nom n'est fourni, mettre à jour tous les produits actifs
    let query = supabaseServer
      .from('products')
      .update({ 
        category: 'objets-art',
        updated_at: new Date().toISOString()
      })
    
    if (productNames && productNames.length > 0) {
      // Mettre à jour seulement les produits spécifiés
      const { data: products, error: fetchError } = await supabaseServer
        .from('products')
        .select('id, name_fr, name_en')
        .in('is_active', [true])
      
      if (fetchError) throw fetchError
      
      // Trouver les IDs des produits correspondants
      const productIds = products
        .filter(p => {
          const nameFr = (p.name_fr || '').toLowerCase()
          const nameEn = (p.name_en || '').toLowerCase()
          return productNames.some(searchName => 
            nameFr.includes(searchName.toLowerCase()) || 
            nameEn.includes(searchName.toLowerCase())
          )
        })
        .map(p => p.id)
      
      if (productIds.length === 0) {
        return NextResponse.json({ 
          success: false, 
          error: 'Aucun produit trouvé avec ces noms' 
        }, { status: 404 })
      }
      
      const { data, error } = await supabaseServer
        .from('products')
        .update({ 
          category: 'objets-art',
          updated_at: new Date().toISOString()
        })
        .in('id', productIds)
        .select()
      
      if (error) throw error
      
      return NextResponse.json({ 
        success: true, 
        message: `${data.length} produit(s) mis à jour`,
        products: data
      })
    } else {
      // Mettre à jour tous les produits actifs
      const { data, error } = await query
        .eq('is_active', true)
        .select()
      
      if (error) throw error
      
      return NextResponse.json({ 
        success: true, 
        message: `${data.length} produit(s) mis à jour vers objets-art`,
        products: data
      })
    }
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

