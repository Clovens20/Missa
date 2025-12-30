'use client'

import { useEffect, useRef } from 'react'
import QRCode from 'react-qr-code'

export default function ShippingLabel({ order, logoUrl }) {
  const labelRef = useRef(null)

  const orderData = {
    orderNumber: order.orderNumber,
    customer: order.customer,
    items: order.items,
    trackingNumber: order.trackingNumber,
    shippingCarrier: order.shippingCarrier
  }

  const qrData = JSON.stringify(orderData)

  // URL du logo Missa Créations par défaut
  const defaultLogoUrl = '/missa-logo.png' // Vous devrez placer votre logo avec ce nom dans le dossier public/

  return (
    <div ref={labelRef} className="bg-white p-6 w-[4in] h-[6in] border-2 border-gray-300" style={{ pageBreakAfter: 'always', width: '4in', height: '6in' }}>
      {/* Header avec Logo */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-pink-300">
        <div className="flex items-center gap-3">
          <img 
            src={logoUrl || defaultLogoUrl} 
            alt="Missa Créations" 
            className="h-16 w-auto max-w-full object-contain"
            style={{ maxHeight: '64px' }}
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
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              Missa Créations
            </h2>
            <p className="text-xs text-gray-500">Personnalisées et Artisanales</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Informations Client - Gauche */}
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-bold text-gray-500 mb-2">DESTINATAIRE</h3>
            <div className="text-sm space-y-1">
              <p className="font-bold text-lg">{order.customer?.firstName} {order.customer?.lastName}</p>
              <p>{order.customer?.address1}</p>
              {order.customer?.address2 && <p>{order.customer?.address2}</p>}
              <p>{order.customer?.city}, {order.customer?.province} {order.customer?.postalCode}</p>
              <p className="font-semibold">{order.customer?.country}</p>
              {order.customer?.phone && <p className="mt-2">📞 {order.customer?.phone}</p>}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <h3 className="text-sm font-bold text-gray-500 mb-2">COMMANDE</h3>
            <div className="text-sm space-y-1">
              <p><strong>N°:</strong> {order.orderNumber}</p>
              <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString('fr-FR')}</p>
              {order.trackingNumber && (
                <p><strong>Suivi:</strong> {order.trackingNumber}</p>
              )}
            </div>
          </div>
        </div>

        {/* QR Code - Droite */}
        <div className="flex flex-col items-center justify-center">
          <div className="bg-white p-4 border-2 border-gray-300">
            <QRCode
              value={qrData}
              size={150}
              style={{ height: "auto", maxWidth: "100%", width: "100%" }}
              viewBox={`0 0 150 150`}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">Scanner pour détails</p>
        </div>
      </div>

      {/* Items */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <h3 className="text-sm font-bold text-gray-500 mb-2">ARTICLES</h3>
        <div className="space-y-2 text-sm">
          {order.items?.map((item, idx) => (
            <div key={idx} className="flex justify-between">
              <span>{item.name} x{item.quantity}</span>
              <span className="font-semibold">{((item.price + (item.customization ? 10 : 0)) * item.quantity).toFixed(2)}$</span>
            </div>
          ))}
        </div>
        <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between font-bold">
          <span>TOTAL:</span>
          <span>{order.totalAmount?.toFixed(2)}$ CAD</span>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-gray-200 text-center">
        <p className="text-xs text-gray-500">
          Merci pour votre confiance ! ❤️
        </p>
      </div>
    </div>
  )
}