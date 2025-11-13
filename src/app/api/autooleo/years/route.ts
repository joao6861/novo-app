import { NextRequest, NextResponse } from 'next/server'

const AUTOOLEO_BASE_URL = 'https://autooleoapp.com.br'

/**
 * API Route: Buscar anos de um modelo no AutoOleo
 * GET /api/autooleo/years?brand=Toyota&model=Corolla
 */
export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    const { searchParams } = new URL(request.url)
    const brand = searchParams.get('brand')
    const model = searchParams.get('model')

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Token não fornecido' },
        { status: 401 }
      )
    }

    if (!brand || !model) {
      return NextResponse.json(
        { success: false, error: 'Marca e modelo são obrigatórios' },
        { status: 400 }
      )
    }

    const response = await fetch(
      `${AUTOOLEO_BASE_URL}/app/buscar.html?marca=${encodeURIComponent(brand)}&modelo=${encodeURIComponent(model)}`,
      {
        headers: {
          'Cookie': `PHPSESSID=${token}`,
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      }
    )

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: 'Falha ao buscar anos' },
        { status: 500 }
      )
    }

    const html = await response.text()
    const years = extractYearsFromHTML(html)

    return NextResponse.json({
      success: true,
      years,
    })
  } catch (error) {
    console.error('Erro ao buscar anos:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao processar requisição' },
      { status: 500 }
    )
  }
}

function extractYearsFromHTML(html: string): string[] {
  const years: string[] = []
  const optionRegex = /<option[^>]*value="([^"]+)"[^>]*>([^<]+)<\/option>/gi
  let match

  while ((match = optionRegex.exec(html)) !== null) {
    const year = match[2].trim()
    if (year && /^\d{4}$/.test(year) && !years.includes(year)) {
      years.push(year)
    }
  }

  return years.sort((a, b) => parseInt(b) - parseInt(a))
}
