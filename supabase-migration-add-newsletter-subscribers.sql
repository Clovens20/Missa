-- Table pour les abonnés à la newsletter
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  language TEXT DEFAULT 'fr',
  is_active BOOLEAN DEFAULT TRUE,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  unsubscribed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour accélérer la recherche par email
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_email ON newsletter_subscribers (email);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_active ON newsletter_subscribers (is_active);

-- RLS (Row Level Security) pour la table newsletter_subscribers
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Supprimer les politiques existantes si elles existent
DROP POLICY IF EXISTS "Enable insert for all users" ON newsletter_subscribers;
DROP POLICY IF EXISTS "Enable read for service role" ON newsletter_subscribers;

-- Policy pour permettre à tout le monde de s'abonner (INSERT)
-- Cette politique permet l'insertion depuis n'importe quel client (y compris service role)
CREATE POLICY "Enable insert for all users" ON newsletter_subscribers
FOR INSERT 
WITH CHECK (true);

-- Policy pour permettre la lecture via service role (pour l'admin)
-- Cette politique permet la lecture uniquement via le service role key
CREATE POLICY "Enable read for service role" ON newsletter_subscribers
FOR SELECT 
USING (true);

