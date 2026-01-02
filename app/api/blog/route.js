import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'

// Désactiver le cache pour cette route
export const dynamic = 'force-dynamic'
export const revalidate = 0

// Catégories spécialisées pour produits en résine
// Support des anciennes catégories (news, tutorials, inspiration) et nouvelles
const RESIN_CATEGORIES = [
  // Nouvelles catégories
  'bijoux-resine',
  'decoration-resine',
  'art-resine',
  'meubles-resine',
  'accessoires-resine',
  'tutoriels-resine',
  'inspiration-resine',
  // Anciennes catégories (compatibilité)
  'news',
  'tutorials',
  'tutoriels',
  'inspiration',
  'nouveautes',
  'nouvelles'
]

// Validation des URLs d'images haute qualité
function validateImageUrl(url) {
  if (!url) return false
  // Accepter Unsplash, Pexels, ou votre CDN
  const validDomains = [
    'images.unsplash.com',
    'images.pexels.com',
    'cdn.pixabay.com',
    'votre-cdn.com'
  ]
  try {
    const urlObj = new URL(url)
    return validDomains.some(domain => urlObj.hostname.includes(domain))
  } catch {
    return false
  }
}

// Générer un slug automatiquement si nécessaire
function generateSlug(title) {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')
    const limit = searchParams.get('limit')
    const all = searchParams.get('all') // Pour l'admin : récupérer tous les articles (actifs et inactifs)
    
    let query = supabaseServer
      .from('blog_posts')
      .select('*')
    
    // Si all=true n'est pas spécifié, filtrer uniquement les articles actifs
    if (all !== 'true') {
      query = query.eq('is_active', true)
    }
    
    // Filtrer par catégorie
    // Accepter TOUTES les catégories de la DB (news, tutorials, inspiration, etc.)
    if (category && category !== 'all') {
      query = query.eq('category', category)
    }
    
    // Articles en vedette
    if (featured === 'true') {
      query = query.eq('is_featured', true)
    }
    
    // Limiter le nombre de résultats
    if (limit) {
      query = query.limit(parseInt(limit))
    }
    
    query = query.order('published_at', { ascending: false })
    
    const { data: posts, error } = await query
    
    if (error) {
      console.error('❌ Erreur Supabase:', error)
      throw error
    }
    
    // Log détaillé pour debug
    console.log(`📝 Blog API: ${posts?.length || 0} articles trouvés${category ? ` (catégorie: ${category})` : ''}`)
    if (posts && posts.length > 0) {
      console.log('📋 Articles retournés:')
      posts.forEach(p => {
        console.log(`  - ${p.title_fr} (${p.slug}) | Cat: ${p.category} | Actif: ${p.is_active} | Publié: ${p.published_at}`)
      })
    } else {
      console.warn('⚠️ Aucun article trouvé dans la base de données')
    }
    
    // Vérifier aussi les articles inactifs pour debug
    const { data: allPosts } = await supabaseServer
      .from('blog_posts')
      .select('id, slug, title_fr, is_active, published_at')
      .order('published_at', { ascending: false })
      .limit(10)
    
    if (allPosts && allPosts.length > 0) {
      console.log(`📊 Total articles dans la DB (actifs + inactifs): ${allPosts.length}`)
      allPosts.forEach(p => {
        if (!p.is_active) {
          console.log(`  ⚠️ Article INACTIF: ${p.title_fr} (${p.slug}) - Publié: ${p.published_at}`)
        }
      })
    }
    
    // Supprimer les doublons basés sur le slug (au cas où)
    const uniquePosts = posts.reduce((acc, current) => {
      const existingPost = acc.find(p => p.slug === current.slug)
      if (!existingPost) {
        acc.push(current)
      } else {
        console.warn(`⚠️ Doublon détecté: ${current.slug} (ID: ${current.id})`)
      }
      return acc
    }, [])
    
    // Formater les posts avec métadonnées enrichies
    const formattedPosts = uniquePosts.map(p => ({
      _id: p.id,
      slug: p.slug,
      title_fr: p.title_fr,
      title_en: p.title_en,
      excerpt_fr: p.excerpt_fr,
      excerpt_en: p.excerpt_en,
      content_fr: p.content_fr,
      content_en: p.content_en,
      category: p.category,
      
      // Images haute qualité
      image: p.image,
      imageAlt_fr: p.image_alt_fr || p.title_fr,
      imageAlt_en: p.image_alt_en || p.title_en,
      imageCredits: p.image_credits,
      
      // Métadonnées
      author: p.author,
      authorBio_fr: p.author_bio_fr,
      authorBio_en: p.author_bio_en,
      authorAvatar: p.author_avatar,
      
      // Dates et statut
      publishedAt: p.published_at,
      updatedAt: p.updated_at,
      isActive: p.is_active,
      isFeatured: p.is_featured || false,
      
      // SEO
      metaDescription_fr: p.meta_description_fr,
      metaDescription_en: p.meta_description_en,
      
      // Statistiques
      readingTime: p.reading_time || calculateReadingTime(p.content_fr),
      viewCount: p.view_count || 0
    }))
    
    // Désactiver le cache pour forcer le rechargement
    return NextResponse.json({ 
      success: true, 
      posts: formattedPosts,
      count: formattedPosts.length,
      categories: RESIN_CATEGORIES
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
    
  } catch (error) {
    console.error('GET API Error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    
    // Validations
    if (!body.title_fr || !body.content_fr) {
      return NextResponse.json({ 
        success: false, 
        error: 'Titre et contenu en français sont requis' 
      }, { status: 400 })
    }
    
    // Accepter toutes les catégories pour compatibilité
    // if (!RESIN_CATEGORIES.includes(body.category)) {
    //   return NextResponse.json({ 
    //     success: false, 
    //     error: `Catégorie invalide. Choisir parmi: ${RESIN_CATEGORIES.join(', ')}` 
    //   }, { status: 400 })
    // }
    
    if (body.image && !validateImageUrl(body.image)) {
      return NextResponse.json({ 
        success: false, 
        error: 'URL d\'image non valide. Utilisez Unsplash, Pexels ou votre CDN' 
      }, { status: 400 })
    }
    
    // Générer le slug si absent
    const slug = body.slug || generateSlug(body.title_fr)
    
    // Vérifier l'unicité du slug
    const { data: existing } = await supabaseServer
      .from('blog_posts')
      .select('id')
      .eq('slug', slug)
      .single()
    
    if (existing) {
      return NextResponse.json({ 
        success: false, 
        error: 'Un article avec ce slug existe déjà' 
      }, { status: 400 })
    }
    
    const postData = {
      slug,
      title_fr: body.title_fr,
      title_en: body.title_en || body.title_fr,
      excerpt_fr: body.excerpt_fr || body.content_fr.substring(0, 160),
      excerpt_en: body.excerpt_en || body.excerpt_fr,
      content_fr: body.content_fr,
      content_en: body.content_en || body.content_fr,
      category: body.category,
      
      // Images
      image: body.image,
      image_alt_fr: body.image_alt_fr || body.title_fr,
      image_alt_en: body.image_alt_en || body.title_en,
      image_credits: body.image_credits,
      
      // Auteur
      author: body.author || 'Missa',
      author_bio_fr: body.author_bio_fr || 'Artisan spécialisé en créations résine',
      author_bio_en: body.author_bio_en || 'Resin craft specialist',
      author_avatar: body.author_avatar,
      
      // Métadonnées
      published_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_active: body.is_active !== false,
      is_featured: body.is_featured || false,
      
      // SEO
      meta_description_fr: body.meta_description_fr || body.excerpt_fr,
      meta_description_en: body.meta_description_en || body.excerpt_en,
      
      // Stats
      reading_time: calculateReadingTime(body.content_fr),
      view_count: 0
    }
    
    const { data, error } = await supabaseServer
      .from('blog_posts')
      .insert(postData)
      .select()
      .single()
    
    if (error) throw error
    
    return NextResponse.json({ 
      success: true, 
      postId: data.id,
      slug: data.slug,
      message: 'Article publié avec succès'
    })
    
  } catch (error) {
    console.error('POST API Error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 })
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