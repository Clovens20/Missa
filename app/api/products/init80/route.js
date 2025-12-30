import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'

// Mapping des catégories vers les catégories de la base de données
const categoryMapping = {
  "Bijoux": "bijoux-accessoires",
  "Décoration": "decoration-maison",
  "Accessoires": "accessoires-quotidiens",
  "Souvenirs": "objets-art" // Ou créer une nouvelle catégorie, pour l'instant on utilise objets-art
}

// Fonction pour mapper les produits fournis au format de la base de données
function mapProductToDBFormat(product) {
  return {
    name_fr: product.name,
    name_en: product.name, // Pour l'instant on utilise le même nom, vous pouvez traduire plus tard
    description_fr: product.longDesc || product.shortDesc,
    description_en: product.longDesc || product.shortDesc, // Vous pouvez traduire plus tard
    category: categoryMapping[product.category] || "bijoux-accessoires",
    price: product.price,
    promo_price: null,
    weight: estimateWeight(product.category, product.subcategory),
    stock: 10, // Stock initial pour les tests
    min_stock: 3,
    is_customizable: product.customizable || false,
    is_active: true, // Activé par défaut
    images: product.image ? [product.image] : ["https://images.unsplash.com/photo-1612672358776-15458bfd9869?w=800&q=80"]
  }
}

// Estimation du poids selon la catégorie
function estimateWeight(category, subcategory) {
  if (category === "Bijoux") {
    if (subcategory === "Boucles d'oreilles") return 5
    if (subcategory === "Colliers") return 10
    if (subcategory === "Bracelets") return 12
    if (subcategory === "Bagues") return 8
    return 10
  }
  if (category === "Décoration") {
    if (subcategory === "Sous-verres") return 200
    if (subcategory === "Plateaux") return 800
    if (subcategory === "Horloges") return 600
    if (subcategory === "Tableaux") return 2000
    return 500
  }
  if (category === "Accessoires") {
    if (subcategory === "Porte-clés") return 20
    if (subcategory === "Marques-pages") return 30
    if (subcategory === "Supports") return 180
    return 100
  }
  if (category === "Souvenirs") {
    if (subcategory === "Cœurs souvenir") return 50
    if (subcategory === "Encapsulations") return 200
    if (subcategory === "Cubes") return 300
    return 150
  }
  return 100
}

