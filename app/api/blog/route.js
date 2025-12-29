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

// Initialize blog posts
async function initializeBlogPosts() {
  const database = await connectDB()
  const posts = database.collection('blog_posts')
  
  const count = await posts.countDocuments()
  if (count > 0) return
  
  const demoPosts = [
    {
      slug: 'comment-entretenir-bijoux-resine',
      title_fr: 'Comment entretenir vos bijoux en résine',
      title_en: 'How to care for your resin jewelry',
      excerpt_fr: 'Découvrez nos meilleurs conseils pour garder vos bijoux en résine aussi beaux qu\'au premier jour',
      excerpt_en: 'Discover our best tips to keep your resin jewelry as beautiful as day one',
      content_fr: 'Vos bijoux en résine sont de véritables œuvres d\'art. Pour les garder magnifiques, évitez l\'exposition prolongée au soleil, nettoyez-les délicatement avec un chiffon doux, et rangez-les dans un endroit sec.',
      content_en: 'Your resin jewelry are true works of art. To keep them beautiful, avoid prolonged sun exposure, clean them gently with a soft cloth, and store them in a dry place.',
      category: 'tutorials',
      image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=800',
      author: 'Missa',
      publishedAt: new Date('2024-12-01'),
      isActive: true
    },
    {
      slug: 'tendances-resine-2024',
      title_fr: 'Tendances résine 2024',
      title_en: 'Resin trends 2024',
      excerpt_fr: 'Les couleurs et styles qui font sensation cette année dans le monde de la résine',
      excerpt_en: 'The colors and styles making waves this year in the resin world',
      content_fr: 'Cette année, les demi-teintes pastel et les inclusions florales dominent les tendances. Les clients adorent les pièces personnalisées avec leurs propres fleurs séchées.',
      content_en: 'This year, pastel halftones and floral inclusions dominate the trends. Customers love personalized pieces with their own dried flowers.',
      category: 'inspiration',
      image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=800',
      author: 'Missa',
      publishedAt: new Date('2024-11-15'),
      isActive: true
    },
    {
      slug: 'nouvelle-collection-ocean',
      title_fr: 'Nouvelle collection Océan',
      title_en: 'New Ocean collection',
      excerpt_fr: 'Découvrez notre toute nouvelle collection inspirée des profondeurs marines',
      excerpt_en: 'Discover our brand new collection inspired by the ocean depths',
      content_fr: 'Plongé dans les teintes de bleu turquoise et d\'argent, cette collection capture l\'essence de l\'océan. Chaque pièce est unique.',
      content_en: 'Immersed in shades of turquoise blue and silver, this collection captures the essence of the ocean. Each piece is unique.',
      category: 'news',
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
      author: 'Missa',
      publishedAt: new Date('2024-12-10'),
      isActive: true
    }
  ]
  
  await posts.insertMany(demoPosts)
  console.log('✅ Demo blog posts initialized')
}

export async function GET() {
  try {
    await connectDB()
    await initializeBlogPosts()
    const database = await connectDB()
    
    const posts = await database.collection('blog_posts')
      .find({ isActive: true })
      .sort({ publishedAt: -1 })
      .toArray()
    
    return NextResponse.json({ success: true, posts })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const database = await connectDB()
    const body = await request.json()
    
    const post = {
      ...body,
      publishedAt: new Date(),
      isActive: true
    }
    
    const result = await database.collection('blog_posts').insertOne(post)
    return NextResponse.json({ success: true, postId: result.insertedId })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
