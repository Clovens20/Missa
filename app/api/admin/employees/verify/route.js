import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'

export async function POST(request) {
  try {
    const { code } = await request.json()
    
    if (!code) {
      return NextResponse.json({ success: false, error: 'Code requis' }, { status: 400 })
    }
    
    // Normaliser le code (majuscules et trim)
    let codeUpper = code.toUpperCase().trim()
    
    if (!codeUpper.startsWith('MISSA-')) {
      return NextResponse.json({ success: false, error: 'Format de code invalide. Format attendu: MISSA-XXXX' }, { status: 400 })
    }
    
    // Normaliser le format du code (MISSA-001 -> MISSA-0001)
    const codeMatch = codeUpper.match(/MISSA-(\d+)/)
    if (codeMatch) {
      const number = parseInt(codeMatch[1])
      codeUpper = `MISSA-${number.toString().padStart(4, '0')}`
    }
    
    // Vérifier si le code existe dans la base de données
    console.log('Recherche du code:', codeUpper)
    
    const { data: employee, error } = await supabaseServer
      .from('employees')
      .select('id, name, code, is_active')
      .eq('code', codeUpper)
      .maybeSingle()
    
    // Si erreur autre que "pas de résultat trouvé"
    if (error && error.code !== 'PGRST116') {
      console.error('Supabase error:', error)
      return NextResponse.json({ success: false, error: 'Erreur lors de la vérification' }, { status: 500 })
    }
    
    // Si aucun employé trouvé
    if (!employee) {
      // Log pour debug - vérifier tous les codes existants
      const { data: allEmployees } = await supabaseServer
        .from('employees')
        .select('code')
        .limit(10)
      console.log('Codes existants dans la base:', allEmployees?.map(e => e.code))
      console.log('Code recherché (normalisé):', codeUpper)
      
      return NextResponse.json({ success: false, error: 'Code employé introuvable' }, { status: 404 })
    }
    
    if (!employee.is_active) {
      return NextResponse.json({ success: false, error: 'Ce compte employé est désactivé' }, { status: 403 })
    }
    
    return NextResponse.json({ 
      success: true, 
      employee: {
        id: employee.id,
        name: employee.name,
        code: employee.code
      }
    })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

