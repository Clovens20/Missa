import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const section = searchParams.get('section')
    const language = searchParams.get('language') || 'fr'
    
    let query = supabaseServer
      .from('site_content')
      .select('*')
    
    if (section) {
      query = query.eq('section', section)
    }
    
    if (language) {
      query = query.eq('language', language)
    }
    
    const { data, error } = await query
    
    if (error) {
      console.error('Supabase query error:', error)
      throw error
    }
    
    // Si aucune donnée, retourner un tableau vide
    return NextResponse.json({ success: true, content: data || [] })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { section, content, language = 'fr' } = body
    
    // Vérifier si la section existe déjà pour cette langue
    const { data: existing, error: checkError } = await supabaseServer
      .from('site_content')
      .select('id')
      .eq('section', section)
      .eq('language', language)
      .maybeSingle()
    
    // Ignorer l'erreur si aucune ligne trouvée (c'est normal pour une nouvelle section)
    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking existing content:', checkError)
    }
    
    let result
    if (existing && existing.id) {
      // Mettre à jour
      const { data, error } = await supabaseServer
        .from('site_content')
        .update({ content, updated_at: new Date().toISOString() })
        .eq('section', section)
        .eq('language', language)
        .select()
        .single()
      
      if (error) throw error
      result = data
    } else {
      // Créer
      const { data, error } = await supabaseServer
        .from('site_content')
        .insert({ section, content, language })
        .select()
        .single()
      
      if (error) throw error
      result = data
    }
    
    return NextResponse.json({ success: true, content: result })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

