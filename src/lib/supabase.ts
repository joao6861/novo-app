import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Cliente Supabase (lazy initialization)
let supabaseInstance: SupabaseClient | null = null

/**
 * Retorna o cliente Supabase (cria apenas quando necessário)
 */
export function getSupabaseClient() {
  // Se já existe instância, retorna
  if (supabaseInstance) {
    return supabaseInstance
  }

  // Verifica se as credenciais estão disponíveis
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Credenciais do Supabase não configuradas')
    return null
  }

  // Cria e armazena a instância
  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey)
  return supabaseInstance
}

// Tipos para o banco de dados
export interface VehicleDatabase {
  id?: number
  marca: string
  modelo: string
  ano: string
  motor: string
  oleo_motor: string
  capacidade_oleo_motor: string
  oleo_cambio_manual: string
  capacidade_cambio_manual: string
  oleo_cambio_automatico: string
  capacidade_cambio_automatico: string
  oleo_diferencial_dianteiro: string
  capacidade_diferencial_dianteiro: string
  oleo_diferencial_traseiro: string
  capacidade_diferencial_traseiro: string
  oleo_caixa_transferencia: string
  filtro_oleo: string
  filtro_ar: string
  filtro_combustivel: string
  filtro_cabine: string
  filtro_oleo_cambio: string
  fluido_direcao: string
  fluido_freio: string
  torque_aperto: string
  palhetas_limpador: string
  aditivo_radiador: string
  created_at?: string
  updated_at?: string
}

/**
 * Busca informações técnicas de um veículo no banco de dados
 */
export async function buscarVeiculoDB(marca: string, modelo: string, ano: string, motor?: string) {
  const supabase = getSupabaseClient()
  
  if (!supabase) {
    console.warn('Cliente Supabase não disponível')
    return null
  }

  try {
    let query = supabase
      .from('vehicles')
      .select('*')
      .ilike('marca', marca)
      .ilike('modelo', modelo)
      .eq('ano', ano)

    if (motor) {
      query = query.ilike('motor', `%${motor}%`)
    }

    const { data, error } = await query.single()

    if (error) {
      console.error('Erro ao buscar veículo no banco:', error)
      return null
    }

    return data as VehicleDatabase
  } catch (error) {
    console.error('Erro na consulta ao banco:', error)
    return null
  }
}

/**
 * Cadastra um novo veículo no banco de dados
 */
export async function cadastrarVeiculoDB(vehicle: VehicleDatabase) {
  const supabase = getSupabaseClient()
  
  if (!supabase) {
    console.warn('Cliente Supabase não disponível')
    return null
  }

  try {
    const { data, error } = await supabase
      .from('vehicles')
      .insert([vehicle])
      .select()
      .single()

    if (error) {
      console.error('Erro ao cadastrar veículo:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Erro ao cadastrar veículo:', error)
    return null
  }
}

/**
 * Lista todos os veículos cadastrados
 */
export async function listarVeiculosDB() {
  const supabase = getSupabaseClient()
  
  if (!supabase) {
    console.warn('Cliente Supabase não disponível')
    return []
  }

  try {
    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .order('marca', { ascending: true })

    if (error) {
      console.error('Erro ao listar veículos:', error)
      return []
    }

    return data as VehicleDatabase[]
  } catch (error) {
    console.error('Erro ao listar veículos:', error)
    return []
  }
}
