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

    console.log('[PlacaFIPE] Consultando placa:', placa)

    const response = await fetch('/api/placafipe/consulta', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ placa: placa.toUpperCase() }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ 
        error: 'Erro ao consultar placa', 
        details: 'Sem detalhes disponíveis' 
      }))
      
      // Mensagem amigável baseada no status
      if (response.status === 404) {
        // Não loga erro para 404 - é esperado quando placa não existe
        throw new Error('Placa não encontrada. Verifique se digitou corretamente.')
      } else if (response.status === 500) {
        console.error('[PlacaFIPE] Erro no servidor:', errorData.details)
        throw new Error('Serviço temporariamente indisponível. Tente novamente em alguns instantes.')
      } else {
        console.error('[PlacaFIPE] Erro na consulta:', errorData)
        throw new Error(errorData.error || 'Falha ao consultar placa')
      }
    }

    const data = await response.json()
    
    if (!data.success || !data.vehicle) {
      return null
    }

    console.log('[PlacaFIPE] ✓ Consulta bem-sucedida via', data.source || 'fonte desconhecida')
    return data.vehicle
  } catch (error) {
    // Re-throw para o componente tratar, mas sem logar novamente
    throw error
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
