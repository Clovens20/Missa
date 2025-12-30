-- Script de correction des politiques RLS pour newsletter_subscribers
-- À exécuter dans le SQL Editor de Supabase

-- Supprimer toutes les politiques existantes
DROP POLICY IF EXISTS "Enable insert for all users" ON newsletter_subscribers;
DROP POLICY IF EXISTS "Enable read for service role" ON newsletter_subscribers;
DROP POLICY IF EXISTS "Enable read for all users" ON newsletter_subscribers;

-- Désactiver temporairement RLS pour permettre la création des nouvelles politiques
ALTER TABLE newsletter_subscribers DISABLE ROW LEVEL SECURITY;

-- Réactiver RLS
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Créer une politique qui permet l'insertion à tous (y compris service role)
CREATE POLICY "Enable insert for all users" ON newsletter_subscribers
FOR INSERT 
WITH CHECK (true);

-- Créer une politique qui permet la lecture à tous (nécessaire pour le service role aussi)
CREATE POLICY "Enable read for all users" ON newsletter_subscribers
FOR SELECT 
USING (true);

-- Créer une politique qui permet la mise à jour (pour réactiver les abonnements)
CREATE POLICY "Enable update for all users" ON newsletter_subscribers
FOR UPDATE 
USING (true)
WITH CHECK (true);

-- Faire de même pour abandoned_carts
DROP POLICY IF EXISTS "Enable insert for all users" ON abandoned_carts;
DROP POLICY IF EXISTS "Enable read for service role" ON abandoned_carts;
DROP POLICY IF EXISTS "Enable read for all users" ON abandoned_carts;

ALTER TABLE abandoned_carts DISABLE ROW LEVEL SECURITY;
ALTER TABLE abandoned_carts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable insert for all users" ON abandoned_carts
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Enable read for all users" ON abandoned_carts
FOR SELECT 
USING (true);

CREATE POLICY "Enable update for all users" ON abandoned_carts
FOR UPDATE 
USING (true)
WITH CHECK (true);

-- Faire de même pour subscriber_promo_codes (si la table existe)
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'subscriber_promo_codes') THEN
    DROP POLICY IF EXISTS "Enable insert for service role" ON subscriber_promo_codes;
    DROP POLICY IF EXISTS "Enable read for service role" ON subscriber_promo_codes;
    DROP POLICY IF EXISTS "Enable insert for all users" ON subscriber_promo_codes;
    DROP POLICY IF EXISTS "Enable read for all users" ON subscriber_promo_codes;
    
    ALTER TABLE subscriber_promo_codes DISABLE ROW LEVEL SECURITY;
    ALTER TABLE subscriber_promo_codes ENABLE ROW LEVEL SECURITY;
    
    CREATE POLICY "Enable insert for all users" ON subscriber_promo_codes
    FOR INSERT 
    WITH CHECK (true);
    
    CREATE POLICY "Enable read for all users" ON subscriber_promo_codes
    FOR SELECT 
    USING (true);
  END IF;
END $$;

