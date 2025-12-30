-- Migration: Ajouter la colonne is_active à la table employees
-- Exécutez ce script dans votre SQL Editor de Supabase si la colonne n'existe pas déjà

-- Ajouter la colonne is_active si elle n'existe pas
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'employees' 
    AND column_name = 'is_active'
  ) THEN
    ALTER TABLE employees ADD COLUMN is_active BOOLEAN DEFAULT true;
  END IF;
END $$;

-- Mettre à jour toutes les lignes existantes pour avoir is_active = true par défaut
UPDATE employees SET is_active = true WHERE is_active IS NULL;

