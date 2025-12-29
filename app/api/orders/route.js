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

function generateOrderNumber() {
  return 'MISSA-' + Date.now().toString().slice(-8)
}

export async function GET() {
  try {
    const database = await connectDB()
    const orders = await database.collection('orders').find({}).sort({ createdAt: -1 }).toArray()
    return NextResponse.json({ success: true, orders })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const database = await connectDB()
    const body = await request.json()
    
    const order = {
      ...body,
      orderNumber: generateOrderNumber(),
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    const result = await database.collection('orders').insertOne(order)
    
    // TODO: Send email confirmation via Resend (to be integrated later)
    
    return NextResponse.json({ 
      success: true, 
      orderId: result.insertedId,
      orderNumber: order.orderNumber
    })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
