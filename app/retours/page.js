'use client'

import { RotateCcw, Mail, CheckCircle, XCircle, Package, Home, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useLanguage } from '@/contexts/LanguageContext'
import Link from 'next/link'

export default function RetoursPage() {
  const { language, t } = useLanguage()

  const returnSteps = [
    {
      step: 1,
      title: language === 'fr' ? 'Contactez-nous' : 'Contact Us',
      description: language === 'fr'
        ? 'Envoyez un email à support@missacreations.com avec votre numéro de commande'
        : 'Send an email to support@missacreations.com with your order number',
      icon: <Mail className="w-6 h-6" />
    },
    {
      step: 2,
      title: language === 'fr' ? 'Indiquez la raison' : 'Indicate Reason',
      description: language === 'fr'
        ? 'Précisez pourquoi vous souhaitez retourner l\'article'
        : 'Specify why you want to return the item',
      icon: <Package className="w-6 h-6" />
    },
    {
      step: 3,
      title: language === 'fr' ? 'Étiquette prépayée' : 'Prepaid Label',
      description: language === 'fr'
        ? 'Nous vous enverrons une étiquette de retour prépayée par email'
        : 'We will send you a prepaid return label by email',
      icon: <CheckCircle className="w-6 h-6" />
    },
    {
      step: 4,
      title: language === 'fr' ? 'Emballez et envoyez' : 'Pack and Send',
      description: language === 'fr'
        ? 'Emballez soigneusement l\'article dans son emballage d\'origine et envoyez-le'
        : 'Carefully pack the item in its original packaging and send it',
      icon: <Package className="w-6 h-6" />
    },
    {
      step: 5,
      title: language === 'fr' ? 'Remboursement' : 'Refund',
      description: language === 'fr'
        ? 'Remboursement sous 5-7 jours après réception'
        : 'Refund within 5-7 days after receipt',
      icon: <CheckCircle className="w-6 h-6" />
    }
  ]

  const eligibleItems = [
    language === 'fr' ? 'Article intact et non porté' : 'Intact and unworn item',
    language === 'fr' ? 'Emballage d\'origine' : 'Original packaging',
    language === 'fr' ? 'Étiquettes attachées (si applicable)' : 'Tags attached (if applicable)'
  ]

  const nonReturnableItems = [
    language === 'fr' ? 'Créations personnalisées avec photo/texte' : 'Personalized creations with photo/text',
    language === 'fr' ? 'Bijoux portés ou endommagés' : 'Worn or damaged jewelry',
    language === 'fr' ? 'Articles soldés (sauf défaut)' : 'Sale items (except defects)'
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
            <RotateCcw className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
            {language === 'fr' ? 'Politique de Retours' : 'Return Policy'}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {language === 'fr'
              ? 'Retournez votre article dans les 30 jours suivant la réception'
              : 'Return your item within 30 days of receipt'}
          </p>
        </div>

        <div className="max-w-6xl mx-auto space-y-8">
          {/* Return Period */}
          <Card className="shadow-2xl border-0 bg-gradient-to-br from-green-50 to-blue-50">
            <CardContent className="p-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">
                    {language === 'fr' ? 'Délai de retour : 30 jours' : 'Return Period: 30 days'}
                  </h3>
                  <p className="text-gray-600">
                    {language === 'fr'
                      ? 'Vous disposez de 30 jours à compter de la réception pour retourner un article non personnalisé en parfait état.'
                      : 'You have 30 days from receipt to return a non-personalized item in perfect condition.'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Personalized Items */}
          <Card className="shadow-2xl border-0">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Package className="w-6 h-6 text-purple-500" />
                {language === 'fr' ? 'Articles personnalisés' : 'Personalized Items'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                <p className="text-gray-700">
                  {language === 'fr'
                    ? 'Les créations sur mesure avec vos photos ou textes ne sont pas éligibles au retour, sauf en cas de défaut de fabrication.'
                    : 'Custom creations with your photos or texts are not eligible for return, except in case of manufacturing defect.'}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Return Process */}
          <Card className="shadow-2xl border-0">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <RotateCcw className="w-6 h-6 text-pink-500" />
                {language === 'fr' ? 'Comment effectuer un retour' : 'How to Make a Return'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {returnSteps.map((step, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg">
                        {step.step}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="text-pink-500">{step.icon}</div>
                        <h4 className="text-lg font-semibold">{step.title}</h4>
                      </div>
                      <p className="text-gray-600">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Eligible vs Non-Eligible */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="shadow-xl border-2 border-green-200">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2 text-green-600">
                  <CheckCircle className="w-5 h-5" />
                  {language === 'fr' ? 'Articles éligibles' : 'Eligible Items'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {eligibleItems.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="shadow-xl border-2 border-red-200">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2 text-red-600">
                  <XCircle className="w-5 h-5" />
                  {language === 'fr' ? 'Articles non retournables' : 'Non-Returnable Items'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {nonReturnableItems.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Contact Section */}
          <Card className="shadow-2xl border-0 bg-gradient-to-br from-pink-50 to-purple-50">
            <CardContent className="p-8 text-center">
              <Mail className="w-12 h-12 mx-auto mb-4 text-pink-500" />
              <h3 className="text-2xl font-bold mb-4 text-gray-800">
                {language === 'fr' ? 'Prêt à effectuer un retour ?' : 'Ready to make a return?'}
              </h3>
              <p className="text-gray-600 mb-6">
                {language === 'fr'
                  ? 'Contactez-nous dès maintenant et nous vous guiderons dans le processus'
                  : 'Contact us now and we will guide you through the process'}
              </p>
              <a href="mailto:support@missacreations.com">
                <Button size="lg" className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white shadow-xl">
                  <Mail className="w-5 h-5 mr-2" />
                  support@missacreations.com
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
            <Card className="hover:shadow-xl transition-shadow cursor-pointer border-2 hover:border-pink-500">
              <CardContent className="p-4 text-center">
                <Package className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                <p className="font-semibold text-sm">{language === 'fr' ? 'Livraison' : 'Delivery'}</p>
              </CardContent>
            </Card>
          </Link>
          <Link href="/retours">
            <Card className="hover:shadow-xl transition-shadow cursor-pointer border-2 border-pink-500 bg-pink-50">
              <CardContent className="p-4 text-center">
                <RotateCcw className="w-8 h-8 mx-auto mb-2 text-pink-500" />
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

