-- Migration: Ajouter la table product_reviews pour les avis clients
-- Exécutez ce script dans votre SQL Editor de Supabase

CREATE TABLE IF NOT EXISTS product_reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  name TEXT NOT NULL,
  email TEXT,
  comment TEXT NOT NULL,
  is_approved BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_product_reviews_product_id ON product_reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_product_reviews_is_approved ON product_reviews(is_approved);
CREATE INDEX IF NOT EXISTS idx_product_reviews_created_at ON product_reviews(created_at DESC);

-- RLS (Row Level Security) - Permettre la lecture publique des avis approuvés
ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;

-- Policy: Tout le monde peut lire les avis approuvés
CREATE POLICY "Anyone can view approved reviews"
  ON product_reviews FOR SELECT
  USING (is_approved = true);

-- Policy: Tout le monde peut insérer des avis (seront approuvés automatiquement pour l'instant)
CREATE POLICY "Anyone can insert reviews"
  ON product_reviews FOR INSERT
  WITH CHECK (true);

-- Note: Les admins peuvent modifier/supprimer via le service role key (supabaseServer)

