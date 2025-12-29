'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { LayoutDashboard, Package, ShoppingCart, Users, LogOut, Plus, Edit, Trash2, Search, Eye } from 'lucide-react'
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

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loginData, setLoginData] = useState({ email: '', password: '' })
  const [currentView, setCurrentView] = useState('dashboard')
  const [stats, setStats] = useState({ ordersCount: 0, productsCount: 0, revenue: 0 })
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [employees, setEmployees] = useState([])
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [productFormOpen, setProductFormOpen] = useState(false)
  const [orderDetailsOpen, setOrderDetailsOpen] = useState(false)
  const [employeeFormOpen, setEmployeeFormOpen] = useState(false)
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
    email: '',
    password: 'missa2024'
  })

  useEffect(() => {
    if (isLoggedIn) {
      loadDashboardData()
    }
  }, [isLoggedIn, currentView])

  const handleLogin = async (e) => {
    e.preventDefault()
    // For demo purposes, simple auth
    if (loginData.email === 'admin@missa.com' && loginData.password === 'admin123') {
      setIsLoggedIn(true)
      toast({ title: '✅ Connecté', description: 'Bienvenue Admin' })
    } else {
      toast({ title: '❌ Erreur', description: 'Identifiants invalides', variant: 'destructive' })
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
      
      if (currentView === 'dashboard' || currentView === 'products') {
        const productsRes = await fetch('/api/products')
        const productsData = await productsRes.json()
        if (productsData.success) {
          setProducts(productsData.products || [])
          setStats(prev => ({ ...prev, productsCount: productsData.products.length }))
        }
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleCreateProduct = async () => {
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productForm)
      })
      const data = await res.json()
      
      if (data.success) {
        toast({ title: '✅ Produit créé' })
        setProductFormOpen(false)
        loadDashboardData()
      }
    } catch (error) {
      toast({ title: '❌ Erreur', variant: 'destructive' })
    }
  }

  const handleCreateEmployee = async () => {
    try {
      const res = await fetch('/api/admin/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(employeeForm)
      })
      const data = await res.json()
      
      if (data.success) {
        toast({ 
          title: '✅ Employé créé', 
          description: `Code: ${data.employeeCode}` 
        })
        setEmployeeFormOpen(false)
        loadDashboardData()
      }
    } catch (error) {
      toast({ title: '❌ Erreur', variant: 'destructive' })
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
                  placeholder="admin@missa.com"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                />
              </div>
              <div>
                <Label>Mot de passe</Label>
                <Input 
                  type="password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600" 
                size="lg"
              >
                Se connecter
              </Button>
            </form>
            <p className="text-xs text-center mt-4 text-gray-500">
              Demo: admin@missa.com / admin123
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="flex">
        <div className="w-64 bg-gradient-to-b from-pink-600 to-purple-700 text-white min-h-screen p-6">
          <div className="mb-8">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-xl mb-3">
              M
            </div>
            <h2 className="text-xl font-bold">Missa Admin</h2>
            <p className="text-sm text-white/80">Administration</p>
          </div>
          
          <nav className="space-y-2">
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
              onClick={() => setCurrentView('employees')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                currentView === 'employees' ? 'bg-white/20' : 'hover:bg-white/10'
              }`}
            >
              <Users className="w-5 h-5" />
              Employés
            </button>
          </nav>

          <button
            onClick={() => setIsLoggedIn(false)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition mt-auto absolute bottom-6"
          >
            <LogOut className="w-5 h-5" />
            Déconnexion
          </button>
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
                <h1 className="text-3xl font-bold">Produits</h1>
                <Button 
                  onClick={() => {
                    setSelectedProduct(null)
                    setProductForm({
                      name_fr: '', name_en: '', description_fr: '', description_en: '',
                      category: 'bijoux', price: 0, weight: 0, stock: 0, minStock: 0,
                      isCustomizable: false, isActive: true, images: ['']
                    })
                    setProductFormOpen(true)
                  }}
                  className="bg-gradient-to-r from-pink-500 to-purple-600"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter un produit
                </Button>
              </div>

              <Card>
                <CardContent className="pt-6">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Image</TableHead>
                        <TableHead>Nom</TableHead>
                        <TableHead>Catégorie</TableHead>
                        <TableHead>Prix</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products.map(product => (
                        <TableRow key={product._id}>
                          <TableCell>
                            <img src={product.images[0]} alt={product.name_fr} className="w-12 h-12 rounded object-cover" />
                          </TableCell>
                          <TableCell className="font-medium">{product.name_fr}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{product.category}</Badge>
                          </TableCell>
                          <TableCell>{product.price}$</TableCell>
                          <TableCell>{product.stock}</TableCell>
                          <TableCell>
                            <Badge className={product.isActive ? 'bg-green-500' : 'bg-gray-500'}>
                              {product.isActive ? 'Actif' : 'Inactif'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button size="icon" variant="outline">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button size="icon" variant="destructive">
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
                            <Badge>{order.status}</Badge>
                          </TableCell>
                          <TableCell>{new Date(order.createdAt).toLocaleDateString('fr-FR')}</TableCell>
                          <TableCell>
                            <Button 
                              size="icon" 
                              variant="outline"
                              onClick={() => {
                                setSelectedOrder(order)
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
                  <p className="text-gray-500 text-center py-12">
                    Les employés auront accès à l'interface /sousadmin avec leur code unique
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Product Form Dialog */}
      <Dialog open={productFormOpen} onOpenChange={setProductFormOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedProduct ? 'Éditer' : 'Ajouter'} un produit</DialogTitle>
          </DialogHeader>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Nom (FR)</Label>
              <Input value={productForm.name_fr} onChange={(e) => setProductForm({...productForm, name_fr: e.target.value})} />
            </div>
            <div>
              <Label>Nom (EN)</Label>
              <Input value={productForm.name_en} onChange={(e) => setProductForm({...productForm, name_en: e.target.value})} />
            </div>
            <div className="col-span-2">
              <Label>Description (FR)</Label>
              <Textarea value={productForm.description_fr} onChange={(e) => setProductForm({...productForm, description_fr: e.target.value})} />
            </div>
            <div className="col-span-2">
              <Label>Description (EN)</Label>
              <Textarea value={productForm.description_en} onChange={(e) => setProductForm({...productForm, description_en: e.target.value})} />
            </div>
            <div>
              <Label>Catégorie</Label>
              <Select value={productForm.category} onValueChange={(value) => setProductForm({...productForm, category: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bijoux">Bijoux</SelectItem>
                  <SelectItem value="decoration">Décoration</SelectItem>
                  <SelectItem value="cadeaux">Cadeaux</SelectItem>
                  <SelectItem value="accessoires">Accessoires</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Prix ($)</Label>
              <Input type="number" value={productForm.price} onChange={(e) => setProductForm({...productForm, price: parseFloat(e.target.value)})} />
            </div>
            <div>
              <Label>Poids (g)</Label>
              <Input type="number" value={productForm.weight} onChange={(e) => setProductForm({...productForm, weight: parseInt(e.target.value)})} />
            </div>
            <div>
              <Label>Stock</Label>
              <Input type="number" value={productForm.stock} onChange={(e) => setProductForm({...productForm, stock: parseInt(e.target.value)})} />
            </div>
            <div>
              <Label>URL Image</Label>
              <Input value={productForm.images[0]} onChange={(e) => setProductForm({...productForm, images: [e.target.value]})} />
            </div>
            <div className="flex items-center gap-4 col-span-2">
              <div className="flex items-center gap-2">
                <Switch checked={productForm.isCustomizable} onCheckedChange={(checked) => setProductForm({...productForm, isCustomizable: checked})} />
                <Label>Personnalisable</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={productForm.isActive} onCheckedChange={(checked) => setProductForm({...productForm, isActive: checked})} />
                <Label>Actif</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setProductFormOpen(false)}>Annuler</Button>
            <Button onClick={handleCreateProduct} className="bg-gradient-to-r from-pink-500 to-purple-600">
              {selectedProduct ? 'Mettre à jour' : 'Créer'}
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

              <div>
                <Label>Changer le statut</Label>
                <Select defaultValue={selectedOrder.status}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">En attente</SelectItem>
                    <SelectItem value="processing">En cours</SelectItem>
                    <SelectItem value="shipped">Expédiée</SelectItem>
                    <SelectItem value="delivered">Livrée</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
              Un code unique sera généré automatiquement (MISSA-XXX)
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Nom complet</Label>
              <Input value={employeeForm.name} onChange={(e) => setEmployeeForm({...employeeForm, name: e.target.value})} />
            </div>
            <div>
              <Label>Email</Label>
              <Input type="email" value={employeeForm.email} onChange={(e) => setEmployeeForm({...employeeForm, email: e.target.value})} />
            </div>
            <div>
              <Label>Mot de passe par défaut</Label>
              <Input value={employeeForm.password} onChange={(e) => setEmployeeForm({...employeeForm, password: e.target.value})} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEmployeeFormOpen(false)}>Annuler</Button>
            <Button onClick={handleCreateEmployee} className="bg-gradient-to-r from-pink-500 to-purple-600">
              Créer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
