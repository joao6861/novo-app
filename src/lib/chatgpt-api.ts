/**
 * OpenAI Integration
 * Análise inteligente de dados de veículos usando ChatGPT
 */

export interface ChatGPTAnalysis {
  summary: string
  recommendations: string[]
  warnings?: string[]
  maintenanceTips?: string[]
}

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions'

/**
 * Analisa dados de um veículo usando ChatGPT
 */
export async function analyzeVehicleWithChatGPT(
  vehicleData: any,
  context?: string
): Promise<ChatGPTAnalysis | null> {
  try {
    const response = await fetch('/api/openai/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        vehicleData,
        context,
      }),
    })

    if (!response.ok) {
      throw new Error('Falha ao analisar com ChatGPT')
    }

    const data = await response.json()
    return data.analysis || null
  } catch (error) {
    console.error('Erro ao analisar com ChatGPT:', error)
    return null
  }
}

/**
 * Gera recomendações de manutenção usando ChatGPT
 */
export async function getMaintenanceRecommendations(
  marca: string,
  modelo: string,
  ano: string,
  quilometragem?: number
): Promise<string[]> {
  try {
    const response = await fetch('/api/openai/maintenance', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        marca,
        modelo,
        ano,
        quilometragem,
      }),
    })

    if (!response.ok) {
      throw new Error('Falha ao buscar recomendações')
    }

    const data = await response.json()
    return data.recommendations || []
  } catch (error) {
    console.error('Erro ao buscar recomendações:', error)
    return []
  }
}

/**
 * Compara especificações de óleos e fluidos usando ChatGPT
 */
export async function compareOilSpecs(
  currentOil: string,
  recommendedOil: string
): Promise<{ compatible: boolean; explanation: string }> {
  try {
    const response = await fetch('/api/openai/compare-oils', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        currentOil,
        recommendedOil,
      }),
    })

    if (!response.ok) {
      throw new Error('Falha ao comparar óleos')
    }

    const data = await response.json()
    return data.comparison || { compatible: false, explanation: 'Erro na análise' }
  } catch (error) {
    console.error('Erro ao comparar óleos:', error)
    return { compatible: false, explanation: 'Erro ao processar comparação' }
  }
}

/**
 * Responde perguntas sobre o veículo usando ChatGPT
 */
export async function askAboutVehicle(
  question: string,
  vehicleData: any
): Promise<string> {
  try {
    const response = await fetch('/api/openai/ask', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question,
        vehicleData,
      }),
    })

    if (!response.ok) {
      throw new Error('Falha ao processar pergunta')
    }

    const data = await response.json()
    return data.answer || 'Não foi possível processar sua pergunta.'
  } catch (error) {
    console.error('Erro ao processar pergunta:', error)
    return 'Erro ao processar sua pergunta. Tente novamente.'
  }
}
