"use client";

import React, { useState } from 'react';
import { Upload, Package, Check, AlertCircle } from 'lucide-react';

const MissaProductsManager = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

  // Tous les produits avec images Unsplash de haute qualité
  const products = [
    // BIJOUX & ACCESSOIRES
    {
      name_fr: "Boucles d'oreilles Ocean Wave",
      name_en: "Ocean Wave Earrings",
      description_fr: "Magnifiques boucles d'oreilles en résine époxy avec effet vagues océaniques. Teintes de bleu turquoise et blanc avec paillettes dorées. Légères et élégantes, parfaites pour un look estival.",
      description_en: "Beautiful epoxy resin earrings with ocean wave effect. Turquoise blue and white tones with golden glitter. Lightweight and elegant, perfect for a summer look.",
      category: "bijoux-accessoires",
      price: 24.99,
      weight: 5,
      stock: 15,
      min_stock: 3,
      is_customizable: true,
      is_active: true,
      images: ["https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80"]
    },
    {
      name_fr: "Pendentif Fleurs Séchées",
      name_en: "Dried Flowers Pendant",
      description_fr: "Collier pendentif rond en résine transparente avec vraies fleurs séchées pressées. Chaque pièce est unique. Chaîne en acier inoxydable incluse.",
      description_en: "Round resin pendant with real pressed dried flowers. Each piece is unique. Stainless steel chain included.",
      category: "bijoux-accessoires",
      price: 32.99,
      weight: 10,
      stock: 12,
      min_stock: 3,
      is_customizable: false,
      is_active: true,
      images: ["https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80"]
    },
    {
      name_fr: "Bague Galaxy Cosmos",
      name_en: "Galaxy Cosmos Ring",
      description_fr: "Bague statement en résine avec effet galaxie époustouflant. Pigments violets, bleus et paillettes argentées créent un univers miniature sur votre doigt.",
      description_en: "Statement resin ring with stunning galaxy effect. Purple and blue pigments with silver glitter create a miniature universe on your finger.",
      category: "bijoux-accessoires",
      price: 28.99,
      weight: 8,
      stock: 10,
      min_stock: 2,
      is_customizable: true,
      is_active: true,
      images: ["https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80"]
    },
    {
      name_fr: "Barrettes Florales Ensemble",
      name_en: "Floral Hair Clips Set",
      description_fr: "Ensemble de 3 barrettes en résine avec inclusions florales et feuilles d'or. Design délicat et féminin. Parfait pour sublimer votre coiffure.",
      description_en: "Set of 3 resin hair clips with floral inclusions and gold leaf. Delicate and feminine design. Perfect to enhance your hairstyle.",
      category: "bijoux-accessoires",
      price: 35.99,
      weight: 15,
      stock: 8,
      min_stock: 2,
      is_customizable: false,
      is_active: true,
      images: ["https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=800&q=80"]
    },
    {
      name_fr: "Bracelet Géométrique Moderne",
      name_en: "Modern Geometric Bracelet",
      description_fr: "Bracelet manchette en résine avec motifs géométriques colorés. Design contemporain et audacieux. Ajustable pour tous les poignets.",
      description_en: "Resin cuff bracelet with colorful geometric patterns. Contemporary and bold design. Adjustable for all wrists.",
      category: "bijoux-accessoires",
      price: 29.99,
      weight: 12,
      stock: 10,
      min_stock: 2,
      is_customizable: true,
      is_active: true,
      images: ["https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80"]
    },

    // DÉCORATION MAISON
    {
      name_fr: "Plateau Géode Améthyste",
      name_en: "Amethyst Geode Tray",
      description_fr: "Magnifique plateau de service en résine avec effet géode améthyste. Cristaux en résine, feuilles d'or et pigments violets profonds. Parfait pour servir ou décorer.",
      description_en: "Beautiful serving tray with amethyst geode effect. Resin crystals, gold leaf and deep purple pigments. Perfect for serving or decorating.",
      category: "decoration-maison",
      price: 89.99,
      weight: 800,
      stock: 5,
      min_stock: 1,
      is_customizable: true,
      is_active: true,
      images: ["https://images.unsplash.com/photo-1634128221889-82ed6efebfc3?w=800&q=80"]
    },
    {
      name_fr: "Ensemble Sous-verres Ocean",
      name_en: "Ocean Coasters Set",
      description_fr: "Set de 4 sous-verres ronds en résine avec effet vagues océaniques. Teintes de bleu, turquoise et blanc avec touches dorées. Protection en feutre au dos.",
      description_en: "Set of 4 round resin coasters with ocean wave effect. Blue, turquoise and white tones with golden touches. Felt protection on back.",
      category: "decoration-maison",
      price: 45.99,
      weight: 200,
      stock: 12,
      min_stock: 3,
      is_customizable: true,
      is_active: true,
      images: ["https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&q=80"]
    },
    {
      name_fr: "Vide-poche Marbre Doré",
      name_en: "Gold Marble Catchall",
      description_fr: "Élégant vide-poche en résine avec effet marbre blanc et veines dorées. Idéal pour l'entrée, la chambre ou le bureau. Finition brillante luxueuse.",
      description_en: "Elegant resin catchall with white marble effect and gold veins. Ideal for entryway, bedroom or office. Luxurious glossy finish.",
      category: "decoration-maison",
      price: 38.99,
      weight: 300,
      stock: 10,
      min_stock: 2,
      is_customizable: false,
      is_active: true,
      images: ["https://images.unsplash.com/photo-1595246140406-fae9c9fatum?w=800&q=80"]
    },
    {
      name_fr: "Porte-encens Zen Botanique",
      name_en: "Botanical Zen Incense Holder",
      description_fr: "Support pour bâtons d'encens en résine transparente avec vraies feuilles et fleurs séchées. Design apaisant et naturel pour vos moments de détente.",
      description_en: "Incense stick holder in clear resin with real dried leaves and flowers. Soothing and natural design for your relaxation moments.",
      category: "decoration-maison",
      price: 26.99,
      weight: 150,
      stock: 15,
      min_stock: 3,
      is_customizable: false,
      is_active: true,
      images: ["https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&q=80"]
    },
    {
      name_fr: "Dessous de plat Abstrait Coloré",
      name_en: "Colorful Abstract Trivet",
      description_fr: "Grand dessous de plat en résine avec motif abstrait multicolore. Résistant à la chaleur jusqu'à 200°C. Œuvre d'art fonctionnelle pour votre table.",
      description_en: "Large resin trivet with multicolored abstract pattern. Heat resistant up to 200°C. Functional artwork for your table.",
      category: "decoration-maison",
      price: 34.99,
      weight: 250,
      stock: 8,
      min_stock: 2,
      is_customizable: true,
      is_active: true,
      images: ["https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=800&q=80"]
    },

    // OBJETS D'ART
    {
      name_fr: "Sculpture Vague Abstraite",
      name_en: "Abstract Wave Sculpture",
      description_fr: "Sculpture décorative en résine représentant une vague stylisée. Dégradé de bleus océaniques avec finition brillante. Pièce maîtresse pour votre décor.",
      description_en: "Decorative resin sculpture representing a stylized wave. Oceanic blue gradient with glossy finish. Statement piece for your decor.",
      category: "objets-art",
      price: 125.99,
      weight: 1200,
      stock: 3,
      min_stock: 1,
      is_customizable: false,
      is_active: true,
      images: ["https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&q=80"]
    },
    {
      name_fr: "Horloge Murale Géode",
      name_en: "Geode Wall Clock",
      description_fr: "Horloge murale unique en résine avec effet géode cristalline. Mécanisme silencieux. Design luxueux avec cristaux en résine et feuilles d'or.",
      description_en: "Unique resin wall clock with crystalline geode effect. Silent mechanism. Luxurious design with resin crystals and gold leaf.",
      category: "objets-art",
      price: 98.99,
      weight: 600,
      stock: 4,
      min_stock: 1,
      is_customizable: true,
      is_active: true,
      images: ["https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=800&q=80"]
    },
    {
      name_fr: "Cadre Photo Floral Romantique",
      name_en: "Romantic Floral Photo Frame",
      description_fr: "Cadre photo 5x7 pouces en résine avec fleurs pressées et paillettes délicates. Chaque cadre est une œuvre d'art unique pour vos souvenirs précieux.",
      description_en: "5x7 inch photo frame in resin with pressed flowers and delicate glitter. Each frame is a unique work of art for your precious memories.",
      category: "objets-art",
      price: 52.99,
      weight: 400,
      stock: 6,
      min_stock: 2,
      is_customizable: false,
      is_active: true,
      images: ["https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=800&q=80"]
    },
    {
      name_fr: "Tableau Ocean Art Grande Taille",
      name_en: "Large Ocean Art Panel",
      description_fr: "Tableau mural en résine 40x60cm avec technique ocean art. Vagues réalistes en bleu, turquoise et blanc avec mousse blanche. Prêt à accrocher.",
      description_en: "40x60cm resin wall panel with ocean art technique. Realistic waves in blue, turquoise and white with white foam. Ready to hang.",
      category: "objets-art",
      price: 189.99,
      weight: 2000,
      stock: 2,
      min_stock: 1,
      is_customizable: true,
      is_active: true,
      images: ["https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&q=80"]
    },

    // ACCESSOIRES QUOTIDIENS
    {
      name_fr: "Porte-clés Galaxie Brillant",
      name_en: "Glitter Galaxy Keychain",
      description_fr: "Porte-clés en résine avec effet galaxie scintillant. Forme ronde avec anneau en métal doré. Léger et résistant, parfait pour identifier vos clés.",
      description_en: "Resin keychain with sparkling galaxy effect. Round shape with gold metal ring. Lightweight and durable, perfect for identifying your keys.",
      category: "accessoires-quotidiens",
      price: 14.99,
      weight: 20,
      stock: 25,
      min_stock: 5,
      is_customizable: true,
      is_active: true,
      images: ["https://images.unsplash.com/photo-1591561954557-26941169b49e?w=800&q=80"]
    },
    {
      name_fr: "Support Téléphone Marbre",
      name_en: "Marble Phone Stand",
      description_fr: "Support élégant pour téléphone en résine effet marbre. Base stable avec angle de vue parfait. Compatible avec tous les smartphones.",
      description_en: "Elegant phone stand in marble effect resin. Stable base with perfect viewing angle. Compatible with all smartphones.",
      category: "accessoires-quotidiens",
      price: 22.99,
      weight: 180,
      stock: 12,
      min_stock: 3,
      is_customizable: true,
      is_active: true,
      images: ["https://images.unsplash.com/photo-1556656793-08538906a9f8?w=800&q=80"]
    },
    {
      name_fr: "Marque-pages Botanique Set",
      name_en: "Botanical Bookmarks Set",
      description_fr: "Ensemble de 3 marque-pages en résine fine avec vraies fleurs pressées. Design délicat et coloré. Parfait cadeau pour les amoureux de lecture.",
      description_en: "Set of 3 thin resin bookmarks with real pressed flowers. Delicate and colorful design. Perfect gift for book lovers.",
      category: "accessoires-quotidiens",
      price: 18.99,
      weight: 30,
      stock: 20,
      min_stock: 4,
      is_customizable: false,
      is_active: true,
      images: ["https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&q=80"]
    },
    {
      name_fr: "Poignées Tiroir Ocean Set de 4",
      name_en: "Ocean Drawer Pulls Set of 4",
      description_fr: "Set de 4 poignées de tiroir uniques en résine avec effet ocean. Quincaillerie incluse. Transformez vos meubles en pièces design!",
      description_en: "Set of 4 unique resin drawer pulls with ocean effect. Hardware included. Transform your furniture into designer pieces!",
      category: "accessoires-quotidiens",
      price: 56.99,
      weight: 400,
      stock: 6,
      min_stock: 2,
      is_customizable: true,
      is_active: true,
      images: ["https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&q=80"]
    }
  ];

  const handleAddProducts = async () => {
    setLoading(true);
    setResults([]);
    setShowResults(true);
    
    try {
      const response = await fetch('/api/products/init', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setResults([{
          name: 'Initialisation',
          status: 'success',
          message: `${data.count} produits ont été ajoutés avec succès. Les produits sont initialement désactivés. L'atelier peut les activer une fois produits.`
        }]);
      } else {
        setResults([{
          name: 'Initialisation',
          status: 'error',
          message: data.message || data.error || 'Erreur inconnue'
        }]);
      }
    } catch (error) {
      setResults([{
        name: 'Initialisation',
        status: 'error',
        message: error.message
      }]);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-3 rounded-xl">
              <Package className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Missa Creations</h1>
              <p className="text-gray-600">Gestionnaire de produits en résine</p>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              📦 {products.length} produits prêts à être ajoutés
            </h2>
            <p className="text-gray-700 mb-4">
              Collection complète de bijoux, décoration, objets d'art et accessoires en résine époxy avec images haute qualité.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="bg-white rounded-lg p-3">
                <div className="font-semibold text-purple-600">Bijoux</div>
                <div className="text-gray-600">5 produits</div>
              </div>
              <div className="bg-white rounded-lg p-3">
                <div className="font-semibold text-blue-600">Décoration</div>
                <div className="text-gray-600">5 produits</div>
              </div>
              <div className="bg-white rounded-lg p-3">
                <div className="font-semibold text-pink-600">Objets d'art</div>
                <div className="text-gray-600">4 produits</div>
              </div>
              <div className="bg-white rounded-lg p-3">
                <div className="font-semibold text-green-600">Accessoires</div>
                <div className="text-gray-600">4 produits</div>
              </div>
            </div>
          </div>

          <button
            onClick={handleAddProducts}
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                Ajout en cours...
              </>
            ) : (
              <>
                <Upload className="w-6 h-6" />
                Ajouter tous les produits à la base de données
              </>
            )}
          </button>
        </div>

        {/* Results */}
        {showResults && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Résultats de l'ajout</h3>
            <div className="space-y-3">
              {results.map((result, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-3 p-4 rounded-lg ${
                    result.status === 'success'
                      ? 'bg-green-50 border border-green-200'
                      : 'bg-red-50 border border-red-200'
                  }`}
                >
                  {result.status === 'success' ? (
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <div className="font-semibold text-gray-800">{result.name}</div>
                    <div className={`text-sm ${
                      result.status === 'success' ? 'text-green-700' : 'text-red-700'
                    }`}>
                      {result.message}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Preview Gallery */}
        <div className="mt-8 bg-white rounded-2xl shadow-xl p-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Aperçu des produits</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <div key={index} className="group bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
                <div className="relative h-64 overflow-hidden bg-gray-200">
                  <img
                    src={product.images[0]}
                    alt={product.name_fr}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full text-sm font-semibold text-purple-600 shadow-lg">
                    {product.price.toFixed(2)} $
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="font-bold text-gray-800 mb-1 line-clamp-1">{product.name_fr}</h4>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description_fr}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                      Stock: {product.stock}
                    </span>
                    <span className="capitalize">{product.category.replace('-', ' ')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MissaProductsManager;

