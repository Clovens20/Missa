'use client'

import { useState, useEffect } from 'react'
import { ShoppingCart, LogOut, Eye, Printer, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import ShippingLabel from '@/components/ShippingLabel'
import ThankYouCard from '@/components/ThankYouCard'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

export default function EmployeePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [employeeCode, setEmployeeCode] = useState('')
  const [employeeName, setEmployeeName] = useState('')
  const [orders, setOrders] = useState([])
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [orderDetailsOpen, setOrderDetailsOpen] = useState(false)
  const [orderStatus, setOrderStatus] = useState('')
  const [orderNotes, setOrderNotes] = useState('')
  const [labelPreviewOpen, setLabelPreviewOpen] = useState(false)
  const [cardPreviewOpen, setCardPreviewOpen] = useState(false)
  const [orderForLabel, setOrderForLabel] = useState(null)
  const { toast } = useToast()

  useEffect(() => {
    if (isLoggedIn) {
      loadOrders()
    }
  }, [isLoggedIn])

  const handleLogin = async (e) => {
    e.preventDefault()
    
    if (!employeeCode || !employeeCode.startsWith('MISSA-')) {
      toast({ title: '❌ Erreur', description: 'Format de code invalide. Format attendu: MISSA-XXXX', variant: 'destructive' })
      return
    }
    
    try {
      const res = await fetch('/api/admin/employees/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: employeeCode.toUpperCase() })
      })
      
      const data = await res.json()
      
      if (data.success) {
        setIsLoggedIn(true)
        setEmployeeName(data.employee.name || '')
        toast({ title: '✅ Connecté', description: `Bienvenue ${data.employee.name || ''}` })
        loadOrders()
      } else {
        toast({ title: '❌ Erreur', description: data.error || 'Code invalide', variant: 'destructive' })
      }
    } catch (error) {
      console.error(error)
      toast({ title: '❌ Erreur', description: 'Erreur de connexion', variant: 'destructive' })
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
                  placeholder="MISSA-0001"
                  value={employeeCode}
                  onChange={(e) => setEmployeeCode(e.target.value.toUpperCase())}
                  className="text-center font-mono text-lg tracking-wider"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Format: MISSA-XXXX (ex: MISSA-0001)
                </p>
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
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              Interface Employé
            </h1>
            <p className="text-gray-500">{employeeName || 'Employé'}</p>
          </div>
          <Button variant="outline" onClick={() => {
            setIsLoggedIn(false)
            setEmployeeCode('')
            setEmployeeName('')
          }}>
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
                          setOrderStatus(order.status)
                          setOrderNotes(order.notes || '')
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
                <Select value={orderStatus} onValueChange={setOrderStatus}>
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
                <Textarea 
                  placeholder="Ajouter des notes..." 
                  rows={3}
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                />
              </div>

              {/* Bouton pour générer étiquette et carte */}
              <div className="pt-4 border-t">
                <div className="flex gap-3 mb-4">
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
              </div>

              <Button 
                onClick={async () => {
                  try {
                    const res = await fetch(`/api/orders/${selectedOrder._id}`, {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ 
                        status: orderStatus,
                        notes: orderNotes
                      })
                    })
                    const data = await res.json()
                    if (data.success) {
                      toast({ title: '✅ Commande mise à jour' })
                      setOrderDetailsOpen(false)
                      loadOrders()
                    } else {
                      toast({ title: '❌ Erreur', variant: 'destructive' })
                    }
                  } catch (error) {
                    toast({ title: '❌ Erreur', variant: 'destructive' })
                  }
                }}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600"
              >
                Enregistrer les modifications
              </Button>
            </div>
          )}
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
