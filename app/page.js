'use client'

import { useState, useEffect, useMemo, useCallback, memo, useRef } from 'react'
import { ShoppingCart, Heart, Search, Menu, X, Globe, Sparkles, Package, Truck, Plus, Minus, Trash2, Upload, Check, Calendar, User, Star, RefreshCw, ChevronLeft, ChevronRight, ShoppingCart as ShoppingCartIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Slider } from '@/components/ui/slider'
import { useToast } from '@/hooks/use-toast'
import { useLanguage } from '@/contexts/LanguageContext'

// Composant Logo avec fallback
function LogoComponent({ size = 'default' }) {
  const [logoError, setLogoError] = useState(false)
  
  const sizeClasses = {
    small: 'h-10 w-auto',
    default: 'h-14 w-auto',
    large: 'h-20 w-auto'
  }
  
  // Fallback élégant si le logo ne charge pas
  if (logoError) {
    return (
      <div className={`${sizeClasses[size] || sizeClasses.default} aspect-square rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg flex-shrink-0`}>
        <Sparkles className="w-6 h-6" />
      </div>
    )
  }
  
  return (
    <img 
      src="/missa-logo.png" 
      alt="Missa Créations" 
      className={`${sizeClasses[size] || sizeClasses.default} flex-shrink-0 object-contain`}
      onError={() => {
        console.error('Logo failed to load:', '/missa-logo.png')
        setLogoError(true)
      }}
      style={{ maxWidth: 'none' }}
    />
  )
}

// Composants pour les logos des réseaux sociaux
function FacebookIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  )
}

function InstagramIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  )
}

function TikTokIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
    </svg>
  )
}

