# 🎨 Module de Personnalisation Missa Créations

## ✨ Fonctionnalités Complètes

### 🎯 Ce que le module permet :

1. **📤 Upload d'image**
   - Depuis ordinateur ou téléphone
   - Formats acceptés : JPG, PNG
   - Taille max : 10MB
   - Validation automatique

2. **✍️ Texte personnalisé**
   - Input avec compteur de caractères (50 max)
   - Texte par défaut : "Missa Créations"
   - Rendu en temps réel sur canvas

3. **🎨 Sélecteur de couleur**
   - Color picker visuel
   - Input hexadécimal
   - Couleur par défaut : Rose #EC4899

4. **📏 Contrôle de taille**
   - Slider interactif 20px - 120px
   - Affichage de la valeur en temps réel
   - Valeur par défaut : 48px

5. **📍 Position verticale**
   - Slider de 10% à 90%
   - Positionnement fluide
   - Valeur par défaut : 50% (centre)

6. **👁️ Aperçu temps réel**
   - Canvas HTML5
   - Redimensionnement automatique
   - Ombre portée pour lisibilité

7. **💾 Téléchargement**
   - Format PNG haute qualité
   - Nom auto : `missa-creation-[timestamp].png`
   - Sauvegarde locale instantanée

8. **🔄 Réinitialisation**
   - Bouton reset complet
   - Retour aux valeurs par défaut
   - Confirmation par toast

## 🎨 Design

### Couleurs & Style :
- **Dégradé principal** : Rose → Violet → Bleu doux
- **Background** : `from-pink-50 via-purple-50 to-blue-50`
- **Cards** : Fond blanc semi-transparent avec backdrop blur
- **Boutons** : Dégradé rose-violet-bleu
- **Ombres** : Douces et élégantes

### Layout :
- **2 colonnes** sur desktop
- **1 colonne** sur mobile (responsive)
- **Aperçu gauche** : Canvas avec image
- **Contrôles droite** : Tous les paramètres

### Composants utilisés :
- shadcn/ui : Button, Card, Input, Label, Slider
- Lucide React : Icons (Upload, Download, RotateCcw, Type, Palette, Move)
- Tailwind CSS : Styling complet

## 🔗 Intégration Supabase

### Configuration :
```javascript
// Variables d'environnement (.env)
NEXT_PUBLIC_SUPABASE_URL=https://btzlvlmfxetfclpvmskk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...

// Client Supabase (/lib/supabase.js)
import { createClient } from '@supabase/supabase-js'
export const supabase = createClient(url, key)
```

### Sauvegarde des créations :
- Upload automatique dans bucket `creations`
- Nom de fichier : `custom-[timestamp].png`
- Type MIME : `image/png`
- Cache : 1 heure

**Note** : Le bucket `creations` doit être créé dans Supabase Storage

## 📂 Fichiers créés

```
/app/
├── lib/
│   └── supabase.js                    # Client Supabase
├── app/
│   └── personnaliser/
│       └── page.js                    # Page de personnalisation complète
├── .env                               # Variables Supabase ajoutées
└── package.json                       # @supabase/supabase-js ajouté
```

## 🚀 URLs d'accès

### Navigation :
- **Menu desktop** : Lien "✨ Personnaliser"
- **Menu mobile** : Lien "✨ Personnaliser"
- **URL directe** : `/personnaliser`

### Page complète :
- https://handmade-resin-1.preview.emergentagent.com/personnaliser

## 🎓 Guide d'utilisation

### Pour le visiteur :

1. **Accéder à la page**
   - Cliquez sur "✨ Personnaliser" dans le menu
   - Ou allez directement sur `/personnaliser`

2. **Charger une image**
   - Cliquez sur la zone de drop
   - Ou glissez-déposez une image
   - L'image apparaît dans l'aperçu

3. **Personnaliser le texte**
   - Tapez votre texte (max 50 caractères)
   - Choisissez la couleur avec le color picker
   - Ajustez la taille avec le slider
   - Positionnez verticalement avec le slider

4. **Télécharger**
   - Cliquez sur "Télécharger"
   - L'image finale est sauvegardée

5. **Recommencer**
   - Cliquez sur le bouton ↻
   - Tout est réinitialisé

## 🛠️ Fonctionnalités techniques

