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

    console.log(`[PlacaFIPE API] Consultando placa: ${placa}`)

    // Tenta múltiplas estratégias de consulta
    let vehicleData = null
    let lastError = null

    // Estratégia 1: Brasil API (mais confiável e gratuita)
    try {
      console.log('[PlacaFIPE API] Tentando Brasil API...')
      vehicleData = await consultarBrasilAPI(placa)
      if (vehicleData) {
        console.log('[PlacaFIPE API] ✓ Dados obtidos via Brasil API')
        return NextResponse.json({
          success: true,
          vehicle: vehicleData,
          source: 'brasilapi'
        })
      }
    } catch (error) {
      lastError = error instanceof Error ? error.message : 'Erro desconhecido'
      console.log('[PlacaFIPE API] Brasil API não retornou dados')
    }

    // Estratégia 2: API oficial PlacaFIPE
    try {
      console.log('[PlacaFIPE API] Tentando API oficial...')
      vehicleData = await consultarAPIOficial(placa)
      if (vehicleData) {
        console.log('[PlacaFIPE API] ✓ Dados obtidos via API oficial')
        return NextResponse.json({
          success: true,
          vehicle: vehicleData,
          source: 'api'
        })
      }
    } catch (error) {
      lastError = error instanceof Error ? error.message : 'Erro desconhecido'
      console.log('[PlacaFIPE API] API oficial não retornou dados')
    }

    // Estratégia 3: Scraping do site
    try {
      console.log('[PlacaFIPE API] Tentando scraping...')
      vehicleData = await scrapePlacaFipe(placa)
      if (vehicleData) {
        console.log('[PlacaFIPE API] ✓ Dados obtidos via scraping')
        return NextResponse.json({
          success: true,
          vehicle: vehicleData,
          source: 'scraping'
        })
      }
    } catch (error) {
      lastError = error instanceof Error ? error.message : 'Erro desconhecido'
      console.log('[PlacaFIPE API] Scraping não retornou dados')
    }

    // Se todas as estratégias falharam
    console.log('[PlacaFIPE API] Nenhuma fonte retornou dados para a placa:', placa)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Placa não encontrada. Verifique se digitou corretamente.',
        details: 'Nenhuma fonte de dados disponível retornou informações para esta placa'
      },
      { status: 404 }
    )
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
    console.error('[PlacaFIPE API] Erro crítico ao processar consulta:', errorMessage)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro ao processar consulta. Tente novamente.',
        details: errorMessage
      },
      { status: 500 }
    )
  }
}

/**
 * Consulta Brasil API - Prioridade 1 (gratuita e confiável)
 */
async function consultarBrasilAPI(placa: string) {
  try {
    const response = await fetch(`https://brasilapi.com.br/api/vehicles/${placa.toUpperCase()}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      signal: AbortSignal.timeout(10000), // 10s timeout
    })

    if (!response.ok) {
      // Não loga erro para 404 - é esperado quando placa não existe
      if (response.status !== 404) {
        console.log(`[Brasil API] Status ${response.status}`)
      }
      return null
    }

    const data = await response.json()

    if (!data || (!data.marca && !data.brand)) {
      return null
    }

    return {
      placa: placa.toUpperCase(),
      marca: data.marca || data.brand || 'N/A',
      modelo: data.modelo || data.model || 'N/A',
      ano: data.ano?.toString() || data.year?.toString() || 'N/A',
      anoModelo: data.anoModelo?.toString() || data.modelYear?.toString() || data.ano?.toString() || 'N/A',
      cor: data.cor || data.color || 'N/A',
      municipio: data.municipio || data.city || 'N/A',
      uf: data.uf || data.state || 'N/A',
      motor: data.motor || data.engine || 'N/A',
      combustivel: data.combustivel || data.fuel || 'N/A',
    }
  } catch (error) {
    // Não loga erro - deixa tentar próxima estratégia
    return null
  }
}

/**
 * Consulta API oficial do PlacaFIPE
 */
async function consultarAPIOficial(placa: string) {
  try {
    const response = await fetch('https://placafipe.com/api/consulta', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      body: JSON.stringify({ placa: placa.toUpperCase() }),
      signal: AbortSignal.timeout(10000), // 10s timeout
    })

    if (!response.ok) {
      return null
    }

    const data = await response.json()

    if (!data || !data.marca) {
      return null
    }

    return {
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
    }
  } catch (error) {
    return null
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
      signal: AbortSignal.timeout(10000), // 10s timeout
    })

    if (!response.ok) {
      return null
    }

    const html = await response.text()

    // Parse básico do HTML
    const extractData = (pattern: RegExp) => {
      const match = html.match(pattern)
      return match ? match[1].trim() : 'N/A'
    }

    const marca = extractData(/Marca:<\/strong>\s*([^<]+)/i)
    
    // Se não encontrou marca, considera que não há dados
    if (marca === 'N/A') {
      return null
    }

    return {
      placa: placa.toUpperCase(),
      marca,
      modelo: extractData(/Modelo:<\/strong>\s*([^<]+)/i),
      ano: extractData(/Ano:<\/strong>\s*([^<]+)/i),
      cor: extractData(/Cor:<\/strong>\s*([^<]+)/i),
      municipio: extractData(/Município:<\/strong>\s*([^<]+)/i),
      uf: extractData(/UF:<\/strong>\s*([^<]+)/i),
      motor: extractData(/Motor:<\/strong>\s*([^<]+)/i),
    }
  } catch (error) {
    return null
  }
}
