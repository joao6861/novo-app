/**
 * Módulo de busca local no banco de veículos (veiculos-database.json)
 * 2.640 veículos de 69 marcas com dados técnicos completos.
 */

import vehiclesData from '@/data/veiculos_database.json'

// Tipo para cada filtro
export interface FiltroItem {
    marca: string
    codigo: string
}

// Tipo para cada veículo do banco local
export interface VehicleDBEntry {
    marca: string
    veiculo_raw: string
    modelo: string
    motor_litros?: string
    motor_valvulas?: string
    potencia_cv?: number
    combustivel?: string
    motor_info?: string
    cambio_info?: string
    ano_de?: number
    ano_ate?: number
    // Óleo motor
    oleo_motor_litros?: number
    oleo_motor_viscosidade?: string
    oleo_motor_especificacao?: string
    // Câmbio manual
    oleo_cambio_manual_litros?: number
    oleo_cambio_manual_viscosidade?: string
    oleo_cambio_manual_especificacao?: string
    // Câmbio automático
    oleo_cambio_auto_total_litros?: number
    oleo_cambio_auto_parcial_litros?: number
    oleo_cambio_auto_especificacao?: string
    // Diferencial dianteiro
    oleo_dif_dianteiro_litros?: number
    oleo_dif_dianteiro_visco?: string
    oleo_dif_dianteiro_especificacao?: string
    // Diferencial traseiro
    oleo_dif_traseiro_litros?: number
    oleo_dif_traseiro_visco?: string
    oleo_dif_traseiro_especificacao?: string
    // Caixa de transferência
    oleo_caixa_transfer_litros?: number
    oleo_caixa_transfer_visco?: string
    oleo_caixa_transfer_especificacao?: string
    // Fluidos
    fluido_freio_litros?: number
    fluido_freio_tipo?: string
    fluido_direcao_litros?: number
    fluido_direcao_tipo?: string
    // Aditivo radiador
    aditivo_radiador_litros?: number
    aditivo_radiador_tipo?: string | null
    aditivo_radiador_cor?: string
    // Bateria
    bateria_capacidade_ah?: number
    bateria_cca?: number
    bateria_polo_positivo?: string
    // Filtros
    filtros?: {
        oleo?: FiltroItem[]
        ar?: FiltroItem[]
        cabine?: FiltroItem[]
        combustivel?: FiltroItem[]
        cambio_auto?: FiltroItem[]
    }
}

/**
 * Mapeamento de abreviações da API → nomes completos no banco
 * A API de placas retorna "VW" mas o banco tem "VOLKSWAGEN"
 */
const BRAND_ALIASES: Record<string, string> = {
    'VW': 'VOLKSWAGEN',
    'GM': 'CHEVROLET',
    'CHEV': 'CHEVROLET',
    'MB': 'MERCEDES BENZ',
    'MERCEDES': 'MERCEDES BENZ',
    'MERCEDES-BENZ': 'MERCEDES BENZ',
    'I': 'FIAT', // Caso edge
    'FIAT': 'FIAT',
    'FORD': 'FORD',
    'TOYOTA': 'TOYOTA',
    'HONDA': 'HONDA',
    'HYUNDAI': 'HYUNDAI',
    'KIA': 'KIA',
    'NISSAN': 'NISSAN',
    'RENAULT': 'RENAULT',
    'PEUGEOT': 'PEUGEOT',
    'CITROEN': 'CITROEN',
    'CITROËN': 'CITROEN',
    'MITSUBISHI': 'MITSUBISHI',
    'SUBARU': 'SUBARU',
    'SUZUKI': 'SUZUKI',
    'VOLVO': 'VOLVO',
    'BMW': 'BMW',
    'AUDI': 'AUDI',
    'PORSCHE': 'PORSCHE',
    'JAGUAR': 'JAGUAR',
    'LAND': 'LAND ROVER',
    'LAND ROVER': 'LAND ROVER',
    'JEEP': 'JEEP',
    'DODGE': 'DODGE',
    'CHRYSLER': 'CHRYSLER',
    'RAM': 'RAM',
    'MINI': 'MINI',
    'SMART': 'SMART',
    'IVECO': 'IVECO',
    'TROLLER': 'TROLLER',
    'SSANGYONG': 'SSANGYONG',
    'CHERY': 'CHERY',
    'JAC': 'JAC',
    'LIFAN': 'LIFAN',
    'BYD': 'BYD',
    'GWM': 'GWM',
    'ALFA': 'ALFA',
    'ALFA ROMEO': 'ALFA',
    'SEAT': 'SEAT',
    'LEXUS': 'LEXUS',
    'INFINITI': 'INFINITI',
    'CADILLAC': 'CADILLAC',
    'HUMMER': 'HUMMER',
    'FERRARI': 'FERRARI',
    'MASERATI': 'MASERATI',
    'ABARTH': 'ABARTH',
    'HAVAL': 'HAVAL',
}

