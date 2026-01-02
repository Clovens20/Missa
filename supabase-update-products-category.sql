-- Script pour mettre à jour la catégorie des deux produits vers "objets-art"
-- Exécutez ce script dans le SQL Editor de Supabase

-- Mettre à jour "Duo de Cœurs Roses et Fleurs" vers objets-art
UPDATE products
SET category = 'objets-art',
    updated_at = NOW()
WHERE (name_fr ILIKE '%Duo%' AND name_fr ILIKE '%Cœurs%')
   OR (name_fr ILIKE '%Duo%' AND name_fr ILIKE '%Coeurs%')
   OR name_fr ILIKE '%Duo de Cœurs Roses%'
   OR name_fr ILIKE '%Duo de Coeurs Roses%';

-- Mettre à jour "Cœurs Entrelacés Fleurs Séchées" vers objets-art
UPDATE products
SET category = 'objets-art',
    updated_at = NOW()
WHERE name_fr ILIKE '%Cœurs Entrelacés%'
   OR name_fr ILIKE '%Coeurs Entrelaces%'
   OR name_fr ILIKE '%Entrelacés%'
   OR name_fr ILIKE '%Entrelaces%';

-- Alternative: Mettre à jour tous les produits actifs (si seulement 2 produits existent)
-- UPDATE products
-- SET category = 'objets-art',
--     updated_at = NOW()
-- WHERE is_active = true;

-- Vérifier les produits mis à jour
SELECT id, name_fr, name_en, category, is_active, updated_at
FROM products
WHERE category = 'objets-art'
ORDER BY updated_at DESC;

-- Vérifier tous les produits actifs
SELECT id, name_fr, name_en, category, is_active
FROM products
WHERE is_active = true
ORDER BY created_at DESC;

