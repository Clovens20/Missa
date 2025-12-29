'use client'

import { useState, useEffect } from 'react'
import { ShoppingCart, Heart, Search, Menu, X, Globe, Sparkles, Package, Truck, Shield, Plus, Minus, Trash2, Upload, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'

export default function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [cart, setCart] = useState([])
  const [products, setProducts] = useState([])
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [customizeModalOpen, setCustomizeModalOpen] = useState(false)
  const [customText, setCustomText] = useState('')
  const [customImages, setCustomImages] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('default')
  const { toast } = useToast()

  // Checkout states
  const [checkoutData, setCheckoutData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address1: '',
    address2: '',
    city: '',
    province: '',
    postalCode: '',
    country: 'canada'
  })
  const [orderConfirmed, setOrderConfirmed] = useState(false)
  const [orderNumber, setOrderNumber] = useState('')

  // Load products
  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => setProducts(data.products || []))
      .catch(err => console.error(err))
  }, [])

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('missaCart')
    if (savedCart) setCart(JSON.parse(savedCart))
  }, [])

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem('missaCart', JSON.stringify(cart))
  }, [cart])

  const addToCart = (product, customization = null) => {
    const cartItem = {
      id: Date.now(),
      productId: product._id,
      name: product.name_fr,
      price: product.price,
      image: product.images[0],
      quantity: 1,
      customization
    }
    setCart([...cart, cartItem])
    toast({ title: '✅ Ajouté au panier', description: product.name_fr })
    setCartOpen(true)
  }

  const removeFromCart = (itemId) => {
    setCart(cart.filter(item => item.id !== itemId))
  }

  const updateQuantity = (itemId, delta) => {
    setCart(cart.map(item => 
      item.id === itemId 
        ? { ...item, quantity: Math.max(1, item.quantity + delta) }
        : item
    ))
  }

  const cartTotal = cart.reduce((sum, item) => {
    const itemPrice = item.price + (item.customization ? 10 : 0)
    return sum + (itemPrice * item.quantity)
  }, 0)

  const shippingCost = calculateShipping(checkoutData.country, cart.length)

  const handleCustomize = (product) => {
    setSelectedProduct(product)
    setCustomText('')
    setCustomImages([])
    setCustomizeModalOpen(true)
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    if (customImages.length + files.length > 5) {
      toast({ title: '⚠️ Maximum 5 images', variant: 'destructive' })
      return
    }
    
    files.forEach(file => {
      if (file.size > 10 * 1024 * 1024) {
        toast({ title: '⚠️ Image trop grande', description: 'Max 10MB', variant: 'destructive' })
        return
      }
      
      const reader = new FileReader()
      reader.onload = (e) => {
        setCustomImages(prev => [...prev, { file, preview: e.target.result }])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeCustomImage = (index) => {
    setCustomImages(customImages.filter((_, i) => i !== index))
  }

  const confirmCustomization = () => {
    const customization = {
      text: customText,
      images: customImages.map(img => img.preview)
    }
    addToCart(selectedProduct, customization)
    setCustomizeModalOpen(false)
  }

  const handleCheckout = async () => {
    // Validation
    if (!checkoutData.firstName || !checkoutData.email || !checkoutData.address1) {
      toast({ title: '⚠️ Formulaire incomplet', variant: 'destructive' })
      return
    }

    // Create order
    const order = {
      customer: checkoutData,
      items: cart,
      shippingCost,
      totalAmount: cartTotal + shippingCost,
      status: 'pending'
    }

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order)
      })
      const data = await res.json()
      
      if (data.success) {
        setOrderNumber(data.orderNumber)
        setOrderConfirmed(true)
        setCart([])
        setCurrentPage('confirmation')
      }
    } catch (err) {
      toast({ title: '❌ Erreur', description: 'Veuillez réessayer', variant: 'destructive' })
    }
  }

  const filteredProducts = products
    .filter(p => selectedCategory === 'all' || p.category === selectedCategory)
    .filter(p => p.name_fr.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price
      if (sortBy === 'price-desc') return b.price - a.price
      return 0
    })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentPage('home')}>
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                M
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                  Missa Créations
                </h1>
                <p className="text-xs text-gray-500">Personnalisées et Artisanales</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <button onClick={() => setCurrentPage('home')} className="text-gray-700 hover:text-pink-500 font-medium transition">Accueil</button>
              <button onClick={() => setCurrentPage('products')} className="text-gray-700 hover:text-pink-500 font-medium transition">Produits</button>
              <button className="text-gray-700 hover:text-pink-500 font-medium transition">Blog</button>
              <button className="text-gray-700 hover:text-pink-500 font-medium transition">Contact</button>
            </nav>

            {/* Icons */}
            <div className="flex items-center gap-4">
              <Search className="w-5 h-5 text-gray-600 cursor-pointer hover:text-pink-500 transition" />
              <Heart className="w-5 h-5 text-gray-600 cursor-pointer hover:text-pink-500 transition" />
              <Globe className="w-5 h-5 text-gray-600 cursor-pointer hover:text-pink-500 transition" />
              <div className="relative cursor-pointer" onClick={() => setCartOpen(true)}>
                <ShoppingCart className="w-6 h-6 text-gray-600 hover:text-pink-500 transition" />
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {cart.length}
                  </span>
                )}
              </div>
              <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t">
            <nav className="flex flex-col p-4 gap-2">
              <button onClick={() => { setCurrentPage('home'); setMobileMenuOpen(false) }} className="text-left py-2 px-4 hover:bg-gray-100 rounded">Accueil</button>
              <button onClick={() => { setCurrentPage('products'); setMobileMenuOpen(false) }} className="text-left py-2 px-4 hover:bg-gray-100 rounded">Produits</button>
              <button className="text-left py-2 px-4 hover:bg-gray-100 rounded">Blog</button>
              <button className="text-left py-2 px-4 hover:bg-gray-100 rounded">Contact</button>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      {currentPage === 'home' && (
        <main>
          {/* Hero Section */}
          <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1612672358776-15458bfd9869?w=1200)' }}
            >
              <div className="absolute inset-0 bg-black/30"></div>
            </div>
            <div className="relative z-10 text-center text-white px-4">
              <h2 className="text-5xl md:text-7xl font-bold mb-4 drop-shadow-lg">Créations Uniques en Résine</h2>
              <p className="text-xl md:text-2xl mb-8 drop-shadow-md">Des bijoux et objets personnalisés, faits main avec amour</p>
              <Button 
                onClick={() => setCurrentPage('products')} 
                size="lg" 
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white text-lg px-8 py-6 rounded-full shadow-2xl"
              >
                Découvrir nos créations
              </Button>
            </div>
          </section>

          {/* Featured Products */}
          <section className="container mx-auto px-4 py-16">
            <h3 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">Produits Vedettes</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.slice(0, 6).map(product => (
                <ProductCard 
                  key={product._id} 
                  product={product} 
                  onAddToCart={addToCart}
                  onCustomize={handleCustomize}
                />
              ))}
            </div>
          </section>

          {/* Why Choose Us */}
          <section className="bg-gradient-to-r from-pink-50 to-purple-50 py-16">
            <div className="container mx-auto px-4">
              <h3 className="text-4xl font-bold text-center mb-12 text-gray-800">Pourquoi Nous Choisir</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card className="text-center shadow-xl hover:shadow-2xl transition-shadow">
                  <CardContent className="pt-8">
                    <Package className="w-16 h-16 mx-auto mb-4 text-pink-500" />
                    <h4 className="text-xl font-bold mb-2">Fait Main</h4>
                    <p className="text-gray-600">Chaque pièce est unique et créée avec passion</p>
                  </CardContent>
                </Card>
                <Card className="text-center shadow-xl hover:shadow-2xl transition-shadow">
                  <CardContent className="pt-8">
                    <Sparkles className="w-16 h-16 mx-auto mb-4 text-purple-500" />
                    <h4 className="text-xl font-bold mb-2">Personnalisable</h4>
                    <p className="text-gray-600">Ajoutez votre touche personnelle à nos créations</p>
                  </CardContent>
                </Card>
                <Card className="text-center shadow-xl hover:shadow-2xl transition-shadow">
                  <CardContent className="pt-8">
                    <Truck className="w-16 h-16 mx-auto mb-4 text-pink-500" />
                    <h4 className="text-xl font-bold mb-2">Livraison Rapide</h4>
                    <p className="text-gray-600">Expédition soignée et sécurisée partout</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
        </main>
      )}

      {currentPage === 'products' && (
        <main className="container mx-auto px-4 py-12">
          <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">Nos Produits</h2>
          
          {/* Filters */}
          <div className="mb-8 flex flex-col md:flex-row gap-4">
            <div className="flex gap-2 flex-wrap">
              {['all', 'bijoux', 'decoration', 'cadeaux', 'accessoires'].map(cat => (
                <Button
                  key={cat}
                  variant={selectedCategory === cat ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory(cat)}
                  className={selectedCategory === cat ? 'bg-gradient-to-r from-pink-500 to-purple-600' : ''}
                >
                  {cat === 'all' ? 'Tous' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                </Button>
              ))}
            </div>
            <div className="flex gap-4 flex-1">
              <Input 
                placeholder="Rechercher..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Par défaut</SelectItem>
                  <SelectItem value="price-asc">Prix croissant</SelectItem>
                  <SelectItem value="price-desc">Prix décroissant</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <ProductCard 
                key={product._id} 
                product={product} 
                onAddToCart={addToCart}
                onCustomize={handleCustomize}
              />
            ))}
          </div>
        </main>
      )}

      {currentPage === 'checkout' && (
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">Paiement</h2>
            
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Form */}
              <div className="lg:col-span-2">
                <Card className="shadow-xl">
                  <CardHeader>
                    <h3 className="text-2xl font-bold">Adresse de livraison</h3>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label>Prénom *</Label>
                        <Input value={checkoutData.firstName} onChange={(e) => setCheckoutData({...checkoutData, firstName: e.target.value})} />
                      </div>
                      <div>
                        <Label>Nom *</Label>
                        <Input value={checkoutData.lastName} onChange={(e) => setCheckoutData({...checkoutData, lastName: e.target.value})} />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label>Email *</Label>
                        <Input type="email" value={checkoutData.email} onChange={(e) => setCheckoutData({...checkoutData, email: e.target.value})} />
                      </div>
                      <div>
                        <Label>Téléphone</Label>
                        <Input value={checkoutData.phone} onChange={(e) => setCheckoutData({...checkoutData, phone: e.target.value})} />
                      </div>
                    </div>
                    <div>
                      <Label>Adresse ligne 1 *</Label>
                      <Input value={checkoutData.address1} onChange={(e) => setCheckoutData({...checkoutData, address1: e.target.value})} />
                    </div>
                    <div>
                      <Label>Adresse ligne 2</Label>
                      <Input value={checkoutData.address2} onChange={(e) => setCheckoutData({...checkoutData, address2: e.target.value})} />
                    </div>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <Label>Ville</Label>
                        <Input value={checkoutData.city} onChange={(e) => setCheckoutData({...checkoutData, city: e.target.value})} />
                      </div>
                      <div>
                        <Label>Province</Label>
                        <Input value={checkoutData.province} onChange={(e) => setCheckoutData({...checkoutData, province: e.target.value})} />
                      </div>
                      <div>
                        <Label>Code postal</Label>
                        <Input value={checkoutData.postalCode} onChange={(e) => setCheckoutData({...checkoutData, postalCode: e.target.value})} />
                      </div>
                    </div>
                    <div>
                      <Label>Pays *</Label>
                      <Select value={checkoutData.country} onValueChange={(value) => setCheckoutData({...checkoutData, country: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="canada">Canada</SelectItem>
                          <SelectItem value="usa">États-Unis</SelectItem>
                          <SelectItem value="france">France</SelectItem>
                          <SelectItem value="dominicaine">République Dominicaine</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Order Summary */}
              <div>
                <Card className="shadow-xl sticky top-24">
                  <CardHeader>
                    <h3 className="text-xl font-bold">Résumé de commande</h3>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {cart.map(item => (
                      <div key={item.id} className="flex gap-3">
                        <img src={item.image} alt={item.name} className="w-16 h-16 rounded object-cover" />
                        <div className="flex-1">
                          <p className="font-medium text-sm">{item.name}</p>
                          <p className="text-sm text-gray-500">Qté: {item.quantity}</p>
                          {item.customization && <Badge className="mt-1 bg-purple-100 text-purple-700">✨ Personnalisé</Badge>}
                        </div>
                        <p className="font-bold">{((item.price + (item.customization ? 10 : 0)) * item.quantity).toFixed(2)}$</p>
                      </div>
                    ))}
                    <div className="border-t pt-4 space-y-2">
                      <div className="flex justify-between">
                        <span>Sous-total</span>
                        <span>{cartTotal.toFixed(2)}$</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Livraison</span>
                        <span>{shippingCost.toFixed(2)}$</span>
                      </div>
                      <div className="flex justify-between text-xl font-bold border-t pt-2">
                        <span>Total</span>
                        <span className="text-pink-500">{(cartTotal + shippingCost).toFixed(2)}$ CAD</span>
                      </div>
                    </div>
                    <Button 
                      className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700" 
                      size="lg"
                      onClick={handleCheckout}
                    >
                      Finaliser la commande
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      )}

      {currentPage === 'confirmation' && (
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-24 h-24 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-4xl font-bold mb-4 text-gray-800">Commande Confirmée !</h2>
            <p className="text-xl text-gray-600 mb-2">Merci pour votre achat ✨</p>
            <p className="text-lg text-gray-500 mb-8">Numéro de commande: <span className="font-bold text-pink-500">{orderNumber}</span></p>
            <Card className="shadow-xl text-left mb-8">
              <CardHeader>
                <h3 className="text-xl font-bold">Récapitulatif</h3>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-gray-600">Un email de confirmation a été envoyé à <strong>{checkoutData.email}</strong></p>
                <p className="text-gray-600">Montant total: <strong className="text-pink-500">{(cartTotal + shippingCost).toFixed(2)}$ CAD</strong></p>
              </CardContent>
            </Card>
            <Button 
              size="lg" 
              onClick={() => { setCurrentPage('home'); setOrderConfirmed(false) }}
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
            >
              Retour à l'accueil
            </Button>
          </div>
        </main>
      )}

      {/* Cart Sidebar */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 bg-black/50" onClick={() => setCartOpen(false)}>
          <div 
            className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl p-6 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">Panier ({cart.length})</h3>
              <Button variant="ghost" size="icon" onClick={() => setCartOpen(false)}>
                <X className="w-6 h-6" />
              </Button>
            </div>

            {cart.length === 0 ? (
              <p className="text-center text-gray-500 py-12">Votre panier est vide</p>
            ) : (
              <>
                <div className="space-y-4 mb-6">
                  {cart.map(item => (
                    <Card key={item.id}>
                      <CardContent className="p-4">
                        <div className="flex gap-3">
                          <img src={item.image} alt={item.name} className="w-20 h-20 rounded object-cover" />
                          <div className="flex-1">
                            <h4 className="font-bold">{item.name}</h4>
                            <p className="text-sm text-gray-500">{item.price}$ {item.customization && '+ 10$ (personnalisé)'}</p>
                            {item.customization && (
                              <Badge className="mt-1 bg-purple-100 text-purple-700">✨ Personnalisé</Badge>
                            )}
                            <div className="flex items-center gap-2 mt-2">
                              <Button size="icon" variant="outline" onClick={() => updateQuantity(item.id, -1)}>
                                <Minus className="w-4 h-4" />
                              </Button>
                              <span className="w-8 text-center font-bold">{item.quantity}</span>
                              <Button size="icon" variant="outline" onClick={() => updateQuantity(item.id, 1)}>
                                <Plus className="w-4 h-4" />
                              </Button>
                              <Button size="icon" variant="destructive" onClick={() => removeFromCart(item.id)} className="ml-auto">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span>Sous-total</span>
                    <span className="font-bold">{cartTotal.toFixed(2)}$</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Livraison</span>
                    <span>Calculée au paiement</span>
                  </div>
                </div>

                <Button 
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700" 
                  size="lg"
                  onClick={() => { setCartOpen(false); setCurrentPage('checkout') }}
                >
                  Procéder au paiement
                </Button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Customize Modal */}
      <Dialog open={customizeModalOpen} onOpenChange={setCustomizeModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Personnaliser votre création</DialogTitle>
            <DialogDescription>Ajoutez votre touche personnelle</DialogDescription>
          </DialogHeader>
          
          {selectedProduct && (
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <img 
                  src={selectedProduct.images[0]} 
                  alt={selectedProduct.name_fr} 
                  className="w-full rounded-xl shadow-lg"
                />
                <h3 className="text-xl font-bold mt-4">{selectedProduct.name_fr}</h3>
                <p className="text-gray-600">{selectedProduct.description_fr}</p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>Texte personnalisé</Label>
                  <Textarea 
                    placeholder="Entrez votre texte ici..." 
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value)}
                    rows={4}
                  />
                  <p className="text-xs text-gray-500 mt-1">{customText.length} / 200 caractères</p>
                </div>

                <div>
                  <Label>Images (max 5, 10MB chacune)</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-pink-500 transition">
                    <input 
                      type="file" 
                      multiple 
                      accept="image/*" 
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <Upload className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-600">Cliquez ou glissez vos images ici</p>
                    </label>
                  </div>
                  
                  {customImages.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mt-4">
                      {customImages.map((img, index) => (
                        <div key={index} className="relative group">
                          <img src={img.preview} alt="Preview" className="w-full h-24 object-cover rounded" />
                          <Button 
                            size="icon" 
                            variant="destructive" 
                            className="absolute top-1 right-1 w-6 h-6 opacity-0 group-hover:opacity-100 transition"
                            onClick={() => removeCustomImage(index)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between mb-2">
                    <span>Prix de base</span>
                    <span>{selectedProduct.price}$</span>
                  </div>
                  <div className="flex justify-between mb-2 text-purple-600">
                    <span>+ Personnalisation</span>
                    <span>10.00$</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>Total</span>
                    <span className="text-pink-500">{(selectedProduct.price + 10).toFixed(2)}$</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setCustomizeModalOpen(false)}>Annuler</Button>
            <Button 
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
              onClick={confirmCustomization}
            >
              Confirmer et ajouter au panier
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-xl font-bold mb-4 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">Missa Créations</h4>
              <p className="text-gray-400">Créations uniques en résine, faites main avec amour</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Liens rapides</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="hover:text-pink-400 cursor-pointer">À propos</li>
                <li className="hover:text-pink-400 cursor-pointer">Produits</li>
                <li className="hover:text-pink-400 cursor-pointer">Blog</li>
                <li className="hover:text-pink-400 cursor-pointer">Contact</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="hover:text-pink-400 cursor-pointer">FAQ</li>
                <li className="hover:text-pink-400 cursor-pointer">Livraison</li>
                <li className="hover:text-pink-400 cursor-pointer">Retours</li>
                <li className="hover:text-pink-400 cursor-pointer">Garantie</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Suivez-nous</h4>
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition">f</div>
                <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition">i</div>
                <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition">p</div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Missa Créations. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

// Product Card Component
function ProductCard({ product, onAddToCart, onCustomize }) {
  return (
    <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-300">
      <div className="relative overflow-hidden">
        <img 
          src={product.images[0]} 
          alt={product.name_fr} 
          className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
        />
        {product.isCustomizable && (
          <Badge className="absolute top-3 right-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white">
            Personnalisable
          </Badge>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="font-bold text-lg mb-2">{product.name_fr}</h3>
        <p className="text-2xl font-bold text-pink-500 mb-4">{product.price}$ CAD</p>
        <div className="flex gap-2">
          <Button 
            className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
            onClick={() => onAddToCart(product)}
          >
            Ajouter au panier
          </Button>
          {product.isCustomizable && (
            <Button 
              size="icon"
              variant="outline"
              onClick={() => onCustomize(product)}
              className="border-pink-500 text-pink-500 hover:bg-pink-50"
            >
              <Sparkles className="w-5 h-5" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Calculate shipping based on country and items
function calculateShipping(country, itemCount) {
  const rates = {
    canada: { base: 12, additional: 3 },
    usa: { base: 15, additional: 4 },
    france: { base: 18, additional: 5 },
    dominicaine: { base: 20, additional: 6 }
  }
  const rate = rates[country] || rates.canada
  return rate.base + (rate.additional * Math.max(0, itemCount - 1))
}
