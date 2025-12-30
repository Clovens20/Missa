// Script pour initialiser les pages légales avec le contenu actuel
// À exécuter une fois pour synchroniser le contenu des pages avec la base de données

const legalPagesContent = {
  faq: {
    title_fr: 'FAQ',
    title_en: 'FAQ',
    content_fr: `## Questions Fréquentes

**Adresse email :** support@missacreations.com

### Questions Fréquentes

**Q: Combien de temps prend la création d'un bijou personnalisé ?**
R: Chaque création est faite à la main avec soin. Comptez entre 5 à 10 jours ouvrables pour la fabrication, plus le délai de livraison.

**Q: Puis-je modifier ma commande après l'avoir passée ?**
R: Les modifications sont possibles dans les 24h suivant votre commande. Contactez-nous rapidement à support@missacreations.com.

**Q: Quels types d'images fonctionnent le mieux pour la personnalisation ?**
R: Les images de haute qualité (minimum 1000x1000 pixels) avec un bon éclairage donnent les meilleurs résultats. Les photos avec des visages nets ou des motifs clairs sont idéales.

**Q: Les bijoux en résine sont-ils résistants à l'eau ?**
R: Nos créations sont résistantes aux éclaboussures, mais nous recommandons de les retirer avant la douche, la baignade ou les activités aquatiques prolongées.

**Q: Proposez-vous des boîtes cadeaux ?**
R: Oui ! Chaque création est livrée dans un joli emballage cadeau. Des options premium sont disponibles lors de la commande.

💌 **Pour toute question :** support@missacreations.com
📞 **Temps de réponse :** Sous 24h (jours ouvrables)`,
    content_en: `## Frequently Asked Questions

**Email address:** support@missacreations.com

### Frequently Asked Questions

**Q: How long does it take to create a personalized jewelry?**
A: Each creation is handmade with care. Allow 5 to 10 business days for production, plus delivery time.

**Q: Can I modify my order after placing it?**
A: Modifications are possible within 24 hours of your order. Contact us quickly at support@missacreations.com.

**Q: What types of images work best for personalization?**
A: High-quality images (minimum 1000x1000 pixels) with good lighting give the best results. Photos with clear faces or patterns are ideal.

**Q: Are resin jewelry water resistant?**
A: Our creations are splash-resistant, but we recommend removing them before showering, swimming, or prolonged water activities.

**Q: Do you offer gift boxes?**
A: Yes! Each creation is delivered in a beautiful gift box. Premium options are available when ordering.

💌 **For any questions:** support@missacreations.com
📞 **Response time:** Under 24h (business days)`
  },
  livraison: {
    title_fr: 'Livraison',
    title_en: 'Delivery',
    content_fr: `## Livraison

**Adresse email :** support@missacreations.com

### Informations de Livraison

**Délais de livraison :**
- Canada : 3-5 jours ouvrables
- États-Unis : 5-7 jours ouvrables
- International : 10-15 jours ouvrables

**Frais de livraison :**
- Livraison gratuite pour toute commande de 75$ et plus au Canada
- Tarifs standards : 8,99$ (Canada) | 14,99$ (États-Unis)
- Livraison internationale : calculée selon la destination

**Suivi de commande :**
Vous recevrez un numéro de suivi par email dès l'expédition de votre colis. Suivez votre commande en temps réel.

**Problème avec votre livraison ?**
Contactez-nous à support@missacreations.com avec votre numéro de commande.

💌 **Pour toute question :** support@missacreations.com
📞 **Temps de réponse :** Sous 24h (jours ouvrables)`,
    content_en: `## Delivery

**Email address:** support@missacreations.com

### Delivery Information

**Delivery times:**
- Canada: 3-5 business days
- United States: 5-7 business days
- International: 10-15 business days

**Shipping costs:**
- Free shipping for orders of $75 and more in Canada
- Standard rates: $8.99 (Canada) | $14.99 (United States)
- International shipping: calculated by destination

**Order tracking:**
You will receive a tracking number by email as soon as your package is shipped. Track your order in real time.

**Problem with your delivery?**
Contact us at support@missacreations.com with your order number.

💌 **For any questions:** support@missacreations.com
📞 **Response time:** Under 24h (business days)`
  },
  retours: {
    title_fr: 'Retours',
    title_en: 'Returns',
    content_fr: `## Retours

**Adresse email :** support@missacreations.com

### Politique de Retours

**Délai de retour :** 30 jours
Vous disposez de 30 jours à compter de la réception pour retourner un article non personnalisé en parfait état.

**Articles personnalisés :**
Les créations sur mesure avec vos photos ou textes ne sont pas éligibles au retour, sauf en cas de défaut de fabrication.

**Comment effectuer un retour :**
1. Contactez-nous à support@missacreations.com avec votre numéro de commande
2. Indiquez la raison du retour
3. Nous vous enverrons une étiquette de retour prépayée
4. Emballez soigneusement l'article dans son emballage d'origine
5. Remboursement sous 5-7 jours après réception

**Articles éligibles au retour :**
- Article intact et non porté
- Emballage d'origine
- Étiquettes attachées (si applicable)

**Articles non retournables :**
- Créations personnalisées avec photo/texte
- Bijoux portés ou endommagés
- Articles soldés (sauf défaut)

💌 **Pour toute question :** support@missacreations.com
📞 **Temps de réponse :** Sous 24h (jours ouvrables)`,
    content_en: `## Returns

**Email address:** support@missacreations.com

### Return Policy

**Return period:** 30 days
You have 30 days from receipt to return a non-personalized item in perfect condition.

**Personalized items:**
Custom creations with your photos or texts are not eligible for return, except in case of manufacturing defect.

**How to make a return:**
1. Contact us at support@missacreations.com with your order number
2. Indicate the reason for return
3. We will send you a prepaid return label
4. Carefully pack the item in its original packaging
5. Refund within 5-7 days after receipt

**Items eligible for return:**
- Intact and unworn item
- Original packaging
- Tags attached (if applicable)

**Non-returnable items:**
- Personalized creations with photo/text
- Worn or damaged jewelry
- Sale items (except defects)

💌 **For any questions:** support@missacreations.com
📞 **Response time:** Under 24h (business days)`
  },
  garantie: {
    title_fr: 'Garantie',
    title_en: 'Warranty',
    content_fr: `## Garantie

**Adresse email :** support@missacreations.com

### Notre Garantie Qualité

**Garantie de 1 an**
Toutes nos créations sont garanties contre les défauts de fabrication pendant 1 an à compter de la date d'achat.

**Couverture de la garantie :**
- Défauts de résine (jaunissement, fissures)
- Problèmes de monture ou fermoirs
- Détachement de l'image ou du texte
- Défauts de finition

**Non couvert par la garantie :**
- Usure normale
- Dommages causés par mauvaise utilisation
- Exposition prolongée à l'eau ou produits chimiques
- Chocs ou chutes

**Comment faire une réclamation :**
1. Envoyez-nous un email à support@missacreations.com
2. Joignez des photos claires du défaut
3. Incluez votre numéro de commande
4. Nous évaluerons votre demande sous 48h

**Notre engagement :**
Si votre création présente un défaut couvert par la garantie, nous la remplacerons gratuitement ou vous rembourserons intégralement.

**Satisfaction garantie**
Votre bonheur est notre priorité. Si vous n'êtes pas 100% satisfait de votre création, contactez-nous pour trouver une solution.

💌 **Pour toute question :** support@missacreations.com
📞 **Temps de réponse :** Sous 24h (jours ouvrables)`,
    content_en: `## Warranty

**Email address:** support@missacreations.com

### Our Quality Guarantee

**1 Year Warranty**
All our creations are guaranteed against manufacturing defects for 1 year from the date of purchase.

**Warranty coverage:**
- Resin defects (yellowing, cracks)
- Mounting or clasp problems
- Detachment of image or text
- Finishing defects

**Not covered by warranty:**
- Normal wear
- Damage caused by misuse
- Prolonged exposure to water or chemicals
- Shocks or falls

**How to file a claim:**
1. Send us an email at support@missacreations.com
2. Attach clear photos of the defect
3. Include your order number
4. We will evaluate your request within 48h

**Our commitment:**
If your creation has a defect covered by the warranty, we will replace it free of charge or refund you in full.

**Satisfaction guaranteed**
Your happiness is our priority. If you are not 100% satisfied with your creation, contact us to find a solution.

💌 **For any questions:** support@missacreations.com
📞 **Response time:** Under 24h (business days)`
  }
}

// Cette fonction peut être appelée depuis l'interface admin pour initialiser les pages
export async function initializeLegalPages() {
  const pages = Object.keys(legalPagesContent)
  
  for (const slug of pages) {
    const pageData = legalPagesContent[slug]
    
    try {
      const res = await fetch('/api/admin/legal-pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          page_slug: slug,
          ...pageData
        })
      })
      
      const data = await res.json()
      if (data.success) {
        console.log(`✅ Page ${slug} initialisée`)
      } else {
        console.error(`❌ Erreur pour ${slug}:`, data.error)
      }
    } catch (error) {
      console.error(`❌ Erreur pour ${slug}:`, error)
    }
  }
}

