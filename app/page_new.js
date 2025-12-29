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
import { useLanguage } from '@/contexts/LanguageContext'

export default function App() {
  const { language, toggleLanguage, t } = useLanguage()
  const [currentPage, setCurrentPage] = useState('home')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [cart, setCart] = useState([])
  const [favorites, setFavorites] = useState([])
  const [products, setProducts] = useState([])
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [customizeModalOpen, setCustomizeModalOpen] = useState(false)
  const [customText, setCustomText] = useState('')
  const [customImages, setCustomImages] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('default')
  const [promoCode, setPromoCode] = useState('')
  const [appliedPromo, setAppliedPromo] = useState(null)
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

  // Load cart and favorites from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('missaCart')
    const savedFavorites = localStorage.getItem('missaFavorites')
    if (savedCart) setCart(JSON.parse(savedCart))
    if (savedFavorites) setFavorites(JSON.parse(savedFavorites))
  }, [])

  // Save cart and favorites to localStorage
  useEffect(() => {
    localStorage.setItem('missaCart', JSON.stringify(cart))
  }, [cart])

  useEffect(() => {
    localStorage.setItem('missaFavorites', JSON.stringify(favorites))
  }, [favorites])

  const addToCart = (product, customization = null) => {
    const cartItem = {
      id: Date.now(),
      productId: product._id,
      name: language === 'fr' ? product.name_fr : product.name_en,
      price: product.price,
      image: product.images[0],
      quantity: 1,
      customization
    }
    setCart([...cart, cartItem])
    toast({ title: t('addedToCart'), description: language === 'fr' ? product.name_fr : product.name_en })
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

  const toggleFavorite = (product) => {
    const isFavorite = favorites.some(fav => fav._id === product._id)
    if (isFavorite) {
      setFavorites(favorites.filter(fav => fav._id !== product._id))
      toast({ title: t('removedFromFavorites') })
    } else {
      setFavorites([...favorites, product])
      toast({ title: t('addedToFavorites'), description: language === 'fr' ? product.name_fr : product.name_en })
    }
  }

  const isFavorite = (productId) => {
    return favorites.some(fav => fav._id === productId)
  }

  const applyPromoCode = () => {
    // Codes promo demo
    const validCodes = {
      'MISSA10': { type: 'percent', value: 10 },
      'WELCOME': { type: 'percent', value: 15 },
      'SAVE20': { type: 'fixed', value: 20 }
    }

    if (validCodes[promoCode.toUpperCase()]) {
      setAppliedPromo({ code: promoCode.toUpperCase(), ...validCodes[promoCode.toUpperCase()] })
      toast({ title: t('promoApplied'), description: `${promoCode.toUpperCase()}` })
    } else {
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
    if (appliedPromo.type === 'percent') {
      discount = (cartTotal * appliedPromo.value) / 100
    } else {
      discount = appliedPromo.value
    }
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
    if (!checkoutData.firstName || !checkoutData.email || !checkoutData.address1) {
      toast({ title: t('formIncomplete'), variant: 'destructive' })
      return
    }

    const order = {
      customer: checkoutData,
      items: cart,
      shippingCost,
      discount,
      promoCode: appliedPromo?.code || null,
      totalAmount: finalTotal,
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
        setAppliedPromo(null)
        setCurrentPage('confirmation')
      }
    } catch (err) {
      toast({ title: t('error'), description: t('tryAgain'), variant: 'destructive' })
    }
  }

  const filteredProducts = products
    .filter(p => selectedCategory === 'all' || p.category === selectedCategory)
    .filter(p => {
      const name = language === 'fr' ? p.name_fr : p.name_en
      return name.toLowerCase().includes(searchQuery.toLowerCase())
    })
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
              <button onClick={() => setCurrentPage('home')} className="text-gray-700 hover:text-pink-500 font-medium transition">{t('home')}</button>
              <button onClick={() => setCurrentPage('products')} className="text-gray-700 hover:text-pink-500 font-medium transition">{t('products')}</button>
              <button onClick={() => setCurrentPage('blog')} className="text-gray-700 hover:text-pink-500 font-medium transition">{t('blog')}</button>
              <button className="text-gray-700 hover:text-pink-500 font-medium transition">{t('contact')}</button>
            </nav>

            {/* Icons */}
            <div className="flex items-center gap-4">
              <Search className="w-5 h-5 text-gray-600 cursor-pointer hover:text-pink-500 transition" />
              
              <div className="relative cursor-pointer" onClick={() => setCurrentPage('favorites')}>
                <Heart className={`w-5 h-5 cursor-pointer transition ${favorites.length > 0 ? 'fill-pink-500 text-pink-500' : 'text-gray-600 hover:text-pink-500'}`} />
                {favorites.length > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {favorites.length}
                  </span>
                )}
              </div>

              <button onClick={toggleLanguage} className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-pink-500 transition">
                <Globe className="w-5 h-5" />
                <span className="uppercase">{language}</span>
              </button>

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
              <button onClick={() => { setCurrentPage('home'); setMobileMenuOpen(false) }} className="text-left py-2 px-4 hover:bg-gray-100 rounded">{t('home')}</button>
              <button onClick={() => { setCurrentPage('products'); setMobileMenuOpen(false) }} className="text-left py-2 px-4 hover:bg-gray-100 rounded">{t('products')}</button>
              <button onClick={() => { setCurrentPage('blog'); setMobileMenuOpen(false) }} className="text-left py-2 px-4 hover:bg-gray-100 rounded">{t('blog')}</button>
              <button onClick={() => { setCurrentPage('favorites'); setMobileMenuOpen(false) }} className="text-left py-2 px-4 hover:bg-gray-100 rounded">{t('favorites')}</button>
              <button className="text-left py-2 px-4 hover:bg-gray-100 rounded">{t('contact')}</button>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      {currentPage === 'home' && (
        <HomePage 
          products={products.slice(0, 6)}
          onAddToCart={addToCart}
          onCustomize={handleCustomize}
          onToggleFavorite={toggleFavorite}
          isFavorite={isFavorite}
          setCurrentPage={setCurrentPage}
          t={t}
          language={language}
        />
      )}

      {currentPage === 'products' && (
        <ProductsPage
          products={filteredProducts}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          sortBy={sortBy}
          setSortBy={setSortBy}
          onAddToCart={addToCart}
          onCustomize={handleCustomize}
          onToggleFavorite={toggleFavorite}
          isFavorite={isFavorite}
          t={t}
          language={language}
        />
      )}

      {currentPage === 'favorites' && (
        <FavoritesPage
          favorites={favorites}
          onAddToCart={addToCart}
          onCustomize={handleCustomize}
          onToggleFavorite={toggleFavorite}
          t={t}
          language={language}
        />
      )}

      {currentPage === 'blog' && (
        <BlogPage t={t} language={language} />
      )}

      {currentPage === 'checkout' && (
        <CheckoutPage
          cart={cart}
          checkoutData={checkoutData}
          setCheckoutData={setCheckoutData}
          cartTotal={cartTotal}
          shippingCost={shippingCost}
          discount={discount}
          finalTotal={finalTotal}
          promoCode={promoCode}
          setPromoCode={setPromoCode}
          appliedPromo={appliedPromo}
          applyPromoCode={applyPromoCode}
          handleCheckout={handleCheckout}
          t={t}
          language={language}
        />
      )}

      {currentPage === 'confirmation' && (
        <ConfirmationPage
          orderNumber={orderNumber}
          checkoutData={checkoutData}
          cartTotal={cartTotal}
          shippingCost={shippingCost}
          discount={discount}
          finalTotal={finalTotal}
          setCurrentPage={setCurrentPage}
          t={t}
        />
      )}

      {/* Cart Sidebar */}
      <CartSidebar
        cartOpen={cartOpen}
        setCartOpen={setCartOpen}
        cart={cart}
        removeFromCart={removeFromCart}
        updateQuantity={updateQuantity}
        cartTotal={cartTotal}
        setCurrentPage={setCurrentPage}
        t={t}
      />

      {/* Customize Modal */}
      <CustomizeModal
        customizeModalOpen={customizeModalOpen}
        setCustomizeModalOpen={setCustomizeModalOpen}
        selectedProduct={selectedProduct}
        customText={customText}
        setCustomText={setCustomText}
        customImages={customImages}
        handleImageUpload={handleImageUpload}
        removeCustomImage={removeCustomImage}
        confirmCustomization={confirmCustomization}
        t={t}
        language={language}
      />

      {/* Footer */}
      <Footer t={t} />
    </div>
  )
}

// Components will be defined below
// (HomePage, ProductsPage, FavoritesPage, BlogPage, CheckoutPage, ConfirmationPage, CartSidebar, CustomizeModal, Footer)
