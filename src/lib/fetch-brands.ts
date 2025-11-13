/**
 * Script para buscar e salvar todas as marcas do AutoOleo
 * Execute este arquivo para atualizar a lista de marcas
 */

import { loginAutoOleo, fetchAutoOleoBrands } from './autooleo-scraper'

const AUTOOLEO_CREDENTIALS = {
  email: 'contatoaldoscenter@gmail.com',
  password: '12345'
}

export async function fetchAndSaveBrands() {
  try {
    console.log('🔐 Fazendo login no AutoOleo...')
    const token = await loginAutoOleo(AUTOOLEO_CREDENTIALS)
    
    if (!token) {
      throw new Error('Falha ao fazer login no AutoOleo')
    }
    
    console.log('✅ Login realizado com sucesso!')
    console.log('📋 Buscando marcas...')
    
    const brands = await fetchAutoOleoBrands(token)
    
    console.log(`✅ ${brands.length} marcas encontradas!`)
    console.log('Marcas:', brands)
    
    return brands
  } catch (error) {
    console.error('❌ Erro ao buscar marcas:', error)
    return []
  }
}

// Se executado diretamente
if (require.main === module) {
  fetchAndSaveBrands().then(brands => {
    console.log('\n📊 Total de marcas:', brands.length)
    console.log('\n📝 Lista completa:')
    brands.forEach((brand, index) => {
      console.log(`${index + 1}. ${brand}`)
    })
  })
}