export default function App() {
  const { language, toggleLanguage, t } = useLanguage()
  const [currentPage, setCurrentPage] = useState('home')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [cart, setCart] = useState([])
  const [favorites, setFavorites] = useState([])
  const [products, setProducts] = useState([])
  const [blogPosts, setBlogPosts] = useState([])
  const [siteContent, setSiteContent] = useState({}) // Contenu du site depuis la base de données
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [productDetailsOpen, setProductDetailsOpen] = useState(false)
  const [productReviews, setProductReviews] = useState([])
  const [reviewForm, setReviewForm] = useState({ rating: 5, name: '', email: '', comment: '' })
  const [zoomedImage, setZoomedImage] = useState(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [customizeModalOpen, setCustomizeModalOpen] = useState(false)
  const [imageModalOpen, setImageModalOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)
  const [customText, setCustomText] = useState('')
  const [customTextColor, setCustomTextColor] = useState('#EC4899')
  const [customTextPosition, setCustomTextPosition] = useState({ x: 50, y: 30 })
  const [customTextFontSize, setCustomTextFontSize] = useState(40)
  const [customTextFontFamily, setCustomTextFontFamily] = useState('serif')
  const [customTextShadow, setCustomTextShadow] = useState(true)
  const [customTextOutline, setCustomTextOutline] = useState(false)
  const [customTextRotation, setCustomTextRotation] = useState(0)
  const [customTextOpacity, setCustomTextOpacity] = useState(100)
  const [isDraggingCustomText, setIsDraggingCustomText] = useState(false)
  const [customTextDragOffset, setCustomTextDragOffset] = useState({ x: 0, y: 0 })
  const [customImages, setCustomImages] = useState([])
  const [customization, setCustomization] = useState({
    color: 'transparent',
    glitter: 'none',
    flower: 'lavande',
    initial: 'M'
  })
  // États pour la personnalisation avancée
  const [advancedBaseColor, setAdvancedBaseColor] = useState({ type: 'transparent', opacity: 100 })
  const [advancedGlitters, setAdvancedGlitters] = useState([])
  const [advancedFlowers, setAdvancedFlowers] = useState([])
  const [advancedTexts, setAdvancedTexts] = useState([])
  const [selectedElement, setSelectedElement] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const advancedCanvasRef = useRef(null)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedBlogCategory, setSelectedBlogCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('default')
  const [promoCode, setPromoCode] = useState('')
  const [appliedPromo, setAppliedPromo] = useState(null)
  const [contactModalOpen, setContactModalOpen] = useState(false)
  const [selectedBlogPost, setSelectedBlogPost] = useState(null)
  const [blogPostModalOpen, setBlogPostModalOpen] = useState(false)
  const { toast } = useToast()

  const [checkoutData, setCheckoutData] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    address1: '', address2: '', city: '', province: '', postalCode: '', country: 'canada'
  })
  const [checkoutStep, setCheckoutStep] = useState('email') // 'email' ou 'details'
  const [emailSaved, setEmailSaved] = useState(false)
  const [emailSaveTimeout, setEmailSaveTimeout] = useState(null)
  const [orderNumber, setOrderNumber] = useState('')
  const [confirmedOrderTotal, setConfirmedOrderTotal] = useState(0)
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [newsletterName, setNewsletterName] = useState('')
  const [newsletterLoading, setNewsletterLoading] = useState(false)
  const [newsletterPopupOpen, setNewsletterPopupOpen] = useState(false)
  const [popupNewsletterEmail, setPopupNewsletterEmail] = useState('')
  const [popupNewsletterName, setPopupNewsletterName] = useState('')
  const [popupNewsletterLoading, setPopupNewsletterLoading] = useState(false)
  const [searchModalOpen, setSearchModalOpen] = useState(false)
  const [headerSearchQuery, setHeaderSearchQuery] = useState('')
  const [promoCodeModalOpen, setPromoCodeModalOpen] = useState(false)
  const [receivedPromoCode, setReceivedPromoCode] = useState('')

  // Cache pour éviter les requêtes répétées
  // Fonction pour charger les produits (réutilisable)
  const loadProducts = async (forceRefresh = false) => {
    try {
      // Charger les produits avec cache
      const productsCache = sessionStorage.getItem('products_cache')
      const productsCacheTime = sessionStorage.getItem('products_cache_time')
      const now = Date.now()
      
      if (!forceRefresh && productsCache && productsCacheTime && (now - parseInt(productsCacheTime)) < 2 * 60 * 1000) {
        // Utiliser le cache si moins de 2 minutes (réduit de 5 à 2 minutes)
        setProducts(JSON.parse(productsCache))
      } else {
        // Forcer le rechargement avec un timestamp pour éviter le cache navigateur
        const productsRes = await fetch(`/api/products?t=${now}`)
        const productsData = await productsRes.json()
        if (productsData.success) {
          setProducts(productsData.products || [])
          sessionStorage.setItem('products_cache', JSON.stringify(productsData.products || []))
          sessionStorage.setItem('products_cache_time', now.toString())
          console.log(`✅ ${productsData.products?.length || 0} produits chargés`)
        }
      }
    } catch (err) {
      console.error('Erreur lors du chargement:', err)
      setProducts([])
    }
  }

  // Fonction pour charger le contenu du site depuis la base de données
  const loadSiteContent = async (forceRefresh = false) => {
    try {
      // Utiliser le cache pour éviter trop de requêtes
      const contentCache = sessionStorage.getItem('site_content_cache')
      const contentCacheTime = sessionStorage.getItem('site_content_cache_time')
      const now = Date.now()
      
      if (!forceRefresh && contentCache && contentCacheTime && (now - parseInt(contentCacheTime)) < 30 * 1000) {
        // Utiliser le cache si moins de 30 secondes
        setSiteContent(JSON.parse(contentCache))
      } else {
        const res = await fetch(`/api/admin/site-content?t=${now}`)
        const data = await res.json()
        if (data.success && data.content) {
          // Convertir le tableau en objet pour faciliter l'accès
          const contentMap = {}
          data.content.forEach(item => {
            contentMap[item.section] = item.content
          })
          setSiteContent(contentMap)
          sessionStorage.setItem('site_content_cache', JSON.stringify(contentMap))
          sessionStorage.setItem('site_content_cache_time', now.toString())
        }
      }
    } catch (err) {
      console.error('Erreur lors du chargement du contenu du site:', err)
    }
  }
  
  // Recharger le contenu toutes les 30 secondes pour avoir les dernières modifications
  useEffect(() => {
    const interval = setInterval(() => {
      loadSiteContent(true) // Force refresh
    }, 30000) // Toutes les 30 secondes
    
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const loadData = async () => {
      await loadProducts()
      await loadSiteContent()
      
      // Charger les articles de blog avec cache-busting
      try {
        const blogRes = await fetch(`/api/blog?t=${Date.now()}`, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache'
          }
        })
        const blogData = await blogRes.json()
        console.log(`📝 Page d'accueil: ${blogData.posts?.length || 0} articles chargés`)
        setBlogPosts(blogData.posts || [])
      } catch (err) {
        console.error('Erreur lors du chargement du blog:', err)
        setBlogPosts([])
      }
    }
    
    loadData()
  }, [])

  // Debounce pour la recherche (évite les recalculs à chaque frappe)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  useEffect(() => {
    const savedCart = localStorage.getItem('missaCart')
    const savedFavorites = localStorage.getItem('missaFavorites')
    const savedPromoCode = localStorage.getItem('newsletterPromoCode')
    if (savedCart) setCart(JSON.parse(savedCart))
    if (savedFavorites) setFavorites(JSON.parse(savedFavorites))
    // Si l'utilisateur a un code promo sauvegardé, le pré-remplir
    if (savedPromoCode && !promoCode) {
      setPromoCode(savedPromoCode)
    }
  }, [])

  useEffect(() => { localStorage.setItem('missaCart', JSON.stringify(cart)) }, [cart])
  useEffect(() => { localStorage.setItem('missaFavorites', JSON.stringify(favorites)) }, [favorites])

  // Afficher le popup newsletter très rapidement (1 seconde) ou au scroll (50% de la page)
  useEffect(() => {
    // Vérifier si l'utilisateur a déjà fermé le popup ou s'est abonné
    const popupClosed = localStorage.getItem('newsletterPopupClosed')
    const isSubscribed = localStorage.getItem('newsletterSubscribed')
    
    if (popupClosed || isSubscribed) return

    // Timer pour afficher après 1 seconde (très rapide)
    const timer = setTimeout(() => {
      setNewsletterPopupOpen(true)
    }, 1000)

    // Afficher au scroll (50% de la page)
    const handleScroll = () => {
      const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      if (scrollPercent >= 50) {
        setNewsletterPopupOpen(true)
        clearTimeout(timer)
      }
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      clearTimeout(timer)
      window.removeEventListener('scroll', handleScroll)
    }
  }, []) // Exécuter une seule fois au montage

  // Fonction pour calculer le prix avec personnalisation (20% du prix de base)
  const calculateCustomizedPrice = (basePrice, hasCustomization = false) => {
    if (!hasCustomization) return basePrice
    return basePrice * 1.2 // Ajouter 20%
  }

  const addToCart = useCallback((product, customization = null) => {
    const basePrice = product.price
    const finalPrice = customization ? calculateCustomizedPrice(basePrice, true) : basePrice
    
    const cartItem = {
      id: Date.now(), productId: product._id,
      name: language === 'fr' ? product.name_fr : product.name_en,
      price: basePrice, // Prix de base sauvegardé
      finalPrice: finalPrice, // Prix final avec personnalisation
      image: product.images[0], quantity: 1, customization
    }
    setCart(prev => [...prev, cartItem])
    toast({ title: t('addedToCart'), description: cartItem.name })
    setCartOpen(true)
  }, [language, t])

  const removeFromCart = (itemId) => setCart(cart.filter(item => item.id !== itemId))
  
  const updateQuantity = (itemId, delta) => {
    setCart(cart.map(item => item.id === itemId ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item))
  }

  const toggleFavorite = useCallback((product) => {
    setFavorites(prev => {
      const isFav = prev.some(fav => fav._id === product._id)
    if (isFav) {
      toast({ title: t('removedFromFavorites') })
        return prev.filter(fav => fav._id !== product._id)
    } else {
      toast({ title: t('addedToFavorites') })
        return [...prev, product]
    }
    })
  }, [t])

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
    const itemPrice = item.finalPrice || calculateCustomizedPrice(item.price, !!item.customization)
    return sum + (itemPrice * item.quantity)
  }, 0)

  const shippingCost = calculateShipping(checkoutData.country, cart.length)
  
  let discount = 0
  if (appliedPromo) {
    discount = appliedPromo.type === 'percent' ? (cartTotal * appliedPromo.value) / 100 : appliedPromo.value
  }

  const finalTotal = cartTotal + shippingCost - discount

  const handleViewDetails = async (product) => {
    setSelectedProduct(product)
    setSelectedImageIndex(0)
    setZoomedImage(null)
    setProductDetailsOpen(true)
    // Charger les avis du produit
    try {
      const res = await fetch(`/api/products/reviews?productId=${product._id}`)
      const data = await res.json()
      if (data.success) {
        setProductReviews(data.reviews || [])
      }
    } catch (error) {
      console.error('Erreur lors du chargement des avis:', error)
      setProductReviews([])
    }
  }

  const handleCustomize = (product) => {
    setSelectedProduct(product)
    setCustomText('')
    setCustomImages([])
    setCustomization({
      color: 'transparent',
      glitter: 'none',
      flower: 'lavande',
      initial: 'M'
    })
    // Réinitialiser les états avancés
    setAdvancedBaseColor({ type: 'transparent', opacity: 100 })
    setAdvancedGlitters([])
    setAdvancedFlowers([])
    setAdvancedTexts([])
    setSelectedElement(null)
    setCustomizeModalOpen(true)
  }

  // Types de paillettes pour la personnalisation avancée
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

  // Ajouter une paillette
  const addGlitter = (type) => {
    const glitterType = glitterTypes.find(g => g.value === type)
    setAdvancedGlitters([...advancedGlitters, {
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
    setAdvancedFlowers([...advancedFlowers, {
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
  const addText = (isFullName = false) => {
    const newText = {
      id: Date.now(),
      content: isFullName ? '' : '',
      x: 50,
      y: 50,
      fontSize: isFullName ? 40 : 80,
      color: '#EC4899',
      fontFamily: 'serif',
      fontWeight: 'bold',
      rotation: 0,
      opacity: 100,
      shadow: true,
      outline: false,
      isFullName: isFullName
    }
    setAdvancedTexts([...advancedTexts, newText])
    // Sélectionner automatiquement le nouvel élément pour afficher le champ d'édition
    setSelectedElement({ ...newText, type: 'text' })
  }

  // Supprimer un élément
  const deleteElement = (type, id) => {
    if (type === 'glitter') setAdvancedGlitters(advancedGlitters.filter(g => g.id !== id))
    if (type === 'flower') setAdvancedFlowers(advancedFlowers.filter(f => f.id !== id))
    if (type === 'text') setAdvancedTexts(advancedTexts.filter(t => t.id !== id))
    setSelectedElement(null)
  }

  // Mettre à jour un élément
  const updateElement = (type, id, updates) => {
    if (type === 'glitter') {
      setAdvancedGlitters(advancedGlitters.map(g => g.id === id ? { ...g, ...updates } : g))
    }
    if (type === 'flower') {
      setAdvancedFlowers(advancedFlowers.map(f => f.id === id ? { ...f, ...updates } : f))
    }
    if (type === 'text') {
      setAdvancedTexts(advancedTexts.map(t => t.id === id ? { ...t, ...updates } : t))
    }
  }

  // Gestion du drag & drop
  const handleMouseDown = (e, element, type) => {
    if (e.button !== 0 || !advancedCanvasRef.current) return
    setSelectedElement({ ...element, type })
    setIsDragging(true)
    const rect = advancedCanvasRef.current.getBoundingClientRect()
    const offsetX = e.clientX - rect.left - (element.x / 100) * rect.width
    const offsetY = e.clientY - rect.top - (element.y / 100) * rect.height
    setDragOffset({ x: offsetX, y: offsetY })
  }

  const handleMouseMove = (e) => {
    if (isDragging && selectedElement && advancedCanvasRef.current) {
      const rect = advancedCanvasRef.current.getBoundingClientRect()
      const newX = ((e.clientX - rect.left - dragOffset.x) / rect.width) * 100
      const newY = ((e.clientY - rect.top - dragOffset.y) / rect.height) * 100
      updateElement(selectedElement.type, selectedElement.id, {
        x: Math.max(0, Math.min(100, newX)),
        y: Math.max(0, Math.min(100, newY))
      })
    }
    if (isDraggingCustomText && advancedCanvasRef.current) {
      const rect = advancedCanvasRef.current.getBoundingClientRect()
      const newX = ((e.clientX - rect.left - customTextDragOffset.x) / rect.width) * 100
      const newY = ((e.clientY - rect.top - customTextDragOffset.y) / rect.height) * 100
      setCustomTextPosition({
        x: Math.max(0, Math.min(100, newX)),
        y: Math.max(0, Math.min(100, newY))
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    setIsDraggingCustomText(false)
  }

  useEffect(() => {
    if (isDragging || isDraggingCustomText) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, isDraggingCustomText, selectedElement, dragOffset, customTextDragOffset])

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
    addToCart(selectedProduct, { 
      text: customText, 
      images: customImages.map(img => img.preview),
      color: customization.color,
      glitter: customization.glitter,
      flower: customization.flower,
      initial: customization.initial
    })
    setCustomizeModalOpen(false)
    setSelectedProduct(null)
    toast({ 
      title: language === 'fr' ? '✅ Produit ajouté au panier' : '✅ Product added to cart',
      description: language === 'fr' ? 'Votre création personnalisée a été ajoutée avec succès !' : 'Your customized creation has been added successfully!'
    })
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
          customer: { ...checkoutData, language }, items: cart, shippingCost, discount,
          promoCode: appliedPromo?.code || null, totalAmount: finalTotal, status: 'pending'
        })
      })
      const data = await res.json()
      if (data.success) {
        setOrderNumber(data.orderNumber)
        setConfirmedOrderTotal(finalTotal) // Sauvegarder le total avant de vider le panier
        setCart([])
        setAppliedPromo(null)
        setCurrentPage('confirmation')
      }
    } catch {
      toast({ title: t('error'), variant: 'destructive' })
    }
  }

  const handleNewsletterSubscribe = async (e, isPopup = false) => {
    if (e) e.preventDefault()
    
    const email = isPopup ? popupNewsletterEmail : newsletterEmail
    const name = isPopup ? popupNewsletterName : newsletterName
    
    if (!email || !email.includes('@')) {
      return toast({ 
        title: language === 'fr' ? 'Email invalide' : 'Invalid email', 
        variant: 'destructive' 
      })
    }

    if (isPopup) {
      setPopupNewsletterLoading(true)
    } else {
      setNewsletterLoading(true)
    }

    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email,
          name: name || null,
          language: language
        })
      })
      const data = await res.json()
      if (data.success) {
        // Afficher le code promo si c'est un nouvel abonné
        if (data.isNewSubscriber && data.promoCode) {
          // Sauvegarder le code promo
          setReceivedPromoCode(data.promoCode)
          localStorage.setItem('newsletterPromoCode', data.promoCode)
          
          // Fermer le popup newsletter
          if (isPopup) {
            setPopupNewsletterEmail('')
            setPopupNewsletterName('')
            setNewsletterPopupOpen(false)
            localStorage.setItem('newsletterSubscribed', 'true')
          } else {
            setNewsletterEmail('')
            setNewsletterName('')
          }
          
          // Afficher le modal avec le code promo
          setTimeout(() => {
            setPromoCodeModalOpen(true)
          }, 500)
        } else {
          toast({ 
            title: language === 'fr' ? '✅ Abonnement réussi !' : '✅ Subscription successful!',
            description: language === 'fr' 
              ? 'Vérifiez votre email pour votre message de bienvenue !' 
              : 'Check your email for your welcome message!'
          })
        }
        
        if (isPopup) {
          setPopupNewsletterEmail('')
          setPopupNewsletterName('')
          setNewsletterPopupOpen(false)
          localStorage.setItem('newsletterSubscribed', 'true')
          // Sauvegarder le code promo dans localStorage pour référence
          if (data.promoCode) {
            localStorage.setItem('newsletterPromoCode', data.promoCode)
          }
        } else {
          setNewsletterEmail('')
          setNewsletterName('')
          // Sauvegarder le code promo dans localStorage pour référence
          if (data.promoCode) {
            localStorage.setItem('newsletterPromoCode', data.promoCode)
          }
        }
      } else {
        toast({ 
          title: data.error || (language === 'fr' ? 'Erreur' : 'Error'), 
          variant: 'destructive' 
        })
      }
    } catch (error) {
      toast({ 
        title: language === 'fr' ? 'Erreur réseau' : 'Network error', 
        variant: 'destructive' 
      })
    } finally {
      if (isPopup) {
        setPopupNewsletterLoading(false)
      } else {
        setNewsletterLoading(false)
      }
    }
  }

  const handleCloseNewsletterPopup = () => {
    setNewsletterPopupOpen(false)
    localStorage.setItem('newsletterPopupClosed', 'true')
  }

  // Fonction pour obtenir le nom d'affichage de la catégorie
  const getCategoryDisplayName = (category) => {
    const categoryNames = {
      'bijoux-accessoires': language === 'fr' ? 'Bijoux & Accessoires' : 'Jewelry & Accessories',
      'decoration-maison': language === 'fr' ? 'Décoration Maison' : 'Home Decoration',
      'objets-art': language === 'fr' ? 'Objets d\'Art' : 'Art Objects',
      'accessoires-quotidiens': language === 'fr' ? 'Accessoires Quotidiens' : 'Daily Accessories'
    }
    return categoryNames[category] || category
  }

  // Filtrer les produits avec useMemo pour éviter les recalculs inutiles
  const filteredProducts = useMemo(() => {
    if (!products || products.length === 0) return []
    
    let filtered = products
    
    // Filtrer par catégorie (si 'all', on prend tous les produits)
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory)
    }
    
    // Filtrer par recherche
    if (debouncedSearchQuery && debouncedSearchQuery.trim() !== '') {
      const searchLower = debouncedSearchQuery.toLowerCase()
      filtered = filtered.filter(p => {
        const name = (language === 'fr' ? p.name_fr : p.name_en) || ''
        const desc = (language === 'fr' ? p.description_fr : p.description_en) || ''
        return name.toLowerCase().includes(searchLower) || desc.toLowerCase().includes(searchLower)
      })
    }
    
    // Trier
    if (sortBy === 'price-asc') {
      filtered = filtered.sort((a, b) => (a.price || 0) - (b.price || 0))
    } else if (sortBy === 'price-desc') {
      filtered = filtered.sort((a, b) => (b.price || 0) - (a.price || 0))
    }
    
    return filtered
  }, [products, selectedCategory, debouncedSearchQuery, sortBy, language])

  // Grouper les produits par catégorie avec useMemo
  // Utiliser tous les produits pour le groupement, pas seulement les filtrés
  const productsByCategory = useMemo(() => {
    if (!products || products.length === 0) return {}
    
    return products.reduce((acc, product) => {
      const category = product.category || 'other'
      if (!acc[category]) {
        acc[category] = []
      }
      acc[category].push(product)
      return acc
    }, {})
  }, [products])

  // Ordre des catégories pour l'affichage
  const categoryOrder = useMemo(() => ['bijoux-accessoires', 'decoration-maison', 'objets-art', 'accessoires-quotidiens'], [])

  // Produits vedettes pour la page d'accueil (prioriser les 5 produits originaux)
  const featuredProducts = useMemo(() => {
    if (products.length === 0) return []
    
    // Identifier les 5 produits originaux par leurs noms (ceux qui étaient dans le projet initial)
    const originalProductNames = [
      "Boucles d'oreilles Ocean Wave",
      "Pendentif Fleurs Séchées", 
      "Bague Galaxy Cosmos",
      "Barrettes Florales",
      "Bracelet Géométrique"
    ]
    
    // Séparer les produits originaux des autres
    const originalProducts = products.filter(p => 
      originalProductNames.some(name => 
        p.name_fr?.includes(name) || p.name_en?.includes(name.replace('Ocean Wave', 'Ocean Wave').replace('Fleurs Séchées', 'Dried Flowers'))
      )
    )
    
    const otherProducts = products.filter(p => 
      !originalProductNames.some(name => 
        p.name_fr?.includes(name) || p.name_en?.includes(name.replace('Ocean Wave', 'Ocean Wave').replace('Fleurs Séchées', 'Dried Flowers'))
      )
    )
    
    // Mélanger : 5 originaux (ou moins si pas assez) + autres produits pour compléter à 6
    return [
      ...originalProducts.slice(0, 5),
      ...otherProducts.slice(0, Math.max(0, 6 - originalProducts.length))
    ].slice(0, 6)
  }, [products])


  const filteredBlogPosts = blogPosts
    .filter(p => selectedBlogCategory === 'all' || p.category === selectedBlogCategory)

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-50 bg-white shadow-md">
        <div className="container mx-auto px-2 sm:px-4">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <div className="flex items-center gap-2 sm:gap-3 cursor-pointer" onClick={() => setCurrentPage('home')}>
              <LogoComponent size="small" />
              <div className="hidden xs:block">
                <h1 className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">Missa Créations</h1>
                <p className="text-[10px] sm:text-xs text-gray-500 hidden sm:block">Personnalisées et Artisanales</p>
              </div>
            </div>

            <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
              <button onClick={() => setCurrentPage('home')} className={`font-semibold capitalize transition-all ${currentPage === 'home' ? 'text-pink-600 border-b-2 border-pink-600' : 'text-gray-600 hover:text-pink-500'}`}>{t('home')}</button>
              <button onClick={() => setCurrentPage('products')} className={`font-semibold capitalize transition-all ${currentPage === 'products' ? 'text-pink-600 border-b-2 border-pink-600' : 'text-gray-600 hover:text-pink-500'}`}>{t('products')}</button>
              <button onClick={() => setCurrentPage('customize')} className={`font-semibold capitalize transition-all ${currentPage === 'customize' ? 'text-pink-600 border-b-2 border-pink-600' : 'text-gray-600 hover:text-pink-500'}`}>✨ {language === 'fr' ? 'Personnaliser' : 'Customize'}</button>
              <button onClick={() => setCurrentPage('blog')} className={`font-semibold capitalize transition-all ${currentPage === 'blog' ? 'text-pink-600 border-b-2 border-pink-600' : 'text-gray-600 hover:text-pink-500'}`}>{t('blog')}</button>
              <button onClick={() => setContactModalOpen(true)} className={`font-semibold capitalize transition-all ${contactModalOpen ? 'text-pink-600 border-b-2 border-pink-600' : 'text-gray-600 hover:text-pink-500'}`}>{t('contact')}</button>
            </nav>

            <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
              <button onClick={() => setSearchModalOpen(true)} className="p-1.5 sm:p-2 hover:bg-pink-50 rounded-full transition">
                <Search className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 hover:text-pink-500 transition" />
              </button>
              
              <div className="relative cursor-pointer hidden sm:block" onClick={() => setCurrentPage('favorites')}>
                <Heart className={`w-4 h-4 sm:w-5 sm:h-5 cursor-pointer transition ${favorites.length > 0 ? 'fill-pink-500 text-pink-500' : 'text-gray-600 hover:text-pink-500'}`} />
                {favorites.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 sm:-top-2 sm:-right-2 w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-[10px] sm:text-xs rounded-full flex items-center justify-center font-bold">{favorites.length}</span>
                )}
              </div>

              <button onClick={toggleLanguage} className="hidden md:flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-pink-500 transition">
                <Globe className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="uppercase text-xs sm:text-sm">{language}</span>
              </button>

              <div className="relative cursor-pointer" onClick={() => setCartOpen(true)}>
                <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 hover:text-pink-500 transition" />
                {cart.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 sm:-top-2 sm:-right-2 w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-[10px] sm:text-xs rounded-full flex items-center justify-center font-bold">{cart.length}</span>
                )}
              </div>
              
              <button className="lg:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
              </button>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden border-t">
            <nav className="flex flex-col p-2 sm:p-4 gap-1 sm:gap-2">
              <button onClick={() => { setCurrentPage('home'); setMobileMenuOpen(false) }} className="text-left py-2 px-3 sm:px-4 hover:bg-gray-100 rounded text-sm sm:text-base">{t('home')}</button>
              <button onClick={() => { setCurrentPage('products'); setMobileMenuOpen(false) }} className="text-left py-2 px-3 sm:px-4 hover:bg-gray-100 rounded text-sm sm:text-base">{t('products')}</button>
              <button onClick={() => { setCurrentPage('customize'); setMobileMenuOpen(false) }} className="text-left py-2 px-3 sm:px-4 hover:bg-gray-100 rounded text-sm sm:text-base">✨ {language === 'fr' ? 'Personnaliser' : 'Customize'}</button>
              <button onClick={() => { setCurrentPage('blog'); setMobileMenuOpen(false) }} className="text-left py-2 px-3 sm:px-4 hover:bg-gray-100 rounded text-sm sm:text-base">{t('blog')}</button>
              <button onClick={() => { setCurrentPage('favorites'); setMobileMenuOpen(false) }} className="text-left py-2 px-3 sm:px-4 hover:bg-gray-100 rounded text-sm sm:text-base">{t('favorites')}</button>
              <button onClick={() => { setContactModalOpen(true); setMobileMenuOpen(false) }} className="text-left py-2 px-3 sm:px-4 hover:bg-gray-100 rounded text-sm sm:text-base">{t('contact')}</button>
              <div className="flex items-center gap-2 px-3 sm:px-4 py-2 border-t mt-2">
                <button onClick={toggleLanguage} className="flex items-center gap-2 text-sm text-gray-600 hover:text-pink-500">
                  <Globe className="w-4 h-4" />
                  <span className="uppercase">{language}</span>
                </button>
              </div>
            </nav>
          </div>
        )}
      </header>

      {currentPage === 'home' && (
        <main className="overflow-hidden">
          {/* Hero Section - Ultra Attractive */}
          <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-20 left-10 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
              <div className="absolute top-40 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
              <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20 text-center z-10">
              {/* Badge */}
              <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg mb-6 sm:mb-8 animate-fade-in">
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-pink-500" />
                <span className="text-xs sm:text-sm font-semibold text-gray-700">
                  {language === 'fr' ? '✨ Créations 100% Artisanales' : '✨ 100% Handcrafted Creations'}
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold mb-4 sm:mb-6 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent leading-tight animate-slide-up px-2">
                {language === 'fr' ? (
                  <>
                    Créations Artisanales<br />
                    <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">en Résine</span>
                  </>
                ) : (
                  <>
                    Handcrafted Creations<br />
                    <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">in Resin</span>
                  </>
                )}
              </h1>

              {/* Subheadline */}
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-gray-700 mb-3 sm:mb-4 max-w-3xl mx-auto font-medium animate-slide-up-delay px-2">
                {language === 'fr' 
                  ? 'Personnalisez chaque détail : couleur, paillettes, fleurs séchées, initiales'
                  : 'Customize every detail: color, glitter, dried flowers, initials'}
              </p>
              <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-8 sm:mb-12 max-w-2xl mx-auto animate-slide-up-delay-2 px-2">
                {language === 'fr' 
                  ? 'Des créations en résine faites main avec passion, pour des souvenirs qui durent toute une vie'
                  : 'Handcrafted resin creations with passion, for memories that last a lifetime'}
              </p>

              {/* CTA Buttons - Multiple and Active */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-12 sm:mb-16 animate-fade-in-delay px-2">
                <Button 
                  onClick={() => setCurrentPage('products')}
                  size="lg" 
                  className="w-full sm:w-auto bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 hover:from-pink-600 hover:via-purple-600 hover:to-pink-600 text-white text-base sm:text-lg md:text-xl px-6 sm:px-8 md:px-12 py-4 sm:py-5 md:py-6 rounded-full shadow-2xl transform hover:scale-105 sm:hover:scale-110 transition-all duration-300 font-bold animate-pulse-slow relative overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2 sm:gap-3">
                    <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
                    {language === 'fr' ? '🛍️ Explorer la Boutique' : '🛍️ Explore Shop'}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </Button>
                
                <Button 
                  onClick={() => setCurrentPage('customize')}
                  size="lg" 
                  variant="outline"
                  className="w-full sm:w-auto border-2 sm:border-3 border-pink-500 text-pink-600 hover:bg-pink-50 text-base sm:text-lg md:text-xl px-6 sm:px-8 md:px-12 py-4 sm:py-5 md:py-6 rounded-full shadow-xl transform hover:scale-105 sm:hover:scale-110 transition-all duration-300 font-bold bg-white/80 backdrop-blur-sm"
                >
                  <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                  {language === 'fr' ? '✨ Personnaliser Maintenant' : '✨ Customize Now'}
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-3xl mx-auto animate-fade-in-delay-2 px-2">
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-pink-600 mb-1 sm:mb-2">{products.length}+</div>
                  <div className="text-xs sm:text-sm text-gray-600">{language === 'fr' ? 'Créations Uniques' : 'Unique Creations'}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-purple-600 mb-1 sm:mb-2">100%</div>
                  <div className="text-xs sm:text-sm text-gray-600">{language === 'fr' ? 'Fait Main' : 'Handmade'}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-600 mb-1 sm:mb-2">5★</div>
                  <div className="text-xs sm:text-sm text-gray-600">{language === 'fr' ? 'Satisfaction' : 'Satisfaction'}</div>
                </div>
              </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
              <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
                <div className="w-1 h-3 bg-gray-400 rounded-full mt-2"></div>
              </div>
            </div>
          </section>

          {/* Featured Products Section - Enhanced */}
          <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-white to-gray-50">
            <div className="container mx-auto px-3 sm:px-4">
              <div className="text-center mb-10 sm:mb-12 md:mb-16">
                <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-pink-100 rounded-full mb-3 sm:mb-4">
                  <Star className="w-4 h-4 sm:w-5 sm:h-5 text-pink-500 fill-pink-500" />
                  <span className="text-xs sm:text-sm font-semibold text-pink-700">{language === 'fr' ? 'Produits Populaires' : 'Popular Products'}</span>
                </div>
                <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent px-2">
                  {language === 'fr' ? '✨ Nos Créations Vedettes' : '✨ Our Featured Creations'}
                </h3>
                <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-2">
                  {language === 'fr' 
                    ? 'Découvrez nos créations les plus appréciées, toutes personnalisables selon vos envies'
                    : 'Discover our most loved creations, all customizable to your desires'}
                </p>
              </div>
              
              {products.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-gray-500 text-lg">{t('noProductsAvailable')}</p>
                  </CardContent>
                </Card>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                    {featuredProducts.map((product, idx) => (
                      <div key={product._id} className="transform transition-all duration-300 hover:scale-105" style={{ animationDelay: `${idx * 100}ms` }}>
                        <ProductCard 
                          product={product} 
                          onAddToCart={addToCart} 
                          onCustomize={handleCustomize} 
                          onToggleFavorite={toggleFavorite} 
                          isFavorite={isFavorite(product._id)} 
                          onViewDetails={handleViewDetails}
                          language={language} 
                          t={t} 
                        />
                      </div>
                    ))}
                  </div>
                  
                  {/* CTA for Products */}
                  <div className="text-center">
                    <Button 
                      onClick={() => setCurrentPage('products')}
                      size="lg"
                      className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-12 py-6 rounded-full shadow-2xl transform hover:scale-110 transition-all font-bold text-lg"
                    >
                      {language === 'fr' ? '👉 Voir Tous les Produits' : '👉 View All Products'}
                    </Button>
                  </div>
                </>
              )}
            </div>
          </section>

          {/* Why Choose Us - Enhanced */}
          <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full filter blur-3xl"></div>
              <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full filter blur-3xl"></div>
            </div>
            
            <div className="container mx-auto px-3 sm:px-4 relative z-10">
              <div className="text-center mb-10 sm:mb-12 md:mb-16">
                <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 px-2">{language === 'fr' ? 'Pourquoi Nous Choisir ?' : 'Why Choose Us?'}</h3>
                <p className="text-base sm:text-lg md:text-xl text-white/90 max-w-2xl mx-auto px-2">
                  {language === 'fr' 
                    ? 'Une expérience unique de création personnalisée, de la conception à la livraison'
                    : 'A unique personalized creation experience, from design to delivery'}
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                <Card className="text-center shadow-2xl bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-all transform hover:scale-105">
                  <CardContent className="pt-8 pb-8">
                    <div className="w-20 h-20 mx-auto mb-6 bg-white/20 rounded-full flex items-center justify-center">
                      <Package className="w-10 h-10 text-white" />
                    </div>
                    <h4 className="text-2xl font-bold mb-3">{t('handmade')}</h4>
                    <p className="text-white/90">{t('handmadeDesc')}</p>
                  </CardContent>
                </Card>
                
                <Card className="text-center shadow-2xl bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-all transform hover:scale-105">
                  <CardContent className="pt-8 pb-8">
                    <div className="w-20 h-20 mx-auto mb-6 bg-white/20 rounded-full flex items-center justify-center">
                      <Sparkles className="w-10 h-10 text-white" />
                    </div>
                    <h4 className="text-2xl font-bold mb-3">{t('customizable')}</h4>
                    <p className="text-white/90">{t('customizableDesc')}</p>
                  </CardContent>
                </Card>
                
                <Card className="text-center shadow-2xl bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-all transform hover:scale-105">
                  <CardContent className="pt-8 pb-8">
                    <div className="w-20 h-20 mx-auto mb-6 bg-white/20 rounded-full flex items-center justify-center">
                      <Truck className="w-10 h-10 text-white" />
                    </div>
                    <h4 className="text-2xl font-bold mb-3">{t('fastShipping')}</h4>
                    <p className="text-white/90">{t('fastShippingDesc')}</p>
                  </CardContent>
                </Card>
              </div>

              {/* Final CTA */}
              <div className="text-center mt-16">
                <Button 
                  onClick={() => setCurrentPage('customize')}
                  size="lg"
                  className="bg-white text-pink-600 hover:bg-gray-100 px-12 py-6 rounded-full shadow-2xl transform hover:scale-110 transition-all font-bold text-lg"
                >
                  <Sparkles className="w-6 h-6 mr-2" />
                  {language === 'fr' ? '🚀 Commencer Ma Création' : '🚀 Start My Creation'}
                </Button>
              </div>
            </div>
          </section>

          {/* Add CSS Animations */}
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes blob {
              0%, 100% {
                transform: translate(0, 0) scale(1);
              }
              33% {
                transform: translate(30px, -50px) scale(1.1);
              }
              66% {
                transform: translate(-20px, 20px) scale(0.9);
              }
            }
            @keyframes fade-in {
              from {
                opacity: 0;
                transform: translateY(20px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
            @keyframes slide-up {
              from {
                opacity: 0;
                transform: translateY(40px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
            @keyframes pulse-slow {
              0%, 100% {
                opacity: 1;
              }
              50% {
                opacity: 0.8;
              }
            }
            .animate-blob {
              animation: blob 7s infinite;
            }
            .animation-delay-2000 {
              animation-delay: 2s;
            }
            .animation-delay-4000 {
              animation-delay: 4s;
            }
            .animate-fade-in {
              animation: fade-in 1s ease-out;
            }
            .animate-fade-in-delay {
              animation: fade-in 1s ease-out 0.3s both;
            }
            .animate-fade-in-delay-2 {
              animation: fade-in 1s ease-out 0.6s both;
            }
            .animate-slide-up {
              animation: slide-up 0.8s ease-out;
            }
            .animate-slide-up-delay {
              animation: slide-up 0.8s ease-out 0.2s both;
            }
            .animate-slide-up-delay-2 {
              animation: slide-up 0.8s ease-out 0.4s both;
            }
            .animate-pulse-slow {
              animation: pulse-slow 3s ease-in-out infinite;
            }
          `}} />
        </main>
      )}

      {currentPage === 'products' && (
        <main className="container mx-auto px-4 py-12">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">{t('allProducts')}</h2>
              <p className="text-gray-600 mt-2">
                {language === 'fr' 
                  ? `${filteredProducts.length} produit${filteredProducts.length > 1 ? 's' : ''} ${selectedCategory !== 'all' ? 'dans cette catégorie' : 'disponible' + (products.length > 0 ? ` (${products.length} au total)` : '')}`
                  : `${filteredProducts.length} product${filteredProducts.length !== 1 ? 's' : ''} ${selectedCategory !== 'all' ? 'in this category' : 'available' + (products.length > 0 ? ` (${products.length} total)` : '')}`
                }
              </p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => loadProducts(true)}
              className="flex items-center gap-2"
              title={language === 'fr' ? 'Recharger les produits' : 'Reload products'}
            >
              <RefreshCw className="w-4 h-4" />
              {language === 'fr' ? 'Actualiser' : 'Refresh'}
            </Button>
          </div>
          
          <div className="mb-6 sm:mb-8 flex flex-col md:flex-row gap-3 sm:gap-4">
            <div className="flex gap-2 flex-wrap">
              {['all', 'bijoux-accessoires', 'decoration-maison', 'objets-art', 'accessoires-quotidiens'].map(cat => (
                <Button key={cat} variant={selectedCategory === cat ? 'default' : 'outline'} onClick={() => setSelectedCategory(cat)} className={`text-xs sm:text-sm ${selectedCategory === cat ? 'bg-gradient-to-r from-pink-500 to-purple-600' : ''}`}>
                  {cat === 'all' ? t('all') : cat === 'bijoux-accessoires' ? t('jewelry') : cat === 'decoration-maison' ? t('decoration') : cat === 'objets-art' ? t('artObjects') : t('accessories')}
                </Button>
              ))}
            </div>
            <div className="flex gap-2 sm:gap-4 flex-1">
              <Input placeholder={t('search')} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="flex-1 text-sm sm:text-base" />
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[140px] sm:w-[200px] text-xs sm:text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">{t('default')}</SelectItem>
                  <SelectItem value="price-asc">{t('priceAsc')}</SelectItem>
                  <SelectItem value="price-desc">{t('priceDesc')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500 text-lg mb-2">{searchQuery ? t('noProductsFound') : t('noProductsAvailable')}</p>
                {!searchQuery && products.length === 0 && (
                  <div className="mt-4 space-y-2">
                    <p className="text-sm text-gray-400">Les produits n'ont pas encore été ajoutés à la base de données.</p>
                    <p className="text-sm text-gray-400">Pour ajouter les 18 produits, allez sur <code className="bg-gray-100 px-2 py-1 rounded">/admin/products</code></p>
                  </div>
                )}
                {searchQuery && (
                  <Button onClick={() => setSearchQuery('')} className="mt-4 bg-gradient-to-r from-pink-500 to-purple-600">{t('clearSearch')}</Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-12">
              {selectedCategory === 'all' ? (
                // Afficher toutes les catégories groupées (en utilisant filteredProducts pour respecter la recherche)
                (() => {
                  // Grouper les produits filtrés par catégorie
                  const filteredByCategory = filteredProducts.reduce((acc, product) => {
                    const category = product.category || 'other'
                    if (!acc[category]) {
                      acc[category] = []
                    }
                    acc[category].push(product)
                    return acc
                  }, {})
                  
                  // Obtenir toutes les catégories uniques des produits filtrés
                  const allCategories = Object.keys(filteredByCategory)
                  
                  // Trier : d'abord les catégories dans categoryOrder, puis les autres
                  const sortedCategories = [
                    ...categoryOrder.filter(cat => filteredByCategory[cat] && filteredByCategory[cat].length > 0),
                    ...allCategories.filter(cat => !categoryOrder.includes(cat) && filteredByCategory[cat] && filteredByCategory[cat].length > 0)
                  ]
                  
                  if (sortedCategories.length === 0) {
                    // Si aucune catégorie après filtrage, afficher un message
                    return null
                  }
                  
                  return sortedCategories.map(category => {
                    const categoryProducts = filteredByCategory[category] || []
                    if (categoryProducts.length === 0) return null
                    
                    return (
                      <div key={category} className="space-y-6">
                        <div className="flex items-center justify-between border-b-2 border-gradient-to-r from-pink-200 to-purple-200 pb-4 mb-6">
                          <div className="flex items-center gap-4">
                            <h3 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                              {getCategoryDisplayName(category)}
                            </h3>
                            <Badge variant="outline" className="text-sm font-semibold border-pink-300 text-pink-600">
                              {categoryProducts.length} {categoryProducts.length === 1 ? (language === 'fr' ? 'produit' : 'product') : (language === 'fr' ? 'produits' : 'products')}
                            </Badge>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                          {categoryProducts.map(product => (
                            <ProductCard 
                              key={product._id} 
                              product={product} 
                              onAddToCart={addToCart} 
                              onCustomize={handleCustomize} 
                              onToggleFavorite={toggleFavorite} 
                              isFavorite={isFavorite(product._id)} 
                              onViewDetails={handleViewDetails}
                              language={language} 
                              t={t} 
                            />
                          ))}
                        </div>
                      </div>
                    )
                  })
                })()
              ) : (
                // Afficher seulement la catégorie sélectionnée
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b-2 border-gradient-to-r from-pink-200 to-purple-200 pb-4 mb-6">
                    <div className="flex items-center gap-4">
                      <h3 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                        {getCategoryDisplayName(selectedCategory)}
                      </h3>
                      <Badge variant="outline" className="text-sm font-semibold border-pink-300 text-pink-600">
                        {filteredProducts.length} {filteredProducts.length === 1 ? (language === 'fr' ? 'produit' : 'product') : (language === 'fr' ? 'produits' : 'products')}
                      </Badge>
                    </div>
                  </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
                      <ProductCard 
                        key={product._id} 
                        product={product} 
                        onAddToCart={addToCart} 
                        onCustomize={handleCustomize} 
                        onToggleFavorite={toggleFavorite} 
                        isFavorite={isFavorite(product._id)} 
                        onImageClick={(img) => { setSelectedImage(img); setImageModalOpen(true) }} 
                        language={language} 
                        t={t} 
                      />
            ))}
          </div>
                </div>
              )}
            </div>
          )}
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
                <ProductCard key={product._id} product={product} onAddToCart={addToCart} onCustomize={handleCustomize} onToggleFavorite={toggleFavorite} isFavorite={true} onViewDetails={handleViewDetails} language={language} t={t} />
              ))}
            </div>
          )}
        </main>
      )}

      {currentPage === 'customize' && (
        <main className="container mx-auto px-4 py-12">
          {!selectedProduct ? (
            <>
              {/* Sélection du produit à personnaliser */}
              <div className="text-center mb-12">
                <Sparkles className="w-16 h-16 mx-auto mb-6 text-pink-500" />
                <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                  {language === 'fr' ? '✨ Créez Votre Bijou Unique' : '✨ Create Your Unique Jewelry'}
                </h2>
                <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                  {language === 'fr' 
                    ? 'Personnalisez chaque détail : couleur, paillettes, fleurs séchées, initiales. Visualisez votre création en temps réel avant de commander.'
                    : 'Customize every detail: color, glitter, dried flowers, initials. Visualize your creation in real-time before ordering.'}
                </p>
              </div>

              {/* Liste des produits personnalisables */}
              <div>
                <h3 className="text-2xl font-bold mb-6 text-gray-800">
                  {language === 'fr' ? 'Choisissez un produit à personnaliser' : 'Choose a product to customize'}
                </h3>
                
                {products.filter(p => p.isCustomizable).length === 0 ? (
                  <Card className="text-center py-12">
                    <CardContent>
                      <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                      <p className="text-gray-500 text-lg">
                        {language === 'fr' 
                          ? 'Aucun produit personnalisable disponible pour le moment.'
                          : 'No customizable products available at the moment.'}
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.filter(p => p.isCustomizable).map(product => (
                      <Card 
                        key={product._id} 
                        className="group overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer"
                        onClick={() => {
                          setSelectedProduct(product)
                          setCustomization({
                            color: 'transparent',
                            glitter: 'none',
                            flower: 'lavande',
                            initial: 'M'
                          })
                          setCustomText('')
                          setCustomImages([])
                          setCustomizeModalOpen(true)
                        }}
                      >
                        <div className="relative overflow-hidden">
                          <img 
                            src={product.images && product.images.length > 0 ? product.images[0] : 'https://images.unsplash.com/photo-1612672358776-15458bfd9869?w=800&q=80'} 
                            alt={language === 'fr' ? product.name_fr : product.name_en} 
                            className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300" 
                            loading="lazy"
                            decoding="async"
                          />
                          <Badge className="absolute top-3 right-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white">
                            ✨ {language === 'fr' ? 'Personnalisable' : 'Customizable'}
                          </Badge>
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-bold text-lg mb-2">{language === 'fr' ? product.name_fr : product.name_en}</h3>
                          <p className="text-2xl font-bold text-pink-500 mb-4">{product.price}$ CAD</p>
                          <Button 
                            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedProduct(product)
                              setCustomization({
                                color: 'transparent',
                                glitter: 'none',
                                flower: 'lavande',
                                initial: 'M'
                              })
                              setCustomText('')
                              setCustomImages([])
                              setCustomizeModalOpen(true)
                            }}
                          >
                            {language === 'fr' ? 'Personnaliser' : 'Customize'}
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {/* Informations sur la personnalisation */}
                <div className="mt-12 grid md:grid-cols-3 gap-6">
                  <Card className="text-center p-6">
                    <div className="text-5xl mb-4">🎨</div>
                    <h3 className="font-bold text-xl mb-2">{language === 'fr' ? 'Choix des couleurs' : 'Color selection'}</h3>
                    <p className="text-gray-600">{language === 'fr' ? 'Transparent, océan, noir, or, et plus encore' : 'Transparent, ocean, black, gold, and more'}</p>
                  </Card>
                  <Card className="text-center p-6">
                    <div className="text-5xl mb-4">✨</div>
                    <h3 className="font-bold text-xl mb-2">{language === 'fr' ? 'Paillettes' : 'Glitter'}</h3>
                    <p className="text-gray-600">{language === 'fr' ? 'Dorées, argentées ou effet holographique' : 'Gold, silver or holographic effect'}</p>
                  </Card>
                  <Card className="text-center p-6">
                    <div className="text-5xl mb-4">🌸</div>
                    <h3 className="font-bold text-xl mb-2">{language === 'fr' ? 'Fleurs séchées' : 'Dried flowers'}</h3>
                    <p className="text-gray-600">{language === 'fr' ? 'Lavande, rose, marguerite préservées' : 'Preserved lavender, rose, daisy'}</p>
                  </Card>
                </div>
              </div>
            </>
          ) : (
            // Le modal de personnalisation s'affichera via customizeModalOpen
            <div className="text-center py-12">
              <p className="text-gray-500">{language === 'fr' ? 'Personnalisation en cours...' : 'Customization in progress...'}</p>
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
                  <Button variant="outline" className="w-full" onClick={() => {
                    setSelectedBlogPost(post)
                    setBlogPostModalOpen(true)
                  }}>{t('readMore')}</Button>
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
                    {/* Étape 1: Email uniquement */}
                    {checkoutStep === 'email' && (
                      <div className="space-y-6 py-6">
                        <div className="text-center mb-6">
                          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full mb-4">
                            <span className="text-2xl">📧</span>
                          </div>
                          <h4 className="text-2xl font-bold mb-2">
                            {language === 'fr' ? 'Commençons par votre email' : 'Let\'s start with your email'}
                          </h4>
                          <p className="text-gray-600">
                            {language === 'fr' 
                              ? 'Nous avons besoin de votre email pour continuer' 
                              : 'We need your email to continue'}
                          </p>
                        </div>
                        <div>
                          <Label className="text-lg font-semibold">{t('email')} *</Label>
                          <Input 
                            type="email" 
                            value={checkoutData.email} 
                            onChange={(e) => {
                              const email = e.target.value
                              setCheckoutData({...checkoutData, email})
                              setEmailSaved(false)
                              
                              // Annuler le timeout précédent
                              if (emailSaveTimeout) {
                                clearTimeout(emailSaveTimeout)
                              }
                              
                              // Enregistrer l'email dès qu'il est valide (après un délai de 1.5 secondes)
                              if (email && email.includes('@') && email.includes('.')) {
                                const timeout = setTimeout(async () => {
                                  try {
                                    const res = await fetch('/api/abandoned-carts', {
                                      method: 'POST',
                                      headers: { 'Content-Type': 'application/json' },
                                      body: JSON.stringify({
                                        email: email,
                                        name: checkoutData.firstName ? `${checkoutData.firstName} ${checkoutData.lastName}`.trim() : null,
                                        language: language,
                                        cartItems: cart,
                                        totalAmount: finalTotal
                                      })
                                    })
                                    const data = await res.json()
                                    if (data.success) {
                                      setEmailSaved(true)
                                    }
                                  } catch (error) {
                                    console.error('Error saving email:', error)
                                  }
                                }, 1500) // Délai de 1.5 secondes après la dernière frappe
                                setEmailSaveTimeout(timeout)
                              }
                            }}
                            placeholder={language === 'fr' ? 'votre@email.com' : 'your@email.com'}
                            className="h-14 text-lg"
                          />
                        </div>
                        <Button
                          onClick={() => {
                            if (checkoutData.email && checkoutData.email.includes('@') && checkoutData.email.includes('.')) {
                              setCheckoutStep('details')
                            } else {
                              toast({ 
                                title: language === 'fr' ? 'Email invalide' : 'Invalid email', 
                                variant: 'destructive' 
                              })
                            }
                          }}
                          className="w-full h-14 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-lg font-bold"
                        >
                          {language === 'fr' ? 'Continuer' : 'Continue'} →
                        </Button>
                      </div>
                    )}

                    {/* Étape 2: Tous les autres champs */}
                    {checkoutStep === 'details' && (
                      <>
                        {emailSaved && (
                          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                            <Check className="w-5 h-5 text-green-600" />
                            <span className="text-sm text-green-700">
                              {language === 'fr' ? 'Email enregistré avec succès' : 'Email saved successfully'}
                            </span>
                          </div>
                        )}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div><Label>{t('firstName')} *</Label><Input value={checkoutData.firstName} onChange={(e) => setCheckoutData({...checkoutData, firstName: e.target.value})} /></div>
                      <div><Label>{t('lastName')} *</Label><Input value={checkoutData.lastName} onChange={(e) => setCheckoutData({...checkoutData, lastName: e.target.value})} /></div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Label>{t('email')} *</Label>
                            <Input 
                              type="email" 
                              value={checkoutData.email} 
                              readOnly
                              className="bg-gray-100"
                            />
                          </div>
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
                      </>
                    )}
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
                        <p className="font-bold">{((item.finalPrice || calculateCustomizedPrice(item.price, !!item.customization)) * item.quantity).toFixed(2)}$</p>
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
                <p className="text-gray-600">{t('totalAmount')}: <strong className="text-pink-500">{confirmedOrderTotal.toFixed(2)}$ CAD</strong></p>
              </CardContent>
            </Card>
            <Button size="lg" onClick={() => setCurrentPage('home')} className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700">{t('backToHome')}</Button>
          </div>
        </main>
      )}

      {cartOpen && (
        <div className="fixed inset-0 z-50 bg-black/50" onClick={() => setCartOpen(false)}>
          <div className="absolute right-0 top-0 h-full w-full sm:max-w-md bg-white shadow-2xl p-4 sm:p-6 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <h3 className="text-xl sm:text-2xl font-bold">{t('yourCart')} ({cart.length})</h3>
              <Button variant="ghost" size="icon" onClick={() => setCartOpen(false)}><X className="w-5 h-5 sm:w-6 sm:h-6" /></Button>
            </div>

            {cart.length === 0 ? (
              <p className="text-center text-gray-500 py-12">{t('emptyCart')}</p>
            ) : (
              <>
                <div className="space-y-4 mb-6">
                  {cart.map(item => (
                    <Card key={item.id}>
                      <CardContent className="p-4">
                        <div className="flex gap-2 sm:gap-3">
                          <img src={item.image} alt={item.name} className="w-16 h-16 sm:w-20 sm:h-20 rounded object-cover flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-sm sm:text-base truncate">{item.name}</h4>
                            <p className="text-xs sm:text-sm text-gray-500">
                              {item.price}$ 
                              {item.customization && (
                                <span className="text-purple-600 font-semibold">
                                  {' '}+ {((item.finalPrice || calculateCustomizedPrice(item.price, true)) - item.price).toFixed(2)}$ ({language === 'fr' ? 'personnalisé' : 'customized'})
                                </span>
                              )}
                            </p>
                            {item.customization && <Badge className="mt-1 bg-purple-100 text-purple-700 text-xs">✨ {t('customized')}</Badge>}
                            <div className="flex items-center gap-1.5 sm:gap-2 mt-2">
                              <Button size="icon" variant="outline" className="h-7 w-7 sm:h-8 sm:w-8" onClick={() => updateQuantity(item.id, -1)}><Minus className="w-3 h-3 sm:w-4 sm:h-4" /></Button>
                              <span className="w-6 sm:w-8 text-center font-bold text-sm sm:text-base">{item.quantity}</span>
                              <Button size="icon" variant="outline" className="h-7 w-7 sm:h-8 sm:w-8" onClick={() => updateQuantity(item.id, 1)}><Plus className="w-3 h-3 sm:w-4 sm:h-4" /></Button>
                              <Button size="icon" variant="destructive" className="h-7 w-7 sm:h-8 sm:w-8 ml-auto" onClick={() => removeFromCart(item.id)}><Trash2 className="w-3 h-3 sm:w-4 sm:h-4" /></Button>
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

                <Button onClick={() => { setCartOpen(false); setCurrentPage('checkout') }} className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-sm sm:text-base" size="lg">{t('proceedToCheckout')}</Button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Modal de personnalisation avancée */}
      {customizeModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-2 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl sm:rounded-3xl max-w-7xl w-full my-4 max-h-[95vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center z-10">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">✨ {language === 'fr' ? 'Studio de Personnalisation Avancé' : 'Advanced Customization Studio'}</h2>
              <button onClick={() => {
                setCustomizeModalOpen(false)
                setSelectedProduct(null)
                setSelectedElement(null)
              }} className="text-gray-500 hover:text-gray-800 p-1">
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
            
            <div className="p-4 sm:p-6 grid lg:grid-cols-[1fr,400px] gap-6">
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
                      ref={advancedCanvasRef}
                      className="relative w-full aspect-square bg-gray-100 rounded-xl overflow-hidden shadow-lg cursor-crosshair"
                      style={{ 
                        backgroundImage: `url(${selectedProduct?.images?.[0] || selectedProduct?.image || 'https://images.unsplash.com/photo-1612672358776-15458bfd9869?w=800&q=80'})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}
                    >
                      {/* Overlay de couleur de base */}
                      {advancedBaseColor.type !== 'transparent' && (
                        <div 
                          className="absolute inset-0 mix-blend-overlay"
                          style={{ 
                            backgroundColor: baseColors.find(c => c.value === advancedBaseColor.type)?.hex,
                            opacity: advancedBaseColor.opacity / 100
                          }}
                        />
                      )}

                      {/* Paillettes */}
                      {advancedGlitters.map(glitter => (
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
                          <div className="relative w-full h-full">
                            {[...Array(Math.min(glitter.density, 30))].map((_, i) => {
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
                      {advancedFlowers.map(flower => (
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
                      {advancedTexts.map(text => (
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

                      {/* Texte personnalisé */}
                      {customText && (
                        <div
                          className={`absolute cursor-move transition-transform hover:scale-105 ${isDraggingCustomText ? 'ring-4 ring-pink-500' : ''}`}
                          style={{
                            left: `${customTextPosition.x}%`,
                            top: `${customTextPosition.y}%`,
                            fontSize: `${customTextFontSize}px`,
                            color: customTextColor,
                            fontFamily: customTextFontFamily,
                            fontWeight: 'bold',
                            transform: `translate(-50%, -50%) rotate(${customTextRotation}deg)`,
                            opacity: customTextOpacity / 100,
                            textShadow: customTextShadow ? '0 4px 12px rgba(0,0,0,0.5)' : 'none',
                            WebkitTextStroke: customTextOutline ? '2px white' : 'none'
                          }}
                          onMouseDown={(e) => {
                            if (e.button !== 0 || !advancedCanvasRef.current) return
                            setIsDraggingCustomText(true)
                            const rect = advancedCanvasRef.current.getBoundingClientRect()
                            const offsetX = e.clientX - rect.left - (customTextPosition.x / 100) * rect.width
                            const offsetY = e.clientY - rect.top - (customTextPosition.y / 100) * rect.height
                            setCustomTextDragOffset({ x: offsetX, y: offsetY })
                          }}
                        >
                          {customText}
                        </div>
                      )}

                      {/* Indicateur d'élément sélectionné */}
                      {(selectedElement || (customText && isDraggingCustomText)) && (
                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg">
                          <p className="text-sm font-semibold text-gray-800">
                            {selectedElement?.type === 'glitter' && '✨ Paillettes'}
                            {selectedElement?.type === 'flower' && '🌸 Fleur'}
                            {selectedElement?.type === 'text' && '📝 Texte'}
                            {customText && isDraggingCustomText && '📝 Texte Personnalisé'}
                          </p>
                          <p className="text-xs text-gray-600">{language === 'fr' ? 'Cliquez pour modifier' : 'Click to edit'}</p>
                        </div>
                      )}
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
                                onClick={() => setAdvancedBaseColor({ ...advancedBaseColor, type: color.value })}
                                className={`w-full aspect-square rounded-lg border-2 transition-all hover:scale-110 ${
                                  advancedBaseColor.type === color.value ? 'border-pink-500 ring-4 ring-pink-200' : 'border-gray-300'
                                }`}
                                style={{ backgroundColor: color.hex }}
                                title={color.name}
                              />
                            ))}
                          </div>
                          <Label>{language === 'fr' ? 'Opacité' : 'Opacity'}: {advancedBaseColor.opacity}%</Label>
                          <Slider
                            value={[advancedBaseColor.opacity]}
                            onValueChange={(v) => setAdvancedBaseColor({ ...advancedBaseColor, opacity: v[0] })}
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
                        {/* Champ de texte personnalisé (optionnel) */}
                        <div className="border-b pb-4 mb-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <Label className="text-base font-semibold">{language === 'fr' ? 'Texte personnalisé (optionnel)' : 'Custom text (optional)'}</Label>
                            {customText && (
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => {
                                  setCustomText('')
                                  setCustomTextPosition({ x: 50, y: 30 })
                                  setCustomTextFontSize(40)
                                  setCustomTextColor('#EC4899')
                                }}
                              >
                                <Trash2 className="w-4 h-4 mr-1" />
                                {language === 'fr' ? 'Supprimer' : 'Delete'}
                              </Button>
                            )}
                          </div>
                          <Textarea 
                            placeholder={language === 'fr' ? 'Entrez votre texte personnalisé ici...' : 'Enter your custom text here...'} 
                            value={customText} 
                            onChange={(e) => setCustomText(e.target.value)} 
                            rows={3}
                            className="resize-none"
                          />
                          <p className="text-xs text-gray-500">{customText.length} / 200 {language === 'fr' ? 'caractères' : 'characters'}</p>
                          
                          {customText && (
                            <div className="space-y-3 pt-3 border-t">
                              <div>
                                <Label>{language === 'fr' ? 'Couleur du texte' : 'Text color'}</Label>
                                <div className="flex gap-2 items-center mt-1">
                                  <input
                                    type="color"
                                    value={customTextColor}
                                    onChange={(e) => setCustomTextColor(e.target.value)}
                                    className="w-12 h-12 rounded cursor-pointer border-2 border-gray-300"
                                  />
                                  <Input
                                    value={customTextColor}
                                    onChange={(e) => setCustomTextColor(e.target.value)}
                                    className="flex-1 font-mono uppercase"
                                    placeholder="#EC4899"
                                  />
                                </div>
                              </div>
                              <div>
                                <div className="flex justify-between items-center mb-2">
                                  <Label>{language === 'fr' ? 'Taille' : 'Size'}: {customTextFontSize}px</Label>
                                </div>
                                <Slider
                                  value={[customTextFontSize]}
                                  onValueChange={(v) => setCustomTextFontSize(v[0])}
                                  min={10}
                                  max={100}
                                  step={1}
                                />
                              </div>
                              <div>
                                <Label>{language === 'fr' ? 'Police' : 'Font'}</Label>
                                <Select
                                  value={customTextFontFamily}
                                  onValueChange={setCustomTextFontFamily}
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
                                <Label>{language === 'fr' ? 'Rotation' : 'Rotation'}: {customTextRotation}°</Label>
                                <Slider
                                  value={[customTextRotation]}
                                  onValueChange={(v) => setCustomTextRotation(v[0])}
                                  min={0}
                                  max={360}
                                />
                              </div>
                              <div>
                                <Label>{language === 'fr' ? 'Opacité' : 'Opacity'}: {customTextOpacity}%</Label>
                                <Slider
                                  value={[customTextOpacity]}
                                  onValueChange={(v) => setCustomTextOpacity(v[0])}
                                  min={0}
                                  max={100}
                                />
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  variant={customTextShadow ? "default" : "outline"}
                                  onClick={() => setCustomTextShadow(!customTextShadow)}
                                  className="flex-1"
                                  size="sm"
                                >
                                  {language === 'fr' ? 'Ombre' : 'Shadow'}
                                </Button>
                                <Button
                                  variant={customTextOutline ? "default" : "outline"}
                                  onClick={() => setCustomTextOutline(!customTextOutline)}
                                  className="flex-1"
                                  size="sm"
                                >
                                  {language === 'fr' ? 'Contour' : 'Outline'}
                                </Button>
                              </div>
                              <p className="text-xs text-gray-500 italic">{language === 'fr' ? '💡 Cliquez et glissez le texte dans l\'aperçu pour le repositionner' : '💡 Click and drag the text in the preview to reposition it'}</p>
                            </div>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <Button onClick={() => addText(false)} className="bg-gradient-to-r from-pink-500 to-purple-600">
                            <Plus className="w-4 h-4 mr-2" />
                            {language === 'fr' ? 'Initiale' : 'Initial'}
                          </Button>
                          <Button onClick={() => addText(true)} variant="outline" className="border-pink-500 text-pink-500 hover:bg-pink-50">
                            <Plus className="w-4 h-4 mr-2" />
                            {language === 'fr' ? 'Nom Complet' : 'Full Name'}
                          </Button>
                        </div>

                        {/* Afficher le champ d'édition pour le dernier élément texte ajouté si aucun n'est sélectionné */}
                        {!selectedElement?.type && advancedTexts.length > 0 && (
                          <div className="border-t pt-4 space-y-3 bg-pink-50 p-4 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-bold text-sm">{language === 'fr' ? 'Éditer la dernière initiale/nom ajouté' : 'Edit last added initial/name'}</h4>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  const lastText = advancedTexts[advancedTexts.length - 1]
                                  setSelectedElement({ ...lastText, type: 'text' })
                                }}
                              >
                                {language === 'fr' ? 'Voir tous les détails' : 'View all details'}
                              </Button>
                            </div>
                            <div>
                              <Label className="mb-2 block">{language === 'fr' ? advancedTexts[advancedTexts.length - 1].isFullName ? 'Nom complet' : 'Initiale (2 lettres maximum)' : advancedTexts[advancedTexts.length - 1].isFullName ? 'Full Name' : 'Initial (2 letters max)'}</Label>
                              <Input
                                value={advancedTexts[advancedTexts.length - 1].content}
                                onChange={(e) => {
                                  const lastText = advancedTexts[advancedTexts.length - 1]
                                  const value = lastText.isFullName ? e.target.value : e.target.value.toUpperCase().slice(0, 2)
                                  updateElement('text', lastText.id, { content: value })
                                }}
                                maxLength={advancedTexts[advancedTexts.length - 1].isFullName ? 50 : 2}
                                placeholder={advancedTexts[advancedTexts.length - 1].isFullName ? (language === 'fr' ? 'Entrez le nom complet...' : 'Enter full name...') : (language === 'fr' ? 'Entrez 2 lettres (ex: MJ, AB)' : 'Enter 2 letters (ex: MJ, AB)')}
                                className={advancedTexts[advancedTexts.length - 1].isFullName ? '' : 'text-center text-2xl font-bold'}
                                autoFocus
                              />
                              {advancedTexts[advancedTexts.length - 1].isFullName ? (
                                <p className="text-xs text-gray-500 mt-1">{advancedTexts[advancedTexts.length - 1].content.length} / 50 {language === 'fr' ? 'caractères' : 'characters'}</p>
                              ) : (
                                <div className="mt-1">
                                  <p className="text-xs text-gray-500">{advancedTexts[advancedTexts.length - 1].content.length} / 2 {language === 'fr' ? 'lettres' : 'letters'}</p>
                                  {advancedTexts[advancedTexts.length - 1].content.length === 0 && (
                                    <p className="text-xs text-pink-500 italic mt-1">{language === 'fr' ? '💡 Vous pouvez entrer jusqu\'à 2 lettres (ex: MJ, AB, XY)' : '💡 You can enter up to 2 letters (ex: MJ, AB, XY)'}</p>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {selectedElement?.type === 'text' && (
                          <div className="border-t pt-4 space-y-3">
                            <h4 className="font-bold">{language === 'fr' ? selectedElement.isFullName ? 'Éditer le Nom Complet' : 'Éditer l\'Initiale' : selectedElement.isFullName ? 'Edit Full Name' : 'Edit Initial'}</h4>
                            <div>
                              <Label className="mb-2 block">{language === 'fr' ? selectedElement.isFullName ? 'Nom complet' : 'Initiale (2 lettres maximum)' : selectedElement.isFullName ? 'Full Name' : 'Initial (2 letters max)'}</Label>
                              <Input
                                value={selectedElement.content}
                                onChange={(e) => {
                                  const value = selectedElement.isFullName ? e.target.value : e.target.value.toUpperCase().slice(0, 2)
                                  updateElement('text', selectedElement.id, { content: value })
                                }}
                                maxLength={selectedElement.isFullName ? 50 : 2}
                                placeholder={selectedElement.isFullName ? (language === 'fr' ? 'Entrez le nom complet...' : 'Enter full name...') : (language === 'fr' ? 'Entrez 2 lettres (ex: MJ, AB)' : 'Enter 2 letters (ex: MJ, AB)')}
                                className={selectedElement.isFullName ? '' : 'text-center text-2xl font-bold'}
                              />
                              {selectedElement.isFullName ? (
                                <p className="text-xs text-gray-500 mt-1">{selectedElement.content.length} / 50 {language === 'fr' ? 'caractères' : 'characters'}</p>
                              ) : (
                                <div className="mt-1">
                                  <p className="text-xs text-gray-500">{selectedElement.content.length} / 2 {language === 'fr' ? 'lettres' : 'letters'}</p>
                                  {selectedElement.content.length === 0 && (
                                    <p className="text-xs text-pink-500 italic mt-1">{language === 'fr' ? '💡 Vous pouvez entrer jusqu\'à 2 lettres (ex: MJ, AB, XY)' : '💡 You can enter up to 2 letters (ex: MJ, AB, XY)'}</p>
                                  )}
                                </div>
                              )}
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
                      <div className="space-y-1 text-sm text-gray-600 mb-3">
                        <p>✨ {advancedGlitters.length} {language === 'fr' ? 'effet(s) de paillettes' : 'glitter effect(s)'}</p>
                        <p>🌸 {advancedFlowers.length} {language === 'fr' ? 'fleur(s) séchée(s)' : 'dried flower(s)'}</p>
                        <p>📝 {advancedTexts.length} {language === 'fr' ? 'texte(s) / initiale(s)' : 'text(s) / initial(s)'}</p>
                      </div>
                      <div className="border-t pt-3 space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>{language === 'fr' ? 'Prix de base' : 'Base price'}:</span>
                          <span>{(selectedProduct?.price || 39.99).toFixed(2)}$</span>
                        </div>
                        <div className="flex justify-between text-purple-600 font-semibold">
                          <span>+ {language === 'fr' ? 'Personnalisation (20%)' : 'Customization (20%)'}:</span>
                          <span>+ {((selectedProduct?.price || 39.99) * 0.2).toFixed(2)}$</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg border-t pt-2 text-pink-600">
                          <span>{language === 'fr' ? 'Total' : 'Total'}:</span>
                          <span>{calculateCustomizedPrice(selectedProduct?.price || 39.99, true).toFixed(2)}$ CAD</span>
                        </div>
                      </div>
                    </div>
                    <Button 
                      className="w-full h-14 bg-gradient-to-r from-pink-500 to-purple-600 text-lg font-bold" 
                      onClick={() => {
                        addToCart(selectedProduct, {
                          baseColor: advancedBaseColor,
                          glitters: advancedGlitters,
                          flowers: advancedFlowers,
                          texts: advancedTexts,
                          customText: customText,
                          customTextColor: customTextColor,
                          customTextPosition: customTextPosition,
                          customTextFontSize: customTextFontSize,
                          customTextFontFamily: customTextFontFamily,
                          customTextShadow: customTextShadow,
                          customTextOutline: customTextOutline,
                          customTextRotation: customTextRotation,
                          customTextOpacity: customTextOpacity,
                          images: customImages.map(img => img.preview)
                        })
                        setCustomizeModalOpen(false)
                        setSelectedProduct(null)
                        setSelectedElement(null)
                        toast({
                          title: language === 'fr' ? '✅ Produit ajouté au panier' : '✅ Product added to cart',
                          description: language === 'fr' ? 'Votre création personnalisée a été ajoutée avec succès !' : 'Your customized creation has been added successfully!'
                        })
                      }}
                    >
                      <ShoppingCartIcon className="w-5 h-5 mr-2" />
                      {language === 'fr' ? 'Ajouter au Panier' : 'Add to Cart'} - {calculateCustomizedPrice(selectedProduct?.price || 39.99, true).toFixed(2)}$ CAD
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
      )}

      <Dialog open={imageModalOpen} onOpenChange={setImageModalOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{t('productImage')}</DialogTitle>
          </DialogHeader>
          {selectedImage && (
            <div className="flex justify-center">
              <img 
                src={selectedImage} 
                alt="Product" 
                className="max-w-full max-h-[70vh] object-contain rounded-lg"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Contact Modal */}
      {/* Search Modal */}
      <Dialog open={searchModalOpen} onOpenChange={setSearchModalOpen}>
        <DialogContent className="max-w-3xl w-[95vw] sm:w-full">
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl flex items-center gap-2">
              <Search className="w-5 h-5 sm:w-6 sm:h-6 text-pink-500" />
              {language === 'fr' ? 'Rechercher un produit' : 'Search for a product'}
            </DialogTitle>
            <DialogDescription className="text-sm sm:text-base">
              {language === 'fr' 
                ? 'Tapez le nom d\'un produit pour le trouver rapidement' 
                : 'Type a product name to find it quickly'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              <Input
                type="text"
                placeholder={language === 'fr' ? 'Rechercher...' : 'Search...'}
                value={headerSearchQuery}
                onChange={(e) => setHeaderSearchQuery(e.target.value)}
                className="pl-9 sm:pl-10 h-10 sm:h-12 text-base sm:text-lg"
                autoFocus
              />
            </div>
            
            {headerSearchQuery && (
              <div className="max-h-64 sm:max-h-96 overflow-y-auto space-y-2">
                {products
                  .filter(p => {
                    const name = language === 'fr' ? p.name_fr : p.name_en
                    return name.toLowerCase().includes(headerSearchQuery.toLowerCase())
                  })
                  .slice(0, 10)
                  .map(product => (
                    <Card 
                      key={product._id} 
                      className="cursor-pointer hover:shadow-lg transition-all"
                      onClick={() => {
                        setSearchQuery(headerSearchQuery)
                        setCurrentPage('products')
                        setSearchModalOpen(false)
                        setHeaderSearchQuery('')
                      }}
                    >
                      <CardContent className="p-3 sm:p-4">
                        <div className="flex gap-2 sm:gap-4">
                          <img 
                            src={product.images?.[0] || 'https://images.unsplash.com/photo-1612672358776-15458bfd9869?w=100'} 
                            alt={language === 'fr' ? product.name_fr : product.name_en}
                            className="w-16 h-16 sm:w-20 sm:h-20 rounded object-cover flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-sm sm:text-base md:text-lg mb-1 truncate">
                              {language === 'fr' ? product.name_fr : product.name_en}
                            </h4>
                            <p className="text-xs sm:text-sm text-gray-600 mb-2 line-clamp-2">
                              {language === 'fr' ? product.description_fr : product.description_en}
                            </p>
                            <div className="flex items-center justify-between gap-2 flex-wrap">
                              <Badge variant="outline" className="text-xs">{getCategoryDisplayName(product.category)}</Badge>
                              <span className="text-base sm:text-lg md:text-xl font-bold text-pink-500">{product.price}$ CAD</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                {products.filter(p => {
                  const name = language === 'fr' ? p.name_fr : p.name_en
                  return name.toLowerCase().includes(headerSearchQuery.toLowerCase())
                }).length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    {language === 'fr' ? 'Aucun produit trouvé' : 'No products found'}
                  </div>
                )}
              </div>
            )}
            
            {!headerSearchQuery && (
              <div className="text-center py-8 text-gray-400">
                <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>{language === 'fr' ? 'Commencez à taper pour rechercher...' : 'Start typing to search...'}</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setSearchModalOpen(false)
              setHeaderSearchQuery('')
            }}>
              {t('cancel')}
            </Button>
            {headerSearchQuery && (
              <Button 
                className="bg-gradient-to-r from-pink-500 to-purple-600"
                onClick={() => {
                  setSearchQuery(headerSearchQuery)
                  setCurrentPage('products')
                  setSearchModalOpen(false)
                  setHeaderSearchQuery('')
                }}
              >
                {language === 'fr' ? 'Voir tous les résultats' : 'View all results'}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={contactModalOpen} onOpenChange={setContactModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">{t('contact')}</DialogTitle>
            <DialogDescription>
              {language === 'fr' ? 'Contactez-nous pour toute question' : 'Contact us for any questions'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>{language === 'fr' ? 'Email de support' : 'Support Email'}</Label>
              <Input value="support@missacreations.com" readOnly />
            </div>
            <div>
              <Label>{language === 'fr' ? 'Téléphone' : 'Phone'}</Label>
              <Input value="+1 (555) 123-4567" readOnly />
            </div>
            <div>
              <Label>{language === 'fr' ? 'Adresse' : 'Address'}</Label>
              <Textarea value={language === 'fr' ? '123 Rue de la Création, Montréal, QC, Canada' : '123 Creation Street, Montreal, QC, Canada'} readOnly rows={2} />
            </div>
            <div>
              <Label>{language === 'fr' ? 'Horaires' : 'Hours'}</Label>
              <p className="text-sm text-gray-600">
                {language === 'fr' ? 'Lundi - Vendredi: 9h - 18h' : 'Monday - Friday: 9am - 6pm'}
              </p>
            </div>
          </div>
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setContactModalOpen(false)}>{t('cancel')}</Button>
            <Button className="bg-gradient-to-r from-pink-500 to-purple-600" onClick={() => {
              window.location.href = 'mailto:support@missacreations.com'
            }}>
              {language === 'fr' ? 'Email Support' : 'Support Email'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Blog Post Modal */}
      <Dialog open={blogPostModalOpen} onOpenChange={setBlogPostModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            {selectedBlogPost && (
              <>
                <DialogTitle className="text-2xl">{language === 'fr' ? selectedBlogPost.title_fr : selectedBlogPost.title_en}</DialogTitle>
                <DialogDescription className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {new Date(selectedBlogPost.publishedAt).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US')}
                  <Badge className="ml-2">{t(selectedBlogPost.category)}</Badge>
                </DialogDescription>
              </>
            )}
          </DialogHeader>
          {selectedBlogPost && (
            <div className="space-y-4">
              <img src={selectedBlogPost.image} alt={language === 'fr' ? selectedBlogPost.title_fr : selectedBlogPost.title_en} className="w-full h-64 object-cover rounded-lg" />
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {language === 'fr' ? selectedBlogPost.content_fr : selectedBlogPost.content_en}
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setBlogPostModalOpen(false)}>{t('cancel')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Product Details Modal */}
      <Dialog open={productDetailsOpen} onOpenChange={(open) => {
        setProductDetailsOpen(open)
        if (!open) {
          setSelectedProduct(null)
          setZoomedImage(null)
          setSelectedImageIndex(0)
          setReviewForm({ rating: 5, name: '', email: '', comment: '' })
        }
      }}>
        <DialogContent className="max-w-6xl w-[95vw] sm:w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
          {selectedProduct && (
            <>
              <DialogHeader>
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <DialogTitle className="text-xl sm:text-2xl md:text-3xl font-bold mb-2">
                      {language === 'fr' ? selectedProduct.name_fr : selectedProduct.name_en}
                    </DialogTitle>
                    <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
                      <p className="text-xl sm:text-2xl md:text-3xl font-bold text-pink-500">{selectedProduct.price}$ CAD</p>
                      {selectedProduct.isCustomizable && (
                        <Badge className="bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs sm:text-sm">
                          ✨ {language === 'fr' ? 'Personnalisable' : 'Customizable'}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="flex-shrink-0" onClick={() => setProductDetailsOpen(false)}>
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </DialogHeader>

              <div className="grid md:grid-cols-2 gap-4 sm:gap-6 mt-4">
                {/* Image Gallery */}
                <div className="space-y-4">
                  <div className="relative bg-gray-100 rounded-lg overflow-hidden aspect-square">
                    {selectedProduct.images && selectedProduct.images.length > 0 ? (
                      <>
                        <div className="relative w-full h-full">
                          <img
                            src={selectedProduct.images[selectedImageIndex] || selectedProduct.images[0]}
                            alt={language === 'fr' ? selectedProduct.name_fr : selectedProduct.name_en}
                            className="w-full h-full object-cover cursor-zoom-in"
                            onClick={() => setZoomedImage(selectedProduct.images[selectedImageIndex] || selectedProduct.images[0])}
                          />
                          <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                            {selectedImageIndex + 1} / {selectedProduct.images.length}
                          </div>
                        </div>
                        {selectedProduct.images.length > 1 && (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
                              onClick={(e) => {
                                e.stopPropagation()
                                setSelectedImageIndex((prev) => (prev === 0 ? selectedProduct.images.length - 1 : prev - 1))
                              }}
                            >
                              <ChevronLeft className="w-5 h-5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
                              onClick={(e) => {
                                e.stopPropagation()
                                setSelectedImageIndex((prev) => (prev === selectedProduct.images.length - 1 ? 0 : prev + 1))
                              }}
                            >
                              <ChevronRight className="w-5 h-5" />
                            </Button>
                          </>
                        )}
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
                          {selectedProduct.images.map((img, idx) => (
                            <button
                              key={idx}
                              onClick={(e) => {
                                e.stopPropagation()
                                setSelectedImageIndex(idx)
                              }}
                              className={`w-2 h-2 rounded-full transition-all ${selectedImageIndex === idx ? 'bg-pink-500 w-8' : 'bg-white/50'}`}
                            />
                          ))}
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        {language === 'fr' ? 'Aucune image disponible' : 'No image available'}
                      </div>
                    )}
                  </div>
                  {selectedProduct.images && selectedProduct.images.length > 1 && (
                    <div className="grid grid-cols-4 gap-2">
                      {selectedProduct.images.slice(0, 4).map((img, idx) => (
                        <img
                          key={idx}
                          src={img}
                          alt={`${language === 'fr' ? selectedProduct.name_fr : selectedProduct.name_en} ${idx + 1}`}
                          className={`w-full h-20 object-cover rounded-lg cursor-pointer border-2 transition-all ${
                            selectedImageIndex === idx ? 'border-pink-500' : 'border-transparent hover:border-gray-300'
                          }`}
                          onClick={() => setSelectedImageIndex(idx)}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="space-y-6">
            <div>
                    <h3 className="text-xl font-bold mb-3">{language === 'fr' ? 'Description' : 'Description'}</h3>
                    <p className="text-gray-700 leading-relaxed">
                      {language === 'fr' ? selectedProduct.description_fr : selectedProduct.description_en || 
                       (language === 'fr' ? 'Aucune description disponible' : 'No description available')}
                    </p>
            </div>

                  <div className="border-t pt-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
                        <span className="text-gray-500">{language === 'fr' ? 'Catégorie' : 'Category'}:</span>
                        <p className="font-semibold">{getCategoryDisplayName(selectedProduct.category)}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">{language === 'fr' ? 'Stock' : 'Stock'}:</span>
                        <p className="font-semibold">{selectedProduct.stock} {language === 'fr' ? 'disponibles' : 'available'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700" 
                      onClick={() => {
                        addToCart(selectedProduct)
                        toast({ 
                          title: language === 'fr' ? '✅ Produit ajouté au panier' : '✅ Product added to cart'
                        })
                      }}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      {t('addToCart')}
                    </Button>
                    {selectedProduct.isCustomizable && (
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setProductDetailsOpen(false)
                          handleCustomize(selectedProduct)
                        }}
                        className="border-pink-500 text-pink-500 hover:bg-pink-50"
                      >
                        <Sparkles className="w-4 h-4 mr-2" />
                        {language === 'fr' ? 'Personnaliser' : 'Customize'}
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* Reviews Section */}
              <div className="border-t mt-8 pt-6">
                <h3 className="text-2xl font-bold mb-4">
                  {language === 'fr' ? 'Avis clients' : 'Customer Reviews'}
                  {productReviews.length > 0 && (
                    <span className="text-lg font-normal text-gray-500 ml-2">
                      ({productReviews.length} {language === 'fr' ? 'avis' : 'reviews'})
                    </span>
                  )}
                </h3>

                {/* Reviews List */}
                <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                  {productReviews.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">
                      {language === 'fr' ? 'Aucun avis pour le moment. Soyez le premier à laisser un avis !' : 'No reviews yet. Be the first to leave a review!'}
                    </p>
                  ) : (
                    productReviews.map((review, idx) => (
                      <div key={idx} className="border-b pb-4 last:border-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-semibold">{review.name}</p>
                            <div className="flex items-center gap-2 mt-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                                />
                              ))}
                              <span className="text-sm text-gray-500 ml-2">
                                {new Date(review.created_at).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US')}
                              </span>
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-700 mt-2">{review.comment}</p>
                      </div>
                    ))
                  )}
                </div>

                {/* Review Form */}
                <div className="border-t pt-6">
                  <h4 className="text-xl font-bold mb-4">{language === 'fr' ? 'Laisser un avis' : 'Leave a Review'}</h4>
                  <div className="space-y-4">
                    <div>
                      <Label>{language === 'fr' ? 'Note' : 'Rating'}</Label>
                      <div className="flex gap-2 mt-2">
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <button
                            key={rating}
                            type="button"
                            onClick={() => setReviewForm({ ...reviewForm, rating })}
                            className="focus:outline-none"
                          >
                            <Star
                              className={`w-6 h-6 transition-colors ${
                                rating <= reviewForm.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label>{language === 'fr' ? 'Nom' : 'Name'} *</Label>
                      <Input
                        value={reviewForm.name}
                        onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })}
                        placeholder={language === 'fr' ? 'Votre nom' : 'Your name'}
                      />
                    </div>
                    <div>
                      <Label>{language === 'fr' ? 'Email' : 'Email'}</Label>
                      <Input
                        type="email"
                        value={reviewForm.email}
                        onChange={(e) => setReviewForm({ ...reviewForm, email: e.target.value })}
                        placeholder={language === 'fr' ? 'Votre email (optionnel)' : 'Your email (optional)'}
                      />
                    </div>
                    <div>
                      <Label>{language === 'fr' ? 'Commentaire' : 'Comment'} *</Label>
                      <Textarea
                        value={reviewForm.comment}
                        onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                        placeholder={language === 'fr' ? 'Partagez votre expérience...' : 'Share your experience...'}
                        rows={4}
                      />
                    </div>
                    <Button
                      className="w-full bg-gradient-to-r from-pink-500 to-purple-600"
                      onClick={async () => {
                        if (!reviewForm.name || !reviewForm.comment) {
                          toast({
                            title: language === 'fr' ? '⚠️ Champs requis' : '⚠️ Required fields',
                            description: language === 'fr' ? 'Veuillez remplir tous les champs obligatoires' : 'Please fill in all required fields',
                            variant: 'destructive'
                          })
                          return
                        }
                        try {
                          const res = await fetch('/api/products/reviews', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              productId: selectedProduct._id,
                              rating: reviewForm.rating,
                              name: reviewForm.name,
                              email: reviewForm.email,
                              comment: reviewForm.comment
                            })
                          })
                          const data = await res.json()
                          if (data.success) {
                            toast({
                              title: language === 'fr' ? '✅ Avis ajouté' : '✅ Review added',
                              description: language === 'fr' ? 'Merci pour votre avis !' : 'Thank you for your review!'
                            })
                            setReviewForm({ rating: 5, name: '', email: '', comment: '' })
                            // Recharger les avis
                            const reviewsRes = await fetch(`/api/products/reviews?productId=${selectedProduct._id}`)
                            const reviewsData = await reviewsRes.json()
                            if (reviewsData.success) {
                              setProductReviews(reviewsData.reviews || [])
                            }
                          } else {
                            toast({
                              title: language === 'fr' ? '❌ Erreur' : '❌ Error',
                              description: data.error || (language === 'fr' ? 'Erreur lors de l\'ajout de l\'avis' : 'Error adding review'),
                              variant: 'destructive'
                            })
                          }
                        } catch (error) {
                          toast({
                            title: language === 'fr' ? '❌ Erreur' : '❌ Error',
                            variant: 'destructive'
                          })
                        }
                      }}
                    >
                      {language === 'fr' ? 'Publier l\'avis' : 'Submit Review'}
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Zoom Modal for Images */}
      {zoomedImage && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setZoomedImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            onClick={() => setZoomedImage(null)}
          >
            <X className="w-8 h-8" />
          </button>
          <img
            src={zoomedImage}
            alt={language === 'fr' ? selectedProduct?.name_fr : selectedProduct?.name_en}
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      <footer className="bg-gray-900 text-white py-8 sm:py-12 mt-12 sm:mt-20">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <LogoComponent size="small" />
                <h4 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                  {siteContent.header?.title || 'Missa Créations'}
                </h4>
              </div>
              <p className="text-sm sm:text-base text-gray-400 mb-4 sm:mb-6">
                {siteContent.footer?.description || 'Créations uniques en résine, faites main avec amour'}
              </p>
              
              {/* Formulaire d'abonnement newsletter */}
              <div className="bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-lg p-3 sm:p-4 border border-pink-500/20">
                <h5 className="font-bold mb-2 sm:mb-3 text-white text-sm sm:text-base">
                  {language === 'fr' ? '✨ Abonnez-vous à notre newsletter' : '✨ Subscribe to our newsletter'}
                </h5>
                <p className="text-xs sm:text-sm text-gray-400 mb-3 sm:mb-4">
                  {language === 'fr' 
                    ? 'Recevez nos offres exclusives et nouveautés en avant-première !' 
                    : 'Get our exclusive offers and new releases first!'}
                </p>
                <form onSubmit={handleNewsletterSubscribe} className="space-y-2 sm:space-y-3">
                  <Input
                    type="text"
                    placeholder={language === 'fr' ? 'Votre nom (optionnel)' : 'Your name (optional)'}
                    value={newsletterName}
                    onChange={(e) => setNewsletterName(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 text-sm sm:text-base h-9 sm:h-10"
                  />
                  <Input
                    type="email"
                    placeholder={language === 'fr' ? 'Votre email' : 'Your email'}
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    required
                    className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 text-sm sm:text-base h-9 sm:h-10"
                  />
                  <Button
                    type="submit"
                    disabled={newsletterLoading}
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white text-xs sm:text-sm h-9 sm:h-10"
                  >
                    {newsletterLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-white mr-2"></div>
                        {language === 'fr' ? 'Abonnement...' : 'Subscribing...'}
                      </>
                    ) : (
                      <>
                        ✨ {language === 'fr' ? 'S\'abonner' : 'Subscribe'}
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-3 sm:mb-4 text-sm sm:text-base">Liens rapides</h4>
              <ul className="space-y-1.5 sm:space-y-2 text-gray-400 text-sm sm:text-base">
                <li className="hover:text-pink-400 cursor-pointer transition" onClick={() => setCurrentPage('home')}>{t('home')}</li>
                <li className="hover:text-pink-400 cursor-pointer transition" onClick={() => setCurrentPage('products')}>{t('products')}</li>
                <li className="hover:text-pink-400 cursor-pointer transition" onClick={() => setCurrentPage('blog')}>{t('blog')}</li>
                <li className="hover:text-pink-400 cursor-pointer transition" onClick={() => setContactModalOpen(true)}>{t('contact')}</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-3 sm:mb-4 text-sm sm:text-base">{t('support')}</h4>
              <ul className="space-y-1.5 sm:space-y-2 text-gray-400 text-sm sm:text-base">
                <li className="hover:text-pink-400 cursor-pointer transition"><a href="/faq">{t('faq')}</a></li>
                <li className="hover:text-pink-400 cursor-pointer transition"><a href="/livraison">{t('delivery')}</a></li>
                <li className="hover:text-pink-400 cursor-pointer transition"><a href="/retours">{t('returns')}</a></li>
                <li className="hover:text-pink-400 cursor-pointer transition"><a href="/garantie">{t('warranty')}</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-3 sm:mb-4 text-sm sm:text-base">{t('followUs')}</h4>
              <div className="flex gap-3 sm:gap-4">
                <a 
                  href={siteContent.footer?.socialLinks?.facebook || 'https://facebook.com/missacreations'} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition text-white" 
                  title="Facebook"
                  aria-label="Facebook"
                >
                  <FacebookIcon className="w-5 h-5" />
                </a>
                <a 
                  href={siteContent.footer?.socialLinks?.instagram || 'https://instagram.com/missacreations'} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition text-white" 
                  title="Instagram"
                  aria-label="Instagram"
                >
                  <InstagramIcon className="w-5 h-5" />
                </a>
                <a 
                  href={siteContent.footer?.socialLinks?.tiktok || 'https://tiktok.com/@missacreations'} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition text-white" 
                  title="TikTok"
                  aria-label="TikTok"
                >
                  <TikTokIcon className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-gray-400 text-xs sm:text-sm">
            <p>© 2024 Missa Créations. {t('allRightsReserved')}.</p>
          </div>
        </div>
      </footer>

      {/* Popup Newsletter - Très Attractif */}
      {newsletterPopupOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden animate-slide-up max-h-[95vh] overflow-y-auto">
            {/* Bouton fermer */}
            <button
              onClick={handleCloseNewsletterPopup}
              className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 w-8 h-8 sm:w-10 sm:h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center transition-all hover:scale-110 shadow-lg"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
            </button>

            {/* Background avec gradient animé */}
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500 via-purple-500 to-pink-600 opacity-90">
              <div className="absolute inset-0 opacity-20" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
              }}></div>
            </div>

            {/* Contenu */}
            <div className="relative z-10 p-4 sm:p-6 md:p-8 lg:p-12">
              {/* Icône animée */}
              <div className="flex justify-center mb-4 sm:mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-white/30 rounded-full animate-ping"></div>
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border-2 sm:border-4 border-white/50">
                    <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white animate-pulse" />
                  </div>
                </div>
              </div>

              {/* Titre principal */}
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-center text-white mb-3 sm:mb-4 drop-shadow-lg px-2">
                {language === 'fr' ? (
                  <>
                    🎉 Ne Ratez Plus<br />
                    <span className="bg-gradient-to-r from-yellow-200 to-yellow-400 bg-clip-text text-transparent">
                      Aucun Nouveau Produit !
                    </span>
                  </>
                ) : (
                  <>
                    🎉 Don't Miss<br />
                    <span className="bg-gradient-to-r from-yellow-200 to-yellow-400 bg-clip-text text-transparent">
                      Any New Products !
                    </span>
                  </>
                )}
              </h2>

              {/* Sous-titre */}
              <p className="text-base sm:text-lg md:text-xl text-center text-white/95 mb-2 font-semibold px-2">
                {language === 'fr' 
                  ? '✨ Soyez le premier informé de nos nouvelles créations ✨' 
                  : '✨ Be the first to know about our new creations ✨'}
              </p>
              <p className="text-center text-white/80 mb-6 sm:mb-8 text-sm sm:text-base md:text-lg px-2">
                {language === 'fr' 
                  ? 'Abonnez-vous maintenant et recevez 10% de réduction sur votre première commande !' 
                  : 'Subscribe now and get 10% off your first order!'}
              </p>

              {/* Formulaire */}
              <form onSubmit={(e) => handleNewsletterSubscribe(e, true)} className="space-y-3 sm:space-y-4">
                <div className="bg-white/95 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-xl">
                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <Input
                        type="text"
                        placeholder={language === 'fr' ? '👤 Votre prénom (optionnel)' : '👤 Your first name (optional)'}
                        value={popupNewsletterName}
                        onChange={(e) => setPopupNewsletterName(e.target.value)}
                        className="h-12 sm:h-14 text-base sm:text-lg border-2 border-gray-200 focus:border-pink-500 rounded-xl"
                      />
                    </div>
                    <div>
                      <Input
                        type="email"
                        placeholder={language === 'fr' ? '📧 Votre email' : '📧 Your email'}
                        value={popupNewsletterEmail}
                        onChange={(e) => setPopupNewsletterEmail(e.target.value)}
                        required
                        className="h-14 text-lg border-2 border-gray-200 focus:border-pink-500 rounded-xl"
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={popupNewsletterLoading}
                      className="w-full h-14 bg-gradient-to-r from-pink-500 via-purple-600 to-pink-600 hover:from-pink-600 hover:via-purple-700 hover:to-pink-700 text-white text-lg font-bold rounded-xl shadow-2xl transform hover:scale-105 transition-all duration-200"
                    >
                      {popupNewsletterLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          {language === 'fr' ? 'Abonnement en cours...' : 'Subscribing...'}
                        </>
                      ) : (
                        <>
                          ✨ {language === 'fr' ? 'S\'abonner Maintenant' : 'Subscribe Now'} ✨
                        </>
                      )}
                    </Button>
                    
                    {/* Bouton "Plus tard" */}
                    <Button
                      type="button"
                      onClick={handleCloseNewsletterPopup}
                      variant="outline"
                      className="w-full h-12 bg-white/10 hover:bg-white/20 border-2 border-white/30 text-white text-base font-semibold rounded-xl transition-all duration-200 mt-2"
                    >
                      {language === 'fr' ? 'Plus tard' : 'Later'}
                    </Button>
                  </div>
                </div>

                {/* Avantages */}
                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="text-center">
                    <div className="text-3xl mb-2">🎁</div>
                    <p className="text-white/90 text-sm font-semibold">
                      {language === 'fr' ? 'Offres Exclusives' : 'Exclusive Offers'}
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl mb-2">🆕</div>
                    <p className="text-white/90 text-sm font-semibold">
                      {language === 'fr' ? 'Nouveautés' : 'New Releases'}
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl mb-2">💎</div>
                    <p className="text-white/90 text-sm font-semibold">
                      {language === 'fr' ? '10% de Réduction' : '10% Off'}
                    </p>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal Code Promo après Abonnement */}
      <Dialog open={promoCodeModalOpen} onOpenChange={setPromoCodeModalOpen}>
        <DialogContent className="max-w-2xl bg-gradient-to-br from-pink-500 via-purple-600 to-pink-600 text-white border-0">
          <DialogHeader>
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-white/30 rounded-full animate-ping"></div>
                <div className="relative w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border-4 border-white/50">
                  <Sparkles className="w-10 h-10 text-white animate-pulse" />
                </div>
              </div>
            </div>
            <DialogTitle className="text-3xl md:text-4xl font-black text-center text-white mb-2">
              {language === 'fr' ? '🎉 Félicitations !' : '🎉 Congratulations!'}
            </DialogTitle>
            <DialogDescription className="text-center text-white/90 text-lg">
              {language === 'fr' 
                ? 'Votre code promo exclusif de 10% de réduction !' 
                : 'Your exclusive 10% discount promo code!'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-6 space-y-6">
            {/* Code Promo en grand */}
            <div className="bg-white/20 backdrop-blur-md rounded-2xl p-8 border-4 border-white/30 text-center">
              <p className="text-white/90 text-sm md:text-base font-semibold mb-3">
                {language === 'fr' ? 'Votre code promo :' : 'Your promo code:'}
              </p>
              <div className="bg-white rounded-xl p-4 mb-3">
                <p className="text-3xl md:text-4xl font-black text-pink-600 tracking-wider">
                  {receivedPromoCode}
                </p>
              </div>
              <p className="text-white/80 text-xs md:text-sm">
                {language === 'fr' 
                  ? 'Valable 90 jours - Utilisable une seule fois' 
                  : 'Valid for 90 days - One-time use'}
              </p>
            </div>

            {/* Instructions */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <p className="text-white/90 text-sm md:text-base text-center">
                {language === 'fr' 
                  ? '✨ Utilisez ce code lors de votre prochaine commande pour obtenir 10% de réduction ! ✨' 
                  : '✨ Use this code on your next order to get 10% off! ✨'}
              </p>
            </div>

            {/* Boutons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(receivedPromoCode)
                  toast({
                    title: language === 'fr' ? '✅ Code copié !' : '✅ Code copied!',
                    description: language === 'fr' 
                      ? 'Le code promo a été copié dans votre presse-papiers' 
                      : 'Promo code copied to clipboard'
                  })
                }}
                className="flex-1 bg-white text-pink-600 hover:bg-white/90 font-bold text-lg py-6"
              >
                📋 {language === 'fr' ? 'Copier le Code' : 'Copy Code'}
              </Button>
              <Button
                onClick={() => {
                  setPromoCodeModalOpen(false)
                  setCurrentPage('products')
                }}
                className="flex-1 bg-white/20 hover:bg-white/30 border-2 border-white text-white font-bold text-lg py-6"
              >
                🛍️ {language === 'fr' ? 'Voir les Produits' : 'View Products'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Composant de prévisualisation personnalisée avec image réelle du produit
function CustomizedPreview({ customization, product }) {
  const productImage = product?.images?.[0] || product?.image || "https://images.unsplash.com/photo-1612672358776-15458bfd9869?w=800&q=80"
  
  // Overlay de couleur selon le choix
  const colorOverlay = {
    transparent: 'bg-transparent',
    bleu: 'bg-blue-500/30',
    rose: 'bg-pink-500/30',
    violet: 'bg-purple-500/30',
    ocean: 'bg-cyan-500/30',
    noir: 'bg-gray-900/50',
    or: 'bg-yellow-500/30'
  }[customization.color] || 'bg-transparent'

  return (
    <div className="w-full h-96 rounded-2xl shadow-2xl relative overflow-hidden bg-gray-100">
      {/* Image de base du produit */}
      <img 
        src={productImage} 
        alt={product?.name_fr || product?.name || 'Produit'} 
        className="w-full h-full object-cover"
      />
      
      {/* Overlay de couleur */}
      {customization.color !== 'transparent' && (
        <div className={`absolute inset-0 ${colorOverlay} mix-blend-overlay`} />
      )}
      
      {/* Paillettes animées */}
      {customization.glitter !== 'none' && (
        <div className="absolute inset-0 opacity-60 pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-2 h-2 ${customization.glitter === 'or' ? 'bg-yellow-300' : 'bg-gray-200'} rounded-full animate-pulse`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random() * 2}s`,
                transform: `scale(${0.5 + Math.random() * 1.5})`
              }}
            />
          ))}
        </div>
      )}
      
      {/* Fleur séchée */}
      {customization.flower !== 'none' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-8xl opacity-90 drop-shadow-2xl transform hover:scale-110 transition-transform">
            {customization.flower === 'lavande' ? '🌸' : 
             customization.flower === 'rose' ? '🌹' : '🌼'}
          </div>
        </div>
      )}
      
      {/* Initiale personnalisée */}
      {customization.initial && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-9xl font-bold text-white drop-shadow-[0_0_20px_rgba(0,0,0,0.8)] z-20 transform hover:scale-110 transition-transform">
            {customization.initial}
          </div>
        </div>
      )}
      
      {/* Badge de personnalisation */}
      <div className="absolute top-4 right-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
        ✨ Personnalisé
      </div>
    </div>
  );
}

// Composant de prévisualisation de couleur
function ColorPreview({ color }) {
  const colors = {
    transparent: 'bg-white border-2 border-gray-300',
    bleu: 'bg-blue-400',
    rose: 'bg-pink-400',
    violet: 'bg-purple-400',
    ocean: 'bg-gradient-to-br from-blue-500 to-cyan-300',
    noir: 'bg-gray-900',
    or: 'bg-gradient-to-br from-yellow-400 to-yellow-600'
  };

  return <div className={`w-12 h-12 rounded-full ${colors[color]} shadow-md`}></div>;
}

const ProductCard = memo(function ProductCard({ product, onAddToCart, onCustomize, onToggleFavorite, isFavorite, onImageClick, onViewDetails, language, t }) {
  const productImage = product.images && product.images.length > 0 && product.images[0] 
    ? product.images[0] 
    : 'https://images.unsplash.com/photo-1612672358776-15458bfd9869?w=800&q=80'
  
  return (
    <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-300 h-full flex flex-col">
      <div className="relative overflow-hidden">
        <img 
          src={productImage} 
          alt={language === 'fr' ? product.name_fr : product.name_en} 
          className="w-full h-48 sm:h-56 md:h-64 object-cover group-hover:scale-110 transition-transform duration-300 cursor-pointer" 
          onClick={() => onViewDetails && onViewDetails(product)}
          loading="lazy"
          decoding="async"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1612672358776-15458bfd9869?w=800&q=80'
          }}
        />
        {product.isCustomizable && (
          <Badge className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs sm:text-sm px-2 py-0.5 sm:px-2.5 sm:py-1">
            Personnalisable
          </Badge>
        )}
        <button onClick={() => onToggleFavorite(product)} className="absolute top-2 left-2 sm:top-3 sm:left-3 w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition z-10">
          <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${isFavorite ? 'fill-pink-500 text-pink-500' : 'text-gray-600'}`} />
        </button>
      </div>
      <CardContent className="p-3 sm:p-4 flex-1 flex flex-col">
        <h3 
          className="font-bold text-base sm:text-lg mb-1 sm:mb-2 cursor-pointer hover:text-pink-500 transition line-clamp-2" 
          onClick={() => onViewDetails && onViewDetails(product)}
        >
          {language === 'fr' ? product.name_fr : product.name_en}
        </h3>
        <p className="text-xl sm:text-2xl font-bold text-pink-500 mb-3 sm:mb-4">{product.price}$ CAD</p>
        <div className="flex gap-2 mt-auto">
          <Button className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-xs sm:text-sm h-9 sm:h-10" onClick={() => onAddToCart(product)}>{t('addToCart')}</Button>
          {product.isCustomizable && (
            <Button size="icon" variant="outline" onClick={() => onCustomize(product)} className="border-pink-500 text-pink-500 hover:bg-pink-50 w-9 h-9 sm:w-10 sm:h-10"><Sparkles className="w-4 h-4 sm:w-5 sm:h-5" /></Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
})

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
