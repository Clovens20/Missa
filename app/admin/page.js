'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { LayoutDashboard, Package, ShoppingCart, Users, LogOut, Plus, Edit, Trash2, Search, Eye, EyeOff, FileText, Settings, Globe, Home, Download, Printer, XCircle, AlertTriangle, Mail, ShoppingBag, Copy, Check, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import ShippingLabel from '@/components/ShippingLabel'
import ThankYouCard from '@/components/ThankYouCard'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loginData, setLoginData] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [currentView, setCurrentView] = useState('dashboard')
  const [stats, setStats] = useState({ ordersCount: 0, productsCount: 0, revenue: 0 })
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [employees, setEmployees] = useState([])
  const [newsletterSubscribers, setNewsletterSubscribers] = useState([])
  const [abandonedCarts, setAbandonedCarts] = useState([])
  const [blogPosts, setBlogPosts] = useState([])
  const [emailsCopied, setEmailsCopied] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [selectedBlogPost, setSelectedBlogPost] = useState(null)
  const [productFormOpen, setProductFormOpen] = useState(false)
  const [orderDetailsOpen, setOrderDetailsOpen] = useState(false)
  const [employeeFormOpen, setEmployeeFormOpen] = useState(false)
  const [blogFormOpen, setBlogFormOpen] = useState(false)
  const [siteContentOpen, setSiteContentOpen] = useState(false)
  const [legalPagesOpen, setLegalPagesOpen] = useState(false)
  const [selectedContentSection, setSelectedContentSection] = useState(null)
  const [selectedLegalPage, setSelectedLegalPage] = useState(null)
  const [showShippingForm, setShowShippingForm] = useState(false)
  const [shippingForm, setShippingForm] = useState({ trackingNumber: '', carrier: '' })
  const [labelPreviewOpen, setLabelPreviewOpen] = useState(false)
  const [cardPreviewOpen, setCardPreviewOpen] = useState(false)
  const [orderForLabel, setOrderForLabel] = useState(null)
  const [selectedProducts, setSelectedProducts] = useState([]) // Pour la sélection multiple
  const [filterCustomizable, setFilterCustomizable] = useState(false) // Filtre pour produits personnalisables
  const { toast } = useToast()

  const [productForm, setProductForm] = useState({
    name_fr: '',
    name_en: '',
    description_fr: '',
    description_en: '',
    category: 'bijoux',
    price: 0,
    weight: 0,
    stock: 0,
    minStock: 0,
    isCustomizable: false,
    isActive: true,
    images: ['']
  })

  const [employeeForm, setEmployeeForm] = useState({
    name: '',
    email: ''
  })

  const [blogForm, setBlogForm] = useState({
    slug: '',
    title_fr: '',
    title_en: '',
    excerpt_fr: '',
    excerpt_en: '',
    content_fr: '',
    content_en: '',
    category: 'bijoux-resine',
    image: '',
    image_alt_fr: '',
    image_alt_en: '',
    image_credits: '',
    author: 'Missa',
    author_bio_fr: '',
    author_bio_en: '',
    author_avatar: '',
    published_at: new Date().toISOString().split('T')[0],
    is_active: true,
    is_featured: false,
    reading_time: 5,
    meta_description_fr: '',
    meta_description_en: ''
  })

  useEffect(() => {
    if (isLoggedIn) {
      loadDashboardData()
    }
    // Réinitialiser la sélection quand on change de vue
    if (currentView !== 'products') {
      setSelectedProducts([])
    }
  }, [isLoggedIn, currentView])

  const handleLogin = async (e) => {
    e.preventDefault()
    
    const email = loginData.email.trim()
    const password = loginData.password
    
    if (!email) {
      toast({ title: '❌ Erreur', description: 'Email requis', variant: 'destructive' })
      return
    }
    
    if (!password) {
      toast({ title: '❌ Erreur', description: 'Mot de passe requis', variant: 'destructive' })
      return
    }
    
    try {
      const res = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      
      const data = await res.json()
      
      if (data.success && data.admin) {
        setIsLoggedIn(true)
        toast({ title: '✅ Connecté', description: `Bienvenue ${data.admin.name || 'Admin'}` })
      } else {
        toast({ title: '❌ Erreur', description: data.error || 'Accès non autorisé', variant: 'destructive' })
      }
    } catch (error) {
      console.error(error)
      toast({ title: '❌ Erreur', description: 'Erreur de connexion', variant: 'destructive' })
    }
  }

  const loadDashboardData = async () => {
    try {
      if (currentView === 'dashboard' || currentView === 'orders') {
        const ordersRes = await fetch('/api/orders')
        const ordersData = await ordersRes.json()
        if (ordersData.success) {
          setOrders(ordersData.orders || [])
          const revenue = ordersData.orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0)
          setStats(prev => ({ ...prev, ordersCount: ordersData.orders.length, revenue }))
        }
      }
      
      if (currentView === 'dashboard' || currentView === 'blog') {
        // L'admin doit voir TOUS les articles de blog (actifs et inactifs)
        try {
          const blogRes = await fetch('/api/blog?all=true&t=' + Date.now(), {
            cache: 'no-store',
            headers: { 'Cache-Control': 'no-cache' }
          })
          const blogData = await blogRes.json()
          if (blogData.success) {
            setBlogPosts(blogData.posts || [])
          }
        } catch (error) {
          console.error('Erreur chargement articles de blog:', error)
          toast({ title: '❌ Erreur', description: 'Impossible de charger les articles de blog', variant: 'destructive' })
        }
      }
      
      if (currentView === 'dashboard' || currentView === 'products' || currentView === 'inventory') {
        // L'admin doit voir TOUS les produits (actifs et inactifs)
        const productsRes = await fetch('/api/products?all=true')
        const productsData = await productsRes.json()
        if (productsData.success) {
          setProducts(productsData.products || [])
          setStats(prev => ({ ...prev, productsCount: productsData.products.length }))
        }
      }
      
      if (currentView === 'dashboard' || currentView === 'employees') {
        const employeesRes = await fetch('/api/admin/employees')
        const employeesData = await employeesRes.json()
        if (employeesData.success) {
          setEmployees(employeesData.employees || [])
        }
      }
      
      if (currentView === 'newsletter-subscribers') {
        const subscribersRes = await fetch('/api/newsletter/subscribers')
        const subscribersData = await subscribersRes.json()
        if (subscribersData.success) {
          setNewsletterSubscribers(subscribersData.subscribers || [])
        }
      }
      
      if (currentView === 'abandoned-carts') {
        const cartsRes = await fetch('/api/abandoned-carts')
        const cartsData = await cartsRes.json()
        if (cartsData.success) {
          setAbandonedCarts(cartsData.abandonedCarts || [])
        }
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleCreateProduct = async () => {
    // Validation pour la création d'un nouveau produit
    if (!selectedProduct) {
      if (!productForm.name_fr || !productForm.name_en) {
        toast({ title: '⚠️ Erreur', description: 'Le nom du produit (FR et EN) est requis', variant: 'destructive' })
        return
      }
      if (!productForm.category) {
        toast({ title: '⚠️ Erreur', description: 'La catégorie est requise', variant: 'destructive' })
        return
      }
      if (!productForm.price || productForm.price <= 0) {
        toast({ title: '⚠️ Erreur', description: 'Le prix doit être supérieur à 0', variant: 'destructive' })
        return
      }
    }
    
    try {
      const method = selectedProduct ? 'PUT' : 'POST'
      const url = selectedProduct ? `/api/products/${selectedProduct._id}` : '/api/products'
      
      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productForm)
      })
      const data = await res.json()
      
      if (data.success) {
        toast({ title: selectedProduct ? '✅ Produit mis à jour' : '✅ Produit créé avec succès' })
        setProductFormOpen(false)
        setSelectedProduct(null)
        loadDashboardData()
      } else {
        toast({ title: '❌ Erreur', description: data.error || 'Une erreur est survenue', variant: 'destructive' })
      }
    } catch (error) {
      toast({ title: '❌ Erreur', description: error.message || 'Une erreur est survenue', variant: 'destructive' })
    }
  }

  const handleCreateEmployee = async () => {
    if (!employeeForm.name.trim()) {
      toast({ title: '⚠️ Erreur', description: 'Le nom est requis', variant: 'destructive' })
      return
    }
    
    try {
      const res = await fetch('/api/admin/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(employeeForm)
      })
      const data = await res.json()
      
      if (data.success) {
        toast({ 
          title: '✅ Employé créé avec succès', 
          description: `Code d'accès: ${data.employeeCode}`,
          duration: 5000
        })
        setEmployeeFormOpen(false)
        setEmployeeForm({ name: '', email: '' })
        loadDashboardData()
      } else {
        toast({ title: '❌ Erreur', description: data.error || 'Erreur lors de la création', variant: 'destructive' })
      }
    } catch (error) {
      console.error(error)
      toast({ title: '❌ Erreur', description: 'Erreur lors de la création de l\'employé', variant: 'destructive' })
    }
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-2xl">
          <CardHeader className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white font-bold text-3xl">
              M
            </div>
            <CardTitle className="text-3xl">Admin - Missa Créations</CardTitle>
            <CardDescription>Connectez-vous pour accéder au dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label>Email</Label>
                <Input 
                  type="email" 
                  placeholder="support@missacreations.com"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                />
              </div>
              <div>
                <Label>Mot de passe</Label>
                <div className="relative">
                  <Input 
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500" />
                    )}
                  </Button>
                </div>
              </div>
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600" 
                size="lg"
              >
                Se connecter
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="flex">
        <div className="w-64 bg-gradient-to-b from-pink-600 to-purple-700 text-white min-h-screen p-6 flex flex-col">
          <div className="mb-8">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-xl mb-3">
              M
            </div>
            <h2 className="text-xl font-bold">Missa Admin</h2>
            <p className="text-sm text-white/80">Administration</p>
          </div>
          
          <nav className="space-y-2 flex-1">
            <button
              onClick={() => setCurrentView('dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                currentView === 'dashboard' ? 'bg-white/20' : 'hover:bg-white/10'
              }`}
            >
              <LayoutDashboard className="w-5 h-5" />
              Dashboard
            </button>
            <button
              onClick={() => setCurrentView('products')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                currentView === 'products' ? 'bg-white/20' : 'hover:bg-white/10'
              }`}
            >
              <Package className="w-5 h-5" />
              Produits
            </button>
            <button
              onClick={() => setCurrentView('orders')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                currentView === 'orders' ? 'bg-white/20' : 'hover:bg-white/10'
              }`}
            >
              <ShoppingCart className="w-5 h-5" />
              Commandes
            </button>
            <button
              onClick={() => setCurrentView('inventory')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                currentView === 'inventory' ? 'bg-white/20' : 'hover:bg-white/10'
              }`}
            >
              <Package className="w-5 h-5" />
              Inventaire
            </button>
            <button
              onClick={() => setCurrentView('employees')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                currentView === 'employees' ? 'bg-white/20' : 'hover:bg-white/10'
              }`}
            >
              <Users className="w-5 h-5" />
              Employés
            </button>
            <button
              onClick={() => setCurrentView('newsletter-subscribers')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                currentView === 'newsletter-subscribers' ? 'bg-white/20' : 'hover:bg-white/10'
              }`}
            >
              <Mail className="w-5 h-5" />
              Abonnés Newsletter
            </button>
            <button
              onClick={() => setCurrentView('abandoned-carts')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                currentView === 'abandoned-carts' ? 'bg-white/20' : 'hover:bg-white/10'
              }`}
            >
              <ShoppingBag className="w-5 h-5" />
              Paniers Abandonnés
            </button>
            <button
              onClick={() => setCurrentView('site-content')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                currentView === 'site-content' ? 'bg-white/20' : 'hover:bg-white/10'
              }`}
            >
              <Globe className="w-5 h-5" />
              Contenu du Site
            </button>
            <button
              onClick={() => setCurrentView('legal-pages')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                currentView === 'legal-pages' ? 'bg-white/20' : 'hover:bg-white/10'
              }`}
            >
              <FileText className="w-5 h-5" />
              Pages Légales
            </button>
            <button
              onClick={() => setCurrentView('blog')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                currentView === 'blog' ? 'bg-white/20' : 'hover:bg-white/10'
              }`}
            >
              <BookOpen className="w-5 h-5" />
              Blog
            </button>
          </nav>

          <div className="mt-8 mb-4">
            <button
              onClick={() => setIsLoggedIn(false)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition"
            >
              <LogOut className="w-5 h-5" />
              Déconnexion
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {/* Dashboard */}
          {currentView === 'dashboard' && (
            <div>
              <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
              
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Commandes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-4xl font-bold text-pink-500">{stats.ordersCount}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Produits</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-4xl font-bold text-purple-500">{stats.productsCount}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Revenus</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-4xl font-bold text-green-500">{stats.revenue.toFixed(2)}$</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Dernières commandes</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>N° Commande</TableHead>
                        <TableHead>Client</TableHead>
                        <TableHead>Montant</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.slice(0, 5).map(order => (
                        <TableRow key={order._id}>
                          <TableCell className="font-mono">{order.orderNumber}</TableCell>
                          <TableCell>{order.customer?.firstName} {order.customer?.lastName}</TableCell>
                          <TableCell>{order.totalAmount?.toFixed(2)}$</TableCell>
                          <TableCell>
                            <Badge>{order.status}</Badge>
                          </TableCell>
                          <TableCell>{new Date(order.createdAt).toLocaleDateString('fr-FR')}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Products */}
          {currentView === 'products' && (
            <div>
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h1 className="text-3xl font-bold">Gestion des Produits</h1>
                  <p className="text-gray-600 mt-1">
                    {products.filter(p => p.isCustomizable).length} produit(s) personnalisable(s) sur {products.length}
                  </p>
                </div>
                <div className="flex gap-2">
                  {selectedProducts.length > 0 && (
                    <Button 
                      onClick={async () => {
                        if (confirm(`⚠️ ATTENTION : Voulez-vous supprimer ${selectedProducts.length} produit(s) sélectionné(s) ? Cette action est irréversible !`)) {
                          try {
                            const res = await fetch('/api/products/bulk-delete', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ productIds: selectedProducts })
                            })
                            const data = await res.json()
                            if (data.success) {
                              toast({ 
                                title: `✅ ${data.deletedCount} produit(s) supprimé(s)`, 
                                description: `${data.deletedCount} produit(s) ont été supprimés avec succès`
                              })
                              setSelectedProducts([]) // Réinitialiser la sélection
                              loadDashboardData()
                            } else {
                              toast({ 
                                title: '❌ Erreur', 
                                description: data.error || 'Erreur lors de la suppression',
                                variant: 'destructive' 
                              })
                            }
                          } catch (error) {
                            toast({ title: '❌ Erreur lors de la suppression', variant: 'destructive' })
                          }
                        }
                      }}
                      variant="destructive"
                      className="bg-red-600 hover:bg-red-700"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Supprimer {selectedProducts.length} produit(s) sélectionné(s)
                    </Button>
                  )}
                  <Button 
                    onClick={() => {
                      setSelectedProduct(null)
                      setProductForm({
                        name_fr: '',
                        name_en: '',
                        description_fr: '',
                        description_en: '',
                        category: 'bijoux-accessoires',
                        price: 0,
                        weight: 0,
                        stock: 0,
                        minStock: 0,
                        isCustomizable: false,
                        isActive: true,
                        images: ['']
                      })
                      setProductFormOpen(true)
                    }}
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter un nouveau produit
                  </Button>
                  <Button 
                    onClick={async () => {
                      if (confirm('⚠️ ATTENTION : Voulez-vous supprimer TOUS les produits qui ont été ajoutés par l\'initialisation ? Les 5 produits originaux seront conservés. Cette action est irréversible !')) {
                        try {
                          const res = await fetch('/api/products/init', { method: 'DELETE' })
                          const data = await res.json()
                          if (data.success) {
                            toast({ 
                              title: `✅ ${data.deletedCount} produits supprimés`, 
                              description: `${data.remainingCount} produits conservés dans la base de données`
                            })
                            loadDashboardData()
                          } else {
                            toast({ 
                              title: data.message || 'Erreur', 
                              variant: 'destructive' 
                            })
                          }
                        } catch (error) {
                          toast({ title: '❌ Erreur lors de la suppression', variant: 'destructive' })
                        }
                      }
                    }}
                    variant="destructive"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Supprimer les produits initiaux
                  </Button>
                </div>
              </div>
              {selectedProducts.length > 0 && (
                <div className="mb-4 p-4 bg-pink-50 border border-pink-300 rounded-lg">
                  <p className="text-sm text-pink-800 font-semibold">
                    ✓ {selectedProducts.length} produit(s) sélectionné(s) - Utilisez le bouton "Supprimer" ci-dessus pour les supprimer
                  </p>
                </div>
              )}
              {products.length === 0 && (
                <div className="mb-4 p-4 bg-yellow-50 border border-yellow-300 rounded-lg">
                  <p className="text-sm text-yellow-800 font-semibold mb-2">
                    ⚠️ Aucun produit trouvé dans la base de données
                  </p>
                  <p className="text-sm text-yellow-700">
                    Cliquez sur le bouton <strong>"Initialiser les produits"</strong> ci-dessus pour ajouter les 18 produits pré-configurés à la base de données.
                  </p>
                </div>
              )}
              <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Admin :</strong> Modifiez uniquement les prix directement dans le tableau.<br/>
                  <strong>Atelier :</strong> Gérez le stock et activez/désactivez les produits une fois qu'ils sont produits.<br/>
                  <strong>Sélection multiple :</strong> Cochez les produits que vous souhaitez supprimer, puis utilisez le bouton "Supprimer X produit(s) sélectionné(s)".
                </p>
              </div>

              {/* Filtre pour produits personnalisables */}
              <div className="mb-4 flex items-center gap-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={filterCustomizable}
                    onCheckedChange={setFilterCustomizable}
                  />
                  <Label className="font-semibold">Afficher uniquement les produits personnalisables</Label>
                </div>
                {filterCustomizable && (
                  <Badge variant="secondary" className="ml-2">
                    {products.filter(p => p.isCustomizable).length} produit(s) trouvé(s)
                  </Badge>
                )}
              </div>

              <Card>
                <CardContent className="pt-6">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">
                          <input
                            type="checkbox"
                            checked={selectedProducts.length === (filterCustomizable ? products.filter(p => p.isCustomizable).length : products.length) && (filterCustomizable ? products.filter(p => p.isCustomizable).length : products.length) > 0}
                            onChange={(e) => {
                              const filteredProducts = filterCustomizable ? products.filter(p => p.isCustomizable) : products
                              if (e.target.checked) {
                                setSelectedProducts(filteredProducts.map(p => p._id))
                              } else {
                                setSelectedProducts([])
                              }
                            }}
                            className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                          />
                        </TableHead>
                        <TableHead>Image</TableHead>
                        <TableHead>Nom</TableHead>
                        <TableHead>Catégorie</TableHead>
                        <TableHead>Prix</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Personnalisable</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(filterCustomizable ? products.filter(p => p.isCustomizable) : products).map(product => (
                        <TableRow key={product._id} className={selectedProducts.includes(product._id) ? 'bg-pink-50' : ''}>
                          <TableCell>
                            <input
                              type="checkbox"
                              checked={selectedProducts.includes(product._id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedProducts([...selectedProducts, product._id])
                                } else {
                                  setSelectedProducts(selectedProducts.filter(id => id !== product._id))
                                }
                              }}
                              className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                            />
                          </TableCell>
                          <TableCell>
                            <img src={product.images[0]} alt={product.name_fr} className="w-12 h-12 rounded object-cover" />
                          </TableCell>
                          <TableCell className="font-medium">{product.name_fr}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{product.category}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Input 
                                type="number" 
                                value={product.price} 
                                className="w-20 h-8"
                                onChange={async (e) => {
                                  const newPrice = parseFloat(e.target.value)
                                  if (!isNaN(newPrice) && newPrice >= 0) {
                                    try {
                                      const res = await fetch(`/api/products/${product._id}`, {
                                        method: 'PUT',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ price: newPrice })
                                      })
                                      const data = await res.json()
                                      if (data.success) {
                                        toast({ title: '✅ Prix mis à jour' })
                                        loadDashboardData()
                                      }
                                    } catch (error) {
                                      toast({ title: '❌ Erreur', variant: 'destructive' })
                                    }
                                  }
                                }}
                              />
                              <span>$</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Input 
                                type="number" 
                                value={product.stock} 
                                className="w-20 h-8"
                                onChange={async (e) => {
                                  const newStock = parseInt(e.target.value)
                                  if (!isNaN(newStock) && newStock >= 0) {
                                    try {
                                      const res = await fetch(`/api/products/${product._id}`, {
                                        method: 'PUT',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ stock: newStock })
                                      })
                                      const data = await res.json()
                                      if (data.success) {
                                        toast({ title: '✅ Stock mis à jour' })
                                        loadDashboardData()
                                      }
                                    } catch (error) {
                                      toast({ title: '❌ Erreur', variant: 'destructive' })
                                    }
                                  }
                                }}
                              />
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Badge className={product.isCustomizable ? 'bg-purple-500' : 'bg-gray-400'}>
                                {product.isCustomizable ? '✨ Oui' : 'Non'}
                              </Badge>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={async () => {
                                  try {
                                    const res = await fetch(`/api/products/${product._id}`, {
                                      method: 'PUT',
                                      headers: { 'Content-Type': 'application/json' },
                                      body: JSON.stringify({ isCustomizable: !product.isCustomizable })
                                    })
                                    const data = await res.json()
                                    if (data.success) {
                                      toast({ 
                                        title: `✅ Personnalisation ${!product.isCustomizable ? 'activée' : 'désactivée'}`,
                                        description: `Le produit "${product.name_fr}" est maintenant ${!product.isCustomizable ? 'personnalisable' : 'non personnalisable'}`
                                      })
                                      loadDashboardData()
                                    }
                                  } catch (error) {
                                    toast({ title: '❌ Erreur', variant: 'destructive' })
                                  }
                                }}
                              >
                                {product.isCustomizable ? 'Désactiver' : 'Activer'}
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Badge className={product.isActive ? 'bg-green-500' : 'bg-gray-500'}>
                                {product.isActive ? 'Actif' : 'Inactif'}
                              </Badge>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={async () => {
                                  try {
                                    const res = await fetch(`/api/products/${product._id}`, {
                                      method: 'PUT',
                                      headers: { 'Content-Type': 'application/json' },
                                      body: JSON.stringify({ isActive: !product.isActive })
                                    })
                                    const data = await res.json()
                                    if (data.success) {
                                      toast({ title: `✅ Produit ${!product.isActive ? 'activé' : 'désactivé'}` })
                                      loadDashboardData()
                                    }
                                  } catch (error) {
                                    toast({ title: '❌ Erreur', variant: 'destructive' })
                                  }
                                }}
                              >
                                {product.isActive ? 'Désactiver' : 'Activer'}
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button size="icon" variant="outline" onClick={() => {
                                setSelectedProduct(product)
                                setProductForm({
                                  name_fr: product.name_fr || '',
                                  name_en: product.name_en || '',
                                  description_fr: product.description_fr || '',
                                  description_en: product.description_en || '',
                                  category: product.category || 'bijoux',
                                  price: product.price || 0,
                                  weight: product.weight || 0,
                                  stock: product.stock || 0,
                                  minStock: product.minStock || 0,
                                  isCustomizable: product.isCustomizable || false,
                                  isActive: product.isActive !== undefined ? product.isActive : true,
                                  images: product.images || ['']
                                })
                                setProductFormOpen(true)
                              }}>
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button size="icon" variant="destructive" onClick={async () => {
                                if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
                                  try {
                                    const res = await fetch(`/api/products/${product._id}`, { method: 'DELETE' })
                                    const data = await res.json()
                                    if (data.success) {
                                      toast({ title: '✅ Produit supprimé' })
                                      loadDashboardData()
                                    } else {
                                      toast({ title: '❌ Erreur', variant: 'destructive' })
                                    }
                                  } catch (error) {
                                    toast({ title: '❌ Erreur', variant: 'destructive' })
                                  }
                                }
                              }}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Orders */}
          {currentView === 'orders' && (
            <div>
              <h1 className="text-3xl font-bold mb-8">Commandes</h1>
              
              <Card>
                <CardContent className="pt-6">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>N° Commande</TableHead>
                        <TableHead>Client</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Pays</TableHead>
                        <TableHead>Montant</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map(order => (
                        <TableRow key={order._id}>
                          <TableCell className="font-mono font-bold">{order.orderNumber}</TableCell>
                          <TableCell>{order.customer?.firstName} {order.customer?.lastName}</TableCell>
                          <TableCell>{order.customer?.email}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{order.customer?.country}</Badge>
                          </TableCell>
                          <TableCell className="font-bold text-pink-500">{order.totalAmount?.toFixed(2)}$</TableCell>
                          <TableCell>
                            <Badge className={
                              order.status === 'received' ? 'bg-green-500' :
                              order.status === 'preparing' ? 'bg-blue-500' :
                              order.status === 'shipped' ? 'bg-purple-500' :
                              order.status === 'delivered' ? 'bg-gray-500' :
                              'bg-yellow-500'
                            }>
                              {order.status === 'received' ? '✓ Reçu' :
                               order.status === 'preparing' ? '⚙️ En Préparation' :
                               order.status === 'shipped' ? '🚚 Expédié' :
                               order.status === 'delivered' ? '✓ Livré' :
                               order.status === 'pending' ? '⏳ En Attente' :
                               order.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{new Date(order.createdAt).toLocaleDateString('fr-FR')}</TableCell>
                          <TableCell>
                            <Button 
                              size="icon" 
                              variant="outline"
                              onClick={() => {
                                setSelectedOrder(order)
                                setShowShippingForm(false)
                                setShippingForm({ trackingNumber: '', carrier: '' })
                                setOrderDetailsOpen(true)
                              }}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Employees */}
          {currentView === 'employees' && (
            <div>
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Employés</h1>
                <Button 
                  onClick={() => setEmployeeFormOpen(true)}
                  className="bg-gradient-to-r from-pink-500 to-purple-600"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Créer un employé
                </Button>
              </div>

              <Card>
                <CardContent className="pt-6">
                  {employees.length === 0 ? (
                    <p className="text-gray-500 text-center py-12">
                      Aucun employé créé. Cliquez sur "Créer un employé" pour commencer.
                    </p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Code</TableHead>
                          <TableHead>Nom</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Date de création</TableHead>
                          <TableHead>Statut</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {employees.map(employee => (
                          <TableRow key={employee.id}>
                            <TableCell className="font-mono font-bold text-pink-600">{employee.code}</TableCell>
                            <TableCell>{employee.name}</TableCell>
                            <TableCell>{employee.email || '-'}</TableCell>
                            <TableCell>{new Date(employee.created_at).toLocaleDateString('fr-FR')}</TableCell>
                            <TableCell>
                              <Badge className={employee.is_active ? 'bg-green-500' : 'bg-gray-500'}>
                                {employee.is_active ? 'Actif' : 'Inactif'}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Button
                                size="icon"
                                variant="destructive"
                                onClick={async () => {
                                  if (!window.confirm(`Êtes-vous sûr de vouloir supprimer l'employé ${employee.name} (${employee.code}) ?`)) {
                                    return
                                  }
                                  try {
                                    const res = await fetch(`/api/admin/employees/${employee.id}`, {
                                      method: 'DELETE'
                                    })
                                    const data = await res.json()
                                    if (data.success) {
                                      toast({ 
                                        title: '✅ Employé supprimé', 
                                        description: `${employee.name} a été supprimé avec succès`,
                                        duration: 3000
                                      })
                                      loadDashboardData()
                                    } else {
                                      toast({ 
                                        title: '❌ Erreur', 
                                        description: data.error || 'Impossible de supprimer l\'employé', 
                                        variant: 'destructive' 
                                      })
                                    }
                                  } catch (error) {
                                    console.error(error)
                                    toast({ 
                                      title: '❌ Erreur', 
                                      description: 'Erreur lors de la suppression', 
                                      variant: 'destructive' 
                                    })
                                  }
                                }}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Site Content Management */}
          {currentView === 'site-content' && (
            <div>
              <h1 className="text-3xl font-bold mb-8">Contenu du Site</h1>
              <p className="text-gray-600 mb-8">Gérez tout le contenu éditable de votre site web</p>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {/* Header */}
                <Card className="cursor-pointer hover:shadow-xl transition" onClick={() => {
                  setSelectedContentSection('header')
                  setSiteContentOpen(true)
                }}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="w-5 h-5" />
                      Header
                    </CardTitle>
                    <CardDescription>Logo, titre, sous-titre, navigation</CardDescription>
                  </CardHeader>
                </Card>
                
                {/* Footer */}
                <Card className="cursor-pointer hover:shadow-xl transition" onClick={() => {
                  setSelectedContentSection('footer')
                  setSiteContentOpen(true)
                }}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="w-5 h-5" />
                      Footer
                    </CardTitle>
                    <CardDescription>Description, liens, réseaux sociaux</CardDescription>
                  </CardHeader>
                </Card>
                
                {/* Landing Hero */}
                <Card className="cursor-pointer hover:shadow-xl transition" onClick={() => {
                  setSelectedContentSection('landing_hero')
                  setSiteContentOpen(true)
                }}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Home className="w-5 h-5" />
                      Page d'Accueil - Hero
                    </CardTitle>
                    <CardDescription>Titre principal, sous-titre, bouton CTA</CardDescription>
                  </CardHeader>
                </Card>
                
                {/* Landing Features */}
                <Card className="cursor-pointer hover:shadow-xl transition" onClick={() => {
                  setSelectedContentSection('landing_features')
                  setSiteContentOpen(true)
                }}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Home className="w-5 h-5" />
                      Pourquoi Nous Choisir
                    </CardTitle>
                    <CardDescription>Section avec 3 cartes (Fait Main, Personnalisable, Livraison)</CardDescription>
                  </CardHeader>
                </Card>
                
                {/* Navigation Menu */}
                <Card className="cursor-pointer hover:shadow-xl transition" onClick={() => {
                  setSelectedContentSection('navigation')
                  setSiteContentOpen(true)
                }}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="w-5 h-5" />
                      Menu Navigation
                    </CardTitle>
                    <CardDescription>Liens du menu principal</CardDescription>
                  </CardHeader>
                </Card>
                
                {/* Produits Vedettes */}
                <Card className="cursor-pointer hover:shadow-xl transition" onClick={() => {
                  setSelectedContentSection('featured_products')
                  setSiteContentOpen(true)
                }}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="w-5 h-5" />
                      Produits Vedettes
                    </CardTitle>
                    <CardDescription>Titre de la section produits vedettes</CardDescription>
                  </CardHeader>
                </Card>
              </div>
            </div>
          )}

          {/* Inventory Management */}
          {currentView === 'inventory' && (
            <div>
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Inventaire</h1>
                <Button 
                  onClick={() => {
                    const totalStock = products.reduce((sum, p) => sum + (p.stock || 0), 0)
                    const totalProducts = products.length
                    const activeProducts = products.filter(p => p.isActive).length
                    const lowStockProducts = products.filter(p => p.stock <= p.minStock).length
                    
                    toast({
                      title: '📊 Statistiques d\'Inventaire',
                      description: `Total de produits disponibles: ${totalStock} unités\nTotal de produits: ${totalProducts}\nProduits actifs: ${activeProducts}\nProduits à stock faible: ${lowStockProducts}`,
                      duration: 5000
                    })
                  }}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                  <Package className="w-4 h-4 mr-2" />
                  Voir la quantité totale disponible
                </Button>
              </div>

              {/* Statistiques rapides */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-100 text-sm font-medium">Total Stock Disponible</p>
                        <p className="text-3xl font-bold mt-2">
                          {products.reduce((sum, p) => sum + (p.stock || 0), 0)}
                        </p>
                        <p className="text-blue-100 text-xs mt-1">unités</p>
                      </div>
                      <Package className="w-12 h-12 opacity-80" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-100 text-sm font-medium">Total Produits</p>
                        <p className="text-3xl font-bold mt-2">{products.length}</p>
                        <p className="text-green-100 text-xs mt-1">produits</p>
                      </div>
                      <ShoppingCart className="w-12 h-12 opacity-80" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-purple-100 text-sm font-medium">Produits Actifs</p>
                        <p className="text-3xl font-bold mt-2">
                          {products.filter(p => p.isActive).length}
                        </p>
                        <p className="text-purple-100 text-xs mt-1">en vente</p>
                      </div>
                      <Eye className="w-12 h-12 opacity-80" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className={`bg-gradient-to-br ${products.filter(p => p.stock <= p.minStock).length > 0 ? 'from-yellow-500 to-yellow-600' : 'from-gray-500 to-gray-600'} text-white`}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/80 text-sm font-medium">Stock Faible</p>
                        <p className="text-3xl font-bold mt-2">
                          {products.filter(p => p.stock <= p.minStock).length}
                        </p>
                        <p className="text-white/80 text-xs mt-1">à réapprovisionner</p>
                      </div>
                      <AlertTriangle className="w-12 h-12 opacity-80" />
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardContent className="pt-6">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Produit</TableHead>
                        <TableHead>Catégorie</TableHead>
                        <TableHead>Stock Actuel</TableHead>
                        <TableHead>Stock Minimum</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products.map(product => {
                        const isLowStock = product.stock <= product.minStock
                        return (
                          <TableRow key={product._id} className={isLowStock ? 'bg-yellow-50' : ''}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <img src={product.images[0]} alt={product.name_fr} className="w-12 h-12 rounded object-cover" />
                                <span className="font-medium">{product.name_fr}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{product.category}</Badge>
                            </TableCell>
                            <TableCell>
                              <span className={`font-bold ${isLowStock ? 'text-red-600' : 'text-green-600'}`}>
                                {product.stock}
                              </span>
                            </TableCell>
                            <TableCell>{product.minStock || 0}</TableCell>
                            <TableCell>
                              {isLowStock ? (
                                <Badge className="bg-yellow-500">
                                  <AlertTriangle className="w-3 h-3 mr-1" />
                                  Stock Faible
                                </Badge>
                              ) : (
                                <Badge className="bg-green-500">En Stock</Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              <Button 
                                size="icon" 
                                variant="outline"
                                onClick={() => {
                                  setSelectedProduct(product)
                                  setProductForm({
                                    id: product.id,
                                    name_fr: product.name_fr || '',
                                    name_en: product.name_en || '',
                                    description_fr: product.description_fr || '',
                                    description_en: product.description_en || '',
                                    category: product.category || 'bijoux',
                                    price: product.price || 0,
                                    weight: product.weight || 0,
                                    stock: product.stock || 0,
                                    minStock: product.minStock || 0,
                                    isCustomizable: product.isCustomizable || false,
                                    isActive: product.isActive || true,
                                    images: product.images || ['']
                                  })
                                  setProductFormOpen(true)
                                }}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                  
                  {products.filter(p => p.stock <= p.minStock).length > 0 && (
                    <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center gap-2 text-yellow-800">
                        <AlertTriangle className="w-5 h-5" />
                        <p className="font-semibold">
                          {products.filter(p => p.stock <= p.minStock).length} produit(s) avec stock faible
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Legal Pages Management */}
          {currentView === 'legal-pages' && (
            <div>
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Pages Légales</h1>
                <Button
                  variant="outline"
                  onClick={async () => {
                    if (!window.confirm('Voulez-vous initialiser toutes les pages légales avec le contenu actuel du site ? Cette action va remplacer le contenu existant dans la base de données.')) {
                      return
                    }
                    try {
                      const pages = ['faq', 'livraison', 'retours', 'garantie']
                      const pageContents = {
                        faq: {
                          title_fr: 'FAQ',
                          title_en: 'FAQ',
                          content_fr: `## Questions Fréquentes\n\n**Adresse email :** support@missacreations.com\n\n### Questions Fréquentes\n\n**Q: Combien de temps prend la création d'un bijou personnalisé ?**\nR: Chaque création est faite à la main avec soin. Comptez entre 5 à 10 jours ouvrables pour la fabrication, plus le délai de livraison.\n\n**Q: Puis-je modifier ma commande après l'avoir passée ?**\nR: Les modifications sont possibles dans les 24h suivant votre commande. Contactez-nous rapidement à support@missacreations.com.\n\n**Q: Quels types d'images fonctionnent le mieux pour la personnalisation ?**\nR: Les images de haute qualité (minimum 1000x1000 pixels) avec un bon éclairage donnent les meilleurs résultats. Les photos avec des visages nets ou des motifs clairs sont idéales.\n\n**Q: Les bijoux en résine sont-ils résistants à l'eau ?**\nR: Nos créations sont résistantes aux éclaboussures, mais nous recommandons de les retirer avant la douche, la baignade ou les activités aquatiques prolongées.\n\n**Q: Proposez-vous des boîtes cadeaux ?**\nR: Oui ! Chaque création est livrée dans un joli emballage cadeau. Des options premium sont disponibles lors de la commande.\n\n💌 **Pour toute question :** support@missacreations.com\n📞 **Temps de réponse :** Sous 24h (jours ouvrables)`,
                          content_en: `## Frequently Asked Questions\n\n**Email address:** support@missacreations.com\n\n### Frequently Asked Questions\n\n**Q: How long does it take to create a personalized jewelry?**\nA: Each creation is handmade with care. Allow 5 to 10 business days for production, plus delivery time.\n\n**Q: Can I modify my order after placing it?**\nA: Modifications are possible within 24 hours of your order. Contact us quickly at support@missacreations.com.\n\n**Q: What types of images work best for personalization?**\nA: High-quality images (minimum 1000x1000 pixels) with good lighting give the best results. Photos with clear faces or patterns are ideal.\n\n**Q: Are resin jewelry water resistant?**\nA: Our creations are splash-resistant, but we recommend removing them before showering, swimming, or prolonged water activities.\n\n**Q: Do you offer gift boxes?**\nA: Yes! Each creation is delivered in a beautiful gift box. Premium options are available when ordering.\n\n💌 **For any questions:** support@missacreations.com\n📞 **Response time:** Under 24h (business days)`
                        },
                        livraison: {
                          title_fr: 'Livraison',
                          title_en: 'Delivery',
                          content_fr: `## Livraison\n\n**Adresse email :** support@missacreations.com\n\n### Informations de Livraison\n\n**Délais de livraison :**\n- Canada : 3-5 jours ouvrables\n- États-Unis : 5-7 jours ouvrables\n- International : 10-15 jours ouvrables\n\n**Frais de livraison :**\n- Livraison gratuite pour toute commande de 75$ et plus au Canada\n- Tarifs standards : 8,99$ (Canada) | 14,99$ (États-Unis)\n- Livraison internationale : calculée selon la destination\n\n**Suivi de commande :**\nVous recevrez un numéro de suivi par email dès l'expédition de votre colis. Suivez votre commande en temps réel.\n\n**Problème avec votre livraison ?**\nContactez-nous à support@missacreations.com avec votre numéro de commande.\n\n💌 **Pour toute question :** support@missacreations.com\n📞 **Temps de réponse :** Sous 24h (jours ouvrables)`,
                          content_en: `## Delivery\n\n**Email address:** support@missacreations.com\n\n### Delivery Information\n\n**Delivery times:**\n- Canada: 3-5 business days\n- United States: 5-7 business days\n- International: 10-15 business days\n\n**Shipping costs:**\n- Free shipping for orders of $75 and more in Canada\n- Standard rates: $8.99 (Canada) | $14.99 (United States)\n- International shipping: calculated by destination\n\n**Order tracking:**\nYou will receive a tracking number by email as soon as your package is shipped. Track your order in real time.\n\n**Problem with your delivery?**\nContact us at support@missacreations.com with your order number.\n\n💌 **For any questions:** support@missacreations.com\n📞 **Response time:** Under 24h (business days)`
                        },
                        retours: {
                          title_fr: 'Retours',
                          title_en: 'Returns',
                          content_fr: `## Retours\n\n**Adresse email :** support@missacreations.com\n\n### Politique de Retours\n\n**Délai de retour :** 30 jours\nVous disposez de 30 jours à compter de la réception pour retourner un article non personnalisé en parfait état.\n\n**Articles personnalisés :**\nLes créations sur mesure avec vos photos ou textes ne sont pas éligibles au retour, sauf en cas de défaut de fabrication.\n\n**Comment effectuer un retour :**\n1. Contactez-nous à support@missacreations.com avec votre numéro de commande\n2. Indiquez la raison du retour\n3. Nous vous enverrons une étiquette de retour prépayée\n4. Emballez soigneusement l'article dans son emballage d'origine\n5. Remboursement sous 5-7 jours après réception\n\n**Articles éligibles au retour :**\n- Article intact et non porté\n- Emballage d'origine\n- Étiquettes attachées (si applicable)\n\n**Articles non retournables :**\n- Créations personnalisées avec photo/texte\n- Bijoux portés ou endommagés\n- Articles soldés (sauf défaut)\n\n💌 **Pour toute question :** support@missacreations.com\n📞 **Temps de réponse :** Sous 24h (jours ouvrables)`,
                          content_en: `## Returns\n\n**Email address:** support@missacreations.com\n\n### Return Policy\n\n**Return period:** 30 days\nYou have 30 days from receipt to return a non-personalized item in perfect condition.\n\n**Personalized items:**\nCustom creations with your photos or texts are not eligible for return, except in case of manufacturing defect.\n\n**How to make a return:**\n1. Contact us at support@missacreations.com with your order number\n2. Indicate the reason for return\n3. We will send you a prepaid return label\n4. Carefully pack the item in its original packaging\n5. Refund within 5-7 days after receipt\n\n**Items eligible for return:**\n- Intact and unworn item\n- Original packaging\n- Tags attached (if applicable)\n\n**Non-returnable items:**\n- Personalized creations with photo/text\n- Worn or damaged jewelry\n- Sale items (except defects)\n\n💌 **For any questions:** support@missacreations.com\n📞 **Response time:** Under 24h (business days)`
                        },
                        garantie: {
                          title_fr: 'Garantie',
                          title_en: 'Warranty',
                          content_fr: `## Garantie\n\n**Adresse email :** support@missacreations.com\n\n### Notre Garantie Qualité\n\n**Garantie de 1 an**\nToutes nos créations sont garanties contre les défauts de fabrication pendant 1 an à compter de la date d'achat.\n\n**Couverture de la garantie :**\n- Défauts de résine (jaunissement, fissures)\n- Problèmes de monture ou fermoirs\n- Détachement de l'image ou du texte\n- Défauts de finition\n\n**Non couvert par la garantie :**\n- Usure normale\n- Dommages causés par mauvaise utilisation\n- Exposition prolongée à l'eau ou produits chimiques\n- Chocs ou chutes\n\n**Comment faire une réclamation :**\n1. Envoyez-nous un email à support@missacreations.com\n2. Joignez des photos claires du défaut\n3. Incluez votre numéro de commande\n4. Nous évaluerons votre demande sous 48h\n\n**Notre engagement :**\nSi votre création présente un défaut couvert par la garantie, nous la remplacerons gratuitement ou vous rembourserons intégralement.\n\n**Satisfaction garantie**\nVotre bonheur est notre priorité. Si vous n'êtes pas 100% satisfait de votre création, contactez-nous pour trouver une solution.\n\n💌 **Pour toute question :** support@missacreations.com\n📞 **Temps de réponse :** Sous 24h (jours ouvrables)`,
                          content_en: `## Warranty\n\n**Email address:** support@missacreations.com\n\n### Our Quality Guarantee\n\n**1 Year Warranty**\nAll our creations are guaranteed against manufacturing defects for 1 year from the date of purchase.\n\n**Warranty coverage:**\n- Resin defects (yellowing, cracks)\n- Mounting or clasp problems\n- Detachment of image or text\n- Finishing defects\n\n**Not covered by warranty:**\n- Normal wear\n- Damage caused by misuse\n- Prolonged exposure to water or chemicals\n- Shocks or falls\n\n**How to file a claim:**\n1. Send us an email at support@missacreations.com\n2. Attach clear photos of the defect\n3. Include your order number\n4. We will evaluate your request within 48h\n\n**Our commitment:**\nIf your creation has a defect covered by the warranty, we will replace it free of charge or refund you in full.\n\n**Satisfaction guaranteed**\nYour happiness is our priority. If you are not 100% satisfied with your creation, contact us to find a solution.\n\n💌 **For any questions:** support@missacreations.com\n📞 **Response time:** Under 24h (business days)`
                        }
                      }
                      
                      let successCount = 0
                      for (const slug of pages) {
                        try {
                          const res = await fetch('/api/admin/legal-pages', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              page_slug: slug,
                              ...pageContents[slug]
                            })
                          })
                          const data = await res.json()
                          if (data.success) {
                            successCount++
                          }
                        } catch (error) {
                          console.error(`Erreur pour ${slug}:`, error)
                        }
                      }
                      
                      if (successCount === pages.length) {
                        toast({ 
                          title: '✅ Pages initialisées', 
                          description: 'Toutes les pages légales ont été synchronisées avec succès',
                          duration: 5000
                        })
                        loadDashboardData()
                      } else {
                        toast({ 
                          title: '⚠️ Partiellement initialisé', 
                          description: `${successCount}/${pages.length} pages initialisées`,
                          variant: 'destructive'
                        })
                      }
                    } catch (error) {
                      console.error(error)
                      toast({ title: '❌ Erreur', description: 'Erreur lors de l\'initialisation', variant: 'destructive' })
                    }
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Initialiser avec le contenu actuel
                </Button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="cursor-pointer hover:shadow-xl transition" onClick={() => {
                  setSelectedLegalPage('faq')
                  setLegalPagesOpen(true)
                }}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      FAQ
                    </CardTitle>
                    <CardDescription>Modifier la page FAQ</CardDescription>
                  </CardHeader>
                </Card>
                
                <Card className="cursor-pointer hover:shadow-xl transition" onClick={() => {
                  setSelectedLegalPage('livraison')
                  setLegalPagesOpen(true)
                }}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Livraison
                    </CardTitle>
                    <CardDescription>Modifier la page Livraison</CardDescription>
                  </CardHeader>
                </Card>
                
                <Card className="cursor-pointer hover:shadow-xl transition" onClick={() => {
                  setSelectedLegalPage('retours')
                  setLegalPagesOpen(true)
                }}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Retours
                    </CardTitle>
                    <CardDescription>Modifier la page Retours</CardDescription>
                  </CardHeader>
                </Card>
                
                <Card className="cursor-pointer hover:shadow-xl transition" onClick={() => {
                  setSelectedLegalPage('garantie')
                  setLegalPagesOpen(true)
                }}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Garantie
                    </CardTitle>
                    <CardDescription>Modifier la page Garantie</CardDescription>
                  </CardHeader>
                </Card>
              </div>
            </div>
          )}

          {/* Blog Management */}
          {currentView === 'blog' && (
            <div>
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Gestion du Blog</h1>
                <Button 
                  onClick={() => {
                    setSelectedBlogPost(null)
                    setBlogForm({
                      slug: '',
                      title_fr: '',
                      title_en: '',
                      excerpt_fr: '',
                      excerpt_en: '',
                      content_fr: '',
                      content_en: '',
                      category: 'bijoux-resine',
                      image: '',
                      image_alt_fr: '',
                      image_alt_en: '',
                      image_credits: '',
                      author: 'Missa',
                      author_bio_fr: '',
                      author_bio_en: '',
                      author_avatar: '',
                      published_at: new Date().toISOString().split('T')[0],
                      is_active: true,
                      is_featured: false,
                      reading_time: 5,
                      meta_description_fr: '',
                      meta_description_en: ''
                    })
                    setBlogFormOpen(true)
                  }}
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Nouvel Article
                </Button>
              </div>

              <Card>
                <CardContent className="pt-6">
                  {blogPosts.length === 0 ? (
                    <div className="text-center py-12">
                      <BookOpen className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-500 text-lg">Aucun article de blog pour le moment</p>
                      <p className="text-gray-400 text-sm mt-2">Cliquez sur "Nouvel Article" pour créer votre premier article</p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Image</TableHead>
                          <TableHead>Titre</TableHead>
                          <TableHead>Catégorie</TableHead>
                          <TableHead>Statut</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Vues</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {blogPosts.map((post) => (
                          <TableRow key={post._id}>
                            <TableCell>
                              {post.image ? (
                                <img src={post.image} alt={post.title_fr} className="w-16 h-16 object-cover rounded" />
                              ) : (
                                <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                                  <BookOpen className="w-6 h-6 text-gray-400" />
                                </div>
                              )}
                            </TableCell>
                            <TableCell className="font-medium max-w-xs">
                              <div className="truncate">{post.title_fr}</div>
                              {post.isFeatured && (
                                <Badge className="mt-1 bg-yellow-500">⭐ En vedette</Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{post.category}</Badge>
                            </TableCell>
                            <TableCell>
                              <Badge className={post.isActive ? 'bg-green-500' : 'bg-gray-500'}>
                                {post.isActive ? 'Actif' : 'Inactif'}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {new Date(post.publishedAt).toLocaleDateString('fr-FR')}
                            </TableCell>
                            <TableCell>{post.viewCount || 0}</TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  size="icon"
                                  variant="outline"
                                  onClick={() => {
                                    setSelectedBlogPost(post)
                                    setBlogForm({
                                      slug: post.slug,
                                      title_fr: post.title_fr,
                                      title_en: post.title_en,
                                      excerpt_fr: post.excerpt_fr,
                                      excerpt_en: post.excerpt_en,
                                      content_fr: post.content_fr,
                                      content_en: post.content_en,
                                      category: post.category,
                                      image: post.image,
                                      image_alt_fr: post.imageAlt_fr || '',
                                      image_alt_en: post.imageAlt_en || '',
                                      image_credits: post.imageCredits || '',
                                      author: post.author,
                                      author_bio_fr: post.authorBio_fr || '',
                                      author_bio_en: post.authorBio_en || '',
                                      author_avatar: post.authorAvatar || '',
                                      published_at: post.publishedAt ? new Date(post.publishedAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                                      is_active: post.isActive,
                                      is_featured: post.isFeatured,
                                      reading_time: post.readingTime || 5,
                                      meta_description_fr: post.metaDescription_fr || '',
                                      meta_description_en: post.metaDescription_en || ''
                                    })
                                    setBlogFormOpen(true)
                                  }}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="destructive"
                                  onClick={async () => {
                                    if (confirm(`Êtes-vous sûr de vouloir supprimer l'article "${post.title_fr}" ?`)) {
                                      try {
                                        const res = await fetch(`/api/blog/${post.slug}`, {
                                          method: 'DELETE'
                                        })
                                        const data = await res.json()
                                        if (data.success) {
                                          toast({ title: '✅ Article supprimé', description: 'L\'article a été supprimé avec succès' })
                                          loadDashboardData()
                                        } else {
                                          toast({ title: '❌ Erreur', description: data.error || 'Erreur lors de la suppression', variant: 'destructive' })
                                        }
                                      } catch (error) {
                                        toast({ title: '❌ Erreur', description: 'Erreur lors de la suppression', variant: 'destructive' })
                                      }
                                    }
                                  }}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Newsletter Subscribers */}
          {currentView === 'newsletter-subscribers' && (
            <div>
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Abonnés Newsletter</h1>
                <div className="flex items-center gap-4">
                  <Badge variant="secondary" className="text-lg px-4 py-2">
                    Total: {newsletterSubscribers.length}
                  </Badge>
                  <Button
                    onClick={async () => {
                      const emails = newsletterSubscribers
                        .filter(s => s.is_active)
                        .map(s => s.email)
                        .join(', ')
                      
                      if (emails) {
                        await navigator.clipboard.writeText(emails)
                        setEmailsCopied(true)
                        toast({
                          title: '✅ Emails copiés !',
                          description: `${newsletterSubscribers.filter(s => s.is_active).length} email(s) copié(s) dans le presse-papier`
                        })
                        setTimeout(() => setEmailsCopied(false), 2000)
                      } else {
                        toast({
                          title: '⚠️ Aucun email à copier',
                          variant: 'destructive'
                        })
                      }
                    }}
                    className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                  >
                    {emailsCopied ? (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Copié !
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-2" />
                        Copier tous les emails
                      </>
                    )}
                  </Button>
                </div>
              </div>
              
              <Card>
                <CardContent className="pt-6">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Email</TableHead>
                        <TableHead>Nom</TableHead>
                        <TableHead>Langue</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Date d'abonnement</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {newsletterSubscribers.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                            Aucun abonné pour le moment
                          </TableCell>
                        </TableRow>
                      ) : (
                        newsletterSubscribers.map((subscriber) => (
                          <TableRow key={subscriber.id}>
                            <TableCell className="font-medium">{subscriber.email}</TableCell>
                            <TableCell>{subscriber.name || '-'}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{subscriber.language || 'fr'}</Badge>
                            </TableCell>
                            <TableCell>
                              <Badge className={subscriber.is_active ? 'bg-green-500' : 'bg-gray-500'}>
                                {subscriber.is_active ? 'Actif' : 'Inactif'}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {new Date(subscriber.subscribed_at).toLocaleDateString('fr-FR', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Abandoned Carts */}
          {currentView === 'abandoned-carts' && (
            <div>
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Paniers Abandonnés</h1>
                <div className="flex items-center gap-4">
                  <Badge variant="secondary" className="text-lg px-4 py-2">
                    Total: {abandonedCarts.length}
                  </Badge>
                  <Button
                    onClick={async () => {
                      // Récupérer les emails uniques (éviter les doublons)
                      const uniqueEmails = [...new Set(abandonedCarts.map(c => c.email))]
                      const emails = uniqueEmails.join(', ')
                      
                      if (emails) {
                        await navigator.clipboard.writeText(emails)
                        setEmailsCopied(true)
                        toast({
                          title: '✅ Emails copiés !',
                          description: `${uniqueEmails.length} email(s) unique(s) copié(s) dans le presse-papier`
                        })
                        setTimeout(() => setEmailsCopied(false), 2000)
                      } else {
                        toast({
                          title: '⚠️ Aucun email à copier',
                          variant: 'destructive'
                        })
                      }
                    }}
                    className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                  >
                    {emailsCopied ? (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Copié !
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-2" />
                        Copier tous les emails
                      </>
                    )}
                  </Button>
                </div>
              </div>
              
              <Card>
                <CardContent className="pt-6">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Email</TableHead>
                        <TableHead>Nom</TableHead>
                        <TableHead>Langue</TableHead>
                        <TableHead>Articles</TableHead>
                        <TableHead>Montant</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {abandonedCarts.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                            Aucun panier abandonné pour le moment
                          </TableCell>
                        </TableRow>
                      ) : (
                        abandonedCarts.map((cart) => (
                          <TableRow key={cart.id}>
                            <TableCell className="font-medium">{cart.email}</TableCell>
                            <TableCell>{cart.name || '-'}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{cart.language || 'fr'}</Badge>
                            </TableCell>
                            <TableCell>
                              {cart.cart_items && Array.isArray(cart.cart_items) ? (
                                <span>{cart.cart_items.length} article(s)</span>
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </TableCell>
                            <TableCell>
                              {cart.total_amount ? (
                                <span className="font-semibold text-pink-600">{parseFloat(cart.total_amount).toFixed(2)}$ CAD</span>
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </TableCell>
                            <TableCell>
                              {new Date(cart.created_at).toLocaleDateString('fr-FR', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Product Form Dialog */}
      <Dialog open={productFormOpen} onOpenChange={setProductFormOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedProduct ? 'Modifier le produit' : 'Ajouter un nouveau produit'}</DialogTitle>
            <DialogDescription>
              {selectedProduct ? (
                <div className="mt-2">
                  <p className="font-medium">{selectedProduct.name_fr}</p>
                  <p className="text-sm text-gray-500">Catégorie: {selectedProduct.category}</p>
                </div>
              ) : (
                'Remplissez tous les champs pour créer un nouveau produit'
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {!selectedProduct && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Nom (Français) *</Label>
                    <Input 
                      value={productForm.name_fr} 
                      onChange={(e) => setProductForm({...productForm, name_fr: e.target.value})} 
                      placeholder="Nom du produit en français"
                    />
                  </div>
                  <div>
                    <Label>Nom (Anglais) *</Label>
                    <Input 
                      value={productForm.name_en} 
                      onChange={(e) => setProductForm({...productForm, name_en: e.target.value})} 
                      placeholder="Product name in English"
                    />
                  </div>
                </div>
                <div>
                  <Label>Description (Français)</Label>
                  <Textarea 
                    value={productForm.description_fr} 
                    onChange={(e) => setProductForm({...productForm, description_fr: e.target.value})} 
                    rows={3}
                    placeholder="Description du produit en français"
                  />
                </div>
                <div>
                  <Label>Description (Anglais)</Label>
                  <Textarea 
                    value={productForm.description_en} 
                    onChange={(e) => setProductForm({...productForm, description_en: e.target.value})} 
                    rows={3}
                    placeholder="Product description in English"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Catégorie *</Label>
                    <Select value={productForm.category} onValueChange={(value) => setProductForm({...productForm, category: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bijoux-accessoires">Bijoux & Accessoires</SelectItem>
                        <SelectItem value="decoration-maison">Décoration Maison</SelectItem>
                        <SelectItem value="objets-art">Objets d'Art</SelectItem>
                        <SelectItem value="accessoires-quotidiens">Accessoires Quotidiens</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Prix ($ CAD) *</Label>
                    <Input 
                      type="number" 
                      step="0.01"
                      value={productForm.price} 
                      onChange={(e) => setProductForm({...productForm, price: parseFloat(e.target.value) || 0})} 
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Poids (g)</Label>
                    <Input 
                      type="number" 
                      value={productForm.weight} 
                      onChange={(e) => setProductForm({...productForm, weight: parseInt(e.target.value) || 0})} 
                    />
                  </div>
                  <div>
                    <Label>Stock initial</Label>
                    <Input 
                      type="number" 
                      value={productForm.stock} 
                      onChange={(e) => setProductForm({...productForm, stock: parseInt(e.target.value) || 0})} 
                    />
                  </div>
                  <div>
                    <Label>Stock minimum</Label>
                    <Input 
                      type="number" 
                      value={productForm.minStock} 
                      onChange={(e) => setProductForm({...productForm, minStock: parseInt(e.target.value) || 0})} 
                    />
                  </div>
                </div>
                <div>
                  <Label>URL de l'image</Label>
                  <Input 
                    value={productForm.images[0] || ''} 
                    onChange={(e) => setProductForm({...productForm, images: [e.target.value]})} 
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Switch 
                      checked={productForm.isCustomizable} 
                      onCheckedChange={(checked) => setProductForm({...productForm, isCustomizable: checked})}
                    />
                    <Label>Personnalisable</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch 
                      checked={productForm.isActive} 
                      onCheckedChange={(checked) => setProductForm({...productForm, isActive: checked})}
                    />
                    <Label>Actif (visible sur le site)</Label>
                  </div>
                </div>
              </>
            )}
            {selectedProduct && (
              <>
                <div>
                  <Label>Prix ($ CAD)</Label>
                  <Input 
                    type="number" 
                    step="0.01"
                    value={productForm.price} 
                    onChange={(e) => setProductForm({...productForm, price: parseFloat(e.target.value) || 0})} 
                  />
                  <p className="text-sm text-gray-500 mt-1">Modifiez uniquement le prix. Les autres informations sont gérées par l'atelier.</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <p className="text-sm font-medium">Informations du produit (lecture seule)</p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-500">Stock actuel:</span> <span className="font-medium">{selectedProduct.stock}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Statut:</span> <span className="font-medium">{selectedProduct.isActive ? 'Actif' : 'Inactif'}</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setProductFormOpen(false)
              setSelectedProduct(null)
            }}>Annuler</Button>
            <Button onClick={handleCreateProduct} className="bg-gradient-to-r from-pink-500 to-purple-600">
              {selectedProduct ? 'Mettre à jour le prix' : 'Créer le produit'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Order Details Dialog */}
      <Dialog open={orderDetailsOpen} onOpenChange={setOrderDetailsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Détails de la commande {selectedOrder?.orderNumber}</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Informations client</CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Nom</p>
                    <p className="font-medium">{selectedOrder.customer?.firstName} {selectedOrder.customer?.lastName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{selectedOrder.customer?.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Téléphone</p>
                    <p className="font-medium">{selectedOrder.customer?.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Pays</p>
                    <p className="font-medium">{selectedOrder.customer?.country}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-gray-500">Adresse</p>
                    <p className="font-medium">
                      {selectedOrder.customer?.address1}, {selectedOrder.customer?.city}, {selectedOrder.customer?.postalCode}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Produits commandés</CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedOrder.items?.map((item, idx) => (
                    <div key={idx} className="flex gap-4 mb-4 pb-4 border-b last:border-0">
                      <img src={item.image} alt={item.name} className="w-20 h-20 rounded object-cover" />
                      <div className="flex-1">
                        <h4 className="font-bold">{item.name}</h4>
                        <p className="text-sm text-gray-500">Qté: {item.quantity} × {item.price}$</p>
                        {item.customization && (
                          <div className="mt-2 p-3 bg-purple-50 rounded-lg">
                            <Badge className="mb-2 bg-purple-500">✨ Personnalisation</Badge>
                            {item.customization.text && (
                              <div>
                                <p className="text-sm font-medium">Texte:</p>
                                <p className="text-sm italic">"{item.customization.text}"</p>
                              </div>
                            )}
                            {item.customization.images && item.customization.images.length > 0 && (
                              <div className="mt-2">
                                <p className="text-sm font-medium mb-2">Images:</p>
                                <div className="grid grid-cols-3 gap-2">
                                  {item.customization.images.map((img, i) => (
                                    <img key={i} src={img} alt={`Custom ${i+1}`} className="w-full h-20 object-cover rounded" />
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{((item.price + (item.customization ? 10 : 0)) * item.quantity).toFixed(2)}$</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Sous-total</span>
                      <span>{(selectedOrder.totalAmount - selectedOrder.shippingCost).toFixed(2)}$</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Livraison</span>
                      <span>{selectedOrder.shippingCost?.toFixed(2)}$</span>
                    </div>
                    <div className="flex justify-between text-xl font-bold border-t pt-2">
                      <span>Total</span>
                      <span className="text-pink-500">{selectedOrder.totalAmount?.toFixed(2)}$ CAD</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Actions de Commande</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    <Button 
                      variant={selectedOrder.status === 'received' ? 'default' : 'outline'}
                      onClick={async () => {
                        try {
                          const res = await fetch('/api/admin/orders/notify', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ orderId: selectedOrder._id, action: 'received' })
                          })
                          const data = await res.json()
                          if (data.success) {
                            toast({ title: '✅ ' + data.message })
                            loadDashboardData()
                            setOrderDetailsOpen(false)
                          }
                        } catch (error) {
                          toast({ title: '❌ Erreur', variant: 'destructive' })
                        }
                      }}
                      className="bg-green-500 hover:bg-green-600"
                    >
                      ✓ Reçu
                    </Button>
                    
                    <Button 
                      variant={selectedOrder.status === 'preparing' ? 'default' : 'outline'}
                      onClick={async () => {
                        try {
                          const res = await fetch('/api/admin/orders/notify', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ orderId: selectedOrder._id, action: 'preparing' })
                          })
                          const data = await res.json()
                          if (data.success) {
                            toast({ title: '✅ ' + data.message })
                            loadDashboardData()
                            setOrderDetailsOpen(false)
                          }
                        } catch (error) {
                          toast({ title: '❌ Erreur', variant: 'destructive' })
                        }
                      }}
                      className="bg-blue-500 hover:bg-blue-600"
                    >
                      ⚙️ En Préparation
                    </Button>
                    
                    <Button 
                      variant={selectedOrder.status === 'shipped' ? 'default' : 'outline'}
                      onClick={() => setShowShippingForm(true)}
                      className="bg-purple-500 hover:bg-purple-600"
                    >
                      🚚 Envoyé
                    </Button>
                  </div>
                  
                  {selectedOrder.trackingNumber && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm font-semibold mb-2">Informations de suivi :</p>
                      <p className="text-sm"><strong>Numéro :</strong> {selectedOrder.trackingNumber}</p>
                      <p className="text-sm"><strong>Transporteur :</strong> {selectedOrder.shippingCarrier || 'N/A'}</p>
                      {selectedOrder.trackingUrl && (
                        <a href={selectedOrder.trackingUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                          🔗 Lien de suivi
                        </a>
                      )}
                    </div>
                  )}

                  {/* Boutons pour générer étiquette et carte */}
                  <div className="flex gap-3 pt-4 border-t">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => {
                        setOrderForLabel(selectedOrder)
                        setLabelPreviewOpen(true)
                      }}
                    >
                      <Printer className="w-4 h-4 mr-2" />
                      Générer Étiquette
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => {
                        setOrderForLabel(selectedOrder)
                        setCardPreviewOpen(true)
                      }}
                    >
                      <Printer className="w-4 h-4 mr-2" />
                      Générer Carte
                    </Button>
                  </div>

                  {/* Bouton Annuler Commande */}
                  {selectedOrder.status !== 'cancelled' && selectedOrder.status !== 'delivered' && (
                    <div className="pt-4 border-t">
                      <Button 
                        variant="destructive" 
                        className="w-full"
                        onClick={async () => {
                          if (!confirm('Êtes-vous sûr de vouloir annuler cette commande ? Le remboursement sera effectué automatiquement.')) {
                            return
                          }
                          try {
                            const res = await fetch(`/api/admin/orders/${selectedOrder._id}/cancel`, {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' }
                            })
                            const data = await res.json()
                            if (data.success) {
                              toast({ 
                                title: '✅ Commande annulée', 
                                description: `Remboursement de ${selectedOrder.totalAmount?.toFixed(2)}$ effectué`,
                                duration: 5000
                              })
                              setOrderDetailsOpen(false)
                              loadDashboardData()
                            } else {
                              toast({ title: '❌ Erreur', description: data.error || 'Impossible d\'annuler la commande', variant: 'destructive' })
                            }
                          } catch (error) {
                            console.error(error)
                            toast({ title: '❌ Erreur', description: 'Erreur lors de l\'annulation', variant: 'destructive' })
                          }
                        }}
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Annuler la Commande et Rembourser
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {showShippingForm && (
                <Card className="border-2 border-purple-500">
                  <CardHeader>
                    <CardTitle className="text-lg">Informations d'expédition</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Numéro de suivi *</Label>
                      <Input 
                        value={shippingForm.trackingNumber}
                        onChange={(e) => setShippingForm({...shippingForm, trackingNumber: e.target.value})}
                        placeholder="Ex: 1234567890"
                      />
                    </div>
                    <div>
                      <Label>Transporteur *</Label>
                      <Select value={shippingForm.carrier} onValueChange={(value) => setShippingForm({...shippingForm, carrier: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un transporteur" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="canada-post">Canada Post</SelectItem>
                          <SelectItem value="ups">UPS</SelectItem>
                          <SelectItem value="fedex">FedEx</SelectItem>
                          <SelectItem value="dhl">DHL</SelectItem>
                          <SelectItem value="usps">USPS</SelectItem>
                          <SelectItem value="colissimo">Colissimo (France)</SelectItem>
                          <SelectItem value="chronopost">Chronopost (France)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        onClick={() => setShowShippingForm(false)}
                        className="flex-1"
                      >
                        Annuler
                      </Button>
                      <Button 
                        onClick={async () => {
                          if (!shippingForm.trackingNumber || !shippingForm.carrier) {
                            toast({ title: '⚠️ Veuillez remplir tous les champs', variant: 'destructive' })
                            return
                          }
                          try {
                            const res = await fetch('/api/admin/orders/notify', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ 
                                orderId: selectedOrder._id, 
                                action: 'shipped',
                                trackingNumber: shippingForm.trackingNumber,
                                carrier: shippingForm.carrier
                              })
                            })
                            const data = await res.json()
                            if (data.success) {
                              toast({ 
                                title: '✅ ' + data.message,
                                description: data.trackingUrl ? `Lien de suivi généré : ${data.trackingUrl}` : ''
                              })
                              setShowShippingForm(false)
                              setShippingForm({ trackingNumber: '', carrier: '' })
                              loadDashboardData()
                              setOrderDetailsOpen(false)
                            }
                          } catch (error) {
                            toast({ title: '❌ Erreur', variant: 'destructive' })
                          }
                        }}
                        className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600"
                      >
                        Enregistrer et Notifier
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Employee Form Dialog */}
      <Dialog open={employeeFormOpen} onOpenChange={setEmployeeFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Créer un employé</DialogTitle>
            <DialogDescription>
              Un code unique sera généré automatiquement au format MISSA-XXXX
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Nom complet *</Label>
              <Input 
                value={employeeForm.name} 
                onChange={(e) => setEmployeeForm({...employeeForm, name: e.target.value})}
                placeholder="Nom de l'employé"
              />
            </div>
            <div>
              <Label>Email (optionnel)</Label>
              <Input 
                type="email" 
                value={employeeForm.email} 
                onChange={(e) => setEmployeeForm({...employeeForm, email: e.target.value})}
                placeholder="email@example.com"
              />
            </div>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                <strong>Note :</strong> L'employé se connectera uniquement avec le code généré (format MISSA-XXXX). 
                Aucun mot de passe n'est requis.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setEmployeeFormOpen(false)
              setEmployeeForm({ name: '', email: '' })
            }}>Annuler</Button>
            <Button 
              onClick={handleCreateEmployee} 
              className="bg-gradient-to-r from-pink-500 to-purple-600"
              disabled={!employeeForm.name.trim()}
            >
              Créer et générer le code
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Site Content Editor Dialog */}
      <Dialog open={siteContentOpen} onOpenChange={setSiteContentOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Éditer {selectedContentSection === 'header' ? 'Header' : selectedContentSection === 'footer' ? 'Footer' : selectedContentSection === 'landing_hero' ? 'Hero Section' : 'Features Section'}</DialogTitle>
            <DialogDescription>
              Modifiez le contenu qui sera affiché sur le site
            </DialogDescription>
          </DialogHeader>
          <SiteContentEditor 
            section={selectedContentSection}
            onSave={async (content) => {
              if (!content) {
                setSiteContentOpen(false)
                return
              }
              try {
                const res = await fetch('/api/admin/site-content', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ section: selectedContentSection, content, language: 'fr' })
                })
                const data = await res.json()
                if (data.success) {
                  toast({ 
                    title: '✅ Contenu sauvegardé', 
                    description: 'Les modifications sont appliquées automatiquement et visibles immédiatement sur le site',
                    duration: 5000
                  })
                  setSiteContentOpen(false)
                  // Recharger les données du dashboard si nécessaire
                  loadDashboardData()
                }
              } catch (error) {
                toast({ title: '❌ Erreur', variant: 'destructive' })
              }
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Legal Pages Editor Dialog */}
      {/* Blog Form Dialog */}
      <Dialog open={blogFormOpen} onOpenChange={setBlogFormOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedBlogPost ? 'Modifier l\'article' : 'Nouvel article de blog'}</DialogTitle>
            <DialogDescription>
              {selectedBlogPost ? 'Modifiez les informations de l\'article' : 'Créez un nouvel article pour le blog'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="basic">Infos de base</TabsTrigger>
                <TabsTrigger value="content">Contenu</TabsTrigger>
                <TabsTrigger value="media">Médias</TabsTrigger>
                <TabsTrigger value="seo">SEO & Auteur</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Titre (FR) *</Label>
                    <Input
                      value={blogForm.title_fr}
                      onChange={(e) => setBlogForm({...blogForm, title_fr: e.target.value})}
                      placeholder="Titre en français"
                    />
                  </div>
                  <div>
                    <Label>Titre (EN)</Label>
                    <Input
                      value={blogForm.title_en}
                      onChange={(e) => setBlogForm({...blogForm, title_en: e.target.value})}
                      placeholder="Title in English"
                    />
                  </div>
                </div>
                <div>
                  <Label>Slug * (URL-friendly)</Label>
                  <Input
                    value={blogForm.slug}
                    onChange={(e) => setBlogForm({...blogForm, slug: e.target.value.toLowerCase().replace(/\s+/g, '-')})}
                    placeholder="exemple-article-blog"
                  />
                  <p className="text-xs text-gray-500 mt-1">Sera utilisé dans l'URL : /blog/{blogForm.slug || 'slug'}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Extrait (FR)</Label>
                    <Textarea
                      value={blogForm.excerpt_fr}
                      onChange={(e) => setBlogForm({...blogForm, excerpt_fr: e.target.value})}
                      placeholder="Court résumé de l'article..."
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label>Extrait (EN)</Label>
                    <Textarea
                      value={blogForm.excerpt_en}
                      onChange={(e) => setBlogForm({...blogForm, excerpt_en: e.target.value})}
                      placeholder="Short article summary..."
                      rows={3}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Catégorie *</Label>
                    <Select value={blogForm.category} onValueChange={(v) => setBlogForm({...blogForm, category: v})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bijoux-resine">Bijoux Résine</SelectItem>
                        <SelectItem value="decoration-resine">Décoration Résine</SelectItem>
                        <SelectItem value="art-resine">Art Résine</SelectItem>
                        <SelectItem value="meubles-resine">Meubles Résine</SelectItem>
                        <SelectItem value="accessoires-resine">Accessoires Résine</SelectItem>
                        <SelectItem value="tutoriels-resine">Tutoriels Résine</SelectItem>
                        <SelectItem value="inspiration-resine">Inspiration Résine</SelectItem>
                        <SelectItem value="news">Nouveautés</SelectItem>
                        <SelectItem value="tutorials">Tutoriels</SelectItem>
                        <SelectItem value="inspiration">Inspiration</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Date de publication</Label>
                    <Input
                      type="date"
                      value={blogForm.published_at}
                      onChange={(e) => setBlogForm({...blogForm, published_at: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>Temps de lecture (min)</Label>
                    <Input
                      type="number"
                      value={blogForm.reading_time}
                      onChange={(e) => setBlogForm({...blogForm, reading_time: parseInt(e.target.value) || 5})}
                      min={1}
                      max={60}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={blogForm.is_active}
                      onCheckedChange={(checked) => setBlogForm({...blogForm, is_active: checked})}
                    />
                    <Label>Article actif</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={blogForm.is_featured}
                      onCheckedChange={(checked) => setBlogForm({...blogForm, is_featured: checked})}
                    />
                    <Label>En vedette</Label>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="content" className="space-y-4">
                <div>
                  <Label>Contenu (FR) *</Label>
                  <Textarea
                    value={blogForm.content_fr}
                    onChange={(e) => setBlogForm({...blogForm, content_fr: e.target.value})}
                    placeholder="Contenu complet de l'article en français..."
                    rows={15}
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-1">Utilisez des sauts de ligne pour les paragraphes. Les emojis sont supportés.</p>
                </div>
                <div>
                  <Label>Contenu (EN)</Label>
                  <Textarea
                    value={blogForm.content_en}
                    onChange={(e) => setBlogForm({...blogForm, content_en: e.target.value})}
                    placeholder="Full article content in English..."
                    rows={15}
                    className="font-mono text-sm"
                  />
                </div>
              </TabsContent>

              <TabsContent value="media" className="space-y-4">
                <div>
                  <Label>URL de l'image principale *</Label>
                  <Input
                    value={blogForm.image}
                    onChange={(e) => setBlogForm({...blogForm, image: e.target.value})}
                    placeholder="https://images.unsplash.com/photo-..."
                  />
                  <p className="text-xs text-gray-500 mt-1">Utilisez des URLs Unsplash, Pexels ou votre CDN</p>
                  {blogForm.image && (
                    <div className="mt-4">
                      <img src={blogForm.image} alt="Preview" className="w-full h-64 object-cover rounded-lg" />
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Alt texte image (FR)</Label>
                    <Input
                      value={blogForm.image_alt_fr}
                      onChange={(e) => setBlogForm({...blogForm, image_alt_fr: e.target.value})}
                      placeholder="Description de l'image"
                    />
                  </div>
                  <div>
                    <Label>Alt texte image (EN)</Label>
                    <Input
                      value={blogForm.image_alt_en}
                      onChange={(e) => setBlogForm({...blogForm, image_alt_en: e.target.value})}
                      placeholder="Image description"
                    />
                  </div>
                </div>
                <div>
                  <Label>Crédits photo</Label>
                  <Input
                    value={blogForm.image_credits}
                    onChange={(e) => setBlogForm({...blogForm, image_credits: e.target.value})}
                    placeholder="Photo par John Doe sur Unsplash"
                  />
                </div>
              </TabsContent>

              <TabsContent value="seo" className="space-y-4">
                <div>
                  <Label>Auteur</Label>
                  <Input
                    value={blogForm.author}
                    onChange={(e) => setBlogForm({...blogForm, author: e.target.value})}
                    placeholder="Missa"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Bio auteur (FR)</Label>
                    <Textarea
                      value={blogForm.author_bio_fr}
                      onChange={(e) => setBlogForm({...blogForm, author_bio_fr: e.target.value})}
                      placeholder="Biographie de l'auteur..."
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label>Bio auteur (EN)</Label>
                    <Textarea
                      value={blogForm.author_bio_en}
                      onChange={(e) => setBlogForm({...blogForm, author_bio_en: e.target.value})}
                      placeholder="Author biography..."
                      rows={3}
                    />
                  </div>
                </div>
                <div>
                  <Label>Avatar auteur (URL)</Label>
                  <Input
                    value={blogForm.author_avatar}
                    onChange={(e) => setBlogForm({...blogForm, author_avatar: e.target.value})}
                    placeholder="https://images.unsplash.com/photo-..."
                  />
                  {blogForm.author_avatar && (
                    <div className="mt-2">
                      <img src={blogForm.author_avatar} alt="Avatar" className="w-16 h-16 rounded-full object-cover" />
                    </div>
                  )}
                </div>
                <div>
                  <Label>Meta Description (FR)</Label>
                  <Textarea
                    value={blogForm.meta_description_fr}
                    onChange={(e) => setBlogForm({...blogForm, meta_description_fr: e.target.value})}
                    placeholder="Description pour les moteurs de recherche (150-160 caractères)"
                    rows={2}
                  />
                  <p className="text-xs text-gray-500 mt-1">{blogForm.meta_description_fr.length} / 160 caractères</p>
                </div>
                <div>
                  <Label>Meta Description (EN)</Label>
                  <Textarea
                    value={blogForm.meta_description_en}
                    onChange={(e) => setBlogForm({...blogForm, meta_description_en: e.target.value})}
                    placeholder="Search engine description (150-160 characters)"
                    rows={2}
                  />
                  <p className="text-xs text-gray-500 mt-1">{blogForm.meta_description_en.length} / 160 caractères</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setBlogFormOpen(false)
              setSelectedBlogPost(null)
            }}>Annuler</Button>
            <Button 
              onClick={async () => {
                if (!blogForm.title_fr || !blogForm.slug || !blogForm.content_fr) {
                  toast({ title: '❌ Erreur', description: 'Titre, slug et contenu (FR) sont requis', variant: 'destructive' })
                  return
                }
                try {
                  const method = selectedBlogPost ? 'PUT' : 'POST'
                  const url = selectedBlogPost ? `/api/blog/${selectedBlogPost.slug}` : '/api/blog'
                  
                  const res = await fetch(url, {
                    method,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(blogForm)
                  })
                  const data = await res.json()
                  
                  if (data.success) {
                    toast({ 
                      title: selectedBlogPost ? '✅ Article modifié' : '✅ Article créé',
                      description: selectedBlogPost ? 'L\'article a été modifié avec succès' : 'L\'article a été créé avec succès'
                    })
                    setBlogFormOpen(false)
                    setSelectedBlogPost(null)
                    loadDashboardData()
                  } else {
                    toast({ title: '❌ Erreur', description: data.error || 'Erreur lors de la sauvegarde', variant: 'destructive' })
                  }
                } catch (error) {
                  toast({ title: '❌ Erreur', description: 'Erreur lors de la sauvegarde', variant: 'destructive' })
                }
              }}
              className="bg-gradient-to-r from-pink-500 to-purple-600"
            >
              {selectedBlogPost ? 'Modifier' : 'Créer'} l'article
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={legalPagesOpen} onOpenChange={setLegalPagesOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Éditer Page {selectedLegalPage}</DialogTitle>
            <DialogDescription>
              Modifiez le contenu de la page légale
            </DialogDescription>
          </DialogHeader>
          <LegalPageEditor 
            pageSlug={selectedLegalPage}
            onSave={async (pageData) => {
              if (!pageData) {
                setLegalPagesOpen(false)
                return
              }
              try {
                const res = await fetch('/api/admin/legal-pages', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ page_slug: selectedLegalPage, ...pageData })
                })
                const data = await res.json()
                if (data.success) {
                  toast({ title: '✅ Page sauvegardée', description: 'Les modifications sont maintenant visibles sur le site' })
                  setLegalPagesOpen(false)
                }
              } catch (error) {
                toast({ title: '❌ Erreur', variant: 'destructive' })
              }
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Label Preview Dialog */}
      <Dialog open={labelPreviewOpen} onOpenChange={setLabelPreviewOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Étiquette d'expédition</DialogTitle>
            <DialogDescription>
              Aperçu de l'étiquette pour la commande {orderForLabel?.orderNumber}
            </DialogDescription>
          </DialogHeader>
          {orderForLabel && (
            <div className="space-y-6">
              <div className="flex gap-4 justify-end">
                <Button 
                  onClick={async () => {
                    const labelElement = document.getElementById('shipping-label')
                    
                    if (labelElement) {
                      try {
                        const labelCanvas = await html2canvas(labelElement, { scale: 2, useCORS: true })
                        
                        // Étiquette 4x6 pouces
                        const pdf = new jsPDF('portrait', 'in', [6, 4])
                        const labelImgData = labelCanvas.toDataURL('image/png')
                        pdf.addImage(labelImgData, 'PNG', 0, 0, 4, 6)
                        
                        pdf.save(`etiquette-${orderForLabel.orderNumber}.pdf`)
                        toast({ title: '✅ PDF généré', description: 'Étiquette téléchargée' })
                      } catch (error) {
                        console.error(error)
                        toast({ title: '❌ Erreur', description: 'Impossible de générer le PDF', variant: 'destructive' })
                      }
                    }
                  }}
                  className="bg-gradient-to-r from-pink-500 to-purple-600"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Télécharger PDF
                </Button>
                <Button 
                  onClick={() => window.print()}
                  variant="outline"
                >
                  <Printer className="w-4 h-4 mr-2" />
                  Imprimer
                </Button>
              </div>
              
              <div id="shipping-label">
                <ShippingLabel order={orderForLabel} />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Card Preview Dialog */}
      <Dialog open={cardPreviewOpen} onOpenChange={setCardPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Carte de remerciement</DialogTitle>
            <DialogDescription>
              Aperçu de la carte pour la commande {orderForLabel?.orderNumber}
            </DialogDescription>
          </DialogHeader>
          {orderForLabel && (
            <div className="space-y-6">
              <div className="flex gap-4 justify-end">
                <Button 
                  onClick={async () => {
                    const cardElement = document.getElementById('thank-you-card')
                    
                    if (cardElement) {
                      try {
                        const cardCanvas = await html2canvas(cardElement, { scale: 2, useCORS: true })
                        
                        // Carte 8.5x11 pouces (format lettre US)
                        const pdf = new jsPDF('portrait', 'in', [11, 8.5])
                        const cardImgData = cardCanvas.toDataURL('image/png')
                        pdf.addImage(cardImgData, 'PNG', 0, 0, 8.5, 11)
                        
                        pdf.save(`carte-${orderForLabel.orderNumber}.pdf`)
                        toast({ title: '✅ PDF généré', description: 'Carte téléchargée' })
                      } catch (error) {
                        console.error(error)
                        toast({ title: '❌ Erreur', description: 'Impossible de générer le PDF', variant: 'destructive' })
                      }
                    }
                  }}
                  className="bg-gradient-to-r from-pink-500 to-purple-600"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Télécharger PDF
                </Button>
                <Button 
                  onClick={() => window.print()}
                  variant="outline"
                >
                  <Printer className="w-4 h-4 mr-2" />
                  Imprimer
                </Button>
              </div>
              
              <div id="thank-you-card">
                <ThankYouCard order={orderForLabel} />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Site Content Editor Component
function SiteContentEditor({ section, onSave }) {
  const [content, setContent] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadContent()
  }, [section])

  const loadContent = async () => {
    try {
      const res = await fetch(`/api/admin/site-content?section=${section}&language=fr`)
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`)
      }
      const data = await res.json()
      if (data.success && data.content && data.content.length > 0) {
        setContent(data.content[0].content || {})
      } else {
        // Initialiser avec des valeurs par défaut
        setContent(getDefaultContent(section))
      }
    } catch (error) {
      console.error('Error loading content:', error)
      // Initialiser avec des valeurs par défaut en cas d'erreur
      setContent(getDefaultContent(section))
    } finally {
      setLoading(false)
    }
  }

  const getDefaultContent = (section) => {
    const defaults = {
      header: { 
        logo: '/missa-logo.png', 
        title: 'Missa Créations', 
        subtitle: 'Personnalisées et Artisanales',
        navItems: ['Accueil', 'Produits', 'Personnaliser', 'Blog', 'Contact']
      },
      footer: { 
        description: 'Créations uniques en résine, faites main avec amour',
        quickLinks: ['Accueil', 'Produits', 'Blog', 'Contact'],
        supportLinks: ['FAQ', 'Livraison', 'Retours', 'Garantie'],
        socialLinks: {
          facebook: 'https://facebook.com/missacreations',
          instagram: 'https://instagram.com/missacreations',
          tiktok: 'https://tiktok.com/@missacreations'
        }
      },
      landing_hero: { 
        title: 'Créations Uniques en Résine', 
        subtitle: 'Des bijoux et objets personnalisés, faits main avec amour', 
        cta: 'Découvrir nos créations',
        backgroundImage: 'https://images.unsplash.com/photo-1612672358776-15458bfd9869?w=1200'
      },
      landing_features: { 
        title: 'Pourquoi Nous Choisir', 
        features: [
          { icon: 'Package', title: 'Fait Main', description: 'Chaque pièce est unique et créée avec passion' },
          { icon: 'Sparkles', title: 'Personnalisable', description: 'Ajoutez votre touche personnelle à nos créations' },
          { icon: 'Truck', title: 'Livraison Rapide', description: 'Expédition soignée et sécurisée partout' }
        ]
      },
      navigation: {
        items: ['Accueil', 'Produits', 'Personnaliser', 'Blog', 'Contact']
      },
      featured_products: {
        title: 'Produits Vedettes'
      }
    }
    return defaults[section] || {}
  }

  if (loading) return <div className="p-4">Chargement...</div>

  return (
    <div className="space-y-4">
      {section === 'header' && (
        <>
          <div>
            <Label>URL du Logo</Label>
            <Input value={content.logo || ''} onChange={(e) => setContent({...content, logo: e.target.value})} placeholder="/missa-logo.png" />
          </div>
          <div>
            <Label>Titre</Label>
            <Input value={content.title || ''} onChange={(e) => setContent({...content, title: e.target.value})} />
          </div>
          <div>
            <Label>Sous-titre</Label>
            <Input value={content.subtitle || ''} onChange={(e) => setContent({...content, subtitle: e.target.value})} />
          </div>
          <div>
            <Label>Éléments du Menu (séparés par des virgules)</Label>
            <Input value={Array.isArray(content.navItems) ? content.navItems.join(', ') : ''} onChange={(e) => setContent({...content, navItems: e.target.value.split(',').map(s => s.trim())})} placeholder="Accueil, Produits, Blog, Contact" />
          </div>
        </>
      )}
      
      {section === 'footer' && (
        <>
          <div>
            <Label>Description</Label>
            <Textarea value={content.description || ''} onChange={(e) => setContent({...content, description: e.target.value})} rows={3} />
          </div>
          <div>
            <Label>Liens Rapides (séparés par des virgules)</Label>
            <Input value={Array.isArray(content.quickLinks) ? content.quickLinks.join(', ') : ''} onChange={(e) => setContent({...content, quickLinks: e.target.value.split(',').map(s => s.trim())})} />
          </div>
          <div>
            <Label>Liens Support (séparés par des virgules)</Label>
            <Input value={Array.isArray(content.supportLinks) ? content.supportLinks.join(', ') : ''} onChange={(e) => setContent({...content, supportLinks: e.target.value.split(',').map(s => s.trim())})} />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Facebook URL</Label>
              <Input value={content.socialLinks?.facebook || ''} onChange={(e) => setContent({...content, socialLinks: {...content.socialLinks, facebook: e.target.value}})} placeholder="https://facebook.com/missacreations" />
            </div>
            <div>
              <Label>Instagram URL</Label>
              <Input value={content.socialLinks?.instagram || ''} onChange={(e) => setContent({...content, socialLinks: {...content.socialLinks, instagram: e.target.value}})} placeholder="https://instagram.com/missacreations" />
            </div>
            <div>
              <Label>TikTok URL</Label>
              <Input value={content.socialLinks?.tiktok || ''} onChange={(e) => setContent({...content, socialLinks: {...content.socialLinks, tiktok: e.target.value}})} placeholder="https://tiktok.com/@missacreations" />
            </div>
          </div>
        </>
      )}

      {section === 'landing_hero' && (
        <>
          <div>
            <Label>Titre Principal</Label>
            <Input value={content.title || ''} onChange={(e) => setContent({...content, title: e.target.value})} />
          </div>
          <div>
            <Label>Sous-titre</Label>
            <Textarea value={content.subtitle || ''} onChange={(e) => setContent({...content, subtitle: e.target.value})} rows={3} />
          </div>
          <div>
            <Label>Texte du bouton CTA</Label>
            <Input value={content.cta || ''} onChange={(e) => setContent({...content, cta: e.target.value})} />
          </div>
          <div>
            <Label>URL Image de Fond</Label>
            <Input value={content.backgroundImage || ''} onChange={(e) => setContent({...content, backgroundImage: e.target.value})} />
          </div>
        </>
      )}

      {section === 'landing_features' && (
        <>
          <div>
            <Label>Titre de la Section</Label>
            <Input value={content.title || ''} onChange={(e) => setContent({...content, title: e.target.value})} />
          </div>
          <div>
            <Label>Features (JSON)</Label>
            <Textarea 
              value={JSON.stringify(content.features || [], null, 2)} 
              onChange={(e) => {
                try {
                  const parsed = JSON.parse(e.target.value)
                  setContent({...content, features: parsed})
                } catch {
                  // Garder le texte si JSON invalide
                }
              }}
              rows={10}
              className="font-mono text-sm"
            />
            <p className="text-xs text-gray-500 mt-1">Format: [{'{'}"icon": "Package", "title": "Titre", "description": "Description"{'}'}]</p>
          </div>
        </>
      )}

      {section === 'navigation' && (
        <div>
          <Label>Éléments du Menu (séparés par des virgules)</Label>
          <Input value={Array.isArray(content.items) ? content.items.join(', ') : ''} onChange={(e) => setContent({...content, items: e.target.value.split(',').map(s => s.trim())})} placeholder="Accueil, Produits, Blog, Contact" />
        </div>
      )}

      {section === 'featured_products' && (
        <div>
          <Label>Titre de la Section</Label>
          <Input value={content.title || ''} onChange={(e) => setContent({...content, title: e.target.value})} />
        </div>
      )}

      <DialogFooter>
        <Button variant="outline" onClick={() => onSave(null)}>Annuler</Button>
        <Button onClick={() => onSave(content)} className="bg-gradient-to-r from-pink-500 to-purple-600">
          Enregistrer
        </Button>
      </DialogFooter>
    </div>
  )
}

// Legal Page Editor Component
function LegalPageEditor({ pageSlug, onSave }) {
  const [pageData, setPageData] = useState({
    title_fr: '',
    title_en: '',
    content_fr: '',
    content_en: ''
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPage()
  }, [pageSlug])

  // Contenu par défaut des pages légales (vrai contenu actuel)
  const getDefaultContent = (slug, lang) => {
    const contents = {
      faq: {
        fr: `## Questions Fréquentes

**Adresse email :** support@missacreations.com

### Questions Fréquentes

**Q: Combien de temps prend la création d'un bijou personnalisé ?**
R: Chaque création est faite à la main avec soin. Comptez entre 5 à 10 jours ouvrables pour la fabrication, plus le délai de livraison.

**Q: Puis-je modifier ma commande après l'avoir passée ?**
R: Les modifications sont possibles dans les 24h suivant votre commande. Contactez-nous rapidement à support@missacreations.com.

**Q: Quels types d'images fonctionnent le mieux pour la personnalisation ?**
R: Les images de haute qualité (minimum 1000x1000 pixels) avec un bon éclairage donnent les meilleurs résultats. Les photos avec des visages nets ou des motifs clairs sont idéales.

**Q: Les bijoux en résine sont-ils résistants à l'eau ?**
R: Nos créations sont résistantes aux éclaboussures, mais nous recommandons de les retirer avant la douche, la baignade ou les activités aquatiques prolongées.

**Q: Proposez-vous des boîtes cadeaux ?**
R: Oui ! Chaque création est livrée dans un joli emballage cadeau. Des options premium sont disponibles lors de la commande.

💌 **Pour toute question :** support@missacreations.com
📞 **Temps de réponse :** Sous 24h (jours ouvrables)`,
        en: `## Frequently Asked Questions

**Email address:** support@missacreations.com

### Frequently Asked Questions

**Q: How long does it take to create a personalized jewelry?**
A: Each creation is handmade with care. Allow 5 to 10 business days for production, plus delivery time.

**Q: Can I modify my order after placing it?**
A: Modifications are possible within 24 hours of your order. Contact us quickly at support@missacreations.com.

**Q: What types of images work best for personalization?**
A: High-quality images (minimum 1000x1000 pixels) with good lighting give the best results. Photos with clear faces or patterns are ideal.

**Q: Are resin jewelry water resistant?**
A: Our creations are splash-resistant, but we recommend removing them before showering, swimming, or prolonged water activities.

**Q: Do you offer gift boxes?**
A: Yes! Each creation is delivered in a beautiful gift box. Premium options are available when ordering.

💌 **For any questions:** support@missacreations.com
📞 **Response time:** Under 24h (business days)`
      },
      livraison: {
        fr: `## Livraison

**Adresse email :** support@missacreations.com

### Informations de Livraison

**Délais de livraison :**
- Canada : 3-5 jours ouvrables
- États-Unis : 5-7 jours ouvrables
- International : 10-15 jours ouvrables

**Frais de livraison :**
- Livraison gratuite pour toute commande de 75$ et plus au Canada
- Tarifs standards : 8,99$ (Canada) | 14,99$ (États-Unis)
- Livraison internationale : calculée selon la destination

**Suivi de commande :**
Vous recevrez un numéro de suivi par email dès l'expédition de votre colis. Suivez votre commande en temps réel.

**Problème avec votre livraison ?**
Contactez-nous à support@missacreations.com avec votre numéro de commande.

💌 **Pour toute question :** support@missacreations.com
📞 **Temps de réponse :** Sous 24h (jours ouvrables)`,
        en: `## Delivery

**Email address:** support@missacreations.com

### Delivery Information

**Delivery times:**
- Canada: 3-5 business days
- United States: 5-7 business days
- International: 10-15 business days

**Shipping costs:**
- Free shipping for orders of $75 and more in Canada
- Standard rates: $8.99 (Canada) | $14.99 (United States)
- International shipping: calculated by destination

**Order tracking:**
You will receive a tracking number by email as soon as your package is shipped. Track your order in real time.

**Problem with your delivery?**
Contact us at support@missacreations.com with your order number.

💌 **For any questions:** support@missacreations.com
📞 **Response time:** Under 24h (business days)`
      },
      retours: {
        fr: `## Retours

**Adresse email :** support@missacreations.com

### Politique de Retours

**Délai de retour :** 30 jours
Vous disposez de 30 jours à compter de la réception pour retourner un article non personnalisé en parfait état.

**Articles personnalisés :**
Les créations sur mesure avec vos photos ou textes ne sont pas éligibles au retour, sauf en cas de défaut de fabrication.

**Comment effectuer un retour :**
1. Contactez-nous à support@missacreations.com avec votre numéro de commande
2. Indiquez la raison du retour
3. Nous vous enverrons une étiquette de retour prépayée
4. Emballez soigneusement l'article dans son emballage d'origine
5. Remboursement sous 5-7 jours après réception

**Articles éligibles au retour :**
- Article intact et non porté
- Emballage d'origine
- Étiquettes attachées (si applicable)

**Articles non retournables :**
- Créations personnalisées avec photo/texte
- Bijoux portés ou endommagés
- Articles soldés (sauf défaut)

💌 **Pour toute question :** support@missacreations.com
📞 **Temps de réponse :** Sous 24h (jours ouvrables)`,
        en: `## Returns

**Email address:** support@missacreations.com

### Return Policy

**Return period:** 30 days
You have 30 days from receipt to return a non-personalized item in perfect condition.

**Personalized items:**
Custom creations with your photos or texts are not eligible for return, except in case of manufacturing defect.

**How to make a return:**
1. Contact us at support@missacreations.com with your order number
2. Indicate the reason for return
3. We will send you a prepaid return label
4. Carefully pack the item in its original packaging
5. Refund within 5-7 days after receipt

**Items eligible for return:**
- Intact and unworn item
- Original packaging
- Tags attached (if applicable)

**Non-returnable items:**
- Personalized creations with photo/text
- Worn or damaged jewelry
- Sale items (except defects)

💌 **For any questions:** support@missacreations.com
📞 **Response time:** Under 24h (business days)`
      },
      garantie: {
        fr: `## Garantie

**Adresse email :** support@missacreations.com

### Notre Garantie Qualité

**Garantie de 1 an**
Toutes nos créations sont garanties contre les défauts de fabrication pendant 1 an à compter de la date d'achat.

**Couverture de la garantie :**
- Défauts de résine (jaunissement, fissures)
- Problèmes de monture ou fermoirs
- Détachement de l'image ou du texte
- Défauts de finition

**Non couvert par la garantie :**
- Usure normale
- Dommages causés par mauvaise utilisation
- Exposition prolongée à l'eau ou produits chimiques
- Chocs ou chutes

**Comment faire une réclamation :**
1. Envoyez-nous un email à support@missacreations.com
2. Joignez des photos claires du défaut
3. Incluez votre numéro de commande
4. Nous évaluerons votre demande sous 48h

**Notre engagement :**
Si votre création présente un défaut couvert par la garantie, nous la remplacerons gratuitement ou vous rembourserons intégralement.

**Satisfaction garantie**
Votre bonheur est notre priorité. Si vous n'êtes pas 100% satisfait de votre création, contactez-nous pour trouver une solution.

💌 **Pour toute question :** support@missacreations.com
📞 **Temps de réponse :** Sous 24h (jours ouvrables)`,
        en: `## Warranty

**Email address:** support@missacreations.com

### Our Quality Guarantee

**1 Year Warranty**
All our creations are guaranteed against manufacturing defects for 1 year from the date of purchase.

**Warranty coverage:**
- Resin defects (yellowing, cracks)
- Mounting or clasp problems
- Detachment of image or text
- Finishing defects

**Not covered by warranty:**
- Normal wear
- Damage caused by misuse
- Prolonged exposure to water or chemicals
- Shocks or falls

**How to file a claim:**
1. Send us an email at support@missacreations.com
2. Attach clear photos of the defect
3. Include your order number
4. We will evaluate your request within 48h

**Our commitment:**
If your creation has a defect covered by the warranty, we will replace it free of charge or refund you in full.

**Satisfaction guaranteed**
Your happiness is our priority. If you are not 100% satisfied with your creation, contact us to find a solution.

💌 **For any questions:** support@missacreations.com
📞 **Response time:** Under 24h (business days)`
      }
    }
    return contents[slug]?.[lang] || ''
  }

  const getDefaultTitle = (slug, lang) => {
    const titles = {
      faq: { fr: 'FAQ', en: 'FAQ' },
      livraison: { fr: 'Livraison', en: 'Delivery' },
      retours: { fr: 'Retours', en: 'Returns' },
      garantie: { fr: 'Garantie', en: 'Warranty' }
    }
    return titles[slug]?.[lang] || slug
  }

  const loadPage = async () => {
    try {
      const res = await fetch(`/api/admin/legal-pages?slug=${pageSlug}`)
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`)
      }
      const data = await res.json()
      
      if (data.success && data.pages) {
        // Gérer le contenu qui peut être JSONB (objet) ou texte
        const contentFr = data.pages.content_fr
        const contentEn = data.pages.content_en
        
        // Convertir JSONB en string si nécessaire
        let contentFrStr = ''
        let contentEnStr = ''
        
        if (typeof contentFr === 'string') {
          contentFrStr = contentFr
        } else if (contentFr && typeof contentFr === 'object') {
          // Si c'est un objet JSONB, le convertir en string
          contentFrStr = JSON.stringify(contentFr, null, 2)
        }
        
        if (typeof contentEn === 'string') {
          contentEnStr = contentEn
        } else if (contentEn && typeof contentEn === 'object') {
          // Si c'est un objet JSONB, le convertir en string
          contentEnStr = JSON.stringify(contentEn, null, 2)
        }
        
        setPageData({
          title_fr: data.pages.title_fr || getDefaultTitle(pageSlug, 'fr'),
          title_en: data.pages.title_en || getDefaultTitle(pageSlug, 'en'),
          content_fr: contentFrStr || getDefaultContent(pageSlug, 'fr'),
          content_en: contentEnStr || getDefaultContent(pageSlug, 'en')
        })
      } else {
        // Si la page n'existe pas, charger le vrai contenu par défaut
        setPageData({
          title_fr: getDefaultTitle(pageSlug, 'fr'),
          title_en: getDefaultTitle(pageSlug, 'en'),
          content_fr: getDefaultContent(pageSlug, 'fr'),
          content_en: getDefaultContent(pageSlug, 'en')
        })
      }
    } catch (error) {
      console.error('Error loading page:', error)
      // En cas d'erreur, charger le contenu par défaut
      setPageData({
        title_fr: getDefaultTitle(pageSlug, 'fr'),
        title_en: getDefaultTitle(pageSlug, 'en'),
        content_fr: getDefaultContent(pageSlug, 'fr'),
        content_en: getDefaultContent(pageSlug, 'en')
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="p-4">Chargement...</div>

  return (
    <Tabs defaultValue="fr" className="w-full">
      <TabsList>
        <TabsTrigger value="fr">Français</TabsTrigger>
        <TabsTrigger value="en">English</TabsTrigger>
      </TabsList>
      
      <TabsContent value="fr" className="space-y-4">
        <div>
          <Label>Titre (FR) *</Label>
          <Input 
            value={pageData.title_fr} 
            onChange={(e) => setPageData({...pageData, title_fr: e.target.value})} 
            placeholder="Titre de la page en français"
          />
        </div>
        <div>
          <Label>Contenu (FR) *</Label>
          <Textarea 
            value={pageData.content_fr}
            onChange={(e) => setPageData({...pageData, content_fr: e.target.value})}
            rows={25}
            className="font-mono text-sm"
            placeholder="Entrez le contenu de la page en français..."
          />
          <div className="flex items-center justify-between mt-2">
            <p className="text-xs text-gray-500">Format texte simple ou Markdown. Supporte les retours à la ligne et la mise en forme.</p>
            <p className="text-xs text-gray-400">{pageData.content_fr.length} caractères</p>
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="en" className="space-y-4">
        <div>
          <Label>Title (EN) *</Label>
          <Input 
            value={pageData.title_en} 
            onChange={(e) => setPageData({...pageData, title_en: e.target.value})} 
            placeholder="Page title in English"
          />
        </div>
        <div>
          <Label>Content (EN) *</Label>
          <Textarea 
            value={pageData.content_en}
            onChange={(e) => setPageData({...pageData, content_en: e.target.value})}
            rows={25}
            className="font-mono text-sm"
            placeholder="Enter the page content in English..."
          />
          <div className="flex items-center justify-between mt-2">
            <p className="text-xs text-gray-500">Plain text or Markdown format. Supports line breaks and formatting.</p>
            <p className="text-xs text-gray-400">{pageData.content_en.length} characters</p>
          </div>
        </div>
      </TabsContent>

      <DialogFooter className="mt-4">
        <Button variant="outline" onClick={() => onSave(null)}>Annuler</Button>
        <Button onClick={() => onSave(pageData)} className="bg-gradient-to-r from-pink-500 to-purple-600">
          Enregistrer
        </Button>
      </DialogFooter>
    </Tabs>
  )
}
