/**
 * PlacaFIPE API Integration
 * Consulta informações de veículos pela placa usando PlacaFIPE
 */

export interface PlacaFipeVehicle {
  placa: string
  marca: string
  modelo: string
  ano: string
  anoModelo?: string
  cor?: string
  municipio?: string
  uf?: string
  chassi?: string
  motor?: string
  combustivel?: string
  categoria?: string
  situacao?: string
  restricoes?: string[]
}

const PLACAFIPE_BASE_URL = 'https://placafipe.com'

/**
 * Valida formato de placa brasileira (padrão antigo e Mercosul)
 */
export function validarPlacaBrasileira(placa: string): boolean {
  // Remove espaços e converte para maiúsculo
  const placaLimpa = placa.replace(/\s/g, '').toUpperCase()
  
  // Padrão antigo: ABC1234
  const padraoAntigo = /^[A-Z]{3}[0-9]{4}$/
  
  // Padrão Mercosul: ABC1D23
  const padraoMercosul = /^[A-Z]{3}[0-9][A-Z][0-9]{2}$/
  
  return padraoAntigo.test(placaLimpa) || padraoMercosul.test(placaLimpa)
}

/**
 * Consulta informações de um veículo pela placa no PlacaFIPE
 */
export async function consultarPlacaFipe(placa: string): Promise<PlacaFipeVehicle | null> {
  try {
    if (!validarPlacaBrasileira(placa)) {
      throw new Error('Formato de placa inválido')
    }

    const response = await fetch('/api/placafipe/consulta', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ placa: placa.toUpperCase() }),
    })

    if (!response.ok) {
      throw new Error('Falha ao consultar placa')
    }

    const data = await response.json()
    
    if (!data.success || !data.vehicle) {
      return null
    }

    return data.vehicle
  } catch (error) {
    console.error('Erro ao consultar PlacaFIPE:', error)
    return null
  }
}

/**
 * Formata placa para exibição (adiciona hífen)
 */
export function formatarPlaca(placa: string): string {
  const placaLimpa = placa.replace(/\s/g, '').toUpperCase()
  
  if (placaLimpa.length === 7) {
    // ABC-1234 ou ABC-1D23
    return `${placaLimpa.slice(0, 3)}-${placaLimpa.slice(3)}`
  }
  
  return placaLimpa
}

/**
 * Extrai informações básicas da placa (UF de origem, etc)
 */
export function extrairInfoPlaca(placa: string): { uf?: string; tipo: 'antiga' | 'mercosul' } {
  const placaLimpa = placa.replace(/\s/g, '').toUpperCase()
  
  // Verifica se é Mercosul
  const isMercosul = /^[A-Z]{3}[0-9][A-Z][0-9]{2}$/.test(placaLimpa)
  
  return {
    tipo: isMercosul ? 'mercosul' : 'antiga',
  }
}
