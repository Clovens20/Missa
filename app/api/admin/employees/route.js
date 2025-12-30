import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'

async function generateEmployeeCode() {
  // Récupérer le dernier code pour générer le suivant
  const { data: lastEmployee } = await supabaseServer
    .from('employees')
    .select('code')
    .order('created_at', { ascending: false })
    .limit(1)
    .single()
  
  let nextNumber = 1
  if (lastEmployee && lastEmployee.code) {
    // Extraire le numéro du dernier code (MISSA-XXXX)
    const match = lastEmployee.code.match(/MISSA-(\d+)/)
    if (match) {
      nextNumber = parseInt(match[1]) + 1
    }
  }
  
  // Formater avec 4 chiffres (MISSA-0001, MISSA-0002, etc.)
  return `MISSA-${nextNumber.toString().padStart(4, '0')}`
}

export async function GET() {
  try {
    const { data: employees, error } = await supabaseServer
      .from('employees')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    
    return NextResponse.json({ success: true, employees })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    
    const employeeCode = await generateEmployeeCode()
    
    const employeeData = {
      name: body.name || '',
      email: body.email || '',
      code: employeeCode,
      is_active: true
    }
    
    const { data, error } = await supabaseServer
      .from('employees')
      .insert(employeeData)
      .select()
      .single()
    
    if (error) throw error
    
    return NextResponse.json({ 
      success: true, 
      employeeId: data.id,
      employeeCode: employeeCode
    })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
