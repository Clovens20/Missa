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
      name_fr: 'Cœurs Entrelacés Fleurs Séchées',
      name_en: 'Intertwined Hearts with Dried Flowers',
      description_fr: 'Décoration romantique en résine avec cœurs entrelacés et fleurs séchées rouges, base corail',
      description_en: 'Romantic resin decoration with intertwined hearts and red dried flowers, coral base',
      category: 'decoration',
      price: 55,
      promoPrice: null,
      weight: 300,
      stock: 8,
      minStock: 2,
      isCustomizable: true,
      isActive: true,
      images: ['https://customer-assets.emergentagent.com/job_handmade-resin-1/artifacts/lu1ibz6r_1000404735.jpg']
    },
    {
      name_fr: 'Duo de Cœurs Roses et Fleurs',
      name_en: 'Pink Hearts Duo with Flowers',
      description_fr: 'Sculpture décorative en résine avec deux cœurs roses marbrés et fleurs rouges',
      description_en: 'Decorative resin sculpture with two pink marbled hearts and red flowers',
      category: 'decoration',
      price: 52,
      promoPrice: null,
      weight: 280,
      stock: 10,
      minStock: 2,
      isCustomizable: true,
      isActive: true,
      images: ['https://customer-assets.emergentagent.com/job_handmade-resin-1/artifacts/pr0nimwc_1000404736.jpg']
    },
    {
      name_fr: 'Moule Étoiles et Lunes',
      name_en: 'Stars and Moons Mold',
      description_fr: 'Moule en silicone pour créations en résine - étoiles et croissants de lune',
      description_en: 'Silicone mold for resin creations - stars and crescent moons',
      category: 'accessoires',
      price: 28,
      promoPrice: null,
      weight: 150,
      stock: 20,
      minStock: 5,
      isCustomizable: false,
      isActive: true,
      images: ['https://customer-assets.emergentagent.com/job_handmade-resin-1/artifacts/7e2y39r7_1000404737.jpg']
    },
    {
      name_fr: 'Pendentif Lune Dorée',
      name_en: 'Golden Moon Pendant',
      description_fr: 'Pendentif croissant de lune en résine bicolore blanc et or pailleté',
      description_en: 'Crescent moon pendant in bicolor resin - white and gold glitter',
      category: 'bijoux',
      price: 35,
      promoPrice: null,
      weight: 15,
      stock: 25,
      minStock: 5,
      isCustomizable: true,
      isActive: true,
      images: ['https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600']
    },
    {
      name_fr: 'Boucles d\'oreilles Étoiles',
      name_en: 'Star Earrings',
      description_fr: 'Élégantes boucles d\'oreilles étoiles en résine nacrée',
      description_en: 'Elegant star earrings in pearlescent resin',
      category: 'bijoux',
      price: 32,
      promoPrice: null,
      weight: 10,
      stock: 30,
      minStock: 8,
      isCustomizable: true,
      isActive: true,
      images: ['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600']
    },
    {
      name_fr: 'Porte-clés Cœur Floral',
      name_en: 'Floral Heart Keychain',
      description_fr: 'Porte-clés cœur en résine avec fleurs séchées encapsulées',
      description_en: 'Heart keychain in resin with encapsulated dried flowers',
      category: 'cadeaux',
      price: 22,
      promoPrice: null,
      weight: 25,
      stock: 40,
      minStock: 10,
      isCustomizable: true,
      isActive: true,
      images: ['https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?w=600']
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
