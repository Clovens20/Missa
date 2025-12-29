'use client'

import { useState, useEffect } from 'react'
import { ShoppingCart, LogOut, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

export default function EmployeePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [employeeCode, setEmployeeCode] = useState('')
  const [orders, setOrders] = useState([])
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [orderDetailsOpen, setOrderDetailsOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (isLoggedIn) {
      loadOrders()
    }
  }, [isLoggedIn])

  const handleLogin = async (e) => {
    e.preventDefault()
    // For demo purposes
    if (employeeCode.startsWith('MISSA-')) {
      setIsLoggedIn(true)
      toast({ title: '✅ Connecté', description: 'Bienvenue' })
      loadOrders()
    } else {
      toast({ title: '❌ Erreur', description: 'Code invalide', variant: 'destructive' })
    }
  }

  const loadOrders = async () => {
    try {
      const res = await fetch('/api/orders')
      const data = await res.json()
      if (data.success) {
        setOrders(data.orders || [])
      }
    } catch (error) {
      console.error(error)
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
            <CardTitle className="text-3xl">Employé - Missa Créations</CardTitle>
            <CardDescription>Connectez-vous avec votre code</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label>Code Employé</Label>
                <Input 
                  placeholder="MISSA-XXX"
                  value={employeeCode}
                  onChange={(e) => setEmployeeCode(e.target.value)}
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
              Demo: MISSA-001
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              Interface Employé
            </h1>
            <p className="text-gray-500">Code: {employeeCode}</p>
          </div>
          <Button variant="outline" onClick={() => setIsLoggedIn(false)}>
            <LogOut className="w-4 h-4 mr-2" />
            Déconnexion
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Commandes</CardTitle>
            <CardDescription>Consultation et mise à jour des statuts</CardDescription>
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
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map(order => (
                  <TableRow key={order._id}>
                    <TableCell className="font-mono font-bold">{order.orderNumber}</TableCell>
                    <TableCell>{order.customer?.firstName} {order.customer?.lastName}</TableCell>
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

      {/* Order Details Dialog */}
      <Dialog open={orderDetailsOpen} onOpenChange={setOrderDetailsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Commande {selectedOrder?.orderNumber}</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Client</CardTitle>
                </CardHeader>
                <CardContent>
                  <p><strong>Nom:</strong> {selectedOrder.customer?.firstName} {selectedOrder.customer?.lastName}</p>
                  <p><strong>Email:</strong> {selectedOrder.customer?.email}</p>
                  <p><strong>Adresse:</strong> {selectedOrder.customer?.address1}, {selectedOrder.customer?.city}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Produits</CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedOrder.items?.map((item, idx) => (
                    <div key={idx} className="flex gap-4 mb-4 pb-4 border-b last:border-0">
                      <img src={item.image} alt={item.name} className="w-20 h-20 rounded object-cover" />
                      <div className="flex-1">
                        <h4 className="font-bold">{item.name}</h4>
                        <p className="text-sm">Qté: {item.quantity}</p>
                        {item.customization && (
                          <Badge className="mt-2 bg-purple-500">✨ Personnalisé</Badge>
                        )}
                      </div>
                    </div>
                  ))}
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
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Notes</Label>
                <Textarea placeholder="Ajouter des notes..." rows={3} />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