/**
 * Normaliza marca vinda da API para corresponder ao banco de dados
 */
function normalizeBrand(marca: string): string {
    const upper = marca.toUpperCase().trim()
    return BRAND_ALIASES[upper] || upper
}

/**
 * Normaliza modelo para busca (remove acentos, espaços extras, etc.)
 */
function normalizeModel(modelo: string): string {
    return modelo
        .toUpperCase()
        .trim()
        .replace(/[^\w\s]/g, '')
        .replace(/\s+/g, ' ')
}

/**
 * Busca inteligente de veículo no banco local.
 * Prioridades:
 * 1. Match exato: marca + modelo + motor_litros + ano dentro do range
 * 2. Match parcial: marca + modelo + motor_litros
 * 3. Match flexível: marca + modelo (primeiro resultado)
 */
export function buscarVeiculoLocal(
    marcaApi: string,
    modeloApi: string,
    motorLitros?: string,
    ano?: number
): VehicleDBEntry | null {
    const vehicles = vehiclesData as VehicleDBEntry[]
    const marcaNorm = normalizeBrand(marcaApi)
    const modeloNorm = normalizeModel(modeloApi)

    // Filtra por marca
    const byBrand = vehicles.filter(v => v.marca.toUpperCase() === marcaNorm)

    if (byBrand.length === 0) return null

    // Filtra por modelo (contém o nome do modelo)
    const byModel = byBrand.filter(v => {
        const dbModelo = normalizeModel(v.modelo || '')
        const dbRaw = normalizeModel(v.veiculo_raw || '')
        return dbModelo.includes(modeloNorm) || modeloNorm.includes(dbModelo) || dbRaw.includes(modeloNorm)
    })

    if (byModel.length === 0) {
        // Tenta busca mais flexível: primeira palavra do modelo
        const firstWord = modeloNorm.split(' ')[0]
        const byFirstWord = byBrand.filter(v => {
            const dbModelo = normalizeModel(v.modelo || '')
            return dbModelo.includes(firstWord) || firstWord.includes(dbModelo)
        })
        if (byFirstWord.length === 0) return null
        return byFirstWord[0]
    }

    // Se tem motor_litros, refina
    if (motorLitros) {
        const cleanMotor = motorLitros.replace(/[^\d.]/g, '')
        const byMotor = byModel.filter(v => v.motor_litros === cleanMotor)

        if (byMotor.length > 0) {
            // Se tem ano, refina mais
            if (ano) {
                const byAge = byMotor.filter(v => {
                    const de = v.ano_de || 1900
                    const ate = v.ano_ate || 2099
                    return ano >= de && ano <= ate
                })
                if (byAge.length > 0) return byAge[0]
            }
            return byMotor[0]
        }
    }

    // Se tem ano, refina por faixa
    if (ano) {
        const byAge = byModel.filter(v => {
            const de = v.ano_de || 1900
            const ate = v.ano_ate || 2099
            return ano >= de && ano <= ate
        })
        if (byAge.length > 0) return byAge[0]
    }

    return byModel[0]
}
