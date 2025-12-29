import { MongoClient } from 'mongodb'
import { NextResponse } from 'next/server'

let client
let db

async function connectDB() {
  if (db) return db
  
  try {
    client = new MongoClient(process.env.MONGO_URL)
    await client.connect()
    db = client.db('missa_creations')
    console.log('✅ Connected to MongoDB')
    return db
  } catch (error) {
    console.error('❌ MongoDB connection error:', error)
    throw error
  }
}

async function initializeProducts() {
  const database = await connectDB()
  const products = database.collection('products')
  
  const count = await products.countDocuments()
  if (count > 0) return
  
  const demoProducts = [
    {
      name_fr: 'Collier Fleur Résine',
      name_en: 'Resin Flower Necklace',
      description_fr: 'Magnifique collier avec fleur préservée dans la résine époxy',
      description_en: 'Beautiful necklace with preserved flower in epoxy resin',
      category: 'bijoux',
      price: 45,
      promoPrice: null,
      weight: 50,
      stock: 15,
      minStock: 3,
      isCustomizable: true,
      isActive: true,
      images: ['https://images.unsplash.com/photo-1704289709073-1aee032040fa?w=600']
    },
    {
      name_fr: 'Porte-clés Personnalisé',
      name_en: 'Custom Keychain',
      description_fr: 'Porte-clés unique en résine, personnalisable avec texte et images',
      description_en: 'Unique resin keychain, customizable with text and images',
      category: 'cadeaux',
      price: 25,
      promoPrice: null,
      weight: 30,
      stock: 25,
      minStock: 5,
      isCustomizable: true,
      isActive: true,
      images: ['https://images.pexels.com/photos/1194034/pexels-photo-1194034.jpeg?w=600']
    },
    {
      name_fr: 'Plateau Déco Résine',
      name_en: 'Resin Decorative Tray',
      description_fr: 'Plateau décoratif en résine aux couleurs vives et modernes',
      description_en: 'Decorative resin tray with vibrant modern colors',
      category: 'decoration',
      price: 65,
      promoPrice: null,
      weight: 400,
      stock: 8,
      minStock: 2,
      isCustomizable: true,
      isActive: true,
      images: ['https://images.pexels.com/photos/6074969/pexels-photo-6074969.jpeg?w=600']
    },
    {
      name_fr: 'Boucles d\'oreilles Océan',
      name_en: 'Ocean Earrings',
      description_fr: 'Élégantes boucles d\'oreilles inspirées de l\'océan',
      description_en: 'Elegant ocean-inspired earrings',
      category: 'bijoux',
      price: 35,
      promoPrice: null,
      weight: 20,
      stock: 20,
      minStock: 5,
      isCustomizable: true,
      isActive: true,
      images: ['https://images.unsplash.com/photo-1708221235473-69e1500dd3bc?w=600']
    },
    {
      name_fr: 'Dessous de verre Set',
      name_en: 'Coaster Set',
      description_fr: 'Set de 4 dessous de verre en résine aux détails dorés',
      description_en: 'Set of 4 resin coasters with gold details',
      category: 'decoration',
      price: 40,
      promoPrice: null,
      weight: 200,
      stock: 12,
      minStock: 3,
      isCustomizable: true,
      isActive: true,
      images: ['https://images.pexels.com/photos/7256634/pexels-photo-7256634.jpeg?w=600']
    },
    {
      name_fr: 'Bracelet Personnalisé',
      name_en: 'Custom Bracelet',
      description_fr: 'Bracelet élégant en résine, entièrement personnalisable',
      description_en: 'Elegant resin bracelet, fully customizable',
      category: 'bijoux',
      price: 38,
      promoPrice: null,
      weight: 40,
      stock: 18,
      minStock: 4,
      isCustomizable: true,
      isActive: true,
      images: ['https://images.unsplash.com/photo-1597006354775-2955b15ec026?w=600']
    }
  ]
  
  await products.insertMany(demoProducts)
  console.log('✅ Demo products initialized')
}

export async function GET() {
  try {
    await connectDB()
    await initializeProducts()
    const database = await connectDB()
    
    const products = await database.collection('products').find({ isActive: true }).toArray()
    return NextResponse.json({ success: true, products })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    await connectDB()
    const database = await connectDB()
    const body = await request.json()
    
    const product = {
      ...body,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    const result = await database.collection('products').insertOne(product)
    return NextResponse.json({ success: true, productId: result.insertedId })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
