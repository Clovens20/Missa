-- Script pour vérifier TOUS les articles de blog (actifs et inactifs)
-- Exécutez ce script dans le SQL Editor de Supabase

-- 1. Voir TOUS les articles (actifs et inactifs)
SELECT 
  id,
  slug,
  title_fr,
  category,
  is_active,
  is_featured,
  published_at,
  created_at,
  updated_at,
  CASE 
    WHEN is_active = false THEN '❌ INACTIF'
    WHEN published_at > NOW() THEN '⏰ FUTUR'
    ELSE '✅ ACTIF'
  END as status
FROM blog_posts
ORDER BY created_at DESC, published_at DESC;

-- 2. Compter par statut
SELECT 
  COUNT(*) as total,
  COUNT(CASE WHEN is_active = true THEN 1 END) as actifs,
  COUNT(CASE WHEN is_active = false THEN 1 END) as inactifs,
  COUNT(CASE WHEN published_at > NOW() THEN 1 END) as futurs
FROM blog_posts;

-- 3. Voir les articles récemment créés (dernières 24h)
SELECT 
  id,
  slug,
  title_fr,
  category,
  is_active,
  published_at,
  created_at
FROM blog_posts
WHERE created_at >= NOW() - INTERVAL '24 hours'
ORDER BY created_at DESC;

-- 4. Voir les articles avec dates de publication futures
SELECT 
  id,
  slug,
  title_fr,
  category,
  is_active,
  published_at,
  created_at
FROM blog_posts
WHERE published_at > NOW()
ORDER BY published_at ASC;

-- 5. Voir les articles inactifs
SELECT 
  id,
  slug,
  title_fr,
  category,
  is_active,
  published_at,
  created_at
FROM blog_posts
WHERE is_active = false
ORDER BY created_at DESC;

