import { NextRequest, NextResponse } from 'next/server'
import * as cheerio from 'cheerio'

const AUTOOLEO_BASE_URL = 'https://autooleoapp.com.br'
const AUTOOLEO_CREDENTIALS = {
  email: 'contatoaldoscenter@gmail.com',
  password: '12345',
}

/**
 * API Route: Login no AutoOleo
 * POST /api/autooleo/login
 */
export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Faz login no AutoOleo
    const loginResponse = await fetch(`${AUTOOLEO_BASE_URL}/app/login.html`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      body: new URLSearchParams({
        email: email || AUTOOLEO_CREDENTIALS.email,
        password: password || AUTOOLEO_CREDENTIALS.password,
      }),
      redirect: 'manual',
    })

    // Extrai cookies de sessão
    const cookies = loginResponse.headers.get('set-cookie')
    
    if (!cookies) {
      return NextResponse.json(
        { success: false, error: 'Falha no login' },
        { status: 401 }
      )
    }

    // Extrai token/session ID dos cookies
    const sessionMatch = cookies.match(/PHPSESSID=([^;]+)/)
    const token = sessionMatch ? sessionMatch[1] : null

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Token não encontrado' },
        { status: 401 }
      )
    }

    return NextResponse.json({
      success: true,
      token,
    })
  } catch (error) {
    console.error('Erro ao fazer login no AutoOleo:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao processar login' },
      { status: 500 }
    )
  }
}
