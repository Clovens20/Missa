import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'

// Catégories acceptées
const RESIN_CATEGORIES = [
  'bijoux-resine',
  'decoration-resine',
  'art-resine',
  'meubles-resine',
  'accessoires-resine',
  'tutoriels-resine',
  'inspiration-resine',
  'news',
  'tutorials',
  'tutoriels',
  'inspiration',
  'nouveautes',
  'nouvelles'
]

// Validation des URLs d'images
function validateImageUrl(url) {
  if (!url) return false
  const validDomains = [
    'images.unsplash.com',
    'images.pexels.com',
    'cdn.pixabay.com',
    'votre-cdn.com'
  ]
  try {
    const urlObj = new URL(url)
    return validDomains.some(domain => urlObj.hostname.includes(domain)) || url.startsWith('http')
  } catch {
    return false
  }
}

// Fonction utilitaire pour calculer le temps de lecture
function calculateReadingTime(content) {
  if (!content) return 1
  const wordsPerMinute = 200
  const wordCount = content.trim().split(/\s+/).length
  const minutes = Math.ceil(wordCount / wordsPerMinute)
  return minutes
}

// GET : Récupérer un article spécifique
export async function GET(request, { params }) {
  try {
    const { slug } = params
    const { searchParams } = new URL(request.url)
    const all = searchParams.get('all') // Pour l'admin : récupérer même les articles inactifs

    let query = supabaseServer
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
    
    // Si all=true n'est pas spécifié, filtrer uniquement les articles actifs
    if (all !== 'true') {
      query = query.eq('is_active', true)
    }

    const { data: post, error } = await query.single()

    if (error || !post) {
      return NextResponse.json({ 
        success: false, 
        error: 'Article non trouvé' 
      }, { status: 404 })
    }

    const formattedPost = {
      _id: post.id,
      slug: post.slug,
      title_fr: post.title_fr,
      title_en: post.title_en,
      excerpt_fr: post.excerpt_fr,
      excerpt_en: post.excerpt_en,
      content_fr: post.content_fr,
      content_en: post.content_en,
      category: post.category,
      image: post.image,
      imageAlt_fr: post.image_alt_fr || post.title_fr,
      imageAlt_en: post.image_alt_en || post.title_en,
      imageCredits: post.image_credits,
      author: post.author,
      authorBio_fr: post.author_bio_fr,
      authorBio_en: post.author_bio_en,
      authorAvatar: post.author_avatar,
      publishedAt: post.published_at,
      updatedAt: post.updated_at,
      isActive: post.is_active,
      isFeatured: post.is_featured || false,
      metaDescription_fr: post.meta_description_fr,
      metaDescription_en: post.meta_description_en,
      readingTime: post.reading_time || calculateReadingTime(post.content_fr),
      viewCount: post.view_count || 0
    }

    return NextResponse.json({ 
      success: true, 
      post: formattedPost
    })

  } catch (error) {
    console.error('GET API Error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 })
  }
}

// PUT : Modifier un article
export async function PUT(request, { params }) {
  try {
    const { slug } = params
    const body = await request.json()

    // Validations
    if (!body.title_fr || !body.content_fr) {
      return NextResponse.json({ 
        success: false, 
        error: 'Titre et contenu en français sont requis' 
      }, { status: 400 })
    }

    if (body.image && !validateImageUrl(body.image)) {
      return NextResponse.json({ 
        success: false, 
        error: 'URL d\'image non valide. Utilisez Unsplash, Pexels ou votre CDN' 
      }, { status: 400 })
    }

    // Vérifier que l'article existe
    const { data: existing } = await supabaseServer
      .from('blog_posts')
      .select('id')
      .eq('slug', slug)
      .single()

    if (!existing) {
      return NextResponse.json({ 
        success: false, 
        error: 'Article non trouvé' 
      }, { status: 404 })
    }

    // Si le slug change, vérifier qu'il n'existe pas déjà
    if (body.slug && body.slug !== slug) {
      const { data: slugExists } = await supabaseServer
        .from('blog_posts')
        .select('id')
        .eq('slug', body.slug)
        .single()

      if (slugExists) {
        return NextResponse.json({ 
          success: false, 
          error: 'Un article avec ce slug existe déjà' 
        }, { status: 400 })
      }
    }

    const updateData = {
      slug: body.slug || slug,
      title_fr: body.title_fr,
      title_en: body.title_en || body.title_fr,
      excerpt_fr: body.excerpt_fr || body.content_fr.substring(0, 160),
      excerpt_en: body.excerpt_en || body.excerpt_fr,
      content_fr: body.content_fr,
      content_en: body.content_en || body.content_fr,
      category: body.category,
      image: body.image,
      image_alt_fr: body.image_alt_fr || body.title_fr,
      image_alt_en: body.image_alt_en || body.title_en,
      image_credits: body.image_credits,
      author: body.author || 'Missa',
      author_bio_fr: body.author_bio_fr,
      author_bio_en: body.author_bio_en,
      author_avatar: body.author_avatar,
      published_at: body.published_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_active: body.is_active !== false,
      is_featured: body.is_featured || false,
      meta_description_fr: body.meta_description_fr || body.excerpt_fr,
      meta_description_en: body.meta_description_en || body.excerpt_en,
      reading_time: body.reading_time || calculateReadingTime(body.content_fr)
    }

    const { data, error } = await supabaseServer
      .from('blog_posts')
      .update(updateData)
      .eq('slug', slug)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ 
      success: true, 
      postId: data.id,
      slug: data.slug,
      message: 'Article modifié avec succès'
    })

  } catch (error) {
    console.error('PUT API Error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 })
  }
}

// DELETE : Supprimer un article
export async function DELETE(request, { params }) {
  try {
    const { slug } = params

    const { error } = await supabaseServer
      .from('blog_posts')
      .delete()
      .eq('slug', slug)

    if (error) throw error

    return NextResponse.json({ 
      success: true,
      message: 'Article supprimé avec succès'
    })

  } catch (error) {
    console.error('DELETE API Error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 })
  }
}

