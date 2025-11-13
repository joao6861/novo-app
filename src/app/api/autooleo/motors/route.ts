import { NextRequest, NextResponse } from 'next/server'

const AUTOOLEO_BASE_URL = 'https://autooleoapp.com.br'

/**
 * API Route: Buscar motores de um veículo no AutoOleo
 * GET /api/autooleo/motors?brand=Toyota&model=Corolla&year=2020
 */
export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    const { searchParams } = new URL(request.url)
    const brand = searchParams.get('brand')
    const model = searchParams.get('model')
    const year = searchParams.get('year')

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Token não fornecido' },
        { status: 401 }
      )
    }

    if (!brand || !model || !year) {
      return NextResponse.json(
        { success: false, error: 'Marca, modelo e ano são obrigatórios' },
        { status: 400 }
      )
    }

    const response = await fetch(
      `${AUTOOLEO_BASE_URL}/app/buscar.html?marca=${encodeURIComponent(brand)}&modelo=${encodeURIComponent(model)}&ano=${encodeURIComponent(year)}`,
      {
        headers: {
          'Cookie': `PHPSESSID=${token}`,
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      }
    )

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: 'Falha ao buscar motores' },
        { status: 500 }
      )
    }

    const html = await response.text()
    const motors = extractMotorsFromHTML(html)

    return NextResponse.json({
      success: true,
      motors,
    })
  } catch (error) {
    console.error('Erro ao buscar motores:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao processar requisição' },
      { status: 500 }
    )
  }
}

function extractMotorsFromHTML(html: string): string[] {
  const motors: string[] = []
  const optionRegex = /<option[^>]*value="([^"]+)"[^>]*>([^<]+)<\/option>/gi
  let match

  while ((match = optionRegex.exec(html)) !== null) {
    const motor = match[2].trim()
    if (motor && motor !== 'Selecione' && !motors.includes(motor)) {
      motors.push(motor)
    }
  }

  return motors.sort()
}
