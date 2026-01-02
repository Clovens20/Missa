'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useLanguage } from '@/contexts/LanguageContext'

export default function BlogPostPage() {
  const [post, setPost] = useState(null)
  const [relatedPosts, setRelatedPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const { slug } = useParams()
  const { language } = useLanguage()
  const router = useRouter()

  useEffect(() => {
    if (slug) {
      fetchPost()
      incrementViewCount()
    }
  }, [slug])

  const fetchPost = async () => {
    try {
      setLoading(true)
      // Essayer d'abord de récupérer l'article directement par slug
      try {
        const directRes = await fetch(`/api/blog/${slug}?t=${Date.now()}`, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache'
          }
        })
        const directData = await directRes.json()
        
        if (directData.success && directData.post) {
          setPost(directData.post)
          
          // Récupérer les articles similaires
          const relatedRes = await fetch(`/api/blog?category=${directData.post.category}&limit=10&t=${Date.now()}`, {
            cache: 'no-store',
            headers: { 'Cache-Control': 'no-cache' }
          })
          const relatedData = await relatedRes.json()
          if (relatedData.success) {
            const related = relatedData.posts
              .filter(p => p.slug !== slug)
              .slice(0, 3)
            setRelatedPosts(related)
          }
          return
        }
      } catch (directError) {
        console.log('Tentative directe échouée, utilisation de la méthode alternative')
      }
      
      // Méthode alternative : récupérer tous les articles et trouver celui qui correspond
      const res = await fetch(`/api/blog?t=${Date.now()}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache'
        }
      })
      const data = await res.json()
      
      if (data.success) {
        const foundPost = data.posts.find(p => p.slug === slug)
        
        if (foundPost) {
          setPost(foundPost)
          
          // Articles similaires de la même catégorie
          const related = data.posts
            .filter(p => p.category === foundPost.category && p._id !== foundPost._id)
            .slice(0, 3)
          setRelatedPosts(related)
        } else {
          router.push('/blog')
        }
      }
    } catch (error) {
      console.error('Erreur chargement article:', error)
    } finally {
      setLoading(false)
    }
  }

  const incrementViewCount = async () => {
    try {
      await fetch(`/api/blog/view/${slug}`, { method: 'POST' })
    } catch (error) {
      console.error('Erreur compteur vues:', error)
    }
  }

  const getText = (field) => {
    if (!post) return ''
    return language === 'fr' ? post[`${field}_fr`] : post[`${field}_en`]
  }

  const shareOnSocial = (platform) => {
    const url = window.location.href
    const title = getText('title')
    
    const urls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      pinterest: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&description=${encodeURIComponent(title)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
    }
    
    window.open(urls[platform], '_blank', 'width=600,height=400')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">{language === 'fr' ? 'Chargement...' : 'Loading...'}</p>
        </div>
      </div>
    )
  }

  if (!post) return null

  return (
    <div className="min-h-screen bg-white">
      {/* Bouton retour */}
      <div className="bg-gray-50 border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link 
            href="/blog"
            className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {language === 'fr' ? 'Retour au blog' : 'Back to blog'}
          </Link>
        </div>
      </div>

      {/* Image hero */}
      <div className="relative h-96 md:h-[500px] w-full bg-gray-900">
        {post.image && post.image.trim() !== '' ? (
          <Image
            src={post.image}
            alt={post.imageAlt_fr || post.imageAlt_en || getText('title')}
            fill
            className="object-cover opacity-90"
            priority
            sizes="100vw"
            unoptimized={post.image?.includes('unsplash.com') || post.image?.includes('pexels.com')}
            onError={(e) => {
              console.error('Erreur chargement image:', post.image, post.slug)
              // Remplacer par un fallback visuel
              e.target.style.display = 'none'
              const fallback = e.target.nextElementSibling
              if (fallback) fallback.style.display = 'flex'
            }}
          />
        ) : null}
        {/* Fallback si l'image ne charge pas ou n'existe pas */}
        <div 
          className={`w-full h-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center ${post.image && post.image.trim() !== '' ? 'hidden' : ''}`}
          style={{ position: 'absolute', top: 0, left: 0 }}
        >
          <div className="text-center">
            <span className="text-white text-9xl block mb-4">🎨</span>
            <p className="text-white/80 text-sm">Image non disponible</p>
          </div>
        </div>
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        
        {/* Badge catégorie */}
        <div className="absolute top-6 left-6 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-bold text-purple-600">
          {post.category}
        </div>

        {/* Crédits photo */}
        {post.imageCredits && (
          <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full">
            📷 {post.imageCredits}
          </div>
        )}
      </div>

      {/* Contenu principal */}
      <article className="max-w-4xl mx-auto px-4 py-12">
        {/* En-tête article */}
        <header className="mb-10">
          {post.isFeatured && (
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold mb-4">
              ⭐ {language === 'fr' ? 'Article en vedette' : 'Featured article'}
            </div>
          )}
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {getText('title')}
          </h1>

          {/* Métadonnées */}
          <div className="flex flex-wrap items-center gap-6 text-gray-600 pb-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              {post.authorAvatar ? (
                <Image
                  src={post.authorAvatar}
                  alt={post.author}
                  width={48}
                  height={48}
                  className="rounded-full"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold text-lg">
                  {post.author?.[0] || 'M'}
                </div>
              )}
              <div>
                <p className="font-semibold text-gray-900">{post.author}</p>
                <p className="text-sm text-gray-500">{post[`authorBio_${language}`] || ''}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 ml-auto">
              <div className="flex items-center gap-1.5">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {new Date(post.publishedAt).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
              
              <div className="flex items-center gap-1.5">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {post.readingTime || 1} min
              </div>
              
              <div className="flex items-center gap-1.5">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {post.viewCount || 0}
              </div>
            </div>
          </div>
        </header>

        {/* Contenu de l'article */}
        <div className="prose prose-lg max-w-none mb-12">
          <div 
            className="text-gray-700 leading-relaxed whitespace-pre-line"
            dangerouslySetInnerHTML={{ __html: getText('content').replace(/\n/g, '<br/>') }}
          />
        </div>

        {/* Boutons de partage */}
        <div className="border-t border-b border-gray-200 py-8 mb-12">
          <p className="text-gray-600 font-medium mb-4">
            {language === 'fr' ? 'Partager cet article' : 'Share this article'}
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => shareOnSocial('facebook')}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Facebook
            </button>
            <button
              onClick={() => shareOnSocial('pinterest')}
              className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.350-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/>
              </svg>
              Pinterest
            </button>
            <button
              onClick={() => shareOnSocial('twitter')}
              className="flex items-center gap-2 px-6 py-3 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
              Twitter
            </button>
            <button
              onClick={() => shareOnSocial('linkedin')}
              className="flex items-center gap-2 px-6 py-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              LinkedIn
            </button>
          </div>
        </div>

        {/* Articles similaires */}
        {relatedPosts.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              {language === 'fr' ? 'Articles similaires' : 'Related articles'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map(related => (
                <Link 
                  key={related._id}
                  href={`/blog/${related.slug}`}
                  className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="relative h-48">
                    {related.image ? (
                      <Image
                        src={related.image}
                        alt={related.imageAlt_fr || related.imageAlt_en || (language === 'fr' ? related.title_fr : related.title_en)}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                        <span className="text-white text-5xl">🎨</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-2 mb-2">
                      {language === 'fr' ? related.title_fr : related.title_en}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {language === 'fr' ? related.excerpt_fr : related.excerpt_en}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  )
}