### Canvas HTML5 :
```javascript
- Chargement image dynamique
- Redimensionnement automatique (max 800x600)
- Maintien ratio d'aspect
- Rendu texte avec :
  * Font personnalisée (Inter)
  * Couleur dynamique
  * Position centrée horizontalement
  * Position verticale ajustable
  * Ombre portée pour contraste
```

### Toast Notifications :
- ✅ Image chargée
- ✅ Image téléchargée
- 🔄 Réinitialisé
- ⚠️ Erreurs (fichier invalide, trop grand, etc.)

### Validation :
- Type de fichier (images uniquement)
- Taille max 10MB
- Longueur texte max 50 caractères

## 📱 Responsive

### Desktop (lg+) :
- 2 colonnes côte à côte
- Aperçu 50% | Contrôles 50%
- Canvas max 800x600px

### Tablet (md) :
- 2 colonnes adaptées
- Espacement réduit

### Mobile :
- 1 colonne
- Aperçu en haut
- Contrôles en dessous
- Touch-friendly

## 🎯 Cas d'usage

### Pour Missa Créations :
1. **Personnalisation bijoux**
   - Client upload photo de fleur
   - Ajoute prénom ou initiales
   - Télécharge pour validation

2. **Création événements**
   - Photo mariage/anniversaire
   - Texte personnalisé
   - Design final pour commande

3. **Cadeaux personnalisés**
   - Image significative
   - Message personnel
   - Création unique

## 🔮 Améliorations futures possibles

### Fonctionnalités :
- [ ] Choix de police (plusieurs fonts)
- [ ] Position horizontale du texte
- [ ] Rotation du texte
- [ ] Effets (outline, glow)
- [ ] Stickers/formes à ajouter
- [ ] Filtres d'image
- [ ] Historique des créations
- [ ] Partage social

### Supabase :
- [ ] Créer le bucket `creations` dans Storage
- [ ] Politique d'accès public pour les images
- [ ] Table pour sauvegarder métadonnées
- [ ] Galerie des créations publiques
- [ ] Authentification utilisateurs

## 🎨 Personnalisation du code

### Changer les couleurs :
```javascript
// Rose par défaut
setTextColor('#EC4899')

// Dégradés
className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500"

// Background
className="bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50"
```

### Changer les limites :
```javascript
// Taille texte
min={20} max={120} // Modifier ces valeurs

// Taille fichier
if (file.size > 10 * 1024 * 1024) // 10MB

// Longueur texte
maxLength={50} // 50 caractères
```

### Changer la police :
```javascript
ctx.font = `bold ${fontSize[0]}px "Inter", sans-serif`
// Remplacer "Inter" par votre police
```

## 📊 Performance

### Optimisations :
- ✅ Canvas redessine uniquement quand nécessaire (useEffect avec deps)
- ✅ Images redimensionnées automatiquement
- ✅ Validation côté client (pas de requêtes inutiles)
- ✅ Blob URL révoquée après téléchargement

### Chargement :
- Page légère (~50KB HTML)
- Canvas performant
- Pas de bibliothèque lourde

## 🔐 Sécurité

### Validation fichiers :
- Type MIME vérifié
- Taille limitée à 10MB
- Uniquement images acceptées

### Supabase :
- Clés publiques (anon key) seulement
- Politiques RLS à configurer
- Uploads sécurisés

## 💡 Conseils utilisateur

### Affichés dans l'UI :
1. 💡 Utilisez une image haute qualité
2. 💡 Choisissez une couleur contrastante
3. 💡 Ajustez la position pour éviter zones importantes

### Documentation supplémentaire :
- Formats recommandés : JPG pour photos, PNG pour transparence
- Résolution min : 800x600px
- Éclairage : Image bien éclairée pour meilleur rendu
- Composition : Laisser espace pour le texte

## 🎉 Résultat

### Module complet avec :
✅ Upload image (drag & drop)
✅ Texte personnalisé avec compteur
✅ Color picker + input hex
✅ Slider taille (20-120px)
✅ Slider position (10-90%)
✅ Aperçu temps réel sur Canvas
✅ Téléchargement PNG haute qualité
✅ Reset complet
✅ Design dégradé rose/violet/bleu
✅ 2 colonnes responsive
✅ Intégration Supabase
✅ Toast notifications
✅ Validation complète
✅ Mobile-friendly

---

🌸 **Module de personnalisation Missa Créations prêt à l'emploi !** ✨

Accessible via : `/personnaliser` ou menu "✨ Personnaliser"
