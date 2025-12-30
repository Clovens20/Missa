'use client'

import { useRef } from 'react'

export default function ThankYouCard({ order, logoUrl }) {
  const cardRef = useRef(null)

  // URL du logo Missa Créations par défaut
  const defaultLogoUrl = '/missa-logo.png' // Vous devrez placer votre logo avec ce nom dans le dossier public/

  const messages = [
    `Cher(e) ${order.customer?.firstName},`,
    ``,
    `Nous tenons à vous exprimer notre plus sincère gratitude pour votre commande !`,
    ``,
    `Votre confiance en Missa Créations nous touche profondément. Chaque création que nous réalisons est faite avec amour et passion, et savoir que vous avez choisi nos produits pour vous ou pour offrir nous remplit de joie.`,
    ``,
    `Nous espérons que votre création personnalisée dépassera toutes vos attentes et qu'elle vous apportera bonheur et satisfaction pendant de nombreuses années.`,
    ``,
    `N'hésitez pas à partager votre expérience avec nous et à nous suivre sur nos réseaux sociaux pour découvrir nos nouvelles créations !`,
    ``,
    `Avec toute notre gratitude,`,
    `L'équipe Missa Créations ❤️`
  ]

  return (
    <div 
      ref={cardRef} 
      className="bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 p-12 border-2 border-pink-200 shadow-xl"
      style={{ 
        pageBreakAfter: 'always',
        width: '8.5in',
        height: '11in',
        minWidth: '8.5in',
        minHeight: '11in'
      }}
    >
      {/* Logo en haut */}
      <div className="flex justify-center mb-8">
        <img 
          src={logoUrl || defaultLogoUrl} 
          alt="Missa Créations" 
          className="h-20 w-auto max-w-full object-contain"
          style={{ maxHeight: '80px' }}
          onError={(e) => {
            // Si le logo ne charge pas, afficher un fallback
            e.target.style.display = 'none'
            // Afficher un emoji ou texte de remplacement
            const fallback = document.createElement('div')
            fallback.innerHTML = '💎'
            fallback.className = 'text-4xl'
            e.target.parentNode.insertBefore(fallback, e.target)
          }}
        />
      </div>

      {/* Titre */}
      <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
        Merci !
      </h1>

      {/* Message personnalisé */}
      <div className="space-y-4 text-gray-700 leading-relaxed">
        {messages.map((line, index) => (
          <p key={index} className={line === '' ? 'h-4' : line.includes('Cher(e)') ? 'text-lg font-semibold text-pink-600' : line.includes('Missa Créations') ? 'font-bold text-purple-600' : ''}>
            {line}
          </p>
        ))}
      </div>

      {/* Détails de commande */}
      <div className="mt-8 pt-6 border-t border-pink-200">
        <p className="text-sm text-gray-600 text-center">
          Commande #{order.orderNumber} • {new Date(order.createdAt).toLocaleDateString('fr-FR', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </div>

      {/* Footer décoratif */}
      <div className="mt-8 flex justify-center">
        <div className="text-4xl">✨</div>
      </div>
    </div>
  )
}

