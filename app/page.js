'use client'

import { useState, useEffect } from 'react'
import { ShoppingCart, Heart, Search, Menu, X, Globe, Sparkles, Package, Truck, Plus, Minus, Trash2, Upload, Check, Calendar, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { useLanguage } from '@/contexts/LanguageContext'

export default function App() {
  const { language, toggleLanguage, t } = useLanguage()
  const [currentPage, setCurrentPage] = useState('home')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [cart, setCart] = useState([])
  const [favorites, setFavorites] = useState([])
  const [products, setProducts] = useState([])
  const [blogPosts, setBlogPosts] = useState([])
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [customizeModalOpen, setCustomizeModalOpen] = useState(false)
  const [customText, setCustomText] = useState('')
  const [customImages, setCustomImages] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedBlogCategory, setSelectedBlogCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('default')
  const [promoCode, setPromoCode] = useState('')
  const [appliedPromo, setAppliedPromo] = useState(null)
  const { toast } = useToast()

  const [checkoutData, setCheckoutData] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    address1: '', address2: '', city: '', province: '', postalCode: '', country: 'canada'
  })
  const [orderNumber, setOrderNumber] = useState('')

  useEffect(() => {
    fetch('/api/products').then(res => res.json()).then(data => setProducts(data.products || []))
    fetch('/api/blog').then(res => res.json()).then(data => setBlogPosts(data.posts || []))
  }, [])

  useEffect(() => {
    const savedCart = localStorage.getItem('missaCart')
    const savedFavorites = localStorage.getItem('missaFavorites')
    if (savedCart) setCart(JSON.parse(savedCart))
    if (savedFavorites) setFavorites(JSON.parse(savedFavorites))
  }, [])

  useEffect(() => { localStorage.setItem('missaCart', JSON.stringify(cart)) }, [cart])
  useEffect(() => { localStorage.setItem('missaFavorites', JSON.stringify(favorites)) }, [favorites])

  const addToCart = (product, customization = null) => {
    const cartItem = {
      id: Date.now(), productId: product._id,
      name: language === 'fr' ? product.name_fr : product.name_en,
      price: product.price, image: product.images[0], quantity: 1, customization
    }
    setCart([...cart, cartItem])
    toast({ title: t('addedToCart'), description: cartItem.name })
    setCartOpen(true)
  }

  const removeFromCart = (itemId) => setCart(cart.filter(item => item.id !== itemId))
  
  const updateQuantity = (itemId, delta) => {
    setCart(cart.map(item => item.id === itemId ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item))
  }

  const toggleFavorite = (product) => {
    const isFav = favorites.some(fav => fav._id === product._id)
    if (isFav) {
      setFavorites(favorites.filter(fav => fav._id !== product._id))
      toast({ title: t('removedFromFavorites') })
    } else {
      setFavorites([...favorites, product])
      toast({ title: t('addedToFavorites') })
    }
  }

  const isFavorite = (productId) => favorites.some(fav => fav._id === productId)

  const applyPromoCode = async () => {
    try {
      const res = await fetch('/api/promo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: promoCode })
      })
      const data = await res.json()
      if (data.success) {
        setAppliedPromo(data.promo)
        toast({ title: t('promoApplied'), description: data.promo.code })
      } else {
        toast({ title: t('invalidPromo'), variant: 'destructive' })
      }
    } catch {
      toast({ title: t('invalidPromo'), variant: 'destructive' })
    }
  }

  const cartTotal = cart.reduce((sum, item) => {
    const itemPrice = item.price + (item.customization ? 10 : 0)
    return sum + (itemPrice * item.quantity)
  }, 0)

  const shippingCost = calculateShipping(checkoutData.country, cart.length)
  
  let discount = 0
  if (appliedPromo) {
    discount = appliedPromo.type === 'percent' ? (cartTotal * appliedPromo.value) / 100 : appliedPromo.value
  }

  const finalTotal = cartTotal + shippingCost - discount

  const handleCustomize = (product) => {
    setSelectedProduct(product)
    setCustomText('')
    setCustomImages([])
    setCustomizeModalOpen(true)
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    if (customImages.length + files.length > 5) return toast({ title: '⚠️ Maximum 5 images', variant: 'destructive' })
    
    files.forEach(file => {
      if (file.size > 10 * 1024 * 1024) return toast({ title: '⚠️ Image trop grande', variant: 'destructive' })
      const reader = new FileReader()
      reader.onload = (e) => setCustomImages(prev => [...prev, { file, preview: e.target.result }])
      reader.readAsDataURL(file)
    })
  }

  const confirmCustomization = () => {
    addToCart(selectedProduct, { text: customText, images: customImages.map(img => img.preview) })
    setCustomizeModalOpen(false)
  }

  const handleCheckout = async () => {
    if (!checkoutData.firstName || !checkoutData.email || !checkoutData.address1) {
      return toast({ title: t('formIncomplete'), variant: 'destructive' })
    }

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: checkoutData, items: cart, shippingCost, discount,
          promoCode: appliedPromo?.code || null, totalAmount: finalTotal, status: 'pending'
        })
      })
      const data = await res.json()
      if (data.success) {
        setOrderNumber(data.orderNumber)
        setCart([])
        setAppliedPromo(null)
        setCurrentPage('confirmation')
      }
    } catch {
      toast({ title: t('error'), variant: 'destructive' })
    }
  }

  const filteredProducts = products
    .filter(p => selectedCategory === 'all' || p.category === selectedCategory)
    .filter(p => (language === 'fr' ? p.name_fr : p.name_en).toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => sortBy === 'price-asc' ? a.price - b.price : sortBy === 'price-desc' ? b.price - a.price : 0)

  const filteredBlogPosts = blogPosts
    .filter(p => selectedBlogCategory === 'all' || p.category === selectedBlogCategory)

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-50 bg-white shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentPage('home')}>
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">M</div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">Missa Créations</h1>
                <p className="text-xs text-gray-500">Personnalisées et Artisanales</p>
              </div>
            </div>

            <nav className="hidden md:flex items-center gap-8">
              <button onClick={() => setCurrentPage('home')} className="text-gray-700 hover:text-pink-500 font-medium transition">{t('home')}</button>
              <button onClick={() => setCurrentPage('products')} className="text-gray-700 hover:text-pink-500 font-medium transition">{t('products')}</button>
              <button onClick={() => setCurrentPage('blog')} className="text-gray-700 hover:text-pink-500 font-medium transition">{t('blog')}</button>
              <button className="text-gray-700 hover:text-pink-500 font-medium transition">{t('contact')}</button>
            </nav>

            <div className="flex items-center gap-4">
              <Search className="w-5 h-5 text-gray-600 cursor-pointer hover:text-pink-500 transition" />
              
              <div className="relative cursor-pointer" onClick={() => setCurrentPage('favorites')}>
                <Heart className={`w-5 h-5 cursor-pointer transition ${favorites.length > 0 ? 'fill-pink-500 text-pink-500' : 'text-gray-600 hover:text-pink-500'}`} />
                {favorites.length > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs rounded-full flex items-center justify-center font-bold">{favorites.length}</span>
                )}
              </div>

              <button onClick={toggleLanguage} className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-pink-500 transition">
                <Globe className="w-5 h-5" />
                <span className="uppercase">{language}</span>
              </button>

              <div className="relative cursor-pointer" onClick={() => setCartOpen(true)}>
                <ShoppingCart className="w-6 h-6 text-gray-600 hover:text-pink-500 transition" />
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs rounded-full flex items-center justify-center font-bold">{cart.length}</span>
                )}
              </div>
              
              <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t">
            <nav className="flex flex-col p-4 gap-2">
              <button onClick={() => { setCurrentPage('home'); setMobileMenuOpen(false) }} className="text-left py-2 px-4 hover:bg-gray-100 rounded">{t('home')}</button>
              <button onClick={() => { setCurrentPage('products'); setMobileMenuOpen(false) }} className="text-left py-2 px-4 hover:bg-gray-100 rounded">{t('products')}</button>
              <button onClick={() => { setCurrentPage('blog'); setMobileMenuOpen(false) }} className="text-left py-2 px-4 hover:bg-gray-100 rounded">{t('blog')}</button>
              <button onClick={() => { setCurrentPage('favorites'); setMobileMenuOpen(false) }} className="text-left py-2 px-4 hover:bg-gray-100 rounded">{t('favorites')}</button>
            </nav>
          </div>
        )}
      </header>

      {currentPage === 'home' && (
        <main>
          <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1612672358776-15458bfd9869?w=1200)' }}>
              <div className="absolute inset-0 bg-black/30"></div>
            </div>
            <div className="relative z-10 text-center text-white px-4">
              <h2 className="text-5xl md:text-7xl font-bold mb-4 drop-shadow-lg">{t('heroTitle')}</h2>
              <p className="text-xl md:text-2xl mb-8 drop-shadow-md">{t('heroSubtitle')}</p>
              <Button onClick={() => setCurrentPage('products')} size="lg" className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white text-lg px-8 py-6 rounded-full shadow-2xl">{t('heroCTA')}</Button>
            </div>
          </section>

          <section className="container mx-auto px-4 py-16">
            <h3 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">{t('featuredProducts')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.slice(0, 6).map(product => (
                <ProductCard key={product._id} product={product} onAddToCart={addToCart} onCustomize={handleCustomize} onToggleFavorite={toggleFavorite} isFavorite={isFavorite(product._id)} language={language} t={t} />
              ))}
            </div>
          </section>

          <section className="bg-gradient-to-r from-pink-50 to-purple-50 py-16">
            <div className="container mx-auto px-4">
              <h3 className="text-4xl font-bold text-center mb-12 text-gray-800">{t('whyChooseUs')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card className="text-center shadow-xl hover:shadow-2xl transition-shadow">
                  <CardContent className="pt-8">
                    <Package className="w-16 h-16 mx-auto mb-4 text-pink-500" />
                    <h4 className="text-xl font-bold mb-2">{t('handmade')}</h4>
                    <p className="text-gray-600">{t('handmadeDesc')}</p>
                  </CardContent>
                </Card>
                <Card className="text-center shadow-xl hover:shadow-2xl transition-shadow">
                  <CardContent className="pt-8">
                    <Sparkles className="w-16 h-16 mx-auto mb-4 text-purple-500" />
                    <h4 className="text-xl font-bold mb-2">{t('customizable')}</h4>
                    <p className="text-gray-600">{t('customizableDesc')}</p>
                  </CardContent>
                </Card>
                <Card className="text-center shadow-xl hover:shadow-2xl transition-shadow">
                  <CardContent className="pt-8">
                    <Truck className="w-16 h-16 mx-auto mb-4 text-pink-500" />
                    <h4 className="text-xl font-bold mb-2">{t('fastShipping')}</h4>
                    <p className="text-gray-600">{t('fastShippingDesc')}</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
        </main>
      )}

      {currentPage === 'products' && (
        <main className="container mx-auto px-4 py-12">
          <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">{t('allProducts')}</h2>
          
          <div className="mb-8 flex flex-col md:flex-row gap-4">
            <div className="flex gap-2 flex-wrap">
              {['all', 'bijoux', 'decoration', 'cadeaux', 'accessoires'].map(cat => (
                <Button key={cat} variant={selectedCategory === cat ? 'default' : 'outline'} onClick={() => setSelectedCategory(cat)} className={selectedCategory === cat ? 'bg-gradient-to-r from-pink-500 to-purple-600' : ''}>
                  {t(cat === 'all' ? 'all' : cat === 'bijoux' ? 'jewelry' : cat === 'decoration' ? 'decoration' : cat === 'cadeaux' ? 'gifts' : 'accessories')}
                </Button>
              ))}
            </div>
            <div className="flex gap-4 flex-1">
              <Input placeholder={t('search')} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="flex-1" />
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[200px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">{t('default')}</SelectItem>
                  <SelectItem value="price-asc">{t('priceAsc')}</SelectItem>
                  <SelectItem value="price-desc">{t('priceDesc')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <ProductCard key={product._id} product={product} onAddToCart={addToCart} onCustomize={handleCustomize} onToggleFavorite={toggleFavorite} isFavorite={isFavorite(product._id)} language={language} t={t} />
            ))}
          </div>
        </main>
      )}

      {currentPage === 'favorites' && (
        <main className="container mx-auto px-4 py-12">
          <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">{t('myFavorites')}</h2>
          
          {favorites.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Heart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500 text-lg">{t('noFavorites')}</p>
                <Button onClick={() => setCurrentPage('products')} className="mt-4 bg-gradient-to-r from-pink-500 to-purple-600">{t('products')}</Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {favorites.map(product => (
                <ProductCard key={product._id} product={product} onAddToCart={addToCart} onCustomize={handleCustomize} onToggleFavorite={toggleFavorite} isFavorite={true} language={language} t={t} />
              ))}
            </div>
          )}
        </main>
      )}

      {currentPage === 'blog' && (
        <main className="container mx-auto px-4 py-12">
          <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">{t('blog')}</h2>
          
          <div className="mb-8 flex gap-2">
            {['all', 'inspiration', 'tutorials', 'news'].map(cat => (
              <Button key={cat} variant={selectedBlogCategory === cat ? 'default' : 'outline'} onClick={() => setSelectedBlogCategory(cat)} className={selectedBlogCategory === cat ? 'bg-gradient-to-r from-pink-500 to-purple-600' : ''}>
                {t(cat === 'all' ? 'all' : cat)}
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBlogPosts.map(post => (
              <Card key={post._id} className="overflow-hidden hover:shadow-xl transition-shadow cursor-pointer">
                <img src={post.image} alt={language === 'fr' ? post.title_fr : post.title_en} className="w-full h-48 object-cover" />
                <CardHeader>
                  <Badge className="w-fit mb-2">{t(post.category)}</Badge>
                  <CardTitle className="text-xl">{language === 'fr' ? post.title_fr : post.title_en}</CardTitle>
                  <CardDescription className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4" />
                    {new Date(post.publishedAt).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{language === 'fr' ? post.excerpt_fr : post.excerpt_en}</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">{t('readMore')}</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </main>
      )}

      {currentPage === 'checkout' && (
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">{t('checkout')}</h2>
            
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Card className="shadow-xl">
                  <CardHeader><h3 className="text-2xl font-bold">{t('shippingAddress')}</h3></CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div><Label>{t('firstName')} *</Label><Input value={checkoutData.firstName} onChange={(e) => setCheckoutData({...checkoutData, firstName: e.target.value})} /></div>
                      <div><Label>{t('lastName')} *</Label><Input value={checkoutData.lastName} onChange={(e) => setCheckoutData({...checkoutData, lastName: e.target.value})} /></div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div><Label>{t('email')} *</Label><Input type="email" value={checkoutData.email} onChange={(e) => setCheckoutData({...checkoutData, email: e.target.value})} /></div>
                      <div><Label>{t('phone')}</Label><Input value={checkoutData.phone} onChange={(e) => setCheckoutData({...checkoutData, phone: e.target.value})} /></div>
                    </div>
                    <div><Label>{t('address1')} *</Label><Input value={checkoutData.address1} onChange={(e) => setCheckoutData({...checkoutData, address1: e.target.value})} /></div>
                    <div><Label>{t('address2')}</Label><Input value={checkoutData.address2} onChange={(e) => setCheckoutData({...checkoutData, address2: e.target.value})} /></div>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div><Label>{t('city')}</Label><Input value={checkoutData.city} onChange={(e) => setCheckoutData({...checkoutData, city: e.target.value})} /></div>
                      <div><Label>{t('province')}</Label><Input value={checkoutData.province} onChange={(e) => setCheckoutData({...checkoutData, province: e.target.value})} /></div>
                      <div><Label>{t('postalCode')}</Label><Input value={checkoutData.postalCode} onChange={(e) => setCheckoutData({...checkoutData, postalCode: e.target.value})} /></div>
                    </div>
                    <div><Label>{t('country')} *</Label>
                      <Select value={checkoutData.country} onValueChange={(value) => setCheckoutData({...checkoutData, country: value})}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="canada">{t('canada')}</SelectItem>
                          <SelectItem value="usa">{t('usa')}</SelectItem>
                          <SelectItem value="france">{t('france')}</SelectItem>
                          <SelectItem value="dominicaine">{t('dominicanRepublic')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card className="shadow-xl sticky top-24">
                  <CardHeader><h3 className="text-xl font-bold">{t('orderSummary')}</h3></CardHeader>
                  <CardContent className="space-y-4">
                    {cart.map(item => (
                      <div key={item.id} className="flex gap-3">
                        <img src={item.image} alt={item.name} className="w-16 h-16 rounded object-cover" />
                        <div className="flex-1">
                          <p className="font-medium text-sm">{item.name}</p>
                          <p className="text-sm text-gray-500">{t('quantity')}: {item.quantity}</p>
                          {item.customization && <Badge className="mt-1 bg-purple-100 text-purple-700">✨ {t('customized')}</Badge>}
                        </div>
                        <p className="font-bold">{((item.price + (item.customization ? 10 : 0)) * item.quantity).toFixed(2)}$</p>
                      </div>
                    ))}
                    
                    <div className="space-y-2 mt-4">
                      <div><Label>{t('promoCode')}</Label>
                        <div className="flex gap-2">
                          <Input value={promoCode} onChange={(e) => setPromoCode(e.target.value)} placeholder="MISSA10" />
                          <Button onClick={applyPromoCode} variant="outline">{t('applyPromo')}</Button>
                        </div>
                        {appliedPromo && <p className="text-sm text-green-600 mt-1">✓ {appliedPromo.code} {t('discount')}</p>}
                      </div>
                    </div>

                    <div className="border-t pt-4 space-y-2">
                      <div className="flex justify-between"><span>{t('subtotal')}</span><span>{cartTotal.toFixed(2)}$</span></div>
                      <div className="flex justify-between"><span>{t('shipping')}</span><span>{shippingCost.toFixed(2)}$</span></div>
                      {discount > 0 && <div className="flex justify-between text-green-600"><span>{t('discount')}</span><span>-{discount.toFixed(2)}$</span></div>}
                      <div className="flex justify-between text-xl font-bold border-t pt-2">
                        <span>{t('total')}</span>
                        <span className="text-pink-500">{finalTotal.toFixed(2)}$ CAD</span>
                      </div>
                    </div>
                    <Button onClick={handleCheckout} className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700" size="lg">{t('finalizeOrder')}</Button>
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
            <h2 className="text-4xl font-bold mb-4 text-gray-800">{t('orderConfirmed')}</h2>
            <p className="text-xl text-gray-600 mb-2">{t('thankYou')} ✨</p>
            <p className="text-lg text-gray-500 mb-8">{t('orderNumber')}: <span className="font-bold text-pink-500">{orderNumber}</span></p>
            <Card className="shadow-xl text-left mb-8">
              <CardHeader><h3 className="text-xl font-bold">{t('summary')}</h3></CardHeader>
              <CardContent className="space-y-2">
                <p className="text-gray-600">{t('confirmationEmailSent')} <strong>{checkoutData.email}</strong></p>
                <p className="text-gray-600">{t('totalAmount')}: <strong className="text-pink-500">{finalTotal.toFixed(2)}$ CAD</strong></p>
              </CardContent>
            </Card>
            <Button size="lg" onClick={() => setCurrentPage('home')} className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700">{t('backToHome')}</Button>
          </div>
        </main>
      )}

      {cartOpen && (
        <div className="fixed inset-0 z-50 bg-black/50" onClick={() => setCartOpen(false)}>
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl p-6 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">{t('yourCart')} ({cart.length})</h3>
              <Button variant="ghost" size="icon" onClick={() => setCartOpen(false)}><X className="w-6 h-6" /></Button>
            </div>

            {cart.length === 0 ? (
              <p className="text-center text-gray-500 py-12">{t('emptyCart')}</p>
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
                            {item.customization && <Badge className="mt-1 bg-purple-100 text-purple-700">✨ {t('customized')}</Badge>}
                            <div className="flex items-center gap-2 mt-2">
                              <Button size="icon" variant="outline" onClick={() => updateQuantity(item.id, -1)}><Minus className="w-4 h-4" /></Button>
                              <span className="w-8 text-center font-bold">{item.quantity}</span>
                              <Button size="icon" variant="outline" onClick={() => updateQuantity(item.id, 1)}><Plus className="w-4 h-4" /></Button>
                              <Button size="icon" variant="destructive" onClick={() => removeFromCart(item.id)} className="ml-auto"><Trash2 className="w-4 h-4" /></Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-2 mb-4">
                  <div className="flex justify-between"><span>{t('subtotal')}</span><span className="font-bold">{cartTotal.toFixed(2)}$</span></div>
                  <div className="flex justify-between text-sm text-gray-500"><span>{t('shipping')}</span><span>{t('calculatedAtCheckout')}</span></div>
                </div>

                <Button onClick={() => { setCartOpen(false); setCurrentPage('checkout') }} className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700" size="lg">{t('proceedToCheckout')}</Button>
              </>
            )}
          </div>
        </div>
      )}

      <Dialog open={customizeModalOpen} onOpenChange={setCustomizeModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">{t('customizeProduct')}</DialogTitle>
            <DialogDescription>{t('addPersonalTouch')}</DialogDescription>
          </DialogHeader>
          
          {selectedProduct && (
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <img src={selectedProduct.images[0]} alt={language === 'fr' ? selectedProduct.name_fr : selectedProduct.name_en} className="w-full rounded-xl shadow-lg" />
                <h3 className="text-xl font-bold mt-4">{language === 'fr' ? selectedProduct.name_fr : selectedProduct.name_en}</h3>
                <p className="text-gray-600">{language === 'fr' ? selectedProduct.description_fr : selectedProduct.description_en}</p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>{t('customText')}</Label>
                  <Textarea placeholder={t('enterText')} value={customText} onChange={(e) => setCustomText(e.target.value)} rows={4} />
                  <p className="text-xs text-gray-500 mt-1">{customText.length} / 200 {t('characters')}</p>
                </div>

                <div>
                  <Label>{t('images')} ({t('maxImages')})</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-pink-500 transition">
                    <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" id="image-upload" />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <Upload className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-600">{t('clickOrDrag')}</p>
                    </label>
                  </div>
                  
                  {customImages.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mt-4">
                      {customImages.map((img, index) => (
                        <div key={index} className="relative group">
                          <img src={img.preview} alt="Preview" className="w-full h-24 object-cover rounded" />
                          <Button size="icon" variant="destructive" className="absolute top-1 right-1 w-6 h-6 opacity-0 group-hover:opacity-100 transition" onClick={() => setCustomImages(customImages.filter((_, i) => i !== index))}><X className="w-4 h-4" /></Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between mb-2"><span>{t('basePrice')}</span><span>{selectedProduct.price}$</span></div>
                  <div className="flex justify-between mb-2 text-purple-600"><span>+ {t('customization')}</span><span>10.00$</span></div>
                  <div className="flex justify-between font-bold text-lg border-t pt-2"><span>{t('total')}</span><span className="text-pink-500">{(selectedProduct.price + 10).toFixed(2)}$</span></div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setCustomizeModalOpen(false)}>{t('cancel')}</Button>
            <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700" onClick={confirmCustomization}>{t('confirmAdd')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
                <li className="hover:text-pink-400 cursor-pointer" onClick={() => setCurrentPage('home')}>{t('home')}</li>
                <li className="hover:text-pink-400 cursor-pointer" onClick={() => setCurrentPage('products')}>{t('products')}</li>
                <li className="hover:text-pink-400 cursor-pointer" onClick={() => setCurrentPage('blog')}>{t('blog')}</li>
                <li className="hover:text-pink-400 cursor-pointer">{t('contact')}</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">{t('support')}</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="hover:text-pink-400 cursor-pointer">{t('faq')}</li>
                <li className="hover:text-pink-400 cursor-pointer">{t('delivery')}</li>
                <li className="hover:text-pink-400 cursor-pointer">{t('returns')}</li>
                <li className="hover:text-pink-400 cursor-pointer">{t('warranty')}</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">{t('followUs')}</h4>
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition">f</div>
                <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition">i</div>
                <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition">p</div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© 2024 Missa Créations. {t('allRightsReserved')}.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function ProductCard({ product, onAddToCart, onCustomize, onToggleFavorite, isFavorite, language, t }) {
  return (
    <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-300">
      <div className="relative overflow-hidden">
        <img src={product.images[0]} alt={language === 'fr' ? product.name_fr : product.name_en} className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300" />
        {product.isCustomizable && <Badge className="absolute top-3 right-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white">Personnalisable</Badge>}
        <button onClick={() => onToggleFavorite(product)} className="absolute top-3 left-3 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition">
          <Heart className={`w-5 h-5 ${isFavorite ? 'fill-pink-500 text-pink-500' : 'text-gray-600'}`} />
        </button>
      </div>
      <CardContent className="p-4">
        <h3 className="font-bold text-lg mb-2">{language === 'fr' ? product.name_fr : product.name_en}</h3>
        <p className="text-2xl font-bold text-pink-500 mb-4">{product.price}$ CAD</p>
        <div className="flex gap-2">
          <Button className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700" onClick={() => onAddToCart(product)}>{t('addToCart')}</Button>
          {product.isCustomizable && (
            <Button size="icon" variant="outline" onClick={() => onCustomize(product)} className="border-pink-500 text-pink-500 hover:bg-pink-50"><Sparkles className="w-5 h-5" /></Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

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
