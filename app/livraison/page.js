'use client'

import { Truck, Mail, Package, Clock, MapPin, Home, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useLanguage } from '@/contexts/LanguageContext'
import Link from 'next/link'

export default function LivraisonPage() {
  const { language, t } = useLanguage()

  const deliveryInfo = [
    {
      country: language === 'fr' ? 'Canada' : 'Canada',
      delay: language === 'fr' ? '3-5 jours ouvrables' : '3-5 business days',
      price: language === 'fr' ? '8,99$ (Gratuit dès 75$)' : '$8.99 (Free from $75)',
      icon: <MapPin className="w-6 h-6" />
    },
    {
      country: language === 'fr' ? 'États-Unis' : 'United States',
      delay: language === 'fr' ? '5-7 jours ouvrables' : '5-7 business days',
      price: language === 'fr' ? '14,99$' : '$14.99',
      icon: <MapPin className="w-6 h-6" />
    },
    {
      country: language === 'fr' ? 'International' : 'International',
      delay: language === 'fr' ? '10-15 jours ouvrables' : '10-15 business days',
      price: language === 'fr' ? 'Calculé selon destination' : 'Calculated by destination',
      icon: <MapPin className="w-6 h-6" />
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">M</div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">Missa Créations</h1>
                <p className="text-xs text-gray-500">Personnalisées et Artisanales</p>
              </div>
            </Link>
            <Link href="/">
              <Button variant="outline" className="gap-2">
                <Home className="w-4 h-4" />
                {language === 'fr' ? 'Accueil' : 'Home'}
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 mb-6 shadow-xl">
            <Truck className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
            {language === 'fr' ? 'Livraison' : 'Delivery'}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {language === 'fr'
              ? 'Informations complètes sur nos options de livraison'
              : 'Complete information on our delivery options'}
          </p>
        </div>

        {/* Delivery Times */}
        <div className="max-w-6xl mx-auto mb-12">
          <Card className="shadow-2xl border-0 mb-8">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Clock className="w-6 h-6 text-pink-500" />
                {language === 'fr' ? 'Délais de livraison' : 'Delivery Times'}
              </CardTitle>
              <CardDescription>
                {language === 'fr'
                  ? 'Délais estimés selon votre destination'
                  : 'Estimated times based on your destination'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                {deliveryInfo.map((info, index) => (
                  <Card key={index} className="border-2 hover:border-pink-500 transition-all hover:shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4 text-pink-500">
                        {info.icon}
                        <h3 className="text-xl font-bold">{info.country}</h3>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-600">{info.delay}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Package className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-600">{info.price}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Free Shipping */}
          <Card className="shadow-2xl border-0 bg-gradient-to-br from-pink-50 to-purple-50 mb-8">
            <CardContent className="p-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">
                    {language === 'fr' ? 'Livraison gratuite' : 'Free Shipping'}
                  </h3>
                  <p className="text-gray-600">
                    {language === 'fr'
                      ? 'Pour toute commande de 75$ et plus au Canada'
                      : 'For all orders of $75 and more in Canada'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tracking */}
          <Card className="shadow-2xl border-0 mb-8">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Package className="w-6 h-6 text-purple-500" />
                {language === 'fr' ? 'Suivi de commande' : 'Order Tracking'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 leading-relaxed">
                {language === 'fr'
                  ? 'Vous recevrez un numéro de suivi par email dès l\'expédition de votre colis. Suivez votre commande en temps réel.'
                  : 'You will receive a tracking number by email as soon as your package is shipped. Track your order in real time.'}
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">
                  {language === 'fr'
                    ? '📧 Le numéro de suivi sera envoyé à l\'adresse email utilisée lors de la commande'
                    : '📧 The tracking number will be sent to the email address used during checkout'}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Problem Section */}
          <Card className="shadow-2xl border-0 bg-gradient-to-br from-red-50 to-pink-50">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2 text-red-600">
                <Package className="w-6 h-6" />
                {language === 'fr' ? 'Problème avec votre livraison ?' : 'Problem with your delivery?'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                {language === 'fr'
                  ? 'Contactez-nous à support@missacreations.com avec votre numéro de commande et nous vous aiderons rapidement.'
                  : 'Contact us at support@missacreations.com with your order number and we will help you quickly.'}
              </p>
              <a href="mailto:support@missacreations.com">
                <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700">
                  <Mail className="w-4 h-4 mr-2" />
                  {language === 'fr' ? 'Contacter le support' : 'Contact Support'}
                </Button>
              </a>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Links */}
        <div className="max-w-4xl mx-auto mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/faq">
            <Card className="hover:shadow-xl transition-shadow cursor-pointer border-2 hover:border-pink-500">
              <CardContent className="p-4 text-center">
                <Package className="w-8 h-8 mx-auto mb-2 text-purple-500" />
                <p className="font-semibold text-sm">{language === 'fr' ? 'FAQ' : 'FAQ'}</p>
              </CardContent>
            </Card>
          </Link>
          <Link href="/livraison">
            <Card className="hover:shadow-xl transition-shadow cursor-pointer border-2 border-pink-500 bg-pink-50">
              <CardContent className="p-4 text-center">
                <Truck className="w-8 h-8 mx-auto mb-2 text-pink-500" />
                <p className="font-semibold text-sm">{language === 'fr' ? 'Livraison' : 'Delivery'}</p>
              </CardContent>
            </Card>
          </Link>
          <Link href="/retours">
            <Card className="hover:shadow-xl transition-shadow cursor-pointer border-2 hover:border-pink-500">
              <CardContent className="p-4 text-center">
                <Package className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                <p className="font-semibold text-sm">{language === 'fr' ? 'Retours' : 'Returns'}</p>
              </CardContent>
            </Card>
          </Link>
          <Link href="/garantie">
            <Card className="hover:shadow-xl transition-shadow cursor-pointer border-2 hover:border-pink-500">
              <CardContent className="p-4 text-center">
                <Package className="w-8 h-8 mx-auto mb-2 text-green-500" />
                <p className="font-semibold text-sm">{language === 'fr' ? 'Garantie' : 'Warranty'}</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </section>
    </div>
  )
}

