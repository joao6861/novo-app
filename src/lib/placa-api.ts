// API de Consulta de Placas - apibrasil.com.br
// Documentação: https://documenter.getpostman.com/view/24382542/2s8YeptYeo

import { buscarVeiculoDB } from './supabase'

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
  // Campos adicionais que podem vir da API
  [key: string]: any
}

export interface VehicleData extends PlacaResponse {
  // Campos de manutenção (buscados do banco de dados)
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

/**
 * Consulta informações de um veículo pela placa usando a API Brasil
 * e busca dados técnicos no banco de dados Supabase
 * @param placa - Placa do veículo (formato: ABC1234 ou ABC1D23)
 * @returns Dados do veículo ou null se não encontrado
 */
export async function consultarPlaca(placa: string): Promise<VehicleData | null> {
  try {
    // Remove caracteres especiais e converte para maiúsculo
    const placaLimpa = placa.replace(/[^A-Za-z0-9]/g, '').toUpperCase()
    
    if (placaLimpa.length !== 7) {
      throw new Error('Placa inválida. Deve conter 7 caracteres.')
    }

    // Consulta API Brasil para dados básicos do veículo
    const response = await fetch('https://placa-fipe.apibrasil.com.br/placa/consulta', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*',
      },
      body: JSON.stringify({
        placa: placaLimpa
      })
    })

    if (!response.ok) {
      if (response.status === 404) {
        return null // Placa não encontrada
      }
      throw new Error(`Erro na API: ${response.status}`)
    }

    const data: PlacaResponse = await response.json()
    
    // Busca informações técnicas no banco de dados
    const vehicleDB = await buscarVeiculoDB(
      data.marca || '',
      data.modelo || '',
      data.ano || '',
      data.motor
    )

    // Combina dados da API com dados do banco
    return {
      ...data,
      placa: placaLimpa,
      marca: data.marca || 'N/A',
      modelo: data.modelo || 'N/A',
      ano: data.ano || 'N/A',
      motor: data.motor || 'N/A',
      // Dados técnicos do banco ou valores padrão
      oleo_motor: vehicleDB?.oleo_motor || 'Consulte o manual do veículo',
      capacidade_oleo_motor: vehicleDB?.capacidade_oleo_motor || 'Consulte o manual do veículo',
      oleo_cambio_manual: vehicleDB?.oleo_cambio_manual || 'Consulte o manual do veículo',
      capacidade_cambio_manual: vehicleDB?.capacidade_cambio_manual || 'Consulte o manual do veículo',
      oleo_cambio_automatico: vehicleDB?.oleo_cambio_automatico || 'Consulte o manual do veículo',
      capacidade_cambio_automatico: vehicleDB?.capacidade_cambio_automatico || 'Consulte o manual do veículo',
      oleo_diferencial_dianteiro: vehicleDB?.oleo_diferencial_dianteiro || 'Consulte o manual do veículo',
      capacidade_diferencial_dianteiro: vehicleDB?.capacidade_diferencial_dianteiro || 'Consulte o manual do veículo',
      oleo_diferencial_traseiro: vehicleDB?.oleo_diferencial_traseiro || 'Consulte o manual do veículo',
      capacidade_diferencial_traseiro: vehicleDB?.capacidade_diferencial_traseiro || 'Consulte o manual do veículo',
      oleo_caixa_transferencia: vehicleDB?.oleo_caixa_transferencia || 'Consulte o manual do veículo',
      filtro_oleo: vehicleDB?.filtro_oleo || 'Consulte o manual do veículo',
      filtro_ar: vehicleDB?.filtro_ar || 'Consulte o manual do veículo',
      filtro_combustivel: vehicleDB?.filtro_combustivel || 'Consulte o manual do veículo',
      filtro_cabine: vehicleDB?.filtro_cabine || 'Consulte o manual do veículo',
      filtro_oleo_cambio: vehicleDB?.filtro_oleo_cambio || 'Consulte o manual do veículo',
      fluido_direcao: vehicleDB?.fluido_direcao || 'Consulte o manual do veículo',
      fluido_freio: vehicleDB?.fluido_freio || 'Consulte o manual do veículo',
      torque_aperto: vehicleDB?.torque_aperto || 'Consulte o manual do veículo',
      palhetas_limpador: vehicleDB?.palhetas_limpador || 'Consulte o manual do veículo',
      aditivo_radiador: vehicleDB?.aditivo_radiador || 'Consulte o manual do veículo',
    }
  } catch (error) {
    console.error('Erro ao consultar placa:', error)
    throw error
  }
}

/**
 * Valida formato de placa brasileira
 * @param placa - Placa a ser validada
 * @returns true se válida, false caso contrário
 */
export function validarPlaca(placa: string): boolean {
  const placaLimpa = placa.replace(/[^A-Za-z0-9]/g, '').toUpperCase()
  
  // Formato antigo: ABC1234 (3 letras + 4 números)
  const formatoAntigo = /^[A-Z]{3}[0-9]{4}$/
  
  // Formato Mercosul: ABC1D23 (3 letras + 1 número + 1 letra + 2 números)
  const formatoMercosul = /^[A-Z]{3}[0-9]{1}[A-Z]{1}[0-9]{2}$/
  
  return formatoAntigo.test(placaLimpa) || formatoMercosul.test(placaLimpa)
}
