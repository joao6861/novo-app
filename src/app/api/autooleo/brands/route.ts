import { NextRequest, NextResponse } from 'next/server'

const AUTOOLEO_BASE_URL = 'https://autooleoapp.com.br'

/**
 * API Route: Buscar marcas no AutoOleo
 * GET /api/autooleo/brands
 */
export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Token não fornecido' },
        { status: 401 }
      )
    }

    // Busca página de seleção de marcas
    const response = await fetch(`${AUTOOLEO_BASE_URL}/app/buscar.html`, {
      headers: {
        'Cookie': `PHPSESSID=${token}`,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    })

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: 'Falha ao buscar marcas' },
        { status: 500 }
      )
    }

    const html = await response.text()

    // Parse do HTML para extrair marcas
    const brands = extractBrandsFromHTML(html)

    return NextResponse.json({
      success: true,
      brands,
    })
  } catch (error) {
    console.error('Erro ao buscar marcas:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao processar requisição' },
      { status: 500 }
    )
  }
}

function extractBrandsFromHTML(html: string): string[] {
  const brands: string[] = []
  
  // Regex para extrair marcas de select/option ou lista
  const optionRegex = /<option[^>]*value="([^"]+)"[^>]*>([^<]+)<\/option>/gi
  let match

  while ((match = optionRegex.exec(html)) !== null) {
    const brandName = match[2].trim()
    if (brandName && brandName !== 'Selecione' && !brands.includes(brandName)) {
      brands.push(brandName)
    }
  }

  return brands.sort()
}
