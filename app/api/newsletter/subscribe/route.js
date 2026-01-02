import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'

// Resend désactivé - à réactiver quand vous aurez un compte Resend
// import { Resend } from 'resend'
// const resend = new Resend(process.env.RESEND_API_KEY)

// Fonction pour générer un code promo unique
function generatePromoCode(email) {
  // Générer un code basé sur l'email et un timestamp
  const emailPrefix = email.split('@')[0].toUpperCase().slice(0, 4)
  const timestamp = Date.now().toString().slice(-6)
  return `WELCOME${emailPrefix}${timestamp}`
}

// Fonction pour générer le template HTML de l'email de bienvenue
function generateWelcomeEmail(name, email, language = 'fr', promoCode = 'BIENVENUE10') {
  const isFrench = language === 'fr'
  const firstName = name ? name.split(' ')[0] : 'Cher client'
  
  return `
<!DOCTYPE html>
<html lang="${language}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${isFrench ? 'Bienvenue chez Missa Créations' : 'Welcome to Missa Creations'}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f9fafb;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);">
          
          <!-- Header avec gradient et confettis -->
          <tr>
            <td style="background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 50%, #ec4899 100%); padding: 60px 30px; text-align: center; position: relative; overflow: hidden;">
              <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; opacity: 0.3;">
                <div style="position: absolute; top: 20%; left: 10%; width: 20px; height: 20px; background: white; border-radius: 50%; animation: float 3s ease-in-out infinite;"></div>
                <div style="position: absolute; top: 60%; right: 15%; width: 15px; height: 15px; background: white; border-radius: 50%; animation: float 2s ease-in-out infinite;"></div>
                <div style="position: absolute; bottom: 20%; left: 20%; width: 25px; height: 25px; background: white; border-radius: 50%; animation: float 4s ease-in-out infinite;"></div>
              </div>
              <h1 style="margin: 0; color: #ffffff; font-size: 42px; font-weight: 800; text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2); position: relative; z-index: 1;">
                ✨ ${isFrench ? 'Bienvenue' : 'Welcome'} ${firstName} ! ✨
              </h1>
              <p style="margin: 16px 0 0 0; color: #ffffff; font-size: 20px; opacity: 0.95; position: relative; z-index: 1;">
                ${isFrench ? 'Vous faites maintenant partie de la famille Missa Créations' : 'You are now part of the Missa Creations family'}
              </p>
            </td>
          </tr>

          <!-- Message de bienvenue personnalisé -->
          <tr>
            <td style="padding: 50px 40px; text-align: center; background: linear-gradient(to bottom, #fef3f2 0%, #ffffff 100%);">
              <div style="width: 80px; height: 80px; margin: 0 auto 30px; background: linear-gradient(135deg, #ec4899, #8b5cf6); border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 20px rgba(236, 72, 153, 0.3);">
                <span style="font-size: 40px;">🎨</span>
              </div>
              <h2 style="margin: 0 0 20px 0; font-size: 28px; font-weight: 700; color: #111827; line-height: 1.3;">
                ${isFrench 
                  ? `Bonjour ${firstName}, nous sommes ravis de vous accueillir !` 
                  : `Hello ${firstName}, we're thrilled to welcome you!`}
              </h2>
              <p style="margin: 0 0 20px 0; font-size: 18px; color: #4b5563; line-height: 1.7;">
                ${isFrench 
                  ? `Chez <strong style="color: #ec4899;">Missa Créations</strong>, nous transformons vos rêves en réalité avec nos créations artisanales uniques en résine époxy. Chaque pièce est soigneusement fabriquée à la main avec passion, créativité et attention aux moindres détails.` 
                  : `At <strong style="color: #ec4899;">Missa Creations</strong>, we transform your dreams into reality with our unique handcrafted epoxy resin creations. Each piece is carefully handmade with passion, creativity, and attention to the smallest details.`}
              </p>
            </td>
          </tr>

          <!-- Pourquoi nous choisir -->
          <tr>
            <td style="padding: 40px; background: #ffffff;">
              <h3 style="margin: 0 0 30px 0; font-size: 24px; font-weight: 700; color: #111827; text-align: center;">
                ${isFrench ? '🌟 Pourquoi choisir Missa Créations ?' : '🌟 Why Choose Missa Creations?'}
              </h3>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding: 20px; background: linear-gradient(135deg, #fef3f2 0%, #f3e8ff 100%); border-radius: 12px; margin-bottom: 16px;">
                    <div style="display: flex; align-items: start; gap: 16px;">
                      <div style="width: 50px; height: 50px; background: linear-gradient(135deg, #ec4899, #8b5cf6); border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                        <span style="font-size: 24px;">✨</span>
                      </div>
                      <div>
                        <h4 style="margin: 0 0 8px 0; font-size: 18px; font-weight: 700; color: #111827;">
                          ${isFrench ? 'Créations 100% Artisanales' : '100% Handcrafted Creations'}
                        </h4>
                        <p style="margin: 0; font-size: 15px; color: #6b7280; line-height: 1.6;">
                          ${isFrench 
                            ? 'Chaque bijou, chaque décoration est créé avec amour et passion. Aucune machine ne peut reproduire l\'artisanat humain.' 
                            : 'Every jewelry piece, every decoration is created with love and passion. No machine can replicate human craftsmanship.'}
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr><td style="height: 16px;"></td></tr>
                <tr>
                  <td style="padding: 20px; background: linear-gradient(135deg, #f3e8ff 0%, #fef3f2 100%); border-radius: 12px;">
                    <div style="display: flex; align-items: start; gap: 16px;">
                      <div style="width: 50px; height: 50px; background: linear-gradient(135deg, #8b5cf6, #ec4899); border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                        <span style="font-size: 24px;">🎨</span>
                      </div>
                      <div>
                        <h4 style="margin: 0 0 8px 0; font-size: 18px; font-weight: 700; color: #111827;">
                          ${isFrench ? 'Personnalisation Illimitée' : 'Unlimited Personalization'}
                        </h4>
                        <p style="margin: 0; font-size: 15px; color: #6b7280; line-height: 1.6;">
                          ${isFrench 
                            ? 'Créez votre bijou unique avec vos couleurs préférées, vos fleurs séchées, vos initiales ou même vos photos.' 
                            : 'Create your unique jewelry with your favorite colors, dried flowers, initials, or even your photos.'}
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr><td style="height: 16px;"></td></tr>
                <tr>
                  <td style="padding: 20px; background: linear-gradient(135deg, #fef3f2 0%, #f3e8ff 100%); border-radius: 12px;">
                    <div style="display: flex; align-items: start; gap: 16px;">
                      <div style="width: 50px; height: 50px; background: linear-gradient(135deg, #ec4899, #8b5cf6); border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                        <span style="font-size: 24px;">💎</span>
                      </div>
                      <div>
                        <h4 style="margin: 0 0 8px 0; font-size: 18px; font-weight: 700; color: #111827;">
                          ${isFrench ? 'Qualité Premium Garantie' : 'Premium Quality Guaranteed'}
                        </h4>
                        <p style="margin: 0; font-size: 15px; color: #6b7280; line-height: 1.6;">
                          ${isFrench 
                            ? 'Résine époxy de haute qualité, finitions impeccables et garantie d\'un an sur toutes nos créations.' 
                            : 'High-quality epoxy resin, impeccable finishes, and a one-year warranty on all our creations.'}
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CTA Principal -->
          <tr>
            <td style="padding: 40px; text-align: center; background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%);">
              <h3 style="margin: 0 0 16px 0; font-size: 26px; font-weight: 700; color: #ffffff;">
                ${isFrench ? '🎁 Offre Spéciale de Bienvenue !' : '🎁 Special Welcome Offer!'}
              </h3>
              <p style="margin: 0 0 30px 0; font-size: 18px; color: #ffffff; opacity: 0.95;">
                ${isFrench 
                  ? `En tant que nouveau membre de notre communauté, ${firstName}, profitez de <strong style="font-size: 24px;">10% de réduction</strong> sur votre première commande !` 
                  : `As a new member of our community, ${firstName}, enjoy <strong style="font-size: 24px;">10% off</strong> on your first order!`}
              </p>
              <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'https://missacreations.com'}/products" 
                 style="display: inline-block; padding: 18px 40px; background: #ffffff; color: #ec4899; text-decoration: none; border-radius: 50px; font-size: 18px; font-weight: 700; box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2); transition: transform 0.2s;">
                ${isFrench ? '✨ Découvrir la Boutique ✨' : '✨ Discover the Shop ✨'}
              </a>
              <div style="margin: 20px 0 0 0; padding: 16px; background: rgba(255, 255, 255, 0.2); border-radius: 12px; border: 2px solid rgba(255, 255, 255, 0.3);">
                <p style="margin: 0 0 8px 0; font-size: 14px; color: #ffffff; opacity: 0.9; font-weight: 600;">
                  ${isFrench ? 'Votre code promo exclusif :' : 'Your exclusive promo code:'}
                </p>
                <p style="margin: 0; font-size: 24px; color: #ffffff; font-weight: 800; letter-spacing: 2px; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);">
                  ${promoCode}
                </p>
                <p style="margin: 8px 0 0 0; font-size: 12px; color: #ffffff; opacity: 0.8;">
                  ${isFrench ? 'Valable 90 jours - Utilisable une seule fois' : 'Valid for 90 days - One-time use'}
                </p>
              </div>
            </td>
          </tr>

          <!-- Ce que vous recevrez -->
          <tr>
            <td style="padding: 40px; background: #ffffff;">
              <h3 style="margin: 0 0 30px 0; font-size: 24px; font-weight: 700; color: #111827; text-align: center;">
                ${isFrench ? '📬 Ce que vous recevrez' : '📬 What You will Receive'}
              </h3>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                <div style="text-align: center; padding: 20px; background: #f9fafb; border-radius: 12px;">
                  <div style="font-size: 32px; margin-bottom: 12px;">🎯</div>
                  <p style="margin: 0; font-size: 15px; color: #111827; font-weight: 600;">
                    ${isFrench ? 'Offres exclusives' : 'Exclusive offers'}
                  </p>
                </div>
                <div style="text-align: center; padding: 20px; background: #f9fafb; border-radius: 12px;">
                  <div style="font-size: 32px; margin-bottom: 12px;">🆕</div>
                  <p style="margin: 0; font-size: 15px; color: #111827; font-weight: 600;">
                    ${isFrench ? 'Nouveautés en avant-première' : 'New releases first'}
                  </p>
                </div>
                <div style="text-align: center; padding: 20px; background: #f9fafb; border-radius: 12px;">
                  <div style="font-size: 32px; margin-bottom: 12px;">💡</div>
                  <p style="margin: 0; font-size: 15px; color: #111827; font-weight: 600;">
                    ${isFrench ? 'Conseils et inspirations' : 'Tips & inspiration'}
                  </p>
                </div>
                <div style="text-align: center; padding: 20px; background: #f9fafb; border-radius: 12px;">
                  <div style="font-size: 32px; margin-bottom: 12px;">🎨</div>
                  <p style="margin: 0; font-size: 15px; color: #111827; font-weight: 600;">
                    ${isFrench ? 'Tutoriels créatifs' : 'Creative tutorials'}
                  </p>
                </div>
              </div>
            </td>
          </tr>

          <!-- Message de remerciement -->
          <tr>
            <td style="padding: 50px 40px; background: linear-gradient(135deg, #fef3f2 0%, #f3e8ff 100%); text-align: center;">
              <p style="margin: 0 0 20px 0; font-size: 20px; color: #111827; line-height: 1.7; font-weight: 600;">
                ${isFrench 
                  ? `Merci ${firstName} de faire confiance à Missa Créations !` 
                  : `Thank you ${firstName} for trusting Missa Creations!`}
              </p>
              <p style="margin: 0; font-size: 16px; color: #6b7280; line-height: 1.7;">
                ${isFrench 
                  ? 'Nous sommes impatients de créer quelque chose de magnifique pour vous. Restez connecté pour des surprises exclusives !' 
                  : 'We look forward to creating something beautiful for you. Stay tuned for exclusive surprises!'}
              </p>
              <p style="margin: 30px 0 0 0; font-size: 16px; color: #111827; font-weight: 600;">
                ${isFrench ? 'Avec tout notre amour,' : 'With all our love,'}
              </p>
              <p style="margin: 8px 0 0 0; font-size: 20px; color: #ec4899; font-weight: 700;">
                L'équipe Missa Créations 💕
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 30px; text-align: center; background: #111827; color: #ffffff;">
              <p style="margin: 0 0 16px 0; font-size: 18px; font-weight: 600;">
                Missa Créations
              </p>
              <p style="margin: 0 0 20px 0; font-size: 14px; color: #9ca3af;">
                ${isFrench ? 'Créations artisanales en résine' : 'Handcrafted resin creations'}
              </p>
              <div style="margin: 20px 0;">
                <a href="https://facebook.com/missacreations" style="display: inline-block; margin: 0 8px; width: 40px; height: 40px; background: #ec4899; border-radius: 50%; line-height: 40px; text-align: center; color: #ffffff; text-decoration: none; font-weight: bold;">f</a>
                <a href="https://instagram.com/missacreations" style="display: inline-block; margin: 0 8px; width: 40px; height: 40px; background: #ec4899; border-radius: 50%; line-height: 40px; text-align: center; color: #ffffff; text-decoration: none; font-weight: bold;">i</a>
                <a href="https://tiktok.com/@missacreations" style="display: inline-block; margin: 0 8px; width: 40px; height: 40px; background: #ec4899; border-radius: 50%; line-height: 40px; text-align: center; color: #ffffff; text-decoration: none; font-weight: bold;">🎵</a>
              </div>
              <p style="margin: 20px 0 0 0; font-size: 12px; color: #6b7280;">
                ${isFrench 
                  ? 'Vous recevez cet email car vous vous êtes abonné à notre newsletter. Si vous souhaitez vous désabonner, <a href="#" style="color: #ec4899;">cliquez ici</a>.' 
                  : 'You are receiving this email because you subscribed to our newsletter. If you wish to unsubscribe, <a href="#" style="color: #ec4899;">click here</a>.'}
              </p>
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
    const { email, name, language = 'fr' } = body

    if (!email || !email.includes('@')) {
      return NextResponse.json({ 
        success: false, 
        error: 'Email invalide' 
      }, { status: 400 })
    }

    // Vérifier la configuration du service role key
    const hasServiceRoleKey = !!process.env.SUPABASE_SERVICE_ROLE_KEY
    console.log('🔑 Service Role Key configured:', hasServiceRoleKey)

    // Vérifier si l'email existe déjà
    const { data: existing, error: checkError } = await supabaseServer
      .from('newsletter_subscribers')
      .select('id, is_active')
      .eq('email', email.toLowerCase().trim())
      .maybeSingle()

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('❌ Error checking existing subscriber:', checkError)
      throw checkError
    }

    let subscriberId
    let isNewSubscriber = false

    if (existing) {
      if (existing.is_active) {
        return NextResponse.json({ 
          success: false, 
          error: 'Vous êtes déjà abonné à notre newsletter' 
        }, { status: 400 })
      } else {
        // Réactiver l'abonnement
        const { data: reactivated, error: reactivateError } = await supabaseServer
          .from('newsletter_subscribers')
          .update({ 
            is_active: true,
            name: name || existing.name,
            language: language,
            unsubscribed_at: null,
            updated_at: new Date().toISOString()
          })
          .eq('id', existing.id)
          .select()
          .single()

        if (reactivateError) throw reactivateError
        subscriberId = reactivated.id
      }
    } else {
      // Nouvel abonné
      console.log('📝 Attempting to insert new subscriber:', email.toLowerCase().trim())
      const { data: newSubscriber, error: insertError } = await supabaseServer
        .from('newsletter_subscribers')
        .insert({
          email: email.toLowerCase().trim(),
          name: name || null,
          language: language,
          is_active: true
        })
        .select()
        .single()

      if (insertError) {
        console.error('❌ Error inserting subscriber:', insertError)
        console.error('Error details:', {
          message: insertError.message,
          code: insertError.code,
          details: insertError.details,
          hint: insertError.hint
        })
        throw insertError
      }
      console.log('✅ Subscriber inserted successfully:', newSubscriber.id)
      subscriberId = newSubscriber.id
      isNewSubscriber = true
    }

    // Générer un code promo unique pour le nouvel abonné uniquement
    let promoCode = null
    if (isNewSubscriber && subscriberId) {
      let codeGenerated = false
      let attempts = 0
      const maxAttempts = 10
      
      while (!codeGenerated && attempts < maxAttempts) {
        promoCode = generatePromoCode(email)
        
        // Vérifier si le code existe déjà
        const { data: existingCode } = await supabaseServer
          .from('promo_codes')
          .select('code')
          .eq('code', promoCode)
          .maybeSingle()
        
        if (!existingCode) {
          codeGenerated = true
        } else {
          attempts++
          // Ajouter un caractère aléatoire si le code existe
          promoCode = generatePromoCode(email) + Math.random().toString(36).substring(2, 4).toUpperCase()
        }
      }
      
      if (promoCode) {
        // Créer le code promo dans la table promo_codes (pour utilisation)
        const expiresAt = new Date()
        expiresAt.setDate(expiresAt.getDate() + 90) // Valide 90 jours
        
        const { error: promoCodeError } = await supabaseServer
          .from('promo_codes')
          .insert({
            code: promoCode,
            type: 'percent',
            value: 10.00,
            is_active: true,
            expires_at: expiresAt.toISOString()
          })
        
        if (promoCodeError) {
          console.error('Error creating promo code:', promoCodeError)
        } else {
          // Lier le code promo à l'abonné
          await supabaseServer
            .from('subscriber_promo_codes')
            .insert({
              subscriber_id: subscriberId,
              promo_code: promoCode,
              type: 'percent',
              value: 10.00,
              is_active: true,
              expires_at: expiresAt.toISOString()
            })
        }
      }
    }

    // Email de bienvenue désactivé temporairement - Resend non configuré
    // TODO: Réactiver quand vous aurez un compte Resend
    console.log('📧 Email de bienvenue désactivé (Resend non configuré)')
    console.log('Nouvel abonné:', email, 'Code promo:', promoCode)
    
    // Générer le HTML pour référence (peut être utilisé plus tard)
    // const emailHtml = generateWelcomeEmail(name || 'Cher client', email, language, promoCode || 'BIENVENUE10')
    
    // L'email sera envoyé manuellement ou via un autre service plus tard

    return NextResponse.json({ 
      success: true, 
      message: isNewSubscriber 
        ? 'Abonnement réussi ! Vérifiez votre email pour votre message de bienvenue.' 
        : 'Abonnement réactivé ! Vérifiez votre email pour votre message de bienvenue.',
      subscriberId,
      promoCode: promoCode || null, // Retourner le code promo si généré
      isNewSubscriber: isNewSubscriber
    })
  } catch (error) {
    console.error('Newsletter subscription error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Erreur lors de l\'abonnement' 
    }, { status: 500 })
  }
}

