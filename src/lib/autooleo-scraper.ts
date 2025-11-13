/**
 * AutoOleo Scraper
 * Extrai dados de veículos do site AutoOleo
 */

export interface AutoOleoVehicle {
  marca: string
  modelo: string
  ano: string
  motor: string
  oleo_motor?: string
  capacidade_oleo_motor?: string
  oleo_cambio_manual?: string
  capacidade_cambio_manual?: string
  oleo_cambio_automatico?: string
  capacidade_cambio_automatico?: string
  oleo_diferencial_dianteiro?: string
  capacidade_diferencial_dianteiro?: string
  oleo_diferencial_traseiro?: string
  capacidade_diferencial_traseiro?: string
  oleo_caixa_transferencia?: string
  filtro_oleo?: string
  filtro_ar?: string
  filtro_combustivel?: string
  filtro_cabine?: string
  filtro_oleo_cambio?: string
  fluido_direcao?: string
  fluido_freio?: string
  torque_aperto?: string
  palhetas_limpador?: string
  aditivo_radiador?: string
}

export interface AutoOleoCredentials {
  email: string
  password: string
}

const AUTOOLEO_BASE_URL = 'https://autooleoapp.com.br'
const AUTOOLEO_LOGIN_URL = `${AUTOOLEO_BASE_URL}/app/login.html`

/**
 * Faz login no AutoOleo e retorna o token de sessão
 */
export async function loginAutoOleo(credentials: AutoOleoCredentials): Promise<string | null> {
  try {
    const response = await fetch('/api/autooleo/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    })

    if (!response.ok) {
      throw new Error('Falha no login do AutoOleo')
    }

    const data = await response.json()
    return data.token || null
  } catch (error) {
    console.error('Erro ao fazer login no AutoOleo:', error)
    return null
  }
}

/**
 * Busca todas as marcas disponíveis no AutoOleo
 */
export async function fetchAutoOleoBrands(token: string): Promise<string[]> {
  try {
    const response = await fetch('/api/autooleo/brands', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error('Falha ao buscar marcas')
    }

    const data = await response.json()
    return data.brands || []
  } catch (error) {
    console.error('Erro ao buscar marcas:', error)
    return []
  }
}

/**
 * Busca todos os modelos de uma marca específica
 */
export async function fetchAutoOleoModels(token: string, brand: string): Promise<string[]> {
  try {
    const response = await fetch(`/api/autooleo/models?brand=${encodeURIComponent(brand)}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error('Falha ao buscar modelos')
    }

    const data = await response.json()
    return data.models || []
  } catch (error) {
    console.error('Erro ao buscar modelos:', error)
    return []
  }
}

/**
 * Busca todos os anos de um modelo específico
 */
export async function fetchAutoOleoYears(token: string, brand: string, model: string): Promise<string[]> {
  try {
    const response = await fetch(
      `/api/autooleo/years?brand=${encodeURIComponent(brand)}&model=${encodeURIComponent(model)}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    )

    if (!response.ok) {
      throw new Error('Falha ao buscar anos')
    }

    const data = await response.json()
    return data.years || []
  } catch (error) {
    console.error('Erro ao buscar anos:', error)
    return []
  }
}

/**
 * Busca todos os motores de um veículo específico
 */
export async function fetchAutoOleoMotors(
  token: string,
  brand: string,
  model: string,
  year: string
): Promise<string[]> {
  try {
    const response = await fetch(
      `/api/autooleo/motors?brand=${encodeURIComponent(brand)}&model=${encodeURIComponent(model)}&year=${encodeURIComponent(year)}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    )

    if (!response.ok) {
      throw new Error('Falha ao buscar motores')
    }

    const data = await response.json()
    return data.motors || []
  } catch (error) {
    console.error('Erro ao buscar motores:', error)
    return []
  }
}

/**
 * Busca informações completas de um veículo específico
 */
export async function fetchAutoOleoVehicleInfo(
  token: string,
  brand: string,
  model: string,
  year: string,
  motor: string
): Promise<AutoOleoVehicle | null> {
  try {
    const response = await fetch(
      `/api/autooleo/vehicle?brand=${encodeURIComponent(brand)}&model=${encodeURIComponent(model)}&year=${encodeURIComponent(year)}&motor=${encodeURIComponent(motor)}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    )

    if (!response.ok) {
      throw new Error('Falha ao buscar informações do veículo')
    }

    const data = await response.json()
    return data.vehicle || null
  } catch (error) {
    console.error('Erro ao buscar informações do veículo:', error)
    return null
  }
}

/**
 * Busca todos os veículos disponíveis no AutoOleo (operação pesada)
 */
export async function fetchAllAutoOleoVehicles(
  token: string,
  onProgress?: (progress: { current: number; total: number; message: string }) => void
): Promise<AutoOleoVehicle[]> {
  const vehicles: AutoOleoVehicle[] = []

  try {
    // 1. Buscar todas as marcas
    const brands = await fetchAutoOleoBrands(token)
    onProgress?.({ current: 0, total: brands.length, message: 'Buscando marcas...' })

    for (let i = 0; i < brands.length; i++) {
      const brand = brands[i]
      onProgress?.({ current: i + 1, total: brands.length, message: `Processando marca: ${brand}` })

      // 2. Buscar modelos da marca
      const models = await fetchAutoOleoModels(token, brand)

      for (const model of models) {
        // 3. Buscar anos do modelo
        const years = await fetchAutoOleoYears(token, brand, model)

        for (const year of years) {
          // 4. Buscar motores do ano
          const motors = await fetchAutoOleoMotors(token, brand, model, year)

          for (const motor of motors) {
            // 5. Buscar informações completas
            const vehicleInfo = await fetchAutoOleoVehicleInfo(token, brand, model, year, motor)

            if (vehicleInfo) {
              vehicles.push(vehicleInfo)
            }

            // Delay para não sobrecarregar o servidor
            await new Promise(resolve => setTimeout(resolve, 100))
          }
        }
      }
    }

    return vehicles
  } catch (error) {
    console.error('Erro ao buscar todos os veículos:', error)
    return vehicles
  }
}
