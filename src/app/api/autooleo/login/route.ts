import { NextRequest, NextResponse } from 'next/server'

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
    const body = await request.json().catch(() => ({}))
    const { email, password } = body

    console.log('[AutoOleo Login] Iniciando tentativa de login...')

    // Tenta fazer login no AutoOleo com múltiplas estratégias
    const loginResponse = await fetch(`${AUTOOLEO_BASE_URL}/app/login.html`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
        'Origin': AUTOOLEO_BASE_URL,
        'Referer': `${AUTOOLEO_BASE_URL}/app/login.html`,
      },
      body: new URLSearchParams({
        email: email || AUTOOLEO_CREDENTIALS.email,
        password: password || AUTOOLEO_CREDENTIALS.password,
      }),
      redirect: 'manual',
    })

    console.log('[AutoOleo Login] Status da resposta:', loginResponse.status)
    console.log('[AutoOleo Login] Headers:', Object.fromEntries(loginResponse.headers.entries()))

    // Verifica se houve redirecionamento (sucesso)
    if (loginResponse.status === 302 || loginResponse.status === 301) {
      const location = loginResponse.headers.get('location')
      console.log('[AutoOleo Login] Redirecionado para:', location)
      
      // Extrai cookies de sessão
      const cookies = loginResponse.headers.get('set-cookie')
      
      if (cookies) {
        const sessionMatch = cookies.match(/PHPSESSID=([^;]+)/)
        const token = sessionMatch ? sessionMatch[1] : null

        if (token) {
          console.log('[AutoOleo Login] ✓ Login bem-sucedido! Token obtido.')
          return NextResponse.json({
            success: true,
            token,
          })
        }
      }
    }

    // Se chegou aqui, tenta extrair cookies mesmo sem redirecionamento
    const cookies = loginResponse.headers.get('set-cookie')
    
    if (cookies) {
      const sessionMatch = cookies.match(/PHPSESSID=([^;]+)/)
      const token = sessionMatch ? sessionMatch[1] : null

      if (token) {
        console.log('[AutoOleo Login] ✓ Token obtido (sem redirecionamento)')
        return NextResponse.json({
          success: true,
          token,
        })
      }
    }

    // Se não conseguiu obter token, lê a resposta para diagnóstico
    const responseText = await loginResponse.text()
    console.error('[AutoOleo Login] Falha - Resposta do servidor:', responseText.substring(0, 300))

    // Verifica se há mensagem de erro específica no HTML
    if (responseText.includes('senha incorreta') || responseText.includes('usuário não encontrado')) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Credenciais inválidas',
          details: 'Email ou senha incorretos'
        },
        { status: 401 }
      )
    }

    // Erro genérico
    return NextResponse.json(
      { 
        success: false, 
        error: 'Não foi possível fazer login no AutoOleo',
        details: 'Servidor não retornou sessão válida. O serviço pode estar temporariamente indisponível.'
      },
      { status: 503 }
    )
  } catch (error) {
    console.error('[AutoOleo Login] Erro crítico:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro ao conectar com AutoOleo',
        details: error instanceof Error ? error.message : 'Erro de conexão desconhecido'
      },
      { status: 500 }
    )
  }
}
