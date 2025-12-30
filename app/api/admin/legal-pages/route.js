import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')
    
    let query = supabaseServer
      .from('legal_pages')
      .select('*')
    
    if (slug) {
      query = query.eq('page_slug', slug).maybeSingle()
    }
    
    const { data, error } = await query
    
    if (error) {
      console.error('Supabase query error:', error)
      throw error
    }
    
    // Si aucune page trouvée, retourner null
    if (slug && !data) {
      return NextResponse.json({ success: true, pages: null })
    }
    
    return NextResponse.json({ success: true, pages: slug ? data : data })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { page_slug, title_fr, title_en, content_fr, content_en, meta_description_fr, meta_description_en } = body
    
    // Vérifier si la page existe déjà
    const { data: existing, error: checkError } = await supabaseServer
      .from('legal_pages')
      .select('id')
      .eq('page_slug', page_slug)
      .maybeSingle()
    
    // Ignorer l'erreur si aucune ligne trouvée (c'est normal pour une nouvelle page)
    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking existing page:', checkError)
    }
    
    let result
    if (existing && existing.id) {
      // Mettre à jour
      const { data, error } = await supabaseServer
        .from('legal_pages')
        .update({
          title_fr,
          title_en,
          content_fr,
          content_en,
          meta_description_fr,
          meta_description_en,
          updated_at: new Date().toISOString()
        })
        .eq('page_slug', page_slug)
        .select()
        .single()
      
      if (error) throw error
      result = data
    } else {
      // Créer
      const { data, error } = await supabaseServer
        .from('legal_pages')
        .insert({
          page_slug,
          title_fr,
          title_en,
          content_fr,
          content_en,
          meta_description_fr,
          meta_description_en
        })
        .select()
        .single()
      
      if (error) throw error
      result = data
    }
    
    return NextResponse.json({ success: true, page: result })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

