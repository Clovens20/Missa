import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'

export async function POST(request, { params }) {
  try {
    const { slug } = params

    if (!slug) {
      return NextResponse.json({ 
        success: false, 
        error: 'Slug requis' 
      }, { status: 400 })
    }

    // Essayer d'utiliser la fonction RPC si elle existe
    try {
      const { data, error } = await supabaseServer
        .rpc('increment_post_views', { post_slug: slug })

      if (!error && data !== null) {
        return NextResponse.json({ 
          success: true,
          viewCount: data
        })
      }
    } catch (rpcError) {
      // Fallback: incrémenter manuellement si la fonction RPC n'existe pas
      console.log('RPC function not available, using manual update')
    }

    // Méthode alternative: mise à jour directe
    const { data: post, error: fetchError } = await supabaseServer
      .from('blog_posts')
      .select('view_count')
      .eq('slug', slug)
      .single()

    if (fetchError) {
      console.error('Erreur fetch post:', fetchError)
      return NextResponse.json({ 
        success: true,
        message: 'Vue comptée (mode dégradé)'
      })
    }

    const newViewCount = (post?.view_count || 0) + 1

    const { error: updateError } = await supabaseServer
      .from('blog_posts')
      .update({ view_count: newViewCount })
      .eq('slug', slug)

    if (updateError) {
      console.error('Erreur increment views:', updateError)
      return NextResponse.json({ 
        success: true,
        message: 'Vue comptée (avec erreur silencieuse)'
      })
    }

    return NextResponse.json({ 
      success: true,
      viewCount: newViewCount
    })

  } catch (error) {
    console.error('POST view error:', error)
    // Ne pas bloquer l'affichage de l'article
    return NextResponse.json({ 
      success: true,
      message: 'Vue comptée (mode dégradé)'
    })
  }
}

