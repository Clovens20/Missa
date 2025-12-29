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
    return db
  } catch (error) {
    console.error('❌ MongoDB connection error:', error)
    throw error
  }
}

// Initialize promo codes
async function initializePromoCodes() {
  const database = await connectDB()
  const codes = database.collection('promo_codes')
  
  const count = await codes.countDocuments()
  if (count > 0) return
  
  const demoCodes = [
    {
      code: 'MISSA10',
      type: 'percent',
      value: 10,
      isActive: true,
      expiresAt: new Date('2025-12-31')
    },
    {
      code: 'WELCOME',
      type: 'percent',
      value: 15,
      isActive: true,
      expiresAt: new Date('2025-12-31')
    },
    {
      code: 'SAVE20',
      type: 'fixed',
      value: 20,
      isActive: true,
      expiresAt: new Date('2025-12-31')
    }
  ]
  
  await codes.insertMany(demoCodes)
  console.log('✅ Demo promo codes initialized')
}

export async function GET() {
  try {
    await connectDB()
    await initializePromoCodes()
    const database = await connectDB()
    
    const codes = await database.collection('promo_codes').find({ isActive: true }).toArray()
    return NextResponse.json({ success: true, codes })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const database = await connectDB()
    await initializePromoCodes()
    const { code } = await request.json()
    
    const promoCode = await database.collection('promo_codes').findOne({ 
      code: code.toUpperCase(),
      isActive: true,
      expiresAt: { $gt: new Date() }
    })
    
    if (!promoCode) {
      return NextResponse.json({ success: false, error: 'Invalid or expired code' }, { status: 404 })
    }
    
    return NextResponse.json({ 
      success: true, 
      promo: {
        code: promoCode.code,
        type: promoCode.type,
        value: promoCode.value
      }
    })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