// Les 80 produits complets
const ALL_PRODUCTS = [
  // ==================== BIJOUX (20 produits) ====================
  // Boucles d'oreilles (4)
  {
    id: 1,
    name: "Boucles d'oreilles fleurs séchées",
    category: "Bijoux",
    subcategory: "Boucles d'oreilles",
    price: 35,
    shortDesc: "Boucles d'oreilles élégantes en résine transparente avec véritables fleurs séchées encapsulées",
    longDesc: "Ces boucles d'oreilles en résine sont entièrement fabriquées à la main. Chaque paire contient de véritables fleurs séchées, sélectionnées pour leur couleur et finesse. Légères, durables et uniques, elles ajoutent une touche naturelle et délicate à votre style. Idéales pour un cadeau, un événement spécial ou un look quotidien raffiné.",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500&h=500&fit=crop",
    customizable: true,
    bestseller: true,
    collection: "Floral"
  },
  {
    id: 2,
    name: "Boucles d'oreilles géométriques",
    category: "Bijoux",
    subcategory: "Boucles d'oreilles",
    price: 32,
    shortDesc: "Design géométrique épuré avec formes triangulaires et carrées en résine colorée",
    longDesc: "Boucles d'oreilles au design contemporain avec formes géométriques précises. Légères et confortables, parfaites pour un look moderne et sophistiqué. Disponibles en plusieurs coloris.",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500&h=500&fit=crop",
    customizable: true,
    bestseller: false,
    collection: "Minimaliste"
  },
  {
    id: 3,
    name: "Boucles d'oreilles paillettes dorées",
    category: "Bijoux",
    subcategory: "Boucles d'oreilles",
    price: 30,
    shortDesc: "Éclatantes boucles d'oreilles avec paillettes dorées et argentées incrustées",
    longDesc: "Ajoutez de l'éclat à votre tenue avec ces boucles d'oreilles scintillantes. Paillettes fines encapsulées dans une résine cristalline pour un effet glamour garanti.",
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500&h=500&fit=crop",
    customizable: true,
    bestseller: true,
    collection: "Luxe"
  },
  {
    id: 4,
    name: "Boucles d'oreilles océan",
    category: "Bijoux",
    subcategory: "Boucles d'oreilles",
    price: 38,
    shortDesc: "Inspirées des vagues marines avec nuances de bleu et touches de blanc nacré",
    longDesc: "Plongez dans l'univers marin avec ces boucles d'oreilles aux teintes océaniques. Effet vagues créé avec plusieurs couches de résine pour un rendu unique.",
    image: "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=500&h=500&fit=crop",
    customizable: true,
    bestseller: true,
    collection: "Océan"
  },
  // Colliers (4)
  {
    id: 5,
    name: "Collier pendentif fleur",
    category: "Bijoux",
    subcategory: "Colliers",
    price: 45,
    shortDesc: "Pendentif rond avec fleur séchée naturelle préservée dans résine transparente",
    longDesc: "Ce collier délicat met en valeur une véritable fleur séchée dans un pendentif en résine. Chaîne ajustable en acier inoxydable. Un bijou poétique et intemporel.",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&h=500&fit=crop",
    customizable: true,
    bestseller: true,
    collection: "Floral"
  },
  {
    id: 6,
    name: "Collier initiale personnalisé",
    category: "Bijoux",
    subcategory: "Colliers",
    price: 42,
    shortDesc: "Pendentif personnalisable avec votre initiale dorée ou argentée incrustée",
    longDesc: "Portez votre initiale avec élégance. Ce pendentif sur mesure combine résine colorée et lettre métallique. Un cadeau personnalisé parfait pour toutes occasions.",
    image: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=500&h=500&fit=crop",
    customizable: true,
    bestseller: true,
    collection: "Romance"
  },
  {
    id: 7,
    name: "Collier cœur transparent",
    category: "Bijoux",
    subcategory: "Colliers",
    price: 40,
    shortDesc: "Pendentif en forme de cœur en résine cristalline avec inclusions délicates",
    longDesc: "Un symbole d'amour en résine pure. Ce pendentif cœur peut contenir des paillettes, fleurs ou rester épuré. Cadeau idéal pour la Saint-Valentin.",
    image: "https://images.unsplash.com/photo-1522367151960-c76a5b0e93b6?w=500&h=500&fit=crop",
    customizable: true,
    bestseller: false,
    collection: "Romance"
  },
  {
    id: 8,
    name: "Collier galaxie cosmique",
    category: "Bijoux",
    subcategory: "Colliers",
    price: 48,
    shortDesc: "Univers miniature avec effet galaxie, étoiles scintillantes et nébuleuses",
    longDesc: "Portez l'univers entier autour du cou. Ce collier capture la beauté du cosmos avec pigments iridescents et paillettes stellaires. Chaque pièce est unique.",
    image: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=500&h=500&fit=crop",
    customizable: false,
    bestseller: true,
    collection: "Luxe"
  },
  // Bracelets (4)
  {
    id: 9,
    name: "Bracelet rigide marbré",
    category: "Bijoux",
    subcategory: "Bracelets",
    price: 48,
    shortDesc: "Bracelet jonc avec effet marbre noir et blanc, finition brillante",
    longDesc: "Ce bracelet rigide présente un magnifique effet marbre obtenu par technique de coulée artistique. Confortable et résistant, il sublime votre poignet avec sophistication.",
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500&h=500&fit=crop",
    customizable: false,
    bestseller: true,
    collection: "Luxe"
  },
  {
    id: 10,
    name: "Bracelet paillettes or",
    category: "Bijoux",
    subcategory: "Bracelets",
    price: 44,
    shortDesc: "Bracelet scintillant avec paillettes dorées en suspension dans résine claire",
    longDesc: "Illuminez votre poignet avec ce bracelet étincelant. Les paillettes dorées créent un effet luxueux et festif. Parfait pour les occasions spéciales.",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500&h=500&fit=crop",
    customizable: true,
    bestseller: false,
    collection: "Luxe"
  },
  {
    id: 11,
    name: "Bracelet minimaliste",
    category: "Bijoux",
    subcategory: "Bracelets",
    price: 38,
    shortDesc: "Design épuré et moderne en résine transparente ou teintée légèrement",
    longDesc: "La simplicité à son meilleur. Ce bracelet minimaliste s'adapte à tous les styles. Résine de haute qualité pour un confort optimal au quotidien.",
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500&h=500&fit=crop",
    customizable: true,
    bestseller: true,
    collection: "Minimaliste"
  },
  {
    id: 12,
    name: "Bracelet océan vagues",
    category: "Bijoux",
    subcategory: "Bracelets",
    price: 46,
    shortDesc: "Effet vagues marines avec dégradés de bleu, blanc et touches argentées",
    longDesc: "Portez l'océan à votre poignet. Ce bracelet capture le mouvement des vagues avec ses couches de résine bleue. Pièce unique inspirée de la mer.",
    image: "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=500&h=500&fit=crop",
    customizable: true,
    bestseller: true,
    collection: "Océan"
  },
  // Bagues (3)
  {
    id: 13,
    name: "Bague transparente",
    category: "Bijoux",
    subcategory: "Bagues",
    price: 28,
    shortDesc: "Bague fine en résine cristalline, légère et confortable pour port quotidien",
    longDesc: "Cette bague transparente offre une alternative moderne aux bijoux traditionnels. Résine ultra-claire et résistante. Disponible en plusieurs tailles.",
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500&h=500&fit=crop",
    customizable: false,
    bestseller: false,
    collection: "Minimaliste"
  },
  {
    id: 14,
    name: "Bague marbre noir",
    category: "Bijoux",
    subcategory: "Bagues",
    price: 32,
    shortDesc: "Effet marbre noir et blanc sophistiqué, design unisexe tendance",
    longDesc: "Une bague audacieuse avec effet marbre noir profond. Finition mate ou brillante au choix. Style affirmé pour hommes et femmes.",
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500&h=500&fit=crop",
    customizable: false,
    bestseller: true,
    collection: "Luxe"
  },
  {
    id: 15,
    name: "Bague fleurs séchées",
    category: "Bijoux",
    subcategory: "Bagues",
    price: 30,
    shortDesc: "Petites fleurs séchées encapsulées dans une bague délicate et colorée",
    longDesc: "Un jardin miniature à votre doigt. Cette bague préserve de véritables fleurs séchées dans la résine. Unique et poétique.",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500&h=500&fit=crop",
    customizable: true,
    bestseller: false,
    collection: "Floral"
  },
  // Pendentifs & Charms (5)
  {
    id: 16,
    name: "Pendentif géode",
    category: "Bijoux",
    subcategory: "Pendentifs",
    price: 50,
    shortDesc: "Inspiré des géodes naturelles avec cristaux et pigments métalliques",
    longDesc: "Portez un morceau de nature stylisé. Ce pendentif imite les géodes avec ses cristaux scintillants et couleurs minérales. Pièce unique faite main.",
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500&h=500&fit=crop",
    customizable: false,
    bestseller: true,
    collection: "Nature"
  },
  {
    id: 17,
    name: "Pendentif photo personnalisé",
    category: "Bijoux",
    subcategory: "Pendentifs",
    price: 48,
    shortDesc: "Encapsulez votre photo favorite dans un pendentif en résine protectrice",
    longDesc: "Gardez vos êtres chers près de votre cœur. Ce pendentif préserve votre photo dans une résine cristalline. Cadeau sentimental intemporel.",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&h=500&fit=crop",
    customizable: true,
    bestseller: true,
    collection: "Romance"
  },
  {
    id: 18,
    name: "Pendentif animal",
    category: "Bijoux",
    subcategory: "Pendentifs",
    price: 42,
    shortDesc: "Silhouettes d'animaux découpées et incrustées dans résine colorée",
    longDesc: "Célébrez votre amour des animaux. Chat, chien, cheval ou oiseau, choisissez votre compagnon en pendentif. Design délicat et original.",
    image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=500&h=500&fit=crop",
    customizable: true,
    bestseller: false,
    collection: "Nature"
  },
  {
    id: 19,
    name: "Charms personnalisés",
    category: "Bijoux",
    subcategory: "Pendentifs",
    price: 25,
    shortDesc: "Petits charms sur mesure avec initiales, symboles ou miniatures",
    longDesc: "Créez votre propre histoire avec ces charms personnalisables. Ajoutez-les à vos bracelets ou colliers. Multiples designs disponibles.",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500&h=500&fit=crop",
    customizable: true,
    bestseller: false,
    collection: "Romance"
  },
  {
    id: 20,
    name: "Pendentif feuille d'or",
    category: "Bijoux",
    subcategory: "Pendentifs",
    price: 55,
    shortDesc: "Véritable feuille d'or 24k encapsulée dans résine transparente",
    longDesc: "Le luxe absolu. Ce pendentif contient de vraies feuilles d'or incrustées dans une résine cristalline. Élégance et raffinement garantis.",
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500&h=500&fit=crop",
    customizable: false,
    bestseller: true,
    collection: "Luxe"
  },
  // ==================== DÉCORATION (20 produits) ====================
  // Sous-verres (4)
  {
    id: 21,
    name: "Sous-verres géode",
    category: "Décoration",
    subcategory: "Sous-verres",
    price: 28,
    shortDesc: "Sous-verres inspirés des géodes naturelles avec pigments métalliques",
    longDesc: "Ces sous-verres en résine sont inspirés des géodes minérales. Chaque pièce est coulée à la main avec des pigments métalliques, des paillettes fines et une finition brillante. Parfaits pour protéger vos surfaces tout en ajoutant une touche artistique à votre intérieur.",
    image: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=500&h=500&fit=crop",
    customizable: false,
    bestseller: true,
    collection: "Luxe"
  },
  {
    id: 22,
    name: "Sous-verres océan",
    category: "Décoration",
    subcategory: "Sous-verres",
    price: 26,
    shortDesc: "Effet vagues marines avec dégradés de bleu et blanc nacré",
    longDesc: "Apportez l'océan sur votre table. Ces sous-verres capturent le mouvement des vagues avec des couches de résine bleue et blanche. Set de 4 pièces.",
    image: "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=500&h=500&fit=crop",
    customizable: true,
    bestseller: true,
    collection: "Océan"
  },
  {
    id: 23,
    name: "Sous-verres minimalistes",
    category: "Décoration",
    subcategory: "Sous-verres",
    price: 24,
    shortDesc: "Design épuré blanc transparent avec finition mate élégante",
    longDesc: "Simplicité et élégance. Ces sous-verres minimalistes s'intègrent à tous les intérieurs. Résine de qualité supérieure, finition mate.",
    image: "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=500&h=500&fit=crop",
    customizable: false,
    bestseller: false,
    collection: "Minimaliste"
  },
  {
    id: 24,
    name: "Sous-verres paillettes dorées",
    category: "Décoration",
    subcategory: "Sous-verres",
    price: 30,
    shortDesc: "Paillettes dorées et argentées en suspension pour effet glamour",
    longDesc: "Ajoutez une touche de glamour à votre table. Ces sous-verres scintillent avec des paillettes dorées. Parfaits pour les occasions spéciales.",
    image: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=500&h=500&fit=crop",
    customizable: true,
    bestseller: false,
    collection: "Luxe"
  },
  // Plateaux (4)
  {
    id: 25,
    name: "Plateau rectangulaire marbre",
    category: "Décoration",
    subcategory: "Plateaux",
    price: 75,
    shortDesc: "Grand plateau effet marbre noir blanc, idéal pour le service",
    longDesc: "Ce plateau rectangulaire impressionne par son effet marbre réaliste. Parfait pour servir vos invités avec style. Dimensions: 40x25cm.",
    image: "https://images.unsplash.com/photo-1565123409695-7b5ef63a2efb?w=500&h=500&fit=crop",
    customizable: false,
    bestseller: true,
    collection: "Luxe"
  },
  {
    id: 26,
    name: "Plateau rond océan",
    category: "Décoration",
    subcategory: "Plateaux",
    price: 65,
    shortDesc: "Plateau circulaire avec effet vagues océan bleu turquoise",
    longDesc: "Un océan sur votre table. Ce plateau rond capture la beauté des vagues marines. Idéal comme pièce centrale décorative. Diamètre: 35cm.",
    image: "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=500&h=500&fit=crop",
    customizable: true,
    bestseller: true,
    collection: "Océan"
  },
  {
    id: 27,
    name: "Plateau hexagonal doré",
    category: "Décoration",
    subcategory: "Plateaux",
    price: 70,
    shortDesc: "Forme hexagonale moderne avec paillettes dorées et finition brillante",
    longDesc: "Design géométrique tendance. Ce plateau hexagonal combine forme moderne et éclat doré. Parfait pour bijoux ou décoration.",
    image: "https://images.unsplash.com/photo-1565123409695-7b5ef63a2efb?w=500&h=500&fit=crop",
    customizable: false,
    bestseller: false,
    collection: "Luxe"
  },
  {
    id: 28,
    name: "Plateau bois et résine",
    category: "Décoration",
    subcategory: "Plateaux",
    price: 85,
    shortDesc: "Combinaison de bois naturel et résine colorée pour effet rivière",
    longDesc: "Une œuvre d'art fonctionnelle. Le bois naturel rencontre la résine dans un design de rivière. Chaque plateau est unique.",
    image: "https://images.unsplash.com/photo-1565123409695-7b5ef63a2efb?w=500&h=500&fit=crop",
    customizable: true,
    bestseller: true,
    collection: "Nature"
  },
  // Horloges (2)
  {
    id: 29,
    name: "Horloge murale océan",
    category: "Décoration",
    subcategory: "Horloges",
    price: 95,
    shortDesc: "Horloge avec fond océan bleu turquoise et aiguilles dorées",
    longDesc: "Le temps s'écoule comme les vagues. Cette horloge murale apporte l'océan dans votre intérieur. Mécanisme silencieux de qualité.",
    image: "https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=500&h=500&fit=crop",
    customizable: true,
    bestseller: true,
    collection: "Océan"
  },
  {
    id: 30,
    name: "Horloge géode",
    category: "Décoration",
    subcategory: "Horloges",
    price: 98,
    shortDesc: "Horloge inspirée des géodes avec cristaux et pigments métalliques",
    longDesc: "Une horloge qui est aussi une œuvre d'art. L'effet géode ajoute une dimension artistique à votre mur. Diamètre: 30cm.",
    image: "https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=500&h=500&fit=crop",
    customizable: false,
    bestseller: false,
    collection: "Luxe"
  },
  // Lettres & Art mural (4)
  {
    id: 31,
    name: "Lettres décoratives fleuries",
    category: "Décoration",
    subcategory: "Lettres",
    price: 45,
    shortDesc: "Lettres personnalisables avec fleurs séchées encapsulées",
    longDesc: "Personnalisez votre espace avec vos initiales. Ces lettres contiennent de vraies fleurs séchées. Idéales pour chambre d'enfant ou décoration murale.",
    image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=500&h=500&fit=crop",
    customizable: true,
    bestseller: true,
    collection: "Floral"
  },
  {
    id: 32,
    name: "Tableau océan abstrait",
    category: "Décoration",
    subcategory: "Tableaux",
    price: 120,
    shortDesc: "Toile avec résine coulée effet océan bleu turquoise et blanc",
    longDesc: "Une vague figée dans le temps. Ce tableau capture le mouvement de l'océan sur toile. Pièce unique pour votre mur. Format: 50x70cm.",
    image: "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=500&h=500&fit=crop",
    customizable: false,
    bestseller: true,
    collection: "Océan"
  },
  {
    id: 33,
    name: "Tableau géode",
    category: "Décoration",
    subcategory: "Tableaux",
    price: 135,
    shortDesc: "Œuvre murale inspirée des géodes avec cristaux et or",
    longDesc: "Un morceau de nature sur votre mur. Ce tableau géode combine résine, pigments et feuille d'or. Chef-d'œuvre artisanal unique.",
    image: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=500&h=500&fit=crop",
    customizable: false,
    bestseller: true,
    collection: "Luxe"
  },
  {
    id: 34,
    name: "Tableau galaxie cosmique",
    category: "Décoration",
    subcategory: "Tableaux",
    price: 125,
    shortDesc: "Univers miniature avec étoiles, nébuleuses et paillettes",
    longDesc: "L'espace infini sur votre mur. Ce tableau capture la beauté du cosmos avec des pigments iridescents. Fascination garantie.",
    image: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=500&h=500&fit=crop",
    customizable: false,
    bestseller: false,
    collection: "Luxe"
  },
  // Lampes & Figurines (6)
  {
    id: 35,
    name: "Lampe LED résine océan",
    category: "Décoration",
    subcategory: "Lampes",
    price: 88,
    shortDesc: "Lampe décorative avec effet océan illuminé de l'intérieur",
    longDesc: "Cette lampe crée une ambiance marine apaisante. L'éclairage LED met en valeur les couches de résine bleue. Parfaite comme veilleuse.",
    image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=500&h=500&fit=crop",
    customizable: false,
    bestseller: true,
    collection: "Océan"
  },
  {
    id: 36,
    name: "Figurine abstraite",
    category: "Décoration",
    subcategory: "Figurines",
    price: 52,
    shortDesc: "Sculpture abstraite moderne en résine colorée pour décoration",
    longDesc: "Art contemporain à portée de main. Cette figurine abstraite ajoute une touche artistique à votre espace. Hauteur: 20cm.",
    image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=500&h=500&fit=crop",
    customizable: false,
    bestseller: false,
    collection: "Minimaliste"
  },
  {
    id: 37,
    name: "Sphères décoratives",
    category: "Décoration",
    subcategory: "Figurines",
    price: 38,
    shortDesc: "Set de 3 sphères avec différents effets: marbre, paillettes, transparent",
    longDesc: "Trio décoratif élégant. Ces sphères se marient parfaitement ensemble. Idéales pour étagères ou centre de table.",
    image: "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=500&h=500&fit=crop",
    customizable: false,
    bestseller: false,
    collection: "Luxe"
  },
  {
    id: 38,
    name: "Vase résine transparent",
    category: "Décoration",
    subcategory: "Vases",
    price: 58,
    shortDesc: "Vase cylindrique en résine cristalline pour fleurs fraîches ou séchées",
    longDesc: "Ce vase en résine pure met en valeur vos fleurs. Design moderne et résistant. Peut aussi servir de pièce décorative seule.",
    image: "https://images.unsplash.com/photo-1565123409695-7b5ef63a2efb?w=500&h=500&fit=crop",
    customizable: false,
    bestseller: false,
    collection: "Minimaliste"
  },
  {
    id: 39,
    name: "Pot décoratif marbré",
    category: "Décoration",
    subcategory: "Pots",
    price: 42,
    shortDesc: "Cache-pot avec effet marbre noir et or pour plantes d'intérieur",
    longDesc: "Sublimez vos plantes avec ce pot au design luxueux. L'effet marbre ajoute une touche d'élégance. Résistant à l'eau.",
    image: "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=500&h=500&fit=crop",
    customizable: false,
    bestseller: true,
    collection: "Luxe"
  },
  {
    id: 40,
    name: "Porte-encens résine",
    category: "Décoration",
    subcategory: "Accessoires",
    price: 32,
    shortDesc: "Support porte-encens avec récupérateur de cendres intégré",
    longDesc: "Créez une atmosphère zen. Ce porte-encens allie fonctionnalité et esthétique. Design apaisant avec effet océan ou marbre.",
    image: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=500&h=500&fit=crop",
    customizable: true,
    bestseller: false,
    collection: "Nature"
  },
  // ==================== ACCESSOIRES (20 produits) ====================
  // Porte-clés (5)
  {
    id: 41,
    name: "Porte-clés initiale",
    category: "Accessoires",
    subcategory: "Porte-clés",
    price: 18,
    shortDesc: "Porte-clés avec votre initiale dorée ou argentée encapsulée",
    longDesc: "Ne perdez plus vos clés avec style. Initiale personnalisable dans une résine colorée. Cadeau parfait et économique.",
    image: "https://images.unsplash.com/photo-1582719471137-c3967ffb1c42?w=500&h=500&fit=crop",
    customizable: true,
    bestseller: true,
    collection: "Romance"
  },
  {
    id: 42,
    name: "Porte-clés photo souvenir",
    category: "Accessoires",
    subcategory: "Porte-clés",
    price: 20,
    shortDesc: "Encapsulez votre photo préférée dans un porte-clés résistant",
    longDesc: "Gardez vos souvenirs avec vous partout. Ce porte-clés préserve votre photo dans une résine protectrice. Résistant aux chocs.",
    image: "https://images.unsplash.com/photo-1590736969955-71cc94901144?w=500&h=500&fit=crop",
    customizable: true,
    bestseller: true,
    collection: "Romance"
  },
  {
    id: 43,
    name: "Porte-clés animaux",
    category: "Accessoires",
    subcategory: "Porte-clés",
    price: 16,
    shortDesc: "Silhouettes d'animaux mignons: chat, chien, patte, oiseau",
    longDesc: "Pour les amoureux des animaux. Ces porte-clés adorables montrent votre passion. Plusieurs modèles disponibles.",
    image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=500&h=500&fit=crop",
    customizable: true,
    bestseller: false,
    collection: "Nature"
  },
  {
    id: 44,
    name: "Porte-clés paillettes",
    category: "Accessoires",
    subcategory: "Porte-clés",
    price: 15,
    shortDesc: "Porte-clés scintillant avec paillettes dorées ou argentées",
    longDesc: "Ajoutez du glamour à votre trousseau. Ces porte-clés brillent de mille feux. Parfaits pour un petit cadeau.",
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500&h=500&fit=crop",
    customizable: true,
    bestseller: false,
    collection: "Luxe"
  },
  {
    id: 45,
    name: "Porte-clés fleurs séchées",
    category: "Accessoires",
    subcategory: "Porte-clés",
    price: 17,
    shortDesc: "Vraies fleurs séchées encapsulées dans un porte-clés transparent",
    longDesc: "Un jardin dans votre poche. Ces porte-clés préservent la beauté des fleurs séchées. Chaque pièce est unique.",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500&h=500&fit=crop",
    customizable: true,
    bestseller: true,
    collection: "Floral"
  },
  // Marques-pages (3)
  {
    id: 46,
    name: "Marque-page fleurs dorées",
    category: "Accessoires",
    subcategory: "Marques-pages",
    price: 22,
    shortDesc: "Marque-page élégant avec fleurs séchées et feuille d'or",
    longDesc: "Un marque-page artisanal qui combine transparence de résine, délicatesse des fleurs séchées et éclat de la feuille d'or. Un cadeau parfait pour les amoureux de lecture et les passionnés d'art.",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500&h=500&fit=crop",
    customizable: true,
    bestseller: true,
    collection: "Floral"
  },
  {
    id: 47,
    name: "Marque-page minimaliste",
    category: "Accessoires",
    subcategory: "Marques-pages",
    price: 18,
    shortDesc: "Design épuré transparent ou légèrement teinté pour lecture",
    longDesc: "Simplicité et fonctionnalité. Ce marque-page minimaliste se glisse discrètement dans vos livres. Résine fine et résistante.",
    image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=500&h=500&fit=crop",
    customizable: false,
    bestseller: false,
    collection: "Minimaliste"
  },
  {
    id: 48,
    name: "Marque-page océan",
    category: "Accessoires",
    subcategory: "Marques-pages",
    price: 20,
    shortDesc: "Effet vagues océaniques avec dégradés de bleu apaisant",
    longDesc: "Plongez dans votre lecture avec ce marque-page inspiré de l'océan. Les vagues bleues créent une ambiance relaxante.",
    image: "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=500&h=500&fit=crop",
    customizable: true,
    bestseller: true,
    collection: "Océan"
  },
  // Supports & Organisateurs (5)
  {
    id: 49,
    name: "Support téléphone",
    category: "Accessoires",
    subcategory: "Supports",
    price: 28,
    shortDesc: "Support téléphone design pour bureau ou table de chevet",
    longDesc: "Gardez votre téléphone à portée de main avec style. Ce support stable et élégant s'adapte à tous les smartphones.",
    image: "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=500&h=500&fit=crop",
    customizable: true,
    bestseller: true,
    collection: "Minimaliste"
  },
  {
    id: 50,
    name: "Support stylos bureau",
    category: "Accessoires",
    subcategory: "Supports",
    price: 35,
    shortDesc: "Pot à crayons élégant avec effet marbre ou océan",
    longDesc: "Organisez votre bureau avec style. Ce support à stylos combine fonctionnalité et esthétique. Stable et spacieux.",
    image: "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=500&h=500&fit=crop",
    customizable: true,
    bestseller: false,
    collection: "Luxe"
  },
  {
    id: 51,
    name: "Porte-cartes de visite",
    category: "Accessoires",
    subcategory: "Porte-cartes",
    price: 32,
    shortDesc: "Porte-cartes de visite élégant pour bureau professionnel",
    longDesc: "Impressionnez vos clients avec ce porte-cartes sophistiqué. Design moderne qui met en valeur vos cartes de visite.",
    image: "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=500&h=500&fit=crop",
    customizable: false,
    bestseller: false,
    collection: "Luxe"
  },
  {
    id: 52,
    name: "Porte-cartes bancaires",
    category: "Accessoires",
    subcategory: "Porte-cartes",
    price: 25,
    shortDesc: "Étui rigide pour cartes bancaires, design slim et protecteur",
    longDesc: "Protégez vos cartes avec style. Cet étui rigide en résine empêche les rayures et la déformation. Capacité: 4-6 cartes.",
    image: "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=500&h=500&fit=crop",
    customizable: true,
    bestseller: true,
    collection: "Minimaliste"
  },
  {
    id: 53,
    name: "Plateau pour cristaux",
    category: "Accessoires",
    subcategory: "Plateaux",
    price: 38,
    shortDesc: "Plateau spécial pour exposer vos cristaux et pierres précieuses",
    longDesc: "Mettez en valeur votre collection de cristaux. Ce plateau est conçu pour exposer harmonieusement vos pierres. Design zen.",
    image: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=500&h=500&fit=crop",
    customizable: false,
    bestseller: false,
    collection: "Nature"
  },
  // Accessoires voiture & divers (7)
  {
    id: 54,
    name: "Accessoire rétroviseur voiture",
    category: "Accessoires",
    subcategory: "Voiture",
    price: 24,
    shortDesc: "Suspension personnalisable pour rétroviseur avec fleurs ou initiale",
    longDesc: "Personnalisez votre voiture. Cette suspension élégante se fixe au rétroviseur. Parfumée en option.",
    image: "https://images.unsplash.com/photo-1582719471137-c3967ffb1c42?w=500&h=500&fit=crop",
    customizable: true,
    bestseller: true,
    collection: "Romance"
  },
  {
    id: 55,
    name: "Plaque décorative voiture",
    category: "Accessoires",
    subcategory: "Voiture",
    price: 28,
    shortDesc: "Petite plaque décorative à coller sur tableau de bord",
    longDesc: "Ajoutez votre touche personnelle à votre véhicule. Cette plaque adhésive résistante se fixe facilement.",
    image: "https://images.unsplash.com/photo-1582719471137-c3967ffb1c42?w=500&h=500&fit=crop",
    customizable: true,
    bestseller: false,
    collection: "Romance"
  },
  {
    id: 56,
    name: "Clips pour sac",
    category: "Accessoires",
    subcategory: "Mode",
    price: 20,
    shortDesc: "Clips décoratifs à attacher sur sacs, sacs à dos ou pochettes",
    longDesc: "Personnalisez vos sacs. Ces clips décoratifs ajoutent une touche unique à vos accessoires. Faciles à attacher.",
    image: "https://images.unsplash.com/photo-1590736969955-71cc94901144?w=500&h=500&fit=crop",
    customizable: true,
    bestseller: false,
    collection: "Floral"
  },
  {
    id: 57,
    name: "Badge porte-nom",
    category: "Accessoires",
    subcategory: "Bureau",
    price: 22,
    shortDesc: "Badge professionnel personnalisable avec prénom et titre",
    longDesc: "Badge d'identification élégant pour entreprises et événements. Personnalisation complète avec votre nom et fonction.",
    image: "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=500&h=500&fit=crop",
    customizable: true,
    bestseller: false,
    collection: "Minimaliste"
  },
  {
    id: 58,
    name: "Amulette protection",
    category: "Accessoires",
    subcategory: "Spirituel",
    price: 30,
    shortDesc: "Amulette avec symboles protecteurs ou pierres semi-précieuses",
    longDesc: "Portez votre protection avec vous. Cette amulette peut contenir des symboles spirituels ou des pierres. Dimension: 3cm.",
    image: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=500&h=500&fit=crop",
    customizable: true,
    bestseller: false,
    collection: "Nature"
  },
  {
    id: 59,
    name: "Talisman chance",
    category: "Accessoires",
    subcategory: "Spirituel",
    price: 28,
    shortDesc: "Talisman porte-bonheur avec trèfle, fer à cheval ou symboles",
    longDesc: "Attirez la chance. Ce talisman combine symbolisme et beauté. Parfait comme cadeau ou pour soi.",
    image: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=500&h=500&fit=crop",
    customizable: true,
    bestseller: true,
    collection: "Romance"
  },
  {
    id: 60,
    name: "Décoration murale géométrique",
    category: "Accessoires",
    subcategory: "Décoration",
    price: 45,
    shortDesc: "Pièce murale avec formes géométriques modernes et colorées",
    longDesc: "Art mural contemporain. Cette pièce géométrique ajoute une dimension artistique à vos murs. Facile à accrocher.",
    image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=500&h=500&fit=crop",
    customizable: false,
    bestseller: false,
    collection: "Minimaliste"
  },
  // ==================== SOUVENIRS & ENCAPSULATIONS (20 produits) ====================
  // Cœurs souvenir (4)
  {
    id: 61,
    name: "Cœur souvenir photo",
    category: "Souvenirs",
    subcategory: "Cœurs souvenir",
    price: 42,
    shortDesc: "Cœur en résine personnalisable avec votre photo pour souvenir durable",
    longDesc: "Ce cœur en résine est conçu pour préserver vos moments précieux. La photo est encapsulée dans une résine cristalline, protégée pour durer des années. Un cadeau sentimental parfait pour un anniversaire, un mariage ou un hommage.",
    image: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=500&h=500&fit=crop",
    customizable: true,
    bestseller: true,
    collection: "Romance"
  },
  {
    id: 62,
    name: "Cœur souvenir fleurs mariage",
    category: "Souvenirs",
    subcategory: "Cœurs souvenir",
    price: 48,
    shortDesc: "Préservez les fleurs de votre bouquet de mariée dans un cœur",
    longDesc: "Gardez les fleurs de votre mariage éternellement. Ce cœur encapsule les pétales de votre bouquet. Souvenir émotionnel unique.",
    image: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=500&h=500&fit=crop",
    customizable: true,
    bestseller: true,
    collection: "Romance"
  },
  {
    id: 63,
    name: "Cœur souvenir cheveux bébé",
    category: "Souvenirs",
    subcategory: "Cœurs souvenir",
    price: 45,
    shortDesc: "Encapsulez la première mèche de cheveux de bébé",
    longDesc: "Préservez ce moment unique. La première coupe de cheveux de bébé devient un souvenir éternel dans ce cœur en résine.",
    image: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=500&h=500&fit=crop",
    customizable: true,
    bestseller: true,
    collection: "Romance"
  },
  {
    id: 64,
    name: "Cœur souvenir animal",
    category: "Souvenirs",
    subcategory: "Cœurs souvenir",
    price: 46,
    shortDesc: "Préservez les poils de votre animal de compagnie adoré",
    longDesc: "Un hommage à votre compagnon. Ce cœur conserve les poils de votre animal pour toujours. Réconfort dans les moments difficiles.",
    image: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=500&h=500&fit=crop",
    customizable: true,
    bestseller: true,
    collection: "Nature"
  },
  // Encapsulations spéciales (6)
  {
    id: 65,
    name: "Encapsulation fleurs mariage complète",
    category: "Souvenirs",
    subcategory: "Encapsulations",
    price: 85,
    shortDesc: "Encapsulation professionnelle de votre bouquet de mariage entier",
    longDesc: "Service complet de préservation de bouquet. Nous encapsulons vos fleurs de mariage dans une résine de qualité muséale. Pièce sur mesure 15x15cm.",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500&h=500&fit=crop",
    customizable: true,
    bestseller: true,
    collection: "Romance"
  },
  {
    id: 66,
    name: "Encapsulation cheveux bébé décorative",
    category: "Souvenirs",
    subcategory: "Encapsulations",
    price: 55,
    shortDesc: "Préservation artistique de la première mèche de bébé",
    longDesc: "Transformez ce moment précieux en œuvre d'art. Les cheveux de bébé sont disposés artistiquement avec décoration personnalisée.",
    image: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=500&h=500&fit=crop",
    customizable: true,
    bestseller: true,
    collection: "Romance"
  },
  {
    id: 67,
    name: "Encapsulation poils animal",
    category: "Souvenirs",
    subcategory: "Encapsulations",
    price: 60,
    shortDesc: "Souvenir éternel de votre animal de compagnie bien-aimé",
    longDesc: "Honorez la mémoire de votre compagnon. Cette encapsulation préserve les poils avec respect et beauté. Plaque ou forme personnalisée.",
    image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=500&h=500&fit=crop",
    customizable: true,
    bestseller: true,
    collection: "Nature"
  },
  {
    id: 68,
    name: "Médaillon photo souvenir",
    category: "Souvenirs",
    subcategory: "Médaillons",
    price: 50,
    shortDesc: "Médaillon ouvrant avec photo encapsulée et message gravé",
    longDesc: "Un médaillon traditionnel réinventé. La photo est protégée dans la résine avec possibilité de graver un message au dos.",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&h=500&fit=crop",
    customizable: true,
    bestseller: false,
    collection: "Romance"
  },
  {
    id: 69,
    name: "Photo encapsulée décorative",
    category: "Souvenirs",
    subcategory: "Photos",
    price: 48,
    shortDesc: "Photo préservée dans bloc de résine transparent comme cadre moderne",
    longDesc: "Un cadre photo nouvelle génération. Votre photo est encapsulée dans un bloc de résine cristalline. Effet 3D saisissant.",
    image: "https://images.unsplash.com/photo-1590736969955-71cc94901144?w=500&h=500&fit=crop",
    customizable: true,
    bestseller: false,
    collection: "Minimaliste"
  },
  {
    id: 70,
    name: "Porte-clés souvenir personnalisé",
    category: "Souvenirs",
    subcategory: "Porte-clés",
    price: 25,
    shortDesc: "Porte-clés avec encapsulation photo, cheveux, fleurs ou message",
    longDesc: "Gardez vos souvenirs toujours avec vous. Ce porte-clés peut contenir photo, mèche de cheveux, fleur ou message manuscrit.",
    image: "https://images.unsplash.com/photo-1582719471137-c3967ffb1c42?w=500&h=500&fit=crop",
    customizable: true,
    bestseller: true,
    collection: "Romance"
  },
  // Plaques & Cubes souvenirs (5)
  {
    id: 71,
    name: "Plaque souvenir murale",
    category: "Souvenirs",
    subcategory: "Plaques",
    price: 65,
    shortDesc: "Plaque décorative murale avec photo, dates et message personnalisé",
    longDesc: "Créez un mémorial durable et élégant. Cette plaque murale combine photo, dates importantes et message gravé. Dimensions: 20x15cm.",
    image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=500&h=500&fit=crop",
    customizable: true,
    bestseller: true,
    collection: "Romance"
  },
  {
    id: 72,
    name: "Cube souvenir 3D",
    category: "Souvenirs",
    subcategory: "Cubes",
    price: 70,
    shortDesc: "Cube transparent avec photo ou objet encapsulé en 3D",
    longDesc: "Innovation et émotion. Ce cube crée un effet de profondeur saisissant avec votre photo ou objet. Pièce décorative impressionnante. 8x8x8cm.",
    image: "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=500&h=500&fit=crop",
    customizable: true,
    bestseller: false,
    collection: "Minimaliste"
  },
  {
    id: 73,
    name: "Souvenir funéraire",
    category: "Souvenirs",
    subcategory: "Funéraire",
    price: 75,
    shortDesc: "Pièce commémorative avec photo, fleurs funéraires et message",
    longDesc: "Un hommage respectueux et durable. Cette pièce préserve la mémoire de l'être cher avec dignité. Peut inclure fleurs de cérémonie, photo et inscription.",
    image: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=500&h=500&fit=crop",
    customizable: true,
    bestseller: false,
    collection: "Romance"
  },
  {
    id: 74,
    name: "Souvenir couple",
    category: "Souvenirs",
    subcategory: "Couple",
    price: 58,
    shortDesc: "Pièce romantique avec photos de couple, dates et initiales",
    longDesc: "Célébrez votre amour. Cette pièce combine vos photos, date de rencontre, initiales enlacées. Cadeau parfait pour anniversaire ou Saint-Valentin.",
    image: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=500&h=500&fit=crop",
    customizable: true,
    bestseller: true,
    collection: "Romance"
  },
  {
    id: 75,
    name: "Souvenir bébé naissance",
    category: "Souvenirs",
    subcategory: "Bébé",
    price: 62,
    shortDesc: "Kit souvenir complet: empreinte, cheveux, photo et infos naissance",
    longDesc: "Préservez chaque détail de la naissance. Ce souvenir peut inclure empreinte de main/pied, mèche de cheveux, photo, poids et taille. Cadeau émouvant.",
    image: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=500&h=500&fit=crop",
    customizable: true,
    bestseller: true,
    collection: "Romance"
  },
  // Souvenirs thématiques (5)
  {
    id: 76,
    name: "Souvenir mariage complet",
    category: "Souvenirs",
    subcategory: "Mariage",
    price: 95,
    shortDesc: "Pièce maîtresse avec fleurs du bouquet, photo du couple et date",
    longDesc: "Le souvenir de mariage ultime. Cette pièce combine fleurs du bouquet, photos des mariés, date gravée. Format généreux 25x20cm. Chef-d'œuvre sentimental.",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500&h=500&fit=crop",
    customizable: true,
    bestseller: true,
    collection: "Romance"
  },
  {
    id: 77,
    name: "Souvenir anniversaire",
    category: "Souvenirs",
    subcategory: "Anniversaire",
    price: 52,
    shortDesc: "Souvenir personnalisé pour anniversaire avec photos et messages",
    longDesc: "Marquez les dates importantes. Ce souvenir célèbre un anniversaire avec photos, date significative et message personnel. Cadeau mémorable.",
    image: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=500&h=500&fit=crop",
    customizable: true,
    bestseller: false,
    collection: "Romance"
  },
  {
    id: 78,
    name: "Souvenir amitié",
    category: "Souvenirs",
    subcategory: "Amitié",
    price: 45,
    shortDesc: "Célébrez l'amitié avec photos partagées et message d'amitié",
    longDesc: "L'amitié éternelle. Cette pièce immortalise les moments précieux avec vos amis. Photos, citations et souvenirs communs.",
    image: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=500&h=500&fit=crop",
    customizable: true,
    bestseller: false,
    collection: "Romance"
  },
  {
    id: 79,
    name: "Souvenir famille",
    category: "Souvenirs",
    subcategory: "Famille",
    price: 68,
    shortDesc: "Pièce familiale avec photos multiples et arbre généalogique",
    longDesc: "Votre héritage familial préservé. Cette pièce peut inclure plusieurs photos de famille, prénoms et relations. Design arbre généalogique disponible.",
    image: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=500&h=500&fit=crop",
    customizable: true,
    bestseller: true,
    collection: "Romance"
  },
  {
    id: 80,
    name: "Souvenir voyage",
    category: "Souvenirs",
    subcategory: "Voyage",
    price: 55,
    shortDesc: "Encapsulez souvenirs de voyage: sable, coquillages, photos, billets",
    longDesc: "Gardez vos voyages vivants. Cette pièce peut contenir sable de plage, petits coquillages, photos de destination, billets d'avion. Carte du lieu gravée possible.",
    image: "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=500&h=500&fit=crop",
    customizable: true,
    bestseller: true,
    collection: "Océan"
  }
]

