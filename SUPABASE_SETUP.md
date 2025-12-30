# Configuration Supabase pour Missa Créations

## 📋 Prérequis

1. Créer un projet sur [Supabase](https://supabase.com)
2. Récupérer vos clés d'API :
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (optionnel, pour les opérations serveur)

## 🗄️ Configuration de la Base de Données

1. Ouvrez le **SQL Editor** dans votre dashboard Supabase
2. Exécutez le script `supabase-schema.sql` pour créer toutes les tables nécessaires :
   - `products`
   - `orders`
   - `blog_posts`
   - `promo_codes`
   - `employees`

## 🔐 Variables d'Environnement

Créez un fichier `.env.local` à la racine du projet :

```env
NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_anon_key
SUPABASE_SERVICE_ROLE_KEY=votre_service_role_key
```

**Note** : Si vous n'avez pas de `SUPABASE_SERVICE_ROLE_KEY`, l'application utilisera l'anon key comme fallback.

## 📊 Structure des Tables

### Products
- `id` (UUID) - Identifiant unique
- `name_fr`, `name_en` - Noms en français et anglais
- `description_fr`, `description_en` - Descriptions
- `category` - Catégorie du produit
- `price` - Prix
- `promo_price` - Prix promotionnel (optionnel)
- `stock`, `min_stock` - Gestion du stock
- `is_customizable` - Peut être personnalisé
- `is_active` - Produit actif
- `images` - Tableau d'URLs d'images

### Orders
- `id` (UUID) - Identifiant unique
- `order_number` - Numéro de commande (ex: MISSA-12345678)
- `customer` (JSONB) - Informations client
- `items` (JSONB) - Articles commandés
- `shipping_cost` - Coût de livraison
- `discount` - Réduction appliquée
- `promo_code` - Code promo utilisé
- `total_amount` - Montant total
- `status` - Statut (pending, processing, shipped, delivered)
- `notes` - Notes internes

### Blog Posts
- `id` (UUID) - Identifiant unique
- `slug` - URL-friendly identifier
- `title_fr`, `title_en` - Titres
- `excerpt_fr`, `excerpt_en` - Extraits
- `content_fr`, `content_en` - Contenu complet
- `category` - Catégorie (tutorials, inspiration, news)
- `image` - URL de l'image
- `published_at` - Date de publication
- `is_active` - Article actif

### Promo Codes
- `id` (UUID) - Identifiant unique
- `code` - Code promo (ex: MISSA10)
- `type` - Type (percent ou fixed)
- `value` - Valeur (pourcentage ou montant fixe)
- `is_active` - Code actif
- `expires_at` - Date d'expiration

### Employees
- `id` (UUID) - Identifiant unique
- `code` - Code employé (ex: MISSA-123456)
- `name` - Nom complet
- `email` - Email
- `password` - Mot de passe (à hasher en production)

## 🚀 Gestion des Données

Les données (produits, articles de blog, codes promo) doivent être créées via l'interface admin ou directement dans Supabase.

## 🔒 Sécurité (Optionnel)

Pour activer Row Level Security (RLS) :

1. Décommentez les lignes RLS dans `supabase-schema.sql`
2. Créez des policies selon vos besoins
3. Exemple de policy pour les produits publics :

```sql
CREATE POLICY "Public products are viewable by everyone" 
ON products FOR SELECT 
USING (is_active = true);
```

## 📝 Notes Importantes

- Les IDs Supabase sont des UUIDs, pas des ObjectIds MongoDB
- Les routes API convertissent automatiquement entre `id` (Supabase) et `_id` (compatibilité frontend)
- Les noms de colonnes utilisent `snake_case` dans Supabase mais sont convertis en `camelCase` pour le frontend
- Les champs JSONB (`customer`, `items`) stockent des objets JavaScript complets

## 🐛 Dépannage

### Erreur "Missing Supabase environment variables"
- Vérifiez que votre fichier `.env.local` contient les bonnes variables
- Redémarrez le serveur de développement après modification du `.env.local`

### Erreur "relation does not exist"
- Exécutez le script `supabase-schema.sql` dans le SQL Editor de Supabase

### Erreur "permission denied"
- Vérifiez vos policies RLS si vous les avez activées
- Utilisez la `SUPABASE_SERVICE_ROLE_KEY` pour les opérations serveur

