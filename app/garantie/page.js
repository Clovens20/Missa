'use client'

import { Shield, Mail, CheckCircle, XCircle, AlertCircle, Home, Award } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useLanguage } from '@/contexts/LanguageContext'
import Link from 'next/link'

export default function GarantiePage() {
  const { language, t } = useLanguage()

  const coveredItems = [
    language === 'fr' ? 'Défauts de résine (jaunissement, fissures)' : 'Resin defects (yellowing, cracks)',
    language === 'fr' ? 'Problèmes de monture ou fermoirs' : 'Mounting or clasp problems',
    language === 'fr' ? 'Détachement de l\'image ou du texte' : 'Detachment of image or text',
    language === 'fr' ? 'Défauts de finition' : 'Finishing defects'
  ]

  const notCoveredItems = [
    language === 'fr' ? 'Usure normale' : 'Normal wear',
    language === 'fr' ? 'Dommages causés par mauvaise utilisation' : 'Damage caused by misuse',
    language === 'fr' ? 'Exposition prolongée à l\'eau ou produits chimiques' : 'Prolonged exposure to water or chemicals',
    language === 'fr' ? 'Chocs ou chutes' : 'Shocks or falls'
  ]

  const claimSteps = [
    {
      step: 1,
      title: language === 'fr' ? 'Envoyez un email' : 'Send an Email',
      description: language === 'fr'
        ? 'Contactez-nous à support@missacreations.com'
        : 'Contact us at support@missacreations.com',
      icon: <Mail className="w-6 h-6" />
    },
    {
      step: 2,
      title: language === 'fr' ? 'Joignez des photos' : 'Attach Photos',
      description: language === 'fr'
        ? 'Envoyez des photos claires du défaut'
        : 'Send clear photos of the defect',
      icon: <AlertCircle className="w-6 h-6" />
    },
    {
      step: 3,
      title: language === 'fr' ? 'Incluez votre numéro' : 'Include Order Number',
      description: language === 'fr'
        ? 'Indiquez votre numéro de commande'
        : 'Provide your order number',
      icon: <Award className="w-6 h-6" />
    },
    {
      step: 4,
      title: language === 'fr' ? 'Évaluation' : 'Evaluation',
      description: language === 'fr'
        ? 'Nous évaluerons votre demande sous 48h'
        : 'We will evaluate your request within 48h',
      icon: <CheckCircle className="w-6 h-6" />
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
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
            {language === 'fr' ? 'Notre Garantie Qualité' : 'Our Quality Guarantee'}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {language === 'fr'
              ? 'Toutes nos créations sont garanties contre les défauts de fabrication'
              : 'All our creations are guaranteed against manufacturing defects'}
          </p>
        </div>

        <div className="max-w-6xl mx-auto space-y-8">
          {/* Warranty Period */}
          <Card className="shadow-2xl border-0 bg-gradient-to-br from-green-50 to-blue-50">
            <CardContent className="p-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">
                    {language === 'fr' ? 'Garantie de 1 an' : '1 Year Warranty'}
                  </h3>
                  <p className="text-gray-600">
                    {language === 'fr'
                      ? 'Toutes nos créations sont garanties contre les défauts de fabrication pendant 1 an à compter de la date d\'achat.'
                      : 'All our creations are guaranteed against manufacturing defects for 1 year from the date of purchase.'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Coverage */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="shadow-xl border-2 border-green-200">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2 text-green-600">
                  <CheckCircle className="w-5 h-5" />
                  {language === 'fr' ? 'Couverture de la garantie' : 'Warranty Coverage'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {coveredItems.map((item, index) => (
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
                  {language === 'fr' ? 'Non couvert par la garantie' : 'Not Covered by Warranty'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {notCoveredItems.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Claim Process */}
          <Card className="shadow-2xl border-0">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Shield className="w-6 h-6 text-pink-500" />
                {language === 'fr' ? 'Comment faire une réclamation' : 'How to File a Claim'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {claimSteps.map((step, index) => (
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

          {/* Commitment */}
          <Card className="shadow-2xl border-0 bg-gradient-to-br from-pink-50 to-purple-50">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Award className="w-6 h-6 text-purple-500" />
                {language === 'fr' ? 'Notre engagement' : 'Our Commitment'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                {language === 'fr'
                  ? 'Si votre création présente un défaut couvert par la garantie, nous la remplacerons gratuitement ou vous rembourserons intégralement.'
                  : 'If your creation has a defect covered by the warranty, we will replace it free of charge or refund you in full.'}
              </p>
              <div className="bg-white p-4 rounded-lg border-l-4 border-purple-500">
                <p className="font-semibold text-gray-800 mb-2">
                  {language === 'fr' ? 'Satisfaction garantie' : 'Satisfaction Guaranteed'}
                </p>
                <p className="text-gray-600">
                  {language === 'fr'
                    ? 'Votre bonheur est notre priorité. Si vous n\'êtes pas 100% satisfait de votre création, contactez-nous pour trouver une solution.'
                    : 'Your happiness is our priority. If you are not 100% satisfied with your creation, contact us to find a solution.'}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Contact Section */}
          <Card className="shadow-2xl border-0 bg-gradient-to-br from-pink-50 to-purple-50">
            <CardContent className="p-8 text-center">
              <Mail className="w-12 h-12 mx-auto mb-4 text-pink-500" />
              <h3 className="text-2xl font-bold mb-4 text-gray-800">
                {language === 'fr' ? 'Besoin de faire une réclamation ?' : 'Need to file a claim?'}
              </h3>
              <p className="text-gray-600 mb-6">
                {language === 'fr'
                  ? 'Contactez-nous dès maintenant et nous vous aiderons rapidement'
                  : 'Contact us now and we will help you quickly'}
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
          <Link href="/faq">
            <Card className="hover:shadow-xl transition-shadow cursor-pointer border-2 hover:border-pink-500">
              <CardContent className="p-4 text-center">
                <Shield className="w-8 h-8 mx-auto mb-2 text-purple-500" />
                <p className="font-semibold text-sm">{language === 'fr' ? 'FAQ' : 'FAQ'}</p>
              </CardContent>
            </Card>
          </Link>
          <Link href="/livraison">
            <Card className="hover:shadow-xl transition-shadow cursor-pointer border-2 hover:border-pink-500">
              <CardContent className="p-4 text-center">
                <Shield className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                <p className="font-semibold text-sm">{language === 'fr' ? 'Livraison' : 'Delivery'}</p>
              </CardContent>
            </Card>
          </Link>
          <Link href="/retours">
            <Card className="hover:shadow-xl transition-shadow cursor-pointer border-2 hover:border-pink-500">
              <CardContent className="p-4 text-center">
                <Shield className="w-8 h-8 mx-auto mb-2 text-pink-500" />
                <p className="font-semibold text-sm">{language === 'fr' ? 'Retours' : 'Returns'}</p>
              </CardContent>
            </Card>
          </Link>
          <Link href="/garantie">
            <Card className="hover:shadow-xl transition-shadow cursor-pointer border-2 border-pink-500 bg-pink-50">
              <CardContent className="p-4 text-center">
                <Shield className="w-8 h-8 mx-auto mb-2 text-green-500" />
                <p className="font-semibold text-sm">{language === 'fr' ? 'Garantie' : 'Warranty'}</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </section>
    </div>
  )
}

