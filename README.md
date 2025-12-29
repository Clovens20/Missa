# 🌸 Missa Créations - E-commerce de Créations en Résine

Site e-commerce professionnel COMPLET pour **Missa Créations**, une boutique de produits en résine personnalisés faits main.

## 🚀 Phase 2 TERMINÉE ! Nouvelles Fonctionnalités

### 🌍 Multilingue FR/EN Complet
- Système de traduction avec Context API
- Bouton changement de langue dans header  
- Toutes les pages traduites
- Préférence sauvegardée

### ❤️ Système de Favoris
- Ajout/retrait avec bouton cœur
- Page dédiée /favorites
- Badge compteur dans header
- Persistance localStorage

### 📝 Blog Complet
- Page /blog avec articles
- 3 articles demo (Tutoriels, Inspiration, Nouveautés)
- Filtres par catégorie
- Support multilingue

### 🎟️ Codes Promo
- Validation codes dans checkout
- 3 codes demo actifs: MISSA10 (10%), WELCOME (15%), SAVE20 (20$)
- Calcul automatique réduction

## ✨ Fonctionnalités Principales (Phase 1)

### 🛍️ Frontend Client
- **Page d'Accueil** : Hero section élégante avec produits vedettes
- **Catalogue Produits** : Grid responsive avec filtres par catégorie et recherche
- **Module de Personnalisation** : Ajout de texte et upload de 5 images max
- **Panier Intelligent** : Sidebar avec gestion quantités et calcul automatique
- **Checkout Complet** : Formulaire avec calcul de livraison selon pays
- **Page Confirmation** : Récapitulatif de commande avec numéro unique

### 🎨 Design
- **Couleurs** : Dégradés rose (#EC4899) et violet (#A855F7)
- **Style** : Moderne, féminin, épuré avec animations douces
- **Responsive** : Mobile-first, adapté à tous les écrans
- **UI/UX** : shadcn/ui + Tailwind CSS

### 📦 Système de Personnalisation
- Ajout de texte personnalisé (200 caractères max)
- Upload de 1 à 5 images (10MB max chacune)
- Supplément : 10$ par personnalisation
- Stockage complet avec chaque commande

### 🚚 Calcul de Livraison Dynamique
- **Canada** : 12$ + 3$/article supplémentaire
- **USA** : 15$ + 4$/article supplémentaire
- **France** : 18$ + 5$/article supplémentaire
- **République Dominicaine** : 20$ + 6$/article supplémentaire

### 👨‍💼 Interface Admin (`/admin`)
- **Dashboard** : Statistiques (commandes, revenus, produits)
- **Gestion Produits** : CRUD complet avec images
- **Gestion Commandes** : 
  - Vue détaillée avec infos client complètes
  - Affichage des personnalisations (texte + images téléchargeables)
  - Changement de statut
  - Notes internes
- **Gestion Employés** : Création avec codes auto (MISSA-001, MISSA-002...)
- **Login** : Email + mot de passe

### 👷 Interface Employé (`/sousadmin`)
- **Consultation Commandes** : Vue lecture seule étendue
- **Mise à Jour Statuts** : En attente → En cours → Expédiée
- **Vue Personnalisations** : Accès aux textes et images clients
- **Login** : Code employé unique

## 🛠️ Stack Technique

- **Framework** : Next.js 14 (App Router)
- **Styling** : Tailwind CSS + shadcn/ui
- **Base de données** : MongoDB
- **Authentification** : JWT (à implémenter)
- **Paiement** : Stripe (à intégrer)
- **Emails** : Resend (à intégrer)
- **Upload** : Cloudinary (à intégrer)

## 📋 Intégrations à Venir

- ✅ Supabase (migration depuis MongoDB)
- ✅ Stripe (paiements sécurisés)
- ✅ Resend (emails de confirmation)
- ✅ Cloudinary/AWS S3 (upload images)
- ⏳ Shippo/EasyPost (API transporteur)

## 🚀 Démarrage

```bash
# Installation
yarn install

# Développement
yarn dev

# Production
yarn build
yarn start
```

## 📝 Variables d'Environnement

```env
MONGO_URL=mongodb://localhost:27017
DB_NAME=missa_creations
NEXT_PUBLIC_BASE_URL=https://your-domain.com
```

## 📂 Structure du Projet

```
/app
├── app/
│   ├── page.js                 # Frontend principal
│   ├── layout.js               # Layout global
│   ├── admin/page.js           # Interface admin
│   ├── sousadmin/page.js       # Interface employé
│   └── api/
│       ├── products/route.js   # API produits
│       └── orders/route.js     # API commandes
├── components/ui/              # Composants shadcn
├── lib/                        # Utilitaires
└── public/                     # Assets statiques
```

## 🎯 Produits Demo

6 produits de démonstration inclus :
1. Collier Fleur Résine - 45$
2. Porte-clés Personnalisé - 25$
3. Plateau Déco Résine - 65$
4. Boucles d'oreilles Océan - 35$
5. Dessous de verre Set - 40$
6. Bracelet Personnalisé - 38$

## 🔐 Accès Demo

- **Admin** : admin@missa.com / admin123
- **Employé** : MISSA-001

## 🌐 Langues

- Français (par défaut)
- Anglais (structure prête, traductions à compléter)

## 📱 Pages

- `/` - Accueil
- `/products` - Catalogue
- `/checkout` - Paiement
- `/confirmation` - Confirmation
- `/admin` - Administration
- `/sousadmin` - Interface employé

## 🎨 Caractéristiques Design

- Coins arrondis (rounded-xl)
- Ombres douces (shadow-lg)
- Animations hover élégantes
- Dégradés rose-violet sur CTAs
- Icônes Lucide React
- Images haute qualité Unsplash

## 📊 Base de Données

**Collections MongoDB :**
- `products` : Catalogue produits
- `orders` : Commandes avec personnalisations
- `users` : Admins et employés

## 🔄 Roadmap Phase 2

- [ ] Blog complet
- [ ] Système de favoris
- [ ] Codes promo
- [ ] Avis clients
- [ ] Newsletter
- [ ] Multilingue FR/EN complet
- [ ] Intégration API transporteur

## 👤 Auteur

**Missa Créations** - Créations uniques en résine, faites main avec amour ✨

---

© 2024 Missa Créations. Tous droits réservés.
