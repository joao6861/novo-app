import { NextRequest, NextResponse } from 'next/server'

const AUTOOLEO_BASE_URL = 'https://autooleoapp.com.br'

/**
 * API Route: Buscar modelos de uma marca no AutoOleo
 * GET /api/autooleo/models?brand=Toyota
 */
export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    const { searchParams } = new URL(request.url)
    const brand = searchParams.get('brand')

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Token não fornecido' },
        { status: 401 }
      )
    }

    if (!brand) {
      return NextResponse.json(
        { success: false, error: 'Marca não fornecida' },
        { status: 400 }
      )
    }

    // Busca modelos da marca
    const response = await fetch(
      `${AUTOOLEO_BASE_URL}/app/buscar.html?marca=${encodeURIComponent(brand)}`,
      {
        headers: {
          'Cookie': `PHPSESSID=${token}`,
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      }
    )

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: 'Falha ao buscar modelos' },
        { status: 500 }
      )
    }

    const html = await response.text()
    const models = extractModelsFromHTML(html)

    return NextResponse.json({
      success: true,
      models,
    })
  } catch (error) {
    console.error('Erro ao buscar modelos:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao processar requisição' },
      { status: 500 }
    )
  }
}

function extractModelsFromHTML(html: string): string[] {
  const models: string[] = []
  const optionRegex = /<option[^>]*value="([^"]+)"[^>]*>([^<]+)<\/option>/gi
  let match

  while ((match = optionRegex.exec(html)) !== null) {
    const modelName = match[2].trim()
    if (modelName && modelName !== 'Selecione' && !models.includes(modelName)) {
      models.push(modelName)
    }
  }

  return models.sort()
}
