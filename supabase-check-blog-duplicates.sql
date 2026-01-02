-- Script pour vérifier et nettoyer les doublons dans blog_posts
-- Exécutez ce script dans le SQL Editor de Supabase

-- 1. Vérifier les doublons par slug
SELECT 
  slug,
  COUNT(*) as count,
  array_agg(id::text) as ids,
  array_agg(title_fr) as titles
FROM blog_posts
GROUP BY slug
HAVING COUNT(*) > 1
ORDER BY count DESC;

-- 2. Vérifier les articles actifs
SELECT 
  COUNT(*) as total_articles,
  COUNT(CASE WHEN is_active = true THEN 1 END) as active_articles,
  COUNT(CASE WHEN is_active = false THEN 1 END) as inactive_articles
FROM blog_posts;

-- 3. Voir tous les articles avec leurs dates
SELECT 
  id,
  slug,
  title_fr,
  category,
  is_active,
  published_at,
  created_at,
  updated_at
FROM blog_posts
ORDER BY published_at DESC, created_at DESC;

-- 4. Supprimer les doublons (GARDE LE PLUS RÉCENT)
-- ATTENTION: Exécutez d'abord les requêtes ci-dessus pour voir les doublons
-- Décommentez seulement si vous voulez supprimer les doublons

/*
WITH duplicates AS (
  SELECT 
    id,
    slug,
    ROW_NUMBER() OVER (PARTITION BY slug ORDER BY published_at DESC, created_at DESC) as rn
  FROM blog_posts
)
DELETE FROM blog_posts
WHERE id IN (
  SELECT id FROM duplicates WHERE rn > 1
);
*/

-- 5. Vérifier les articles récents (derniers 30 jours)
SELECT 
  id,
  slug,
  title_fr,
  category,
  is_active,
  published_at
FROM blog_posts
WHERE published_at >= NOW() - INTERVAL '30 days'
ORDER BY published_at DESC;

