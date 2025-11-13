import { NextResponse } from 'next/server'

const AUTOOLEO_CREDENTIALS = {
  email: 'contatoaldoscenter@gmail.com',
  password: '12345'
}

/**
 * API Route: Buscar todas as marcas do AutoOleo
 * GET /api/brands
 */
export async function GET() {
  try {
    // 1. Fazer login no AutoOleo
    const loginResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/autooleo/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(AUTOOLEO_CREDENTIALS),
    })

    if (!loginResponse.ok) {
      throw new Error('Falha no login do AutoOleo')
    }

    const loginData = await loginResponse.json()
    const token = loginData.token

    if (!token) {
      throw new Error('Token não recebido')
    }

    // 2. Buscar marcas
    const brandsResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/autooleo/brands`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })

    if (!brandsResponse.ok) {
      throw new Error('Falha ao buscar marcas')
    }

    const brandsData = await brandsResponse.json()

    return NextResponse.json({
      success: true,
      brands: brandsData.brands || [],
      total: brandsData.brands?.length || 0,
    })
  } catch (error) {
    console.error('Erro ao buscar marcas:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro ao buscar marcas',
        brands: [],
        total: 0
      },
      { status: 500 }
    )
  }
}
