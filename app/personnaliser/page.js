'use client'

import { useState, useRef, useEffect } from 'react'
import { Upload, Download, RotateCcw, Type, Palette, Move } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase'

export default function PersonnalisationPage() {
  const [image, setImage] = useState(null)
  const [text, setText] = useState('Missa Créations')
  const [textColor, setTextColor] = useState('#EC4899')
  const [fontSize, setFontSize] = useState([48])
  const [textPosition, setTextPosition] = useState([50])
  const canvasRef = useRef(null)
  const fileInputRef = useRef(null)
  const { toast } = useToast()

  // Dessiner sur le canvas
  useEffect(() => {
    if (!image || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const img = new Image()
    
    img.onload = () => {
      // Ajuster la taille du canvas
      const maxWidth = 800
      const maxHeight = 600
      let width = img.width
      let height = img.height

      if (width > maxWidth) {
        height = (height * maxWidth) / width
        width = maxWidth
      }
      if (height > maxHeight) {
        width = (width * maxHeight) / height
        height = maxHeight
      }

      canvas.width = width
      canvas.height = height

      // Dessiner l'image
      ctx.clearRect(0, 0, width, height)
      ctx.drawImage(img, 0, 0, width, height)

      // Ajouter le texte
      if (text) {
        ctx.font = `bold ${fontSize[0]}px "Inter", sans-serif`
        ctx.fillStyle = textColor
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        
        // Position verticale basée sur le slider (0-100% de la hauteur)
        const yPosition = (textPosition[0] / 100) * height
        
        // Ajouter une ombre pour meilleure lisibilité
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)'
        ctx.shadowBlur = 10
        ctx.shadowOffsetX = 2
        ctx.shadowOffsetY = 2
        
        ctx.fillText(text, width / 2, yPosition)
      }
    }
    
    img.src = image
  }, [image, text, textColor, fontSize, textPosition])

  // Charger une image
  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast({ title: '⚠️ Fichier invalide', description: 'Veuillez sélectionner une image', variant: 'destructive' })
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({ title: '⚠️ Image trop grande', description: 'Maximum 10MB', variant: 'destructive' })
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      setImage(e.target.result)
      toast({ title: '✅ Image chargée', description: 'Personnalisez votre création !' })
    }
    reader.readAsDataURL(file)
  }

  // Télécharger l'image finale
  const handleDownload = async () => {
    if (!canvasRef.current || !image) {
      toast({ title: '⚠️ Aucune image', description: 'Veuillez d\'abord charger une image', variant: 'destructive' })
      return
    }

    const canvas = canvasRef.current
    
    try {
      // Convertir en blob
      canvas.toBlob(async (blob) => {
        // Télécharger localement
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `missa-creation-${Date.now()}.png`
        link.click()
        URL.revokeObjectURL(url)

        // Sauvegarder dans Supabase (optionnel)
        try {
          const fileName = `custom-${Date.now()}.png`
          const { data, error } = await supabase.storage
            .from('creations')
            .upload(fileName, blob, {
              contentType: 'image/png',
              cacheControl: '3600',
              upsert: false
            })

          if (error) {
            console.log('Supabase upload info:', error.message)
          } else {
            console.log('Sauvegardé dans Supabase:', data)
          }
        } catch (err) {
          console.log('Supabase non configuré ou bucket manquant')
        }

        toast({ title: '✅ Image téléchargée !', description: 'Votre création est prête !' })
      }, 'image/png', 1.0)
    } catch (error) {
      toast({ title: '❌ Erreur', description: 'Impossible de télécharger l\'image', variant: 'destructive' })
    }
  }

  // Réinitialiser
  const handleReset = () => {
    setImage(null)
    setText('Missa Créations')
    setTextColor('#EC4899')
    setFontSize([48])
    setTextPosition([50])
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    toast({ title: '🔄 Réinitialisé', description: 'Recommencez votre création !' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
                Personnalisation Missa Créations
              </h1>
              <p className="text-gray-600 mt-1">Créez votre bijou unique en résine</p>
            </div>
            <a href="/" className="text-sm text-gray-600 hover:text-pink-500 transition">
              ← Retour à l'accueil
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Colonne Gauche - Aperçu */}
          <div>
            <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Palette className="w-6 h-6 text-pink-500" />
                  Aperçu de votre création
                </CardTitle>
                <CardDescription>Voir le résultat en temps réel</CardDescription>
              </CardHeader>
              <CardContent>
                {!image ? (
                  <div className="aspect-[4/3] bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-pink-300">
                    <Upload className="w-16 h-16 text-pink-400 mb-4" />
                    <p className="text-gray-600 text-lg font-medium">Chargez une image pour commencer</p>
                    <p className="text-gray-400 text-sm mt-2">Format : JPG, PNG (max 10MB)</p>
                  </div>
                ) : (
                  <div className="relative">
                    <canvas
                      ref={canvasRef}
                      className="w-full rounded-xl shadow-lg border-4 border-white"
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Boutons d'action */}
            <div className="mt-6 flex gap-4">
              <Button
                onClick={handleDownload}
                disabled={!image}
                size="lg"
                className="flex-1 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 hover:from-pink-600 hover:via-purple-600 hover:to-blue-600 text-white font-bold py-6 text-lg shadow-xl"
              >
                <Download className="w-5 h-5 mr-2" />
                Télécharger
              </Button>
              <Button
                onClick={handleReset}
                variant="outline"
                size="lg"
                className="border-2 border-gray-300 hover:border-pink-500 hover:bg-pink-50 py-6"
              >
                <RotateCcw className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Colonne Droite - Contrôles */}
          <div className="space-y-6">
            {/* Upload Image */}
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5 text-purple-500" />
                  Charger votre image
                </CardTitle>
              </CardHeader>
              <CardContent>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="block w-full cursor-pointer"
                >
                  <div className="border-2 border-dashed border-purple-300 rounded-xl p-8 text-center hover:border-purple-500 hover:bg-purple-50 transition-all">
                    <Upload className="w-12 h-12 mx-auto mb-3 text-purple-400" />
                    <p className="font-semibold text-gray-700">Cliquez pour choisir une image</p>
                    <p className="text-sm text-gray-500 mt-1">ou glissez-la ici</p>
                  </div>
                </label>
              </CardContent>
            </Card>

            {/* Texte */}
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Type className="w-5 h-5 text-pink-500" />
                  Texte personnalisé
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="text" className="text-base font-semibold mb-2 block">
                    Votre texte
                  </Label>
                  <Input
                    id="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Entrez votre texte..."
                    className="text-lg py-6 border-2 focus:border-pink-500"
                    maxLength={50}
                  />
                  <p className="text-xs text-gray-500 mt-1">{text.length} / 50 caractères</p>
                </div>

                <div>
                  <Label htmlFor="color" className="text-base font-semibold mb-3 block">
                    Couleur du texte
                  </Label>
                  
                  {/* Palette de couleurs prédéfinies */}
                  <div className="grid grid-cols-9 gap-2 mb-4">
                    {[
                      // Rose
                      '#EC4899', '#F472B6', '#FB7185',
                      // Violet
                      '#A855F7', '#C084FC', '#8B5CF6',
                      // Bleu
                      '#3B82F6', '#60A5FA', '#06B6D4',
                      // Vert
                      '#10B981', '#34D399', '#22C55E',
                      // Jaune/Or
                      '#FBBF24', '#FCD34D', '#F59E0B',
                      // Rouge
                      '#EF4444', '#F87171', '#DC2626',
                      // Orange
                      '#F97316', '#FB923C', '#EA580C',
                      // Noir/Gris
                      '#000000', '#1F2937', '#374151',
                      // Blanc/Clair
                      '#FFFFFF', '#F9FAFB', '#F3F4F6'
                    ].map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setTextColor(color)}
                        className={`w-10 h-10 rounded-lg border-2 transition-all hover:scale-110 ${
                          textColor.toUpperCase() === color.toUpperCase()
                            ? 'border-pink-500 ring-4 ring-pink-200 scale-110'
                            : 'border-gray-300 hover:border-gray-400'
                        } ${color === '#FFFFFF' || color === '#F9FAFB' || color === '#F3F4F6' ? 'border-gray-400' : ''}`}
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>

                  {/* Color picker personnalisé */}
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600 font-medium">Ou choisissez une couleur personnalisée :</p>
                    <div className="flex gap-3 items-center">
                      <input
                        type="color"
                        id="color"
                        value={textColor}
                        onChange={(e) => setTextColor(e.target.value)}
                        className="w-16 h-16 rounded-lg border-2 border-gray-300 cursor-pointer hover:border-pink-500 transition"
                      />
                      <Input
                        value={textColor}
                        onChange={(e) => setTextColor(e.target.value)}
                        className="flex-1 font-mono uppercase"
                        placeholder="#EC4899"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Taille du texte */}
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Move className="w-5 h-5 text-blue-500" />
                  Ajustements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <Label className="text-base font-semibold">Taille du texte</Label>
                    <span className="text-sm font-bold text-pink-500 bg-pink-50 px-3 py-1 rounded-full">
                      {fontSize[0]}px
                    </span>
                  </div>
                  <Slider
                    value={fontSize}
                    onValueChange={setFontSize}
                    min={20}
                    max={120}
                    step={1}
                    className="cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Petit</span>
                    <span>Grand</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-3">
                    <Label className="text-base font-semibold">Position verticale</Label>
                    <span className="text-sm font-bold text-purple-500 bg-purple-50 px-3 py-1 rounded-full">
                      {textPosition[0]}%
                    </span>
                  </div>
                  <Slider
                    value={textPosition}
                    onValueChange={setTextPosition}
                    min={10}
                    max={90}
                    step={1}
                    className="cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Haut</span>
                    <span>Bas</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Conseils */}
            <Card className="shadow-xl border-0 bg-gradient-to-br from-pink-50 to-purple-50">
              <CardContent className="pt-6">
                <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="text-2xl">💡</span>
                  Conseils
                </h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-pink-500 font-bold">•</span>
                    <span>Utilisez une image haute qualité pour un meilleur résultat</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500 font-bold">•</span>
                    <span>Choisissez une couleur contrastante pour la lisibilité</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 font-bold">•</span>
                    <span>Ajustez la position pour éviter les zones importantes</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer info */}
      <footer className="container mx-auto px-4 py-8 text-center">
        <p className="text-gray-600">
          Créé avec ❤️ par <span className="font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">Missa Créations</span>
        </p>
      </footer>
    </div>
  )
}
