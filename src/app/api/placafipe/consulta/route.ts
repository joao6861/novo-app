import { NextRequest, NextResponse } from 'next/server'

/**
 * API Route: Consulta de placa via PlacaFIPE
 * POST /api/placafipe/consulta
 */
export async function POST(request: NextRequest) {
  try {
    const { placa } = await request.json()

    if (!placa) {
      return NextResponse.json(
        { success: false, error: 'Placa não fornecida' },
        { status: 400 }
      )
    }

    // Consulta o site PlacaFIPE
    const response = await fetch('https://placafipe.com/api/consulta', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      body: JSON.stringify({ placa: placa.toUpperCase() }),
    })

    if (!response.ok) {
      // Se a API oficial falhar, tenta scraping alternativo
      const scrapedData = await scrapePlacaFipe(placa)
      
      if (scrapedData) {
        return NextResponse.json({
          success: true,
          vehicle: scrapedData,
        })
      }

      return NextResponse.json(
        { success: false, error: 'Placa não encontrada' },
        { status: 404 }
      )
    }

    const data = await response.json()

    return NextResponse.json({
      success: true,
      vehicle: {
        placa: data.placa || placa,
        marca: data.marca || 'N/A',
        modelo: data.modelo || 'N/A',
        ano: data.ano || 'N/A',
        anoModelo: data.anoModelo || data.ano,
        cor: data.cor || 'N/A',
        municipio: data.municipio || 'N/A',
        uf: data.uf || 'N/A',
        chassi: data.chassi || 'N/A',
        motor: data.motor || 'N/A',
        combustivel: data.combustivel || 'N/A',
        categoria: data.categoria || 'N/A',
        situacao: data.situacao || 'N/A',
        restricoes: data.restricoes || [],
      },
    })
  } catch (error) {
    console.error('Erro ao consultar PlacaFIPE:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao processar consulta' },
      { status: 500 }
    )
  }
}

/**
 * Scraping alternativo do PlacaFIPE (caso API oficial falhe)
 */
async function scrapePlacaFipe(placa: string) {
  try {
    const response = await fetch(`https://placafipe.com/placa/${placa.toUpperCase()}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    })

    if (!response.ok) {
      return null
    }

    const html = await response.text()

    // Parse básico do HTML (você pode melhorar isso com cheerio ou similar)
    const extractData = (pattern: RegExp) => {
      const match = html.match(pattern)
      return match ? match[1].trim() : 'N/A'
    }

    return {
      placa: placa.toUpperCase(),
      marca: extractData(/Marca:<\/strong>\s*([^<]+)/i),
      modelo: extractData(/Modelo:<\/strong>\s*([^<]+)/i),
      ano: extractData(/Ano:<\/strong>\s*([^<]+)/i),
      cor: extractData(/Cor:<\/strong>\s*([^<]+)/i),
      municipio: extractData(/Município:<\/strong>\s*([^<]+)/i),
      uf: extractData(/UF:<\/strong>\s*([^<]+)/i),
    }
  } catch (error) {
    console.error('Erro no scraping:', error)
    return null
  }
}
