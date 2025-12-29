import { MongoClient, ObjectId } from 'mongodb'
import { NextResponse } from 'next/server'

// MongoDB connection
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

// Initialize database with demo products
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

// Generate order number
function generateOrderNumber() {
  return 'MISSA-' + Date.now().toString().slice(-8)
}

// API Routes Handler
export async function GET(request) {
  const { pathname } = new URL(request.url)
  
  try {
    await connectDB()
    await initializeProducts()
    const database = await connectDB()
    
    // GET /api/products
    if (pathname === '/api/products') {
      const products = await database.collection('products').find({ isActive: true }).toArray()
      return NextResponse.json({ success: true, products })
    }
    
    // GET /api/products/:id
    if (pathname.match(/^\/api\/products\/[^/]+$/)) {
      const id = pathname.split('/').pop()
      const product = await database.collection('products').findOne({ _id: new ObjectId(id) })
      if (!product) {
        return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 })
      }
      return NextResponse.json({ success: true, product })
    }
    
    // GET /api/orders
    if (pathname === '/api/orders') {
      const orders = await database.collection('orders').find({}).sort({ createdAt: -1 }).toArray()
      return NextResponse.json({ success: true, orders })
    }
    
    // GET /api/orders/:id
    if (pathname.match(/^\/api\/orders\/[^/]+$/)) {
      const id = pathname.split('/').pop()
      const order = await database.collection('orders').findOne({ _id: new ObjectId(id) })
      if (!order) {
        return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 })
      }
      return NextResponse.json({ success: true, order })
    }
    
    // GET /api/admin/stats
    if (pathname === '/api/admin/stats') {
      const ordersCount = await database.collection('orders').countDocuments()
      const productsCount = await database.collection('products').countDocuments()
      
      const orders = await database.collection('orders').find({}).toArray()
      const revenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0)
      
      return NextResponse.json({ 
        success: true, 
        stats: { ordersCount, productsCount, revenue } 
      })
    }
    
    // GET /api/admin/employees
    if (pathname === '/api/admin/employees') {
      const employees = await database.collection('users').find({ role: 'employee' }).toArray()
      return NextResponse.json({ success: true, employees })
    }
    
    return NextResponse.json({ success: false, error: 'Route not found' }, { status: 404 })
    
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  const { pathname } = new URL(request.url)
  
  try {
    await connectDB()
    const database = await connectDB()
    const body = await request.json()
    
    // POST /api/products
    if (pathname === '/api/products') {
      const product = {
        ...body,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      const result = await database.collection('products').insertOne(product)
      return NextResponse.json({ success: true, productId: result.insertedId })
    }
    
    // POST /api/orders
    if (pathname === '/api/orders') {
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
    }
    
    // POST /api/admin/login
    if (pathname === '/api/admin/login') {
      const { email, password, employeeCode } = body
      
      let query = {}
      if (employeeCode) {
        query = { employeeCode, role: 'employee' }
      } else {
        query = { email, role: 'admin' }
      }
      
      const user = await database.collection('users').findOne(query)
      
      // TODO: Hash password comparison (bcrypt - to be integrated later)
      // For now, simple comparison for demo
      if (!user || (password && user.password !== password)) {
        return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 })
      }
      
      return NextResponse.json({ 
        success: true, 
        user: { id: user._id, email: user.email, role: user.role }
      })
    }
    
    // POST /api/admin/employees
    if (pathname === '/api/admin/employees') {
      const employeesCount = await database.collection('users').countDocuments({ role: 'employee' })
      const employeeCode = `MISSA-${String(employeesCount + 1).padStart(3, '0')}`
      
      const employee = {
        ...body,
        employeeCode,
        role: 'employee',
        isActive: true,
        createdAt: new Date()
      }
      
      const result = await database.collection('users').insertOne(employee)
      return NextResponse.json({ 
        success: true, 
        employeeId: result.insertedId,
        employeeCode
      })
    }
    
    return NextResponse.json({ success: false, error: 'Route not found' }, { status: 404 })
    
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function PUT(request) {
  const { pathname } = new URL(request.url)
  
  try {
    await connectDB()
    const database = await connectDB()
    const body = await request.json()
    
    // PUT /api/products/:id
    if (pathname.match(/^\/api\/products\/[^/]+$/)) {
      const id = pathname.split('/').pop()
      const update = {
        ...body,
        updatedAt: new Date()
      }
      delete update._id
      
      await database.collection('products').updateOne(
        { _id: new ObjectId(id) },
        { $set: update }
      )
      return NextResponse.json({ success: true })
    }
    
    // PUT /api/orders/:id
    if (pathname.match(/^\/api\/orders\/[^/]+$/)) {
      const id = pathname.split('/').pop()
      const update = {
        ...body,
        updatedAt: new Date()
      }
      delete update._id
      
      await database.collection('orders').updateOne(
        { _id: new ObjectId(id) },
        { $set: update }
      )
      return NextResponse.json({ success: true })
    }
    
    return NextResponse.json({ success: false, error: 'Route not found' }, { status: 404 })
    
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function DELETE(request) {
  const { pathname } = new URL(request.url)
  
  try {
    await connectDB()
    const database = await connectDB()
    
    // DELETE /api/products/:id
    if (pathname.match(/^\/api\/products\/[^/]+$/)) {
      const id = pathname.split('/').pop()
      await database.collection('products').deleteOne({ _id: new ObjectId(id) })
      return NextResponse.json({ success: true })
    }
    
    // DELETE /api/orders/:id
    if (pathname.match(/^\/api\/orders\/[^/]+$/)) {
      const id = pathname.split('/').pop()
      await database.collection('orders').deleteOne({ _id: new ObjectId(id) })
      return NextResponse.json({ success: true })
    }
    
    // DELETE /api/admin/employees/:id
    if (pathname.match(/^\/api\/admin\/employees\/[^/]+$/)) {
      const id = pathname.split('/').pop()
      await database.collection('users').deleteOne({ _id: new ObjectId(id) })
      return NextResponse.json({ success: true })
    }
    
    return NextResponse.json({ success: false, error: 'Route not found' }, { status: 404 })
    
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
