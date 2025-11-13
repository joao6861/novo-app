import { NextRequest, NextResponse } from 'next/server'

const AUTOOLEO_BASE_URL = 'https://autooleoapp.com.br'

/**
 * API Route: Buscar informações completas de um veículo no AutoOleo
 * GET /api/autooleo/vehicle?brand=Toyota&model=Corolla&year=2020&motor=2.0
 */
export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    const { searchParams } = new URL(request.url)
    const brand = searchParams.get('brand')
    const model = searchParams.get('model')
    const year = searchParams.get('year')
    const motor = searchParams.get('motor')

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Token não fornecido' },
        { status: 401 }
      )
    }

    if (!brand || !model || !year || !motor) {
      return NextResponse.json(
        { success: false, error: 'Todos os parâmetros são obrigatórios' },
        { status: 400 }
      )
    }

    const response = await fetch(
      `${AUTOOLEO_BASE_URL}/app/resultado.html?marca=${encodeURIComponent(brand)}&modelo=${encodeURIComponent(model)}&ano=${encodeURIComponent(year)}&motor=${encodeURIComponent(motor)}`,
      {
        headers: {
          'Cookie': `PHPSESSID=${token}`,
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      }
    )

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: 'Falha ao buscar informações do veículo' },
        { status: 500 }
      )
    }

    const html = await response.text()
    const vehicleInfo = extractVehicleInfoFromHTML(html, brand, model, year, motor)

    return NextResponse.json({
      success: true,
      vehicle: vehicleInfo,
    })
  } catch (error) {
    console.error('Erro ao buscar informações do veículo:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao processar requisição' },
      { status: 500 }
    )
  }
}

function extractVehicleInfoFromHTML(
  html: string,
  brand: string,
  model: string,
  year: string,
  motor: string
) {
  // Função auxiliar para extrair dados
  const extractData = (label: string): string => {
    const regex = new RegExp(`${label}[:\\s]*([^<\\n]+)`, 'i')
    const match = html.match(regex)
    return match ? match[1].trim() : 'N/A'
  }

  return {
    marca: brand,
    modelo: model,
    ano: year,
    motor: motor,
    oleo_motor: extractData('Óleo do Motor|Motor Oil'),
    capacidade_oleo_motor: extractData('Capacidade.*Motor|Motor Capacity'),
    oleo_cambio_manual: extractData('Óleo.*Câmbio Manual|Manual Transmission'),
    capacidade_cambio_manual: extractData('Capacidade.*Câmbio Manual'),
    oleo_cambio_automatico: extractData('Óleo.*Câmbio Automático|Automatic Transmission'),
    capacidade_cambio_automatico: extractData('Capacidade.*Câmbio Automático'),
    oleo_diferencial_dianteiro: extractData('Diferencial Dianteiro|Front Differential'),
    capacidade_diferencial_dianteiro: extractData('Capacidade.*Diferencial Dianteiro'),
    oleo_diferencial_traseiro: extractData('Diferencial Traseiro|Rear Differential'),
    capacidade_diferencial_traseiro: extractData('Capacidade.*Diferencial Traseiro'),
    oleo_caixa_transferencia: extractData('Caixa de Transferência|Transfer Case'),
    filtro_oleo: extractData('Filtro de Óleo|Oil Filter'),
    filtro_ar: extractData('Filtro de Ar|Air Filter'),
    filtro_combustivel: extractData('Filtro de Combustível|Fuel Filter'),
    filtro_cabine: extractData('Filtro de Cabine|Cabin Filter'),
    filtro_oleo_cambio: extractData('Filtro.*Câmbio|Transmission Filter'),
    fluido_direcao: extractData('Fluido.*Direção|Power Steering'),
    fluido_freio: extractData('Fluido.*Freio|Brake Fluid'),
    torque_aperto: extractData('Torque|Torque Spec'),
    palhetas_limpador: extractData('Palhetas|Wiper Blades'),
    aditivo_radiador: extractData('Aditivo.*Radiador|Coolant'),
  }
}
