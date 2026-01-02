-- Migration pour améliorer la table blog_posts
-- Exécutez ce script dans le SQL Editor de Supabase

-- Ajouter les colonnes manquantes si elles n'existent pas
DO $$ 
BEGIN
  -- Colonne pour le compteur de vues
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='blog_posts' AND column_name='view_count') THEN
    ALTER TABLE blog_posts ADD COLUMN view_count INTEGER DEFAULT 0;
  END IF;

  -- Colonne pour le temps de lecture
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='blog_posts' AND column_name='reading_time') THEN
    ALTER TABLE blog_posts ADD COLUMN reading_time INTEGER DEFAULT 1;
  END IF;

  -- Colonne pour articles en vedette
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='blog_posts' AND column_name='is_featured') THEN
    ALTER TABLE blog_posts ADD COLUMN is_featured BOOLEAN DEFAULT false;
  END IF;

  -- Colonnes pour les images
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='blog_posts' AND column_name='image_alt_fr') THEN
    ALTER TABLE blog_posts ADD COLUMN image_alt_fr TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='blog_posts' AND column_name='image_alt_en') THEN
    ALTER TABLE blog_posts ADD COLUMN image_alt_en TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='blog_posts' AND column_name='image_credits') THEN
    ALTER TABLE blog_posts ADD COLUMN image_credits TEXT;
  END IF;

  -- Colonnes pour l'auteur
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='blog_posts' AND column_name='author_avatar') THEN
    ALTER TABLE blog_posts ADD COLUMN author_avatar TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='blog_posts' AND column_name='author_bio_fr') THEN
    ALTER TABLE blog_posts ADD COLUMN author_bio_fr TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='blog_posts' AND column_name='author_bio_en') THEN
    ALTER TABLE blog_posts ADD COLUMN author_bio_en TEXT;
  END IF;

  -- Colonnes SEO
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='blog_posts' AND column_name='meta_description_fr') THEN
    ALTER TABLE blog_posts ADD COLUMN meta_description_fr TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='blog_posts' AND column_name='meta_description_en') THEN
    ALTER TABLE blog_posts ADD COLUMN meta_description_en TEXT;
  END IF;
END $$;

-- Créer une fonction pour incrémenter les vues
CREATE OR REPLACE FUNCTION increment_post_views(post_slug TEXT)
RETURNS INTEGER AS $$
DECLARE
  new_count INTEGER;
BEGIN
  UPDATE blog_posts 
  SET view_count = COALESCE(view_count, 0) + 1
  WHERE slug = post_slug
  RETURNING view_count INTO new_count;
  
  RETURN COALESCE(new_count, 0);
END;
$$ LANGUAGE plpgsql;

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_is_featured ON blog_posts(is_featured);
CREATE INDEX IF NOT EXISTS idx_blog_posts_view_count ON blog_posts(view_count DESC);

