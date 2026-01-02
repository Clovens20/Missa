-- Script pour mettre à jour l'image de l'article "Transformez Votre Maison avec la Décoration en Résine"
-- Exécutez ce script dans le SQL Editor de Supabase

-- Mettre à jour l'image pour l'article (essayer les deux slugs possibles)
UPDATE blog_posts
SET 
  image = 'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=1200&q=80',
  image_alt_fr = 'Plateau décoratif en résine époxy avec effet océan',
  image_alt_en = 'Decorative epoxy resin tray with ocean effect',
  image_credits = 'Photo par Spacejoy sur Unsplash',
  updated_at = NOW()
WHERE slug = 'decoration-maison-resine-epoxy' OR slug = 'decoration-resine' OR title_fr LIKE '%Transformez Votre Maison%';

-- Alternative avec une autre image si la première ne fonctionne pas
-- UPDATE blog_posts
-- SET 
--   image = 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&q=80',
--   image_alt_fr = 'Décoration intérieure moderne avec résine époxy',
--   image_alt_en = 'Modern interior decoration with epoxy resin',
--   image_credits = 'Photo par Unsplash',
--   updated_at = NOW()
-- WHERE slug = 'decoration-resine' OR title_fr LIKE '%Transformez Votre Maison%';

-- Alternative : Si l'image Unsplash ne fonctionne pas, utiliser une autre image
-- UPDATE blog_posts
-- SET 
--   image = 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&q=80',
--   image_alt_fr = 'Décoration intérieure moderne avec résine époxy',
--   image_alt_en = 'Modern interior decoration with epoxy resin',
--   image_credits = 'Photo par Unsplash',
--   updated_at = NOW()
-- WHERE slug = 'decoration-maison-resine-epoxy';

-- Vérifier que la mise à jour a fonctionné
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
WHERE slug IN ('decoration-maison-resine-epoxy', 'decoration-resine') 
   OR title_fr LIKE '%Transformez Votre Maison%'
ORDER BY updated_at DESC;

-- Voir tous les articles sans image
SELECT 
  slug,
  title_fr,
  category,
  CASE 
    WHEN image IS NULL OR image = '' THEN '❌ PAS D''IMAGE'
    ELSE '✅ IMAGE PRÉSENTE'
  END as status_image
FROM blog_posts
WHERE image IS NULL OR image = ''
ORDER BY created_at DESC;

