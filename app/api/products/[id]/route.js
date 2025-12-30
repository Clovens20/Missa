import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'

export async function PUT(request, { params }) {
  try {
    const { id } = params
    const body = await request.json()
    
    // Convertir camelCase vers snake_case pour Supabase
    const updateData = {
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
      is_active: body.isActive,
      images: body.images || [],
      updated_at: new Date().toISOString()
    }
    
    // Supprimer les champs undefined
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) delete updateData[key]
    })
    
    const { data, error } = await supabaseServer
      .from('products')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 })
      }
      throw error
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params
    
    const { error } = await supabaseServer
      .from('products')
      .delete()
      .eq('id', id)
    
    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 })
      }
      throw error
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
