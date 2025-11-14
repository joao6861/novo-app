/**
 * Lista completa de marcas de veículos disponíveis no sistema
 * Inclui carros e motos
 */

export const VEHICLE_BRANDS = [
  'ABARTH',
  'AGRALE',
  'ALFA',
  'ASIA',
  'AUDI',
  'BMW',
  'BMW MOTOS',
  'BYD',
  'CADILLAC',
  'CHANA',
  'CHERY',
  'CHEVROLET',
  'CHRYSLER',
  'CITROEN',
  'CN AUTO',
  'DAEWOO',
  'DAFRA',
  'DAIHATSU',
  'DODGE',
  'EFFA',
  'FERRARI',
  'FIAT',
  'FORD',
  'GEELY',
  'GWM',
  'HAFEI',
  'HARLEY DAVIDSON MOTOS',
  'HAVAL',
  'HONDA',
  'HONDA MOTOS',
  'HUMMER',
  'HYUNDAI',
  'INFINITI',
  'IVECO',
  'JAC',
  'JAGUAR',
  'JEEP',
  'JINBEI',
  'KAWASAKI MOTOS',
  'KIA',
  'LADA',
  'LAND ROVER',
  'LEXUS',
  'LIFAN',
  'MAHINDRA',
  'MASERATI',
  'MAZDA',
  'MERCEDES BENZ',
  'MINI',
  'MITSUBISHI',
  'NISSAN',
  'PEUGEOT',
  'PORSCHE',
  'RAM',
  'RELY',
  'RENAULT',
  'ROYAL ENFIELD MOTOS',
  'SEAT',
  'SMART',
  'SSANGYONG',
  'SUBARU',
  'SUZUKI',
  'SUZUKI MOTOS',
  'TOYOTA',
  'TRIUMPH',
  'TROLLER',
  'VOLKSWAGEN',
  'VOLVO',
  'YAMAHA MOTOS',
] as const

export type VehicleBrand = typeof VEHICLE_BRANDS[number]

/**
 * Verifica se uma marca existe na lista
 */
export function isValidBrand(brand: string): boolean {
  return VEHICLE_BRANDS.includes(brand.toUpperCase() as VehicleBrand)
}

/**
 * Retorna todas as marcas de carros (exclui motos)
 */
export function getCarBrands(): string[] {
  return VEHICLE_BRANDS.filter(brand => !brand.includes('MOTOS'))
}

/**
 * Retorna todas as marcas de motos
 */
export function getMotorcycleBrands(): string[] {
  return VEHICLE_BRANDS.filter(brand => brand.includes('MOTOS'))
}

/**
 * Busca marcas por termo de pesquisa
 */
export function searchBrands(searchTerm: string): string[] {
  const term = searchTerm.toUpperCase()
  return VEHICLE_BRANDS.filter(brand => brand.includes(term))
}

/**
 * Total de marcas cadastradas
 */
export const TOTAL_BRANDS = VEHICLE_BRANDS.length
