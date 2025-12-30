# 🚀 Guide de Développement - Missa Créations

## Prérequis

- Node.js 18+ installé
- npm installé (gestionnaire de paquets utilisé)
- Compte Supabase configuré

## Installation

```bash
# Installer les dépendances
npm install
```

## Configuration

1. Créez un fichier `.env.local` à la racine du projet :

```env
NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_anon_key
SUPABASE_SERVICE_ROLE_KEY=votre_service_role_key
```

2. Configurez votre base de données Supabase :
   - Exécutez le script `supabase-schema.sql` dans le SQL Editor de Supabase
   - Voir `SUPABASE_SETUP.md` pour plus de détails

## Démarrage du serveur de développement

```bash
# Démarrer le serveur de développement
npm run dev
```

Le serveur sera accessible sur : `http://localhost:3000`

Le serveur sera accessible sur : `http://localhost:3000`

## Scripts disponibles

```bash
# Développement
npm run dev           # Démarre le serveur de développement

# Production
npm run build         # Construit l'application pour la production
npm start             # Démarre le serveur de production
```

## Structure du projet

```
/app
├── app/
│   ├── page.js              # Page d'accueil principale
│   ├── layout.js            # Layout global
│   ├── admin/               # Interface admin
│   ├── sousadmin/           # Interface employé
│   ├── faq/                 # Page FAQ
│   ├── livraison/           # Page Livraison
│   ├── retours/             # Page Retours
│   ├── garantie/            # Page Garantie
│   ├── personnaliser/       # Module de personnalisation
│   └── api/                 # Routes API (Supabase)
├── components/ui/           # Composants shadcn/ui
├── contexts/                # Contextes React (Language)
├── lib/                     # Utilitaires (Supabase)
└── hooks/                   # Hooks personnalisés
```

## Dépannage

### Erreur "Missing Supabase environment variables"
- Vérifiez que votre fichier `.env.local` contient toutes les variables nécessaires
- Redémarrez le serveur après modification du `.env.local`

### Erreur "Cannot find module"
- Exécutez `npm install` pour réinstaller les dépendances

### Le serveur ne démarre pas
- Vérifiez que le port 3000 n'est pas déjà utilisé
- Essayez de changer le port dans `package.json` si nécessaire

### Problèmes avec Supabase
- Vérifiez que les tables sont créées (voir `supabase-schema.sql`)
- Vérifiez que vos clés API sont correctes dans `.env.local`

## Technologies utilisées

- **Next.js 14** (App Router)
- **React 18**
- **Tailwind CSS**
- **shadcn/ui**
- **Supabase** (Base de données)
- **Lucide React** (Icônes)

## Support

Pour toute question, consultez :
- `README.md` - Documentation principale
- `SUPABASE_SETUP.md` - Configuration Supabase
- `supabase-schema.sql` - Schéma de base de données

