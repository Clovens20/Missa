import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'
import bcrypt from 'bcryptjs'

// Route de test pour vérifier que l'API est accessible
export async function GET() {
  return NextResponse.json({ 
    success: true, 
    message: 'API /api/admin/verify est accessible',
    timestamp: new Date().toISOString()
  })
}

export async function POST(request) {
  try {
    console.log('🔍 API /api/admin/verify appelée')
    
    const { email, password } = await request.json()
    
    console.log('📧 Email reçu:', email)
    
    if (!email || !password) {
      console.log('❌ Email ou mot de passe manquant')
      return NextResponse.json({ 
        success: false,
        error: 'Email et mot de passe requis' 
      }, { status: 400 })
    }
    
    const normalizedEmail = email.toLowerCase().trim()
    
    console.log('✅ Recherche de l\'employé par email:', normalizedEmail)
    
    // D'abord, lister tous les emails pour debug
    const { data: allEmployees } = await supabaseServer
      .from('employees')
      .select('id, email, role')
      .limit(10)
    
    console.log('📋 Tous les employés trouvés:', allEmployees?.map(e => ({ email: e.email, role: e.role })))
    
    // Chercher l'employé par email et vérifier le rôle admin
    // Utiliser ilike pour une recherche case-insensitive
    const { data: employee, error } = await supabaseServer
      .from('employees')
      .select('id, name, email, code, password, is_active, role')
      .ilike('email', normalizedEmail)
      .maybeSingle()
    
    console.log('📊 DB:', { 
      found: !!employee, 
      employeeEmail: employee?.email,
      employeeRole: employee?.role,
      hasPassword: !!employee?.password,
      isActive: employee?.is_active,
      error: error?.message 
    })
    
    if (error && error.code !== 'PGRST116') {
      console.error('❌ Erreur Supabase:', error)
      return NextResponse.json({ 
        success: false,
        error: 'Erreur de vérification' 
      }, { status: 500 })
    }
    
    if (!employee) {
      console.log('❌ Employé introuvable en DB avec cet email')
      return NextResponse.json({ 
        success: false,
        error: 'Compte admin introuvable' 
      }, { status: 404 })
    }
    
    console.log('👤 Employé trouvé:', employee.name, '| Email:', employee.email, '| Rôle:', employee.role, '| Actif:', employee.is_active)
    
    // Vérifier que c'est un admin (colonne role = 'admin')
    if (employee.role !== 'admin') {
      console.log('❌ Compte n\'est pas admin, rôle:', employee.role)
      return NextResponse.json({ 
        success: false,
        error: 'Accès admin requis' 
      }, { status: 403 })
    }
    
    if (!employee.is_active) {
      console.log('❌ Compte désactivé')
      return NextResponse.json({ 
        success: false,
        error: 'Compte désactivé' 
      }, { status: 403 })
    }
    
    if (!employee.password) {
      console.log('❌ Aucun mot de passe en DB')
      return NextResponse.json({ 
        success: false,
        error: 'Mot de passe non configuré' 
      }, { status: 500 })
    }
    
    console.log('🔐 Vérification mot de passe avec bcrypt...')
    const isValid = await bcrypt.compare(password, employee.password)
    
    console.log('🔑 Résultat bcrypt:', isValid ? '✅ VALIDE' : '❌ INVALIDE')
    
    if (!isValid) {
      console.log('❌ Mot de passe incorrect')
      return NextResponse.json({ 
        success: false,
        error: 'Mot de passe incorrect' 
      }, { status: 401 })
    }
    
    console.log('🎉🎉🎉 CONNEXION RÉUSSIE 🎉🎉🎉')
    
    return NextResponse.json({ 
      success: true,
      isAdmin: true,
      admin: {
        id: employee.id,
        name: employee.name || 'Admin',
        email: employee.email
      }
    })
    
  } catch (error) {
    console.error('💥 ERREUR CRITIQUE:', error)
    return NextResponse.json({ 
      success: false,
      error: 'Erreur serveur: ' + error.message
    }, { status: 500 })
  }
}