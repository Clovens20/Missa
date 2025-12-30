import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'

export async function GET() {
  try {
    
    const { data: posts, error } = await supabaseServer
      .from('blog_posts')
      .select('*')
      .eq('is_active', true)
      .order('published_at', { ascending: false })
    
    if (error) throw error
    
    // Convertir pour compatibilité frontend
    const formattedPosts = posts.map(p => ({
      _id: p.id,
      slug: p.slug,
      title_fr: p.title_fr,
      title_en: p.title_en,
      excerpt_fr: p.excerpt_fr,
      excerpt_en: p.excerpt_en,
      content_fr: p.content_fr,
      content_en: p.content_en,
      category: p.category,
      image: p.image,
      author: p.author,
      publishedAt: p.published_at,
      isActive: p.is_active
    }))
    
    return NextResponse.json({ success: true, posts: formattedPosts })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    
    const postData = {
      slug: body.slug,
      title_fr: body.title_fr,
      title_en: body.title_en,
      excerpt_fr: body.excerpt_fr,
      excerpt_en: body.excerpt_en,
      content_fr: body.content_fr,
      content_en: body.content_en,
      category: body.category,
      image: body.image,
      author: body.author || 'Missa',
      published_at: new Date().toISOString(),
      is_active: true
    }
    
    const { data, error } = await supabaseServer
      .from('blog_posts')
      .insert(postData)
      .select()
      .single()
    
    if (error) throw error
    
    return NextResponse.json({ success: true, postId: data.id })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
