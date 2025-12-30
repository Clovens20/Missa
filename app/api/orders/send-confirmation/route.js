import { NextResponse } from 'next/server'

// Resend désactivé - à réactiver quand vous aurez un compte Resend
// import { Resend } from 'resend'
// const resend = new Resend(process.env.RESEND_API_KEY)

// Fonction pour générer le template HTML de l'email de confirmation
function generateOrderConfirmationEmail(order, language = 'fr') {
  const isFrench = language === 'fr'
  
  // Formater les items de la commande
  const itemsHtml = order.items.map(item => {
    const productName = isFrench ? item.name_fr || item.name : item.name_en || item.name
    const customization = item.customization ? `
      <div style="margin-top: 8px; padding: 8px; background: #f9fafb; border-radius: 6px; font-size: 12px; color: #6b7280;">
        <strong>${isFrench ? 'Personnalisation:' : 'Customization:'}</strong><br/>
        ${item.customization.color && item.customization.color !== 'transparent' ? `${isFrench ? 'Couleur:' : 'Color:'} ${item.customization.color}<br/>` : ''}
        ${item.customization.glitter && item.customization.glitter !== 'none' ? `${isFrench ? 'Paillettes:' : 'Glitter:'} ${item.customization.glitter}<br/>` : ''}
        ${item.customization.flower && item.customization.flower !== 'none' ? `${isFrench ? 'Fleur:' : 'Flower:'} ${item.customization.flower}<br/>` : ''}
        ${item.customization.initial ? `${isFrench ? 'Initiale:' : 'Initial:'} ${item.customization.initial}<br/>` : ''}
        ${item.customization.text ? `${isFrench ? 'Texte:' : 'Text:'} ${item.customization.text}<br/>` : ''}
      </div>
    ` : ''
    
    return `
      <tr>
        <td style="padding: 16px; border-bottom: 1px solid #e5e7eb;">
          <div style="display: flex; gap: 16px;">
            <img src="${item.images?.[0] || item.image || 'https://images.unsplash.com/photo-1612672358776-15458bfd9869?w=100'}" 
                 alt="${productName}" 
                 style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px; border: 1px solid #e5e7eb;" />
            <div style="flex: 1;">
              <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #111827;">${productName}</h3>
              <p style="margin: 0; font-size: 14px; color: #6b7280;">${isFrench ? 'Quantité:' : 'Quantity:'} ${item.quantity}</p>
              <p style="margin: 4px 0 0 0; font-size: 18px; font-weight: 600; color: #ec4899;">${item.price}$ CAD</p>
              ${customization}
            </div>
          </div>
        </td>
      </tr>
    `
  }).join('')

  return `
<!DOCTYPE html>
<html lang="${language}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${isFrench ? 'Confirmation de commande' : 'Order Confirmation'}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f9fafb;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header avec gradient -->
          <tr>
            <td style="background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 700;">
                ✨ ${isFrench ? 'Merci pour votre commande !' : 'Thank you for your order!'}
              </h1>
              <p style="margin: 12px 0 0 0; color: #ffffff; font-size: 16px; opacity: 0.9;">
                ${isFrench ? 'Votre commande a été confirmée' : 'Your order has been confirmed'}
              </p>
            </td>
          </tr>

          <!-- Numéro de commande -->
          <tr>
            <td style="padding: 30px; text-align: center; background: linear-gradient(135deg, #fef3f2 0%, #f3e8ff 100%);">
              <div style="display: inline-block; background: #ffffff; padding: 16px 32px; border-radius: 12px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                <p style="margin: 0 0 8px 0; font-size: 14px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">
                  ${isFrench ? 'Numéro de commande' : 'Order Number'}
                </p>
                <p style="margin: 0; font-size: 28px; font-weight: 700; color: #ec4899; letter-spacing: 2px;">
                  ${order.orderNumber}
                </p>
              </div>
            </td>
          </tr>

          <!-- Informations client -->
          <tr>
            <td style="padding: 30px;">
              <h2 style="margin: 0 0 20px 0; font-size: 20px; font-weight: 600; color: #111827;">
                ${isFrench ? '📋 Informations de livraison' : '📋 Delivery Information'}
              </h2>
              <div style="background: #f9fafb; padding: 20px; border-radius: 8px; border-left: 4px solid #ec4899;">
                <p style="margin: 0 0 8px 0; font-size: 15px; color: #111827;">
                  <strong>${order.customer.firstName} ${order.customer.lastName}</strong>
                </p>
                <p style="margin: 0 0 8px 0; font-size: 14px; color: #6b7280;">
                  ${order.customer.email}
                </p>
                ${order.customer.phone ? `<p style="margin: 0 0 8px 0; font-size: 14px; color: #6b7280;">${order.customer.phone}</p>` : ''}
                <p style="margin: 8px 0 0 0; font-size: 14px; color: #6b7280; line-height: 1.6;">
                  ${order.customer.address1}<br/>
                  ${order.customer.address2 ? `${order.customer.address2}<br/>` : ''}
                  ${order.customer.city}, ${order.customer.province} ${order.customer.postalCode}<br/>
                  ${order.customer.country}
                </p>
              </div>
            </td>
          </tr>

          <!-- Articles commandés -->
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <h2 style="margin: 0 0 20px 0; font-size: 20px; font-weight: 600; color: #111827;">
                ${isFrench ? '🛍️ Articles commandés' : '🛍️ Ordered Items'}
              </h2>
              <table width="100%" cellpadding="0" cellspacing="0" style="background: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
                ${itemsHtml}
              </table>
            </td>
          </tr>

          <!-- Résumé des prix -->
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                    <span style="font-size: 14px; color: #6b7280;">${isFrench ? 'Sous-total' : 'Subtotal'}</span>
                    <span style="float: right; font-size: 14px; font-weight: 600; color: #111827;">${(order.totalAmount - order.shippingCost + order.discount).toFixed(2)}$ CAD</span>
                  </td>
                </tr>
                ${order.discount > 0 ? `
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                    <span style="font-size: 14px; color: #10b981;">${isFrench ? 'Réduction' : 'Discount'}</span>
                    <span style="float: right; font-size: 14px; font-weight: 600; color: #10b981;">-${order.discount.toFixed(2)}$ CAD</span>
                  </td>
                </tr>
                ` : ''}
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                    <span style="font-size: 14px; color: #6b7280;">${isFrench ? 'Livraison' : 'Shipping'}</span>
                    <span style="float: right; font-size: 14px; font-weight: 600; color: #111827;">${order.shippingCost.toFixed(2)}$ CAD</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 16px 0 0 0;">
                    <span style="font-size: 18px; font-weight: 700; color: #111827;">${isFrench ? 'Total' : 'Total'}</span>
                    <span style="float: right; font-size: 24px; font-weight: 700; color: #ec4899;">${order.totalAmount.toFixed(2)}$ CAD</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Message de remerciement -->
          <tr>
            <td style="padding: 30px; background: linear-gradient(135deg, #fef3f2 0%, #f3e8ff 100%); text-align: center;">
              <p style="margin: 0 0 16px 0; font-size: 16px; color: #111827; line-height: 1.6;">
                ${isFrench 
                  ? 'Nous sommes ravis de vous compter parmi nos clients ! Votre commande est en cours de traitement et vous recevrez un email de confirmation dès qu\'elle sera expédiée.' 
                  : 'We are thrilled to have you as a customer! Your order is being processed and you will receive a confirmation email as soon as it is shipped.'}
              </p>
              <p style="margin: 0; font-size: 14px; color: #6b7280;">
                ${isFrench 
                  ? 'Pour toute question, contactez-nous à' 
                  : 'For any questions, contact us at'} 
                <a href="mailto:support@missacreations.com" style="color: #ec4899; text-decoration: none; font-weight: 600;">support@missacreations.com</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 30px; text-align: center; background: #111827; color: #ffffff;">
              <p style="margin: 0 0 8px 0; font-size: 18px; font-weight: 600;">
                Missa Créations
              </p>
              <p style="margin: 0 0 16px 0; font-size: 14px; color: #9ca3af;">
                ${isFrench ? 'Créations artisanales en résine' : 'Handcrafted resin creations'}
              </p>
              <div style="margin: 20px 0;">
                <a href="https://facebook.com/missacreations" style="display: inline-block; margin: 0 8px; width: 36px; height: 36px; background: #ec4899; border-radius: 50%; line-height: 36px; text-align: center; color: #ffffff; text-decoration: none;">f</a>
                <a href="https://instagram.com/missacreations" style="display: inline-block; margin: 0 8px; width: 36px; height: 36px; background: #ec4899; border-radius: 50%; line-height: 36px; text-align: center; color: #ffffff; text-decoration: none;">i</a>
                <a href="https://tiktok.com/@missacreations" style="display: inline-block; margin: 0 8px; width: 36px; height: 36px; background: #ec4899; border-radius: 50%; line-height: 36px; text-align: center; color: #ffffff; text-decoration: none;">🎵</a>
              </div>
              <p style="margin: 16px 0 0 0; font-size: 12px; color: #6b7280;">
                © ${new Date().getFullYear()} Missa Créations. ${isFrench ? 'Tous droits réservés.' : 'All rights reserved.'}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { order, language = 'fr' } = body

    if (!order || !order.customer || !order.customer.email) {
      return NextResponse.json({ 
        success: false, 
        error: 'Order and customer email are required' 
      }, { status: 400 })
    }

    // Email désactivé temporairement - Resend non configuré
    // TODO: Réactiver quand vous aurez un compte Resend
    console.log('📧 Email de confirmation désactivé (Resend non configuré)')
    console.log('Order:', order.orderNumber, 'Email:', order.customer.email)
    
    // Générer le HTML pour référence (peut être utilisé plus tard)
    const isFrench = language === 'fr'
    const emailHtml = generateOrderConfirmationEmail(order, language)
    
    // Retourner un succès même sans envoyer l'email
    // L'email sera envoyé manuellement ou via un autre service plus tard
    return NextResponse.json({ 
      success: true, 
      message: 'Order confirmed (email service not configured - will be sent manually)',
      note: 'Email HTML generated but not sent. Configure RESEND_API_KEY to enable email sending.'
    })
  } catch (error) {
    console.error('Email sending error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Failed to send email' 
    }, { status: 500 })
  }
}