export async function POST(request) {
  try {
    // Récupérer tous les produits existants pour vérifier lesquels manquent
    const { data: existingProducts } = await supabaseServer
      .from('products')
      .select('name_fr, name_en')

    const existingNames = new Set()
    if (existingProducts) {
      existingProducts.forEach(p => {
        existingNames.add(p.name_fr.toLowerCase().trim())
        existingNames.add(p.name_en.toLowerCase().trim())
      })
    }

    // Convertir et filtrer les produits qui n'existent pas encore
    const productsToInsert = ALL_PRODUCTS
      .filter(product => {
        const nameFr = product.name.toLowerCase().trim()
        const nameEn = product.name.toLowerCase().trim()
        return !existingNames.has(nameFr) && !existingNames.has(nameEn)
      })
      .map(product => mapProductToDBFormat(product))

    if (productsToInsert.length === 0) {
      return NextResponse.json({ 
        success: false, 
        message: `Tous les ${ALL_PRODUCTS.length} produits sont déjà dans la base de données. Utilisez l'interface admin pour les modifier.`,
        existingCount: existingProducts?.length || 0,
        expectedCount: ALL_PRODUCTS.length
      }, { status: 400 })
    }

    // Insérer seulement les produits manquants (par lots de 50 pour éviter les limites)
    const batchSize = 50
    let insertedCount = 0
    let lastError = null

    for (let i = 0; i < productsToInsert.length; i += batchSize) {
      const batch = productsToInsert.slice(i, i + batchSize)
      const { data, error } = await supabaseServer
        .from('products')
        .insert(batch)
        .select()

      if (error) {
        lastError = error
        console.error(`Erreur lors de l'insertion du lot ${i / batchSize + 1}:`, error)
        break
      }

      insertedCount += data.length
    }

    if (lastError) {
      throw lastError
    }

    const totalAfterInsert = (existingProducts?.length || 0) + insertedCount

    return NextResponse.json({ 
      success: true, 
      message: `${insertedCount} nouveaux produits ajoutés. Total dans la base: ${totalAfterInsert}/${ALL_PRODUCTS.length}`,
      count: insertedCount,
      total: totalAfterInsert,
      expected: ALL_PRODUCTS.length
    })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 })
  }
}

