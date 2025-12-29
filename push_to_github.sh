#!/bin/bash

# Script de Push automatique vers GitHub
# Repository: https://github.com/Clovens20/Missa.git

echo "🚀 Préparation du push vers GitHub..."
echo ""

cd /app

# Vérifier le statut Git
echo "📊 Statut Git actuel:"
git status
echo ""

# Vérifier le remote
echo "🔗 Remote configuré:"
git remote -v
echo ""

# Afficher les derniers commits
echo "📝 Derniers commits:"
git log --oneline -5
echo ""

# Afficher les fichiers à pusher
echo "📦 Fichiers dans le repository:"
git ls-files | wc -l
echo "fichiers au total"
echo ""

echo "⚠️  IMPORTANT: Le push nécessite une authentification GitHub"
echo ""
echo "🔑 Options pour push:"
echo ""
echo "1️⃣  AVEC TOKEN D'ACCÈS PERSONNEL:"
echo "   Créez un token sur: https://github.com/settings/tokens"
echo "   Puis exécutez:"
echo "   git push https://YOUR_TOKEN@github.com/Clovens20/Missa.git main --force"
echo ""
echo "2️⃣  AVEC GITHUB CLI (si installé):"
echo "   gh auth login"
echo "   git push origin main --force"
echo ""
echo "3️⃣  AVEC SSH (si configuré):"
echo "   git remote set-url origin git@github.com:Clovens20/Missa.git"
echo "   git push origin main --force"
echo ""
echo "✨ Le repository est prêt à être pushé!"
echo ""
echo "📂 Contenu à push:"
echo "   ✅ Application Next.js complète (Phase 1 + 2)"
echo "   ✅ Frontend avec multilingue FR/EN"
echo "   ✅ Système de favoris"
echo "   ✅ Blog complet avec 3 articles"
echo "   ✅ Codes promo fonctionnels"
echo "   ✅ Backend API (MongoDB)"
echo "   ✅ Interface Admin"
echo "   ✅ Interface Employé"
echo "   ✅ Module de personnalisation"
echo "   ✅ 6 produits demo"
echo "   ✅ Documentation complète"
echo ""
