-- Script pour corriger l'image de l'article "Transformez Votre Maison avec la Décoration en Résine"
-- Exécutez ce script dans le SQL Editor de Supabase

-- 1. D'abord, vérifier quel est le slug exact de cet article
SELECT 
  id,
  slug,
  title_fr,
  category,
  image,
  CASE 
    WHEN image IS NULL OR image = '' THEN '❌ PAS D''IMAGE'
    ELSE '✅ IMAGE PRÉSENTE'
  END as status_image,
  updated_at
FROM blog_posts
WHERE title_fr LIKE '%Transformez Votre Maison%' 
   OR slug LIKE '%decoration%'
ORDER BY updated_at DESC;

-- 2. Mettre à jour l'image pour TOUS les articles de décoration qui n'ont pas d'image
UPDATE blog_posts
SET 
  image = 'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=1200&q=80',
  image_alt_fr = 'Plateau décoratif en résine époxy avec effet océan',
  image_alt_en = 'Decorative epoxy resin tray with ocean effect',
  image_credits = 'Photo par Spacejoy sur Unsplash',
  updated_at = NOW()
WHERE (slug = 'decoration-resine' 
    OR slug = 'decoration-maison-resine-epoxy'
    OR title_fr LIKE '%Transformez Votre Maison%')
  AND (image IS NULL OR image = '');

-- 3. Vérifier le résultat après la mise à jour
SELECT 
  slug,
  title_fr,
  image,
  image_alt_fr,
  image_credits,
  CASE 
    WHEN image IS NULL OR image = '' THEN '❌ PAS D''IMAGE'
    ELSE '✅ IMAGE PRÉSENTE'
  END as status_image
FROM blog_posts
WHERE slug LIKE '%decoration%' 
   OR title_fr LIKE '%Transformez Votre Maison%'
ORDER BY updated_at DESC;

-- 4. Si l'image Unsplash ne fonctionne toujours pas, utiliser cette alternative :
-- UPDATE blog_posts
-- SET 
--   image = 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&q=80',
--   image_alt_fr = 'Décoration intérieure moderne avec résine époxy',
--   image_alt_en = 'Modern interior decoration with epoxy resin',
--   image_credits = 'Photo par Unsplash',
--   updated_at = NOW()
-- WHERE slug = 'decoration-resine' OR title_fr LIKE '%Transformez Votre Maison%';

