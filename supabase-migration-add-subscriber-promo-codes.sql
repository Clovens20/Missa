-- Table pour stocker les codes promo générés pour les abonnés newsletter
CREATE TABLE IF NOT EXISTS subscriber_promo_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  subscriber_id UUID REFERENCES newsletter_subscribers(id) ON DELETE CASCADE,
  promo_code TEXT UNIQUE NOT NULL,
  type TEXT DEFAULT 'percent',
  value DECIMAL(10, 2) DEFAULT 10.00,
  is_active BOOLEAN DEFAULT TRUE,
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '90 days'),
  used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour accélérer la recherche
CREATE INDEX IF NOT EXISTS idx_subscriber_promo_codes_subscriber_id ON subscriber_promo_codes (subscriber_id);
CREATE INDEX IF NOT EXISTS idx_subscriber_promo_codes_code ON subscriber_promo_codes (promo_code);
CREATE INDEX IF NOT EXISTS idx_subscriber_promo_codes_active ON subscriber_promo_codes (is_active, expires_at);

-- RLS (Row Level Security) pour la table subscriber_promo_codes
ALTER TABLE subscriber_promo_codes ENABLE ROW LEVEL SECURITY;

-- Supprimer les politiques existantes si elles existent
DROP POLICY IF EXISTS "Enable insert for service role" ON subscriber_promo_codes;
DROP POLICY IF EXISTS "Enable read for service role" ON subscriber_promo_codes;

-- Policy pour permettre l'insertion via service role
CREATE POLICY "Enable insert for service role" ON subscriber_promo_codes
FOR INSERT 
WITH CHECK (true);

-- Policy pour permettre la lecture via service role (pour l'admin)
CREATE POLICY "Enable read for service role" ON subscriber_promo_codes
FOR SELECT 
USING (true);

