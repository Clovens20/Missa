'use client'

import { useState } from 'react'
import { Mail, ChevronDown, ChevronUp, Home, ShoppingCart, HelpCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { useLanguage } from '@/contexts/LanguageContext'
import Link from 'next/link'

export default function FAQPage() {
  const { language, t } = useLanguage()
  const [openItems, setOpenItems] = useState([])

  const faqs = [
    {
      question: language === 'fr' 
        ? 'Combien de temps prend la création d\'un bijou personnalisé ?'
        : 'How long does it take to create a personalized jewelry?',
      answer: language === 'fr'
        ? 'Chaque création est faite à la main avec soin. Comptez entre 5 à 10 jours ouvrables pour la fabrication, plus le délai de livraison.'
        : 'Each creation is handmade with care. Allow 5 to 10 business days for production, plus delivery time.'
    },
    {
      question: language === 'fr'
        ? 'Puis-je modifier ma commande après l\'avoir passée ?'
        : 'Can I modify my order after placing it?',
      answer: language === 'fr'
        ? 'Les modifications sont possibles dans les 24h suivant votre commande. Contactez-nous rapidement à support@missacreations.com.'
        : 'Modifications are possible within 24 hours of your order. Contact us quickly at support@missacreations.com.'
    },
    {
      question: language === 'fr'
        ? 'Quels types d\'images fonctionnent le mieux pour la personnalisation ?'
        : 'What types of images work best for personalization?',
      answer: language === 'fr'
        ? 'Les images de haute qualité (minimum 1000x1000 pixels) avec un bon éclairage donnent les meilleurs résultats. Les photos avec des visages nets ou des motifs clairs sont idéales.'
        : 'High-quality images (minimum 1000x1000 pixels) with good lighting give the best results. Photos with clear faces or patterns are ideal.'
    },
    {
      question: language === 'fr'
        ? 'Les bijoux en résine sont-ils résistants à l\'eau ?'
        : 'Are resin jewelry water resistant?',
      answer: language === 'fr'
        ? 'Nos créations sont résistantes aux éclaboussures, mais nous recommandons de les retirer avant la douche, la baignade ou les activités aquatiques prolongées.'
        : 'Our creations are splash-resistant, but we recommend removing them before showering, swimming, or prolonged water activities.'
    },
    {
      question: language === 'fr'
        ? 'Proposez-vous des boîtes cadeaux ?'
        : 'Do you offer gift boxes?',
      answer: language === 'fr'
        ? 'Oui ! Chaque création est livrée dans un joli emballage cadeau. Des options premium sont disponibles lors de la commande.'
        : 'Yes! Each creation is delivered in a beautiful gift box. Premium options are available when ordering.'
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
            <HelpCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
            {language === 'fr' ? 'FAQ' : 'FAQ'}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {language === 'fr' 
              ? 'Trouvez rapidement les réponses à vos questions les plus fréquentes'
              : 'Quickly find answers to your most frequently asked questions'}
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-4xl mx-auto mb-12">
          <Card className="shadow-2xl border-0">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <HelpCircle className="w-6 h-6 text-pink-500" />
                {language === 'fr' ? 'Questions Fréquentes' : 'Frequently Asked Questions'}
              </CardTitle>
              <CardDescription>
                {language === 'fr' 
                  ? 'Toutes les réponses à vos questions sur nos créations personnalisées'
                  : 'All answers to your questions about our personalized creations'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="border-b border-gray-200">
                    <AccordionTrigger className="text-left font-semibold text-lg hover:text-pink-500 transition">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600 leading-relaxed pt-2">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>

        {/* Contact Section */}
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-2xl border-0 bg-gradient-to-br from-pink-50 to-purple-50">
            <CardContent className="p-8 text-center">
              <Mail className="w-12 h-12 mx-auto mb-4 text-pink-500" />
              <h3 className="text-2xl font-bold mb-4 text-gray-800">
                {language === 'fr' ? 'Besoin d\'aide supplémentaire ?' : 'Need additional help?'}
              </h3>
              <p className="text-gray-600 mb-6">
                {language === 'fr'
                  ? 'Notre équipe est là pour vous aider. Contactez-nous et nous vous répondrons sous 24h.'
                  : 'Our team is here to help. Contact us and we will respond within 24 hours.'}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a href="mailto:support@missacreations.com">
                  <Button size="lg" className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white shadow-xl">
                    <Mail className="w-5 h-5 mr-2" />
                    support@missacreations.com
                  </Button>
                </a>
                <p className="text-sm text-gray-500">
                  {language === 'fr' ? 'Temps de réponse : Sous 24h (jours ouvrables)' : 'Response time: Under 24h (business days)'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Links */}
        <div className="max-w-4xl mx-auto mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/livraison">
            <Card className="hover:shadow-xl transition-shadow cursor-pointer border-2 hover:border-pink-500">
              <CardContent className="p-4 text-center">
                <ShoppingCart className="w-8 h-8 mx-auto mb-2 text-purple-500" />
                <p className="font-semibold text-sm">{language === 'fr' ? 'Livraison' : 'Delivery'}</p>
              </CardContent>
            </Card>
          </Link>
          <Link href="/retours">
            <Card className="hover:shadow-xl transition-shadow cursor-pointer border-2 hover:border-pink-500">
              <CardContent className="p-4 text-center">
                <ShoppingCart className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                <p className="font-semibold text-sm">{language === 'fr' ? 'Retours' : 'Returns'}</p>
              </CardContent>
            </Card>
          </Link>
          <Link href="/garantie">
            <Card className="hover:shadow-xl transition-shadow cursor-pointer border-2 hover:border-pink-500">
              <CardContent className="p-4 text-center">
                <HelpCircle className="w-8 h-8 mx-auto mb-2 text-green-500" />
                <p className="font-semibold text-sm">{language === 'fr' ? 'Garantie' : 'Warranty'}</p>
              </CardContent>
            </Card>
          </Link>
          <Link href="/faq">
            <Card className="hover:shadow-xl transition-shadow cursor-pointer border-2 border-pink-500 bg-pink-50">
              <CardContent className="p-4 text-center">
                <HelpCircle className="w-8 h-8 mx-auto mb-2 text-pink-500" />
                <p className="font-semibold text-sm">{language === 'fr' ? 'FAQ' : 'FAQ'}</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </section>
    </div>
  )
}

