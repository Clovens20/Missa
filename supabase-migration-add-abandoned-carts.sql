-- Table pour les emails des clients qui commencent une commande (même si abandonnée)
CREATE TABLE IF NOT EXISTS abandoned_carts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT,
  language TEXT DEFAULT 'fr',
  cart_items JSONB,
  total_amount DECIMAL(10, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour accélérer la recherche par email
CREATE INDEX IF NOT EXISTS idx_abandoned_carts_email ON abandoned_carts (email);
CREATE INDEX IF NOT EXISTS idx_abandoned_carts_created_at ON abandoned_carts (created_at DESC);

-- RLS (Row Level Security) pour la table abandoned_carts
ALTER TABLE abandoned_carts ENABLE ROW LEVEL SECURITY;

-- Supprimer les politiques existantes si elles existent
DROP POLICY IF EXISTS "Enable insert for all users" ON abandoned_carts;
DROP POLICY IF EXISTS "Enable read for service role" ON abandoned_carts;

-- Policy pour permettre à tout le monde de créer un panier abandonné (INSERT)
CREATE POLICY "Enable insert for all users" ON abandoned_carts
FOR INSERT 
WITH CHECK (true);

-- Policy pour permettre la lecture via service role (pour l'admin)
CREATE POLICY "Enable read for service role" ON abandoned_carts
FOR SELECT 
USING (true);

