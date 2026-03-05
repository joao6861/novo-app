// API de Consulta de Placas - apibrasil.com.br
// + Busca no banco local de veículos (veiculos_database.json)

import { buscarVeiculoLocal, type VehicleDBEntry } from './vehicle-database'

export interface PlacaResponse {
  placa: string
  marca: string
  modelo: string
  ano: string
  anoModelo?: string
  cor?: string
  municipio?: string
  uf?: string
  chassi?: string
  renavam?: string
  situacao?: string
  motor?: string
  combustivel?: string
  potencia?: string
  cilindros?: string
  especie?: string
  tipo_veiculo?: string
  origem?: string
  capacidade_passageiros?: string
  eixos?: string
  [key: string]: any
}

export interface VehicleData extends PlacaResponse {
  dbMatch: VehicleDBEntry | null
}

/**
 * Obtém um token de acesso fresco via login
 */
async function obterToken(): Promise<string> {
  const res = await fetch('https://gateway.apibrasil.io/api/v2/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'joaopedro6861@hotmail.com',
      password: '13521352'
    }),
    cache: 'no-store'
  })
  const data = await res.json()
  if (!data.authorization?.token) {
    throw new Error('Falha ao obter token de acesso')
  }
  return data.authorization.token
}

/**
 * Consulta informações de um veículo pela placa usando a API Brasil
 * e busca dados técnicos no banco de dados local
 */
export async function consultarPlaca(placa: string): Promise<VehicleData | null> {
  try {
    const placaLimpa = placa.replace(/[^A-Za-z0-9]/g, '').toUpperCase()

    if (placaLimpa.length !== 7) {
      throw new Error('Placa inválida. Deve conter 7 caracteres.')
    }

    // Obter token fresco via login
    const token = await obterToken()

    // Endpoint do plano de assinatura - Placa FIPE com Chassi
    // Device: joaopedro6861hotmailcommm (441924ef-3d2f-42ea-99c0-ed9766281347)
    // ApiKey: s1ac7a9-ecaf-44b7-a115-99b6741112a (Placa FIPE Com Chassi)
    const response = await fetch('https://gateway.apibrasil.io/api/v2/vehicles/dados', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'DeviceToken': `441924ef-3d2f-42ea-99c0-ed9766281347`,
        'apiKey': `s1ac7a9-ecaf-44b7-a115-99b6741112a`
      },
      body: JSON.stringify({ placa: placaLimpa }),
      cache: 'no-store'
    })

    if (!response.ok) {
      if (response.status === 404) return null
      const errorText = await response.text()
      throw new Error(`Erro na APIBrasil (${response.status}): ${errorText}`)
    }

    const apiResult = await response.json()

    if (apiResult.error) {
      console.warn('APIBrasil retornou erro:', apiResult.message, apiResult.response?.error)
      return null
    }

    // A resposta vem em apiResult.response
    const vehiclePayload = apiResult.response || apiResult.data || apiResult

    if (!vehiclePayload || typeof vehiclePayload !== 'object') {
      console.warn('API Response sem dados:', JSON.stringify(apiResult))
      return null
    }

    // Mapeamento de campos da APIBrasil v2 (endpoint /vehicles/dados)
    // Campos retornados: Marca, Modelo, AnoModelo, Combustivel, CodigoFipe,
    //   cilindradas, potencia, chassi, cor, uf, municipio, renavam
    const anoModeloRaw = vehiclePayload.AnoModelo || vehiclePayload.anoModelo || ''
    const anoParts = anoModeloRaw.split('/')
    const anoFab = anoParts[0]?.trim() || 'N/A'
    const anoMod = anoParts[1]?.trim() || anoFab

    const data: PlacaResponse = {
      placa: placaLimpa,
      marca: (vehiclePayload.Marca || vehiclePayload.marca || 'N/A').toUpperCase(),
      modelo: (vehiclePayload.Modelo || vehiclePayload.modelo || 'N/A').toUpperCase(),
      ano: anoFab,
      anoModelo: anoMod,
      cor: vehiclePayload.cor || vehiclePayload.Cor || undefined,
      municipio: vehiclePayload.municipio || vehiclePayload.Municipio || undefined,
      uf: vehiclePayload.uf || vehiclePayload.UF || undefined,
      motor: vehiclePayload.motor || undefined,
      chassi: vehiclePayload.chassi || vehiclePayload.Chassi || undefined,
      renavam: vehiclePayload.renavam || vehiclePayload.Renavam || undefined,
      situacao: vehiclePayload.situacao || vehiclePayload.Situacao || undefined,
      combustivel: vehiclePayload.Combustivel || vehiclePayload.combustivel || undefined,
      potencia: vehiclePayload.potencia || vehiclePayload.Potencia || undefined,
      cilindros: vehiclePayload.cilindradas || vehiclePayload.cilindros || vehiclePayload.Cilindradas || undefined,
      especie: vehiclePayload.especie || undefined,
      tipo_veiculo: vehiclePayload.TipoVeiculo?.toString() || vehiclePayload.tipo_veiculo || undefined,
      origem: vehiclePayload.origem || undefined,
      fipe_codigo: vehiclePayload.CodigoFipe || undefined,
      fipe_valor: vehiclePayload.Valor || undefined,
      ipva: vehiclePayload.ipva || undefined,
    }

    const anoNum = parseInt(data.anoModelo || data.ano) || undefined
    const dbMatch = buscarVeiculoLocal(data.marca, data.modelo, data.motor, anoNum)

    return { ...data, dbMatch }
  } catch (error) {
    console.error('Erro ao consultar placa:', error)
    throw error
  }
}

/**
 * Valida formato de placa brasileira
 */
export function validarPlaca(placa: string): boolean {
  const placaLimpa = placa.replace(/[^A-Za-z0-9]/g, '').toUpperCase()
  const formatoAntigo = /^[A-Z]{3}[0-9]{4}$/
  const formatoMercosul = /^[A-Z]{3}[0-9]{1}[A-Z]{1}[0-9]{2}$/
  return formatoAntigo.test(placaLimpa) || formatoMercosul.test(placaLimpa)
}
