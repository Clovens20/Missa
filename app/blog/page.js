'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useLanguage } from '@/contexts/LanguageContext'

export default function ResinBlogGrid() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const { language } = useLanguage()
  
  const categories = [
    { id: 'all', label_fr: 'Tous', label_en: 'All' },
    { id: 'bijoux-resine', label_fr: 'Bijoux', label_en: 'Jewelry' },
    { id: 'decoration-resine', label_fr: 'Décoration', label_en: 'Decoration' },
    { id: 'art-resine', label_fr: 'Art', label_en: 'Art' },
    { id: 'meubles-resine', label_fr: 'Meubles', label_en: 'Furniture' },
    { id: 'accessoires-resine', label_fr: 'Accessoires', label_en: 'Accessories' },
    { id: 'tutoriels-resine', label_fr: 'Tutoriels', label_en: 'Tutorials' },
    { id: 'inspiration-resine', label_fr: 'Inspiration', label_en: 'Inspiration' },
    // Catégories existantes dans la DB (compatibilité)
    { id: 'news', label_fr: 'Nouveautés', label_en: 'News' },
    { id: 'tutorials', label_fr: 'Tutoriels', label_en: 'Tutorials' },
    { id: 'inspiration', label_fr: 'Inspiration', label_en: 'Inspiration' }
  ]
  
  // Fonction pour mapper les catégories de la DB vers les labels
  const getCategoryLabel = (categoryId) => {
    const cat = categories.find(c => c.id === categoryId)
    if (cat) return language === 'fr' ? cat.label_fr : cat.label_en
    
    // Fallback pour les catégories non listées
    const fallbackMap = {
      'news': language === 'fr' ? 'Nouveautés' : 'News',
      'tutorials': language === 'fr' ? 'Tutoriels' : 'Tutorials',
      'tutoriels': language === 'fr' ? 'Tutoriels' : 'Tutorials',
      'inspiration': language === 'fr' ? 'Inspiration' : 'Inspiration'
    }
    return fallbackMap[categoryId] || categoryId
  }

  useEffect(() => {
    fetchPosts()
  }, [selectedCategory])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const url = selectedCategory === 'all' 
        ? '/api/blog'
        : `/api/blog?category=${selectedCategory}`
      
      // Ajouter un timestamp pour éviter le cache
      const cacheBuster = `?t=${Date.now()}`
      const finalUrl = url.includes('?') ? `${url}&t=${Date.now()}` : `${url}?t=${Date.now()}`
      
      const res = await fetch(finalUrl, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache'
        }
      })
      const data = await res.json()
      
      if (data.success) {
        console.log(`✅ Blog page: ${data.posts?.length || 0} articles chargés`)
        if (data.posts && data.posts.length > 0) {
          console.log('📋 Articles affichés:', data.posts.map(p => `${p.title_fr} (${p.slug})`))
        }
        setPosts(data.posts || [])
      } else {
        console.error('❌ Erreur API blog:', data.error)
        setPosts([])
      }
    } catch (error) {
      console.error('Erreur chargement articles:', error)
    } finally {
      setLoading(false)
    }
  }

  const getText = (post, field) => {
    return language === 'fr' ? post[`${field}_fr`] : post[`${field}_en`]
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-purple-600 to-pink-600 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4">
            {language === 'fr' ? 'Blog Créations Résine' : 'Resin Creations Blog'}
          </h1>
          <p className="text-xl opacity-90">
            {language === 'fr' 
              ? 'Découvrez nos créations uniques et nos tutoriels'
              : 'Discover our unique creations and tutorials'}
          </p>
        </div>
      </div>

      {/* Filtres par catégorie */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-wrap gap-3 justify-center items-center">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-6 py-2.5 rounded-full font-medium transition-all duration-300 ${
                  selectedCategory === cat.id
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg transform scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {language === 'fr' ? cat.label_fr : cat.label_en}
              </button>
            ))}
            <button
              onClick={() => fetchPosts()}
              disabled={loading}
              className="ml-4 px-4 py-2.5 rounded-full font-medium transition-all duration-300 bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              title={language === 'fr' ? 'Actualiser les articles' : 'Refresh articles'}
            >
              <svg 
                className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {language === 'fr' ? 'Actualiser' : 'Refresh'}
            </button>
          </div>
        </div>
      </div>

      {/* Grille d'articles */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 h-64 rounded-2xl mb-4"></div>
                <div className="bg-gray-200 h-6 rounded w-3/4 mb-3"></div>
                <div className="bg-gray-200 h-4 rounded w-full mb-2"></div>
                <div className="bg-gray-200 h-4 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🎨</div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">
              {language === 'fr' ? 'Aucun article trouvé' : 'No articles found'}
            </h3>
            <p className="text-gray-500">
              {language === 'fr' 
                ? 'Essayez une autre catégorie'
                : 'Try another category'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map(post => (
              <article 
                key={post._id}
                className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
              >
                {/* Image avec badge Featured */}
                <div className="relative h-64 overflow-hidden">
                  {post.image ? (
                    <Image
                      src={post.image}
                      alt={post.imageAlt_fr || post.imageAlt_en || getText(post, 'title')}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                      <span className="text-white text-6xl">🎨</span>
                    </div>
                  )}
                  
                  {post.isFeatured && (
                    <div className="absolute top-4 left-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-lg">
                      ⭐ {language === 'fr' ? 'En vedette' : 'Featured'}
                    </div>
                  )}
                  
                  {/* Catégorie badge */}
                  <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-semibold text-purple-600">
                    {getCategoryLabel(post.category)}
                  </div>
                </div>

                {/* Contenu */}
                <div className="p-6">
                  {/* Métadonnées */}
                  <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {post.readingTime || 1} min
                    </div>
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      {post.viewCount || 0}
                    </div>
                  </div>

                  {/* Titre */}
                  <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-purple-600 transition-colors">
                    {getText(post, 'title')}
                  </h2>

                  {/* Extrait */}
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {getText(post, 'excerpt')}
                  </p>

                  {/* Auteur et CTA */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-3">
                      {post.authorAvatar ? (
                        <Image
                          src={post.authorAvatar}
                          alt={post.author}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold">
                          {post.author?.[0] || 'M'}
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{post.author}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(post.publishedAt).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    <Link 
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                    >
                      {language === 'fr' ? 'Lire' : 'Read'}
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

