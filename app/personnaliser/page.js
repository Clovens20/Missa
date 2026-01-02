'use client'

import { useState, useRef, useEffect } from 'react'
import { Upload, X, Plus, Minus, Trash2, Move, Type, Palette, Sparkles, RotateCw, ZoomIn, ZoomOut, Lock, Unlock, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'

export default function PersonnalisationPage() {
  const router = useRouter()
  const { toast } = useToast()
  
  // Produit par défaut si aucun produit n'est passé
  const defaultProduct = {
    _id: 'custom',
    name_fr: 'Création Personnalisée',
    name_en: 'Custom Creation',
    price: 39.99,
    images: ['https://images.unsplash.com/photo-1612672358776-15458bfd9869?w=800&q=80']
  }

  const [product] = useState(defaultProduct)
  const [productImage, setProductImage] = useState(product?.images?.[0] || 'https://images.unsplash.com/photo-1612672358776-15458bfd9869?w=800&q=80')
  const [baseColor, setBaseColor] = useState({ type: 'transparent', opacity: 100 })
  const [glitters, setGlitters] = useState([])
  const [flowers, setFlowers] = useState([])
  const [texts, setTexts] = useState([])
  const [selectedElement, setSelectedElement] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const canvasRef = useRef(null)
  const [language, setLanguage] = useState('fr')

  // Couleurs de base disponibles
  const baseColors = [
    { name: 'Transparent', value: 'transparent', hex: '#FFFFFF' },
    { name: 'Bleu Océan', value: 'ocean', hex: '#0891B2' },
    { name: 'Rose Bonbon', value: 'pink', hex: '#EC4899' },
    { name: 'Violet Mystique', value: 'purple', hex: '#A855F7' },
    { name: 'Noir Élégant', value: 'black', hex: '#1F2937' },
    { name: 'Or Scintillant', value: 'gold', hex: '#F59E0B' },
    { name: 'Vert Émeraude', value: 'green', hex: '#10B981' },
    { name: 'Rouge Passion', value: 'red', hex: '#EF4444' },
    { name: 'Bleu Ciel', value: 'sky', hex: '#0EA5E9' },
    { name: 'Corail', value: 'coral', hex: '#FB7185' },
  ]

  // Types de paillettes
  const glitterTypes = [
    { name: 'Or Classique', value: 'gold-classic', color: '#FFD700', size: 'small' },
    { name: 'Or Fin', value: 'gold-fine', color: '#FFA500', size: 'tiny' },
    { name: 'Argent', value: 'silver', color: '#C0C0C0', size: 'small' },
    { name: 'Holographique', value: 'holo', color: 'rainbow', size: 'medium' },
    { name: 'Rose Gold', value: 'rose-gold', color: '#E0BFB8', size: 'small' },
    { name: 'Cuivre', value: 'copper', color: '#B87333', size: 'small' },
    { name: 'Platine', value: 'platinum', color: '#E5E4E2', size: 'tiny' },
    { name: 'Arc-en-ciel', value: 'rainbow', color: 'rainbow', size: 'medium' },
    { name: 'Multicolore', value: 'multi', color: 'multi', size: 'medium' },
    { name: 'Cristal', value: 'crystal', color: '#F0F8FF', size: 'large' },
  ]

  // Types de fleurs séchées
  const flowerTypes = [
    { name: 'Lavande', value: 'lavender', emoji: '🌸', color: '#9333EA' },
    { name: 'Rose Rouge', value: 'rose-red', emoji: '🌹', color: '#DC2626' },
    { name: 'Rose Rose', value: 'rose-pink', emoji: '🌹', color: '#EC4899' },
    { name: 'Marguerite', value: 'daisy', emoji: '🌼', color: '#FFF' },
    { name: 'Tournesol Mini', value: 'sunflower', emoji: '🌻', color: '#F59E0B' },
    { name: 'Cerisier', value: 'cherry', emoji: '🌸', color: '#FFC0CB' },
    { name: 'Orchidée', value: 'orchid', emoji: '🌺', color: '#C084FC' },
    { name: 'Jasmin', value: 'jasmine', emoji: '🤍', color: '#FFF' },
    { name: 'Hibiscus', value: 'hibiscus', emoji: '🌺', color: '#EF4444' },
    { name: 'Eucalyptus', value: 'eucalyptus', emoji: '🌿', color: '#10B981' },
  ]

  // Ajouter une paillette
  const addGlitter = (type) => {
    const glitterType = glitterTypes.find(g => g.value === type)
    setGlitters([...glitters, {
      id: Date.now(),
      type: type,
      x: 50,
      y: 50,
      opacity: 70,
      density: 50,
      size: glitterType.size,
      color: glitterType.color
    }])
  }

  // Ajouter une fleur
  const addFlower = (type) => {
    const flowerType = flowerTypes.find(f => f.value === type)
    setFlowers([...flowers, {
      id: Date.now(),
      type: type,
      x: 50,
      y: 50,
      size: 60,
      rotation: 0,
      opacity: 100,
      emoji: flowerType.emoji
    }])
  }

  // Ajouter un texte/initiale
  const addText = () => {
    setTexts([...texts, {
      id: Date.now(),
      content: 'M',
      x: 50,
      y: 50,
      fontSize: 80,
      color: '#EC4899',
      fontFamily: 'serif',
      fontWeight: 'bold',
      rotation: 0,
      opacity: 100,
      shadow: true,
      outline: false
    }])
  }

  // Supprimer un élément
  const deleteElement = (type, id) => {
    if (type === 'glitter') setGlitters(glitters.filter(g => g.id !== id))
    if (type === 'flower') setFlowers(flowers.filter(f => f.id !== id))
    if (type === 'text') setTexts(texts.filter(t => t.id !== id))
    setSelectedElement(null)
  }

  // Mettre à jour un élément
  const updateElement = (type, id, updates) => {
    if (type === 'glitter') {
      setGlitters(glitters.map(g => g.id === id ? { ...g, ...updates } : g))
    }
    if (type === 'flower') {
      setFlowers(flowers.map(f => f.id === id ? { ...f, ...updates } : f))
    }
    if (type === 'text') {
      setTexts(texts.map(t => t.id === id ? { ...t, ...updates } : t))
    }
  }

  // Gestion du drag & drop
  const handleMouseDown = (e, element, type) => {
    if (e.button !== 0) return
    setSelectedElement({ ...element, type })
    setIsDragging(true)
    const rect = canvasRef.current.getBoundingClientRect()
    const offsetX = e.clientX - rect.left - (element.x / 100) * rect.width
    const offsetY = e.clientY - rect.top - (element.y / 100) * rect.height
    setDragOffset({ x: offsetX, y: offsetY })
  }

  const handleMouseMove = (e) => {
    if (!isDragging || !selectedElement) return
    const rect = canvasRef.current.getBoundingClientRect()
    const newX = ((e.clientX - rect.left - dragOffset.x) / rect.width) * 100
    const newY = ((e.clientY - rect.top - dragOffset.y) / rect.height) * 100
    updateElement(selectedElement.type, selectedElement.id, {
      x: Math.max(0, Math.min(100, newX)),
      y: Math.max(0, Math.min(100, newY))
    })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, selectedElement, dragOffset])

  // Charger une image personnalisée
  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => setProductImage(e.target.result)
      reader.readAsDataURL(file)
    }
  }

  // Sauvegarder la personnalisation
  const saveCustomization = () => {
    const customizationData = {
      baseColor,
      glitters,
      flowers,
      texts,
      productImage
    }
    
    // Sauvegarder dans localStorage pour récupération dans le panier
    const cartItem = {
      id: Date.now(),
      productId: product._id,
      name: language === 'fr' ? product.name_fr : product.name_en,
      price: product.price + 10, // Prix de base + personnalisation
      image: productImage,
      customization: customizationData
    }
    
    const existingCart = JSON.parse(localStorage.getItem('missaCart') || '[]')
    existingCart.push(cartItem)
    localStorage.setItem('missaCart', JSON.stringify(existingCart))
    
    toast({
      title: language === 'fr' ? '✅ Ajouté au panier !' : '✅ Added to cart!',
      description: language === 'fr' ? 'Votre création personnalisée a été ajoutée' : 'Your custom creation has been added'
    })
    
    // Rediriger vers la page d'accueil
    router.push('/')
  }

  const handleClose = () => {
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 p-4">
      {/* Bouton retour */}
      <button
        onClick={handleClose}
        className="mb-4 flex items-center gap-2 text-gray-600 hover:text-pink-500 transition"
      >
        <X className="w-5 h-5" />
        <span>{language === 'fr' ? 'Retour aux produits' : 'Back to products'}</span>
      </button>
      
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mb-2">
            ✨ {language === 'fr' ? 'Studio de Personnalisation Avancé' : 'Advanced Customization Studio'}
          </h1>
          <p className="text-gray-600">{language === 'fr' ? 'Créez votre bijou unique avec un contrôle total sur chaque détail' : 'Create your unique jewelry with total control over every detail'}</p>
        </div>

        <div className="grid lg:grid-cols-[1fr,400px] gap-6">
          {/* Zone de prévisualisation */}
          <div className="space-y-4">
            <Card className="shadow-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-pink-500" />
                  {language === 'fr' ? 'Aperçu en Temps Réel' : 'Real-time Preview'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div 
                  ref={canvasRef}
                  className="relative w-full aspect-square bg-gray-100 rounded-xl overflow-hidden shadow-lg cursor-crosshair"
                  style={{ 
                    backgroundImage: `url(${productImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  {/* Overlay de couleur de base */}
                  {baseColor.type !== 'transparent' && (
                    <div 
                      className="absolute inset-0 mix-blend-overlay"
                      style={{ 
                        backgroundColor: baseColors.find(c => c.value === baseColor.type)?.hex,
                        opacity: baseColor.opacity / 100
                      }}
                    />
                  )}

                  {/* Paillettes */}
                  {glitters.map(glitter => (
                    <div
                      key={glitter.id}
                      className={`absolute cursor-move transition-transform hover:scale-110 ${selectedElement?.id === glitter.id ? 'ring-4 ring-pink-500' : ''}`}
                      style={{
                        left: `${glitter.x}%`,
                        top: `${glitter.y}%`,
                        width: '100px',
                        height: '100px',
                        transform: 'translate(-50%, -50%)',
                        opacity: glitter.opacity / 100
                      }}
                      onMouseDown={(e) => handleMouseDown(e, glitter, 'glitter')}
                    >
                      {/* Effet de paillettes */}
                      <div className="relative w-full h-full">
                        {[...Array(glitter.density)].map((_, i) => {
                          const size = glitter.size === 'tiny' ? 2 : glitter.size === 'small' ? 3 : glitter.size === 'medium' ? 4 : 6
                          return (
                            <div
                              key={i}
                              className="absolute rounded-full animate-pulse"
                              style={{
                                width: `${size}px`,
                                height: `${size}px`,
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                backgroundColor: glitter.color === 'rainbow' ? `hsl(${Math.random() * 360}, 100%, 50%)` : glitter.color,
                                animationDelay: `${Math.random() * 2}s`,
                                animationDuration: `${1 + Math.random()}s`,
                                boxShadow: '0 0 4px rgba(255,255,255,0.8)'
                              }}
                            />
                          )
                        })}
                      </div>
                    </div>
                  ))}

                  {/* Fleurs */}
                  {flowers.map(flower => (
                    <div
                      key={flower.id}
                      className={`absolute cursor-move transition-transform hover:scale-110 ${selectedElement?.id === flower.id ? 'ring-4 ring-pink-500 rounded-full' : ''}`}
                      style={{
                        left: `${flower.x}%`,
                        top: `${flower.y}%`,
                        fontSize: `${flower.size}px`,
                        transform: `translate(-50%, -50%) rotate(${flower.rotation}deg)`,
                        opacity: flower.opacity / 100,
                        filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
                      }}
                      onMouseDown={(e) => handleMouseDown(e, flower, 'flower')}
                    >
                      {flower.emoji}
                    </div>
                  ))}

                  {/* Textes/Initiales */}
                  {texts.map(text => (
                    <div
                      key={text.id}
                      className={`absolute cursor-move transition-transform hover:scale-105 ${selectedElement?.id === text.id ? 'ring-4 ring-pink-500' : ''}`}
                      style={{
                        left: `${text.x}%`,
                        top: `${text.y}%`,
                        fontSize: `${text.fontSize}px`,
                        color: text.color,
                        fontFamily: text.fontFamily,
                        fontWeight: text.fontWeight,
                        transform: `translate(-50%, -50%) rotate(${text.rotation}deg)`,
                        opacity: text.opacity / 100,
                        textShadow: text.shadow ? '0 4px 12px rgba(0,0,0,0.5)' : 'none',
                        WebkitTextStroke: text.outline ? '2px white' : 'none'
                      }}
                      onMouseDown={(e) => handleMouseDown(e, text, 'text')}
                    >
                      {text.content}
                    </div>
                  ))}

                  {/* Indicateur d'élément sélectionné */}
                  {selectedElement && (
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg">
                      <p className="text-sm font-semibold text-gray-800">
                        {selectedElement.type === 'glitter' && '✨ Paillettes'}
                        {selectedElement.type === 'flower' && '🌸 Fleur'}
                        {selectedElement.type === 'text' && '📝 Texte'}
                      </p>
                      <p className="text-xs text-gray-600">{language === 'fr' ? 'Cliquez pour modifier' : 'Click to edit'}</p>
                    </div>
                  )}
                </div>

                <div className="mt-4 flex gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="product-image"
                  />
                  <label htmlFor="product-image" className="cursor-pointer">
                    <Button variant="outline" className="w-full" asChild>
                      <span>
                        <Upload className="w-4 h-4 mr-2" />
                        {language === 'fr' ? 'Changer l\'image de base' : 'Change base image'}
                      </span>
                    </Button>
                  </label>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Panneau de contrôle */}
          <div className="space-y-4">
            <Card className="shadow-xl">
              <CardContent className="pt-6">
                <Tabs defaultValue="base" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="base">🎨 {language === 'fr' ? 'Base' : 'Base'}</TabsTrigger>
                    <TabsTrigger value="glitter">✨ {language === 'fr' ? 'Paillettes' : 'Glitter'}</TabsTrigger>
                    <TabsTrigger value="flowers">🌸 {language === 'fr' ? 'Fleurs' : 'Flowers'}</TabsTrigger>
                    <TabsTrigger value="text">📝 {language === 'fr' ? 'Texte' : 'Text'}</TabsTrigger>
                  </TabsList>

                  {/* Couleur de base */}
                  <TabsContent value="base" className="space-y-4">
                    <div>
                      <Label className="text-base font-semibold mb-3 block">{language === 'fr' ? 'Couleur de Base' : 'Base Color'}</Label>
                      <div className="grid grid-cols-5 gap-2 mb-4">
                        {baseColors.map(color => (
                          <button
                            key={color.value}
                            onClick={() => setBaseColor({ ...baseColor, type: color.value })}
                            className={`w-full aspect-square rounded-lg border-2 transition-all hover:scale-110 ${
                              baseColor.type === color.value ? 'border-pink-500 ring-4 ring-pink-200' : 'border-gray-300'
                            }`}
                            style={{ backgroundColor: color.hex }}
                            title={color.name}
                          />
                        ))}
                      </div>
                      <Label>{language === 'fr' ? 'Opacité' : 'Opacity'}: {baseColor.opacity}%</Label>
                      <Slider
                        value={[baseColor.opacity]}
                        onValueChange={(v) => setBaseColor({ ...baseColor, opacity: v[0] })}
                        min={0}
                        max={100}
                        className="mt-2"
                      />
                    </div>
                  </TabsContent>

                  {/* Paillettes */}
                  <TabsContent value="glitter" className="space-y-4">
                    <div>
                      <Label className="text-base font-semibold mb-3 block">{language === 'fr' ? 'Ajouter des Paillettes' : 'Add Glitter'}</Label>
                      <div className="grid grid-cols-2 gap-2 mb-4 max-h-64 overflow-y-auto">
                        {glitterTypes.map(glitter => (
                          <Button
                            key={glitter.value}
                            onClick={() => addGlitter(glitter.value)}
                            variant="outline"
                            className="justify-start"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            {glitter.name}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {selectedElement?.type === 'glitter' && (
                      <div className="border-t pt-4 space-y-3">
                        <h4 className="font-bold">{language === 'fr' ? 'Éditer les Paillettes' : 'Edit Glitter'}</h4>
                        <div>
                          <Label>{language === 'fr' ? 'Densité' : 'Density'}: {selectedElement.density}</Label>
                          <Slider
                            value={[selectedElement.density]}
                            onValueChange={(v) => updateElement('glitter', selectedElement.id, { density: v[0] })}
                            min={10}
                            max={100}
                          />
                        </div>
                        <div>
                          <Label>{language === 'fr' ? 'Opacité' : 'Opacity'}: {selectedElement.opacity}%</Label>
                          <Slider
                            value={[selectedElement.opacity]}
                            onValueChange={(v) => updateElement('glitter', selectedElement.id, { opacity: v[0] })}
                            min={0}
                            max={100}
                          />
                        </div>
                        <Button
                          variant="destructive"
                          className="w-full"
                          onClick={() => deleteElement('glitter', selectedElement.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          {language === 'fr' ? 'Supprimer' : 'Delete'}
                        </Button>
                      </div>
                    )}
                  </TabsContent>

                  {/* Fleurs */}
                  <TabsContent value="flowers" className="space-y-4">
                    <div>
                      <Label className="text-base font-semibold mb-3 block">{language === 'fr' ? 'Ajouter une Fleur' : 'Add Flower'}</Label>
                      <div className="grid grid-cols-2 gap-2 mb-4 max-h-64 overflow-y-auto">
                        {flowerTypes.map(flower => (
                          <Button
                            key={flower.value}
                            onClick={() => addFlower(flower.value)}
                            variant="outline"
                            className="justify-start"
                          >
                            <span className="mr-2">{flower.emoji}</span>
                            {flower.name}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {selectedElement?.type === 'flower' && (
                      <div className="border-t pt-4 space-y-3">
                        <h4 className="font-bold">{language === 'fr' ? 'Éditer la Fleur' : 'Edit Flower'} {selectedElement.emoji}</h4>
                        <div>
                          <Label>{language === 'fr' ? 'Taille' : 'Size'}: {selectedElement.size}px</Label>
                          <Slider
                            value={[selectedElement.size]}
                            onValueChange={(v) => updateElement('flower', selectedElement.id, { size: v[0] })}
                            min={20}
                            max={150}
                          />
                        </div>
                        <div>
                          <Label>{language === 'fr' ? 'Rotation' : 'Rotation'}: {selectedElement.rotation}°</Label>
                          <Slider
                            value={[selectedElement.rotation]}
                            onValueChange={(v) => updateElement('flower', selectedElement.id, { rotation: v[0] })}
                            min={0}
                            max={360}
                          />
                        </div>
                        <div>
                          <Label>{language === 'fr' ? 'Opacité' : 'Opacity'}: {selectedElement.opacity}%</Label>
                          <Slider
                            value={[selectedElement.opacity]}
                            onValueChange={(v) => updateElement('flower', selectedElement.id, { opacity: v[0] })}
                            min={0}
                            max={100}
                          />
                        </div>
                        <Button
                          variant="destructive"
                          className="w-full"
                          onClick={() => deleteElement('flower', selectedElement.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          {language === 'fr' ? 'Supprimer' : 'Delete'}
                        </Button>
                      </div>
                    )}
                  </TabsContent>

                  {/* Texte/Initiales */}
                  <TabsContent value="text" className="space-y-4">
                    <Button onClick={addText} className="w-full bg-gradient-to-r from-pink-500 to-purple-600">
                      <Plus className="w-4 h-4 mr-2" />
                      {language === 'fr' ? 'Ajouter du Texte / Initiale' : 'Add Text / Initial'}
                    </Button>

                    {selectedElement?.type === 'text' && (
                      <div className="border-t pt-4 space-y-3">
                        <h4 className="font-bold">{language === 'fr' ? 'Éditer le Texte' : 'Edit Text'}</h4>
                        <div>
                          <Label>{language === 'fr' ? 'Texte' : 'Text'}</Label>
                          <Input
                            value={selectedElement.content}
                            onChange={(e) => updateElement('text', selectedElement.id, { content: e.target.value })}
                            maxLength={3}
                          />
                        </div>
                        <div>
                          <Label>{language === 'fr' ? 'Couleur' : 'Color'}</Label>
                          <input
                            type="color"
                            value={selectedElement.color}
                            onChange={(e) => updateElement('text', selectedElement.id, { color: e.target.value })}
                            className="w-full h-12 rounded cursor-pointer"
                          />
                        </div>
                        <div>
                          <div className="flex justify-between items-center mb-3">
                            <Label className="text-base font-semibold">{language === 'fr' ? 'Taille du texte' : 'Text Size'}</Label>
                            <div className="flex items-center gap-2">
                              <Button
                                size="icon"
                                variant="outline"
                                className="h-8 w-8"
                                onClick={() => updateElement('text', selectedElement.id, { fontSize: Math.max(10, selectedElement.fontSize - 5) })}
                              >
                                <Minus className="w-4 h-4" />
                              </Button>
                              <span className="text-lg font-bold text-pink-500 bg-pink-50 px-4 py-1 rounded-full min-w-[80px] text-center">
                                {selectedElement.fontSize}px
                              </span>
                              <Button
                                size="icon"
                                variant="outline"
                                className="h-8 w-8"
                                onClick={() => updateElement('text', selectedElement.id, { fontSize: Math.min(300, selectedElement.fontSize + 5) })}
                              >
                                <Plus className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          <Slider
                            value={[selectedElement.fontSize]}
                            onValueChange={(v) => updateElement('text', selectedElement.id, { fontSize: v[0] })}
                            min={10}
                            max={300}
                            step={1}
                            className="cursor-pointer"
                          />
                          <div className="flex justify-between text-xs text-gray-500 mt-2">
                            <span>{language === 'fr' ? 'Très petit (10px)' : 'Very small (10px)'}</span>
                            <span>{language === 'fr' ? 'Énorme (300px)' : 'Huge (300px)'}</span>
                          </div>
                        </div>
                        <div>
                          <Label>{language === 'fr' ? 'Rotation' : 'Rotation'}: {selectedElement.rotation}°</Label>
                          <Slider
                            value={[selectedElement.rotation]}
                            onValueChange={(v) => updateElement('text', selectedElement.id, { rotation: v[0] })}
                            min={0}
                            max={360}
                          />
                        </div>
                        <div>
                          <Label>{language === 'fr' ? 'Police' : 'Font'}</Label>
                          <Select
                            value={selectedElement.fontFamily}
                            onValueChange={(v) => updateElement('text', selectedElement.id, { fontFamily: v })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="serif">Serif</SelectItem>
                              <SelectItem value="sans-serif">Sans Serif</SelectItem>
                              <SelectItem value="monospace">Monospace</SelectItem>
                              <SelectItem value="cursive">Cursive</SelectItem>
                              <SelectItem value="fantasy">Fantasy</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>{language === 'fr' ? 'Opacité' : 'Opacity'}: {selectedElement.opacity}%</Label>
                          <Slider
                            value={[selectedElement.opacity]}
                            onValueChange={(v) => updateElement('text', selectedElement.id, { opacity: v[0] })}
                            min={0}
                            max={100}
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant={selectedElement.shadow ? "default" : "outline"}
                            onClick={() => updateElement('text', selectedElement.id, { shadow: !selectedElement.shadow })}
                            className="flex-1"
                          >
                            {language === 'fr' ? 'Ombre' : 'Shadow'}
                          </Button>
                          <Button
                            variant={selectedElement.outline ? "default" : "outline"}
                            onClick={() => updateElement('text', selectedElement.id, { outline: !selectedElement.outline })}
                            className="flex-1"
                          >
                            {language === 'fr' ? 'Contour' : 'Outline'}
                          </Button>
                        </div>
                        <Button
                          variant="destructive"
                          className="w-full"
                          onClick={() => deleteElement('text', selectedElement.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          {language === 'fr' ? 'Supprimer' : 'Delete'}
                        </Button>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Actions finales */}
            <Card className="shadow-xl">
              <CardContent className="pt-6 space-y-3">
                <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-4 rounded-lg">
                  <p className="font-bold text-lg mb-2">💎 {language === 'fr' ? 'Votre Création Unique' : 'Your Unique Creation'}</p>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>✨ {glitters.length} {language === 'fr' ? 'effet(s) de paillettes' : 'glitter effect(s)'}</p>
                    <p>🌸 {flowers.length} {language === 'fr' ? 'fleur(s) séchée(s)' : 'dried flower(s)'}</p>
                    <p>📝 {texts.length} {language === 'fr' ? 'texte(s) / initiale(s)' : 'text(s) / initial(s)'}</p>
                  </div>
                </div>
                <Button className="w-full h-14 bg-gradient-to-r from-pink-500 to-purple-600 text-lg font-bold" onClick={saveCustomization}>
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  {language === 'fr' ? 'Ajouter au Panier' : 'Add to Cart'} - {(product?.price || 39.99) + 10}$ CAD
                </Button>
                <p className="text-xs text-center text-gray-500">
                  ⏱️ {language === 'fr' ? 'Délai de fabrication: 5-7 jours ouvrables' : 'Production time: 5-7 business days'}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
