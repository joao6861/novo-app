'use client'

import { useState } from 'react'
import { Search, Car, Shield, Clock, Droplet, Filter, Wrench, List, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { consultarPlaca, validarPlaca, type VehicleData } from '@/lib/placa-api'

// Dados mock para demonstração da busca manual (sem placa)
const mockVehicles: VehicleData[] = [
  {
    placa: 'DEMO001',
    marca: 'Toyota',
    modelo: 'Corolla',
    ano: '2020',
    motor: '2.0 16V Flex',
    oleo_motor: 'SAE 5W-30 API SN',
    capacidade_oleo_motor: '4.2 litros',
    oleo_cambio_manual: 'SAE 75W-85 API GL-4',
    capacidade_cambio_manual: '2.0 litros',
    oleo_cambio_automatico: 'ATF WS',
    capacidade_cambio_automatico: '6.9 litros',
    oleo_diferencial_dianteiro: 'N/A',
    capacidade_diferencial_dianteiro: 'N/A',
    oleo_diferencial_traseiro: 'SAE 80W-90 API GL-5',
    capacidade_diferencial_traseiro: '1.3 litros',
    oleo_caixa_transferencia: 'N/A',
    filtro_oleo: '04152-YZZA6',
    filtro_ar: '17801-21050',
    filtro_combustivel: '23300-21010',
    filtro_cabine: '87139-02090',
    filtro_oleo_cambio: '35330-60050',
    fluido_direcao: 'ATF Dexron III',
    fluido_freio: 'DOT 3',
    torque_aperto: '29 Nm (filtro de óleo)',
    palhetas_limpador: '24" / 16"',
    aditivo_radiador: 'Etilenoglicol 50%'
  },
  {
    placa: 'DEMO002',
    marca: 'Honda',
    modelo: 'Civic',
    ano: '2019',
    motor: '2.0 16V Flex',
    oleo_motor: 'SAE 0W-20 API SN',
    capacidade_oleo_motor: '3.7 litros',
    oleo_cambio_manual: 'MTF-3',
    capacidade_cambio_manual: '1.9 litros',
    oleo_cambio_automatico: 'ATF DW-1',
    capacidade_cambio_automatico: '6.2 litros',
    oleo_diferencial_dianteiro: 'N/A',
    capacidade_diferencial_dianteiro: 'N/A',
    oleo_diferencial_traseiro: 'N/A',
    capacidade_diferencial_traseiro: 'N/A',
    oleo_caixa_transferencia: 'N/A',
    filtro_oleo: '15400-RTA-003',
    filtro_ar: '17220-R1A-A01',
    filtro_combustivel: '16010-ST5-E02',
    filtro_cabine: '80292-TF0-G01',
    filtro_oleo_cambio: '25430-PLR-003',
    fluido_direcao: 'Honda PSF',
    fluido_freio: 'DOT 4',
    torque_aperto: '33 Nm (filtro de óleo)',
    palhetas_limpador: '26" / 18"',
    aditivo_radiador: 'Honda Type 2'
  },
  {
    placa: 'DEMO003',
    marca: 'BMW',
    modelo: 'X3',
    ano: '2021',
    motor: '2.0 Turbo 16V',
    oleo_motor: 'SAE 5W-30 BMW Longlife-04',
    capacidade_oleo_motor: '5.2 litros',
    oleo_cambio_manual: 'N/A',
    capacidade_cambio_manual: 'N/A',
    oleo_cambio_automatico: 'ATF ZF Lifeguard 8',
    capacidade_cambio_automatico: '8.5 litros',
    oleo_diferencial_dianteiro: 'SAE 75W-90 API GL-5',
    capacidade_diferencial_dianteiro: '1.1 litros',
    oleo_diferencial_traseiro: 'SAE 75W-90 API GL-5',
    capacidade_diferencial_traseiro: '1.2 litros',
    oleo_caixa_transferencia: 'ATF ZF Lifeguard 8',
    filtro_oleo: '11427953129',
    filtro_ar: '13717602643',
    filtro_combustivel: '16117373814',
    filtro_cabine: '64319313519',
    filtro_oleo_cambio: '24117571227',
    fluido_direcao: 'Pentosin CHF 11S',
    fluido_freio: 'DOT 4 Low Viscosity',
    torque_aperto: '25 Nm (filtro de óleo)',
    palhetas_limpador: '24" / 20"',
    aditivo_radiador: 'BMW Coolant'
  }
]

export default function TureggonPage() {
  const [searchPlate, setSearchPlate] = useState('')
  const [searchResult, setSearchResult] = useState<VehicleData | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [searchHistory, setSearchHistory] = useState<string[]>([])
  const [searchMode, setSearchMode] = useState<'plate' | 'manual'>('plate')
  const [error, setError] = useState<string | null>(null)
  
  // Estados para busca manual
  const [selectedBrand, setSelectedBrand] = useState('')
  const [selectedModel, setSelectedModel] = useState('')
  const [selectedYear, setSelectedYear] = useState('')
  const [selectedMotor, setSelectedMotor] = useState('')

  // Extrair marcas únicas
  const brands = Array.from(new Set(mockVehicles.map(v => v.marca))).sort()
  
  // Filtrar modelos baseado na marca selecionada
  const models = selectedBrand 
    ? Array.from(new Set(mockVehicles.filter(v => v.marca === selectedBrand).map(v => v.modelo))).sort()
    : []
  
  // Filtrar anos baseado na marca e modelo selecionados
  const years = selectedBrand && selectedModel
    ? Array.from(new Set(mockVehicles.filter(v => v.marca === selectedBrand && v.modelo === selectedModel).map(v => v.ano))).sort((a, b) => parseInt(b) - parseInt(a))
    : []

  // Filtrar motores baseado na marca, modelo e ano selecionados
  const motors = selectedBrand && selectedModel && selectedYear
    ? Array.from(new Set(mockVehicles.filter(v => v.marca === selectedBrand && v.modelo === selectedModel && v.ano === selectedYear).map(v => v.motor || 'N/A'))).sort()
    : []

  const handleSearch = async () => {
    if (!searchPlate.trim()) return

    setIsSearching(true)
    setError(null)
    
    try {
      // Validar formato da placa
      if (!validarPlaca(searchPlate)) {
        setError('Formato de placa inválido. Use ABC1234 ou ABC1D23')
        setSearchResult(null)
        setIsSearching(false)
        return
      }

      // Consultar API real
      const vehicle = await consultarPlaca(searchPlate)
      
      if (vehicle) {
        setSearchResult(vehicle)
        // Adicionar ao histórico
        if (!searchHistory.includes(searchPlate.toUpperCase())) {
          setSearchHistory(prev => [searchPlate.toUpperCase(), ...prev.slice(0, 4)])
        }
      } else {
        setSearchResult(null)
        setError('Placa não encontrada na base de dados')
      }
    } catch (err) {
      console.error('Erro na consulta:', err)
      setError('Erro ao consultar placa. Tente novamente.')
      setSearchResult(null)
    }
    
    setIsSearching(false)
  }

  const handleManualSearch = async () => {
    if (!selectedBrand || !selectedModel || !selectedYear || !selectedMotor) return

    setIsSearching(true)
    setError(null)
    
    // Simular delay de busca
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    try {
      // Buscar nos dados mock
      const vehicle = mockVehicles.find(v => 
        v.marca === selectedBrand && 
        v.modelo === selectedModel && 
        v.ano === selectedYear &&
        v.motor === selectedMotor
      )
      
      setSearchResult(vehicle || null)
      if (!vehicle) {
        setError('Veículo não encontrado na base de dados')
      }
    } catch (err) {
      console.error('Erro na consulta:', err)
      setError('Erro ao consultar veículo. Tente novamente.')
      setSearchResult(null)
    }
    
    setIsSearching(false)
  }

  const formatPlate = (value: string) => {
    // Remove caracteres não alfanuméricos
    const cleaned = value.replace(/[^A-Za-z0-9]/g, '').toUpperCase()
    
    // Formato ABC1234 ou ABC1D23 (Mercosul)
    if (cleaned.length <= 3) {
      return cleaned
    } else if (cleaned.length <= 7) {
      return cleaned.slice(0, 3) + cleaned.slice(3)
    }
    return cleaned.slice(0, 7)
  }

  const handlePlateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPlate(e.target.value)
    setSearchPlate(formatted)
    setError(null)
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Logo Header - Apenas logo em fundo preto */}
      <header className="bg-black py-6 border-b border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex justify-center mb-6">
            <img 
              src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/a35d4fdc-ff2d-4d43-adae-18261b1533b1.png" 
              alt="Tureggon Logo" 
              className="h-16 w-auto"
            />
          </div>

          {/* Botões de Modo de Busca */}
          <div className="flex justify-center gap-4 max-w-md mx-auto">
            <Button
              onClick={() => {
                setSearchMode('plate')
                setError(null)
                setSearchResult(null)
              }}
              variant={searchMode === 'plate' ? 'default' : 'outline'}
              className={`flex-1 ${searchMode === 'plate' ? 'bg-[#00B8FF] hover:bg-[#0099D9]' : 'border-[#00B8FF] text-[#00B8FF] hover:bg-[#00B8FF] hover:text-white'}`}
            >
              <Search className="w-4 h-4 mr-2" />
              Buscar por Placa
            </Button>
            <Button
              onClick={() => {
                setSearchMode('manual')
                setError(null)
                setSearchResult(null)
              }}
              variant={searchMode === 'manual' ? 'default' : 'outline'}
              className={`flex-1 ${searchMode === 'manual' ? 'bg-[#00B8FF] hover:bg-[#0099D9]' : 'border-[#00B8FF] text-[#00B8FF] hover:bg-[#00B8FF] hover:text-white'}`}
            >
              <List className="w-4 h-4 mr-2" />
              Buscar sem Placa
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Consulta Veicular Completa
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Descubra todas as informações do seu veículo através da placa ou selecionando marca, modelo, ano e motor.
          </p>

          {/* Search Box - Por Placa */}
          {searchMode === 'plate' && (
            <div className="max-w-md mx-auto mb-8">
              <Card className="border-2 border-[#00B8FF] shadow-xl bg-gray-900">
                <CardHeader className="bg-[#00B8FF] text-white rounded-t-lg">
                  <CardTitle className="flex items-center justify-center space-x-2">
                    <Search className="w-5 h-5" />
                    <span>Buscar por Placa</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <Input
                        type="text"
                        placeholder="Digite a placa (ex: ABC1234)"
                        value={searchPlate}
                        onChange={handlePlateChange}
                        className="text-center text-lg font-mono tracking-wider border-2 border-[#00B8FF] focus:border-[#00D4FF] bg-gray-800 text-white"
                        maxLength={7}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleSearch()
                          }
                        }}
                      />
                      <p className="text-xs text-gray-400 mt-1">
                        Formato: ABC1234 ou ABC1D23
                      </p>
                      <p className="text-xs text-[#00B8FF] mt-2">
                        🚗 Consulta em tempo real via API Brasil
                      </p>
                    </div>

                    {error && (
                      <div className="flex items-center gap-2 p-3 bg-red-900/20 border border-red-500 rounded-lg text-red-400 text-sm">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        <span>{error}</span>
                      </div>
                    )}

                    <Button 
                      onClick={handleSearch}
                      disabled={!searchPlate.trim() || isSearching}
                      className="w-full bg-[#00B8FF] hover:bg-[#0099D9] text-white py-3 text-lg"
                    >
                      {isSearching ? (
                        <div className="flex items-center space-x-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                          <span>Consultando banco de dados...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <Search className="w-5 h-5" />
                          <span>Consultar Veículo</span>
                        </div>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Search Box - Sem Placa (Manual) */}
          {searchMode === 'manual' && (
            <div className="max-w-md mx-auto mb-8">
              <Card className="border-2 border-[#00B8FF] shadow-xl bg-gray-900">
                <CardHeader className="bg-[#00B8FF] text-white rounded-t-lg">
                  <CardTitle className="flex items-center justify-center space-x-2">
                    <List className="w-5 h-5" />
                    <span>Buscar sem Placa</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-400 mb-1 block">Marca</label>
                      <Select value={selectedBrand} onValueChange={(value) => {
                        setSelectedBrand(value)
                        setSelectedModel('')
                        setSelectedYear('')
                        setSelectedMotor('')
                        setError(null)
                      }}>
                        <SelectTrigger className="w-full border-2 border-[#00B8FF] bg-gray-800 text-white">
                          <SelectValue placeholder="Selecione a marca" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-[#00B8FF]">
                          {brands.map(brand => (
                            <SelectItem key={brand} value={brand} className="text-white hover:bg-[#00B8FF]">
                              {brand}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm text-gray-400 mb-1 block">Modelo</label>
                      <Select 
                        value={selectedModel} 
                        onValueChange={(value) => {
                          setSelectedModel(value)
                          setSelectedYear('')
                          setSelectedMotor('')
                          setError(null)
                        }}
                        disabled={!selectedBrand}
                      >
                        <SelectTrigger className="w-full border-2 border-[#00B8FF] bg-gray-800 text-white disabled:opacity-50">
                          <SelectValue placeholder="Selecione o modelo" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-[#00B8FF]">
                          {models.map(model => (
                            <SelectItem key={model} value={model} className="text-white hover:bg-[#00B8FF]">
                              {model}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm text-gray-400 mb-1 block">Ano</label>
                      <Select 
                        value={selectedYear} 
                        onValueChange={(value) => {
                          setSelectedYear(value)
                          setSelectedMotor('')
                          setError(null)
                        }}
                        disabled={!selectedModel}
                      >
                        <SelectTrigger className="w-full border-2 border-[#00B8FF] bg-gray-800 text-white disabled:opacity-50">
                          <SelectValue placeholder="Selecione o ano" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-[#00B8FF]">
                          {years.map(year => (
                            <SelectItem key={year} value={year} className="text-white hover:bg-[#00B8FF]">
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm text-gray-400 mb-1 block">Motor</label>
                      <Select 
                        value={selectedMotor} 
                        onValueChange={(value) => {
                          setSelectedMotor(value)
                          setError(null)
                        }}
                        disabled={!selectedYear}
                      >
                        <SelectTrigger className="w-full border-2 border-[#00B8FF] bg-gray-800 text-white disabled:opacity-50">
                          <SelectValue placeholder="Selecione o motor" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-[#00B8FF]">
                          {motors.map(motor => (
                            <SelectItem key={motor} value={motor} className="text-white hover:bg-[#00B8FF]">
                              {motor}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {error && (
                      <div className="flex items-center gap-2 p-3 bg-red-900/20 border border-red-500 rounded-lg text-red-400 text-sm">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        <span>{error}</span>
                      </div>
                    )}

                    <Button 
                      onClick={handleManualSearch}
                      disabled={!selectedBrand || !selectedModel || !selectedYear || !selectedMotor || isSearching}
                      className="w-full bg-[#00B8FF] hover:bg-[#0099D9] text-white py-3 text-lg"
                    >
                      {isSearching ? (
                        <div className="flex items-center space-x-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                          <span>Consultando banco de dados...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <Search className="w-5 h-5" />
                          <span>Consultar Veículo</span>
                        </div>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Search History */}
          {searchHistory.length > 0 && searchMode === 'plate' && (
            <div className="max-w-md mx-auto mb-8">
              <p className="text-sm text-gray-400 mb-2">Consultas recentes:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {searchHistory.map((plate, index) => (
                  <Badge 
                    key={index}
                    variant="outline"
                    className="cursor-pointer hover:bg-[#00B8FF] border-[#00B8FF] text-[#00B8FF] hover:text-white"
                    onClick={() => setSearchPlate(plate)}
                  >
                    {plate}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Search Results */}
      {searchResult && (
        <section className="py-8 px-4">
          <div className="container mx-auto max-w-6xl">
            {/* Informações Básicas do Veículo */}
            <Card className="border-2 border-green-500 shadow-xl bg-gray-900 mb-6">
              <CardHeader className="bg-green-600 text-white">
                <CardTitle className="flex items-center space-x-2">
                  <Car className="w-6 h-6" />
                  <span>Veículo Encontrado</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="text-center p-4 bg-[#00B8FF] rounded-lg mb-6">
                  <h3 className="text-3xl font-bold text-white">
                    {searchResult.marca} {searchResult.modelo}
                  </h3>
                  <p className="text-xl text-white mt-2">Ano: {searchResult.ano}</p>
                  <p className="text-lg text-white">Motor: {searchResult.motor}</p>
                  {searchResult.cor && (
                    <p className="text-md text-white mt-1">Cor: {searchResult.cor}</p>
                  )}
                  {searchResult.municipio && searchResult.uf && (
                    <p className="text-sm text-white mt-1">
                      {searchResult.municipio} - {searchResult.uf}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Óleos e Lubrificantes */}
            <Card className="border-2 border-[#00B8FF] shadow-xl bg-gray-900 mb-6">
              <CardHeader className="bg-[#00B8FF] text-white">
                <CardTitle className="flex items-center space-x-2">
                  <Droplet className="w-6 h-6" />
                  <span>Óleos e Lubrificantes</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-800 rounded-lg">
                    <h4 className="font-semibold text-[#00B8FF] mb-2">Óleo do Motor</h4>
                    <p className="text-white">{searchResult.oleo_motor}</p>
                    <p className="text-gray-400 text-sm mt-1">Capacidade: {searchResult.capacidade_oleo_motor}</p>
                  </div>

                  <div className="p-4 bg-gray-800 rounded-lg">
                    <h4 className="font-semibold text-[#00B8FF] mb-2">Óleo Câmbio Manual</h4>
                    <p className="text-white">{searchResult.oleo_cambio_manual}</p>
                    <p className="text-gray-400 text-sm mt-1">Capacidade: {searchResult.capacidade_cambio_manual}</p>
                  </div>

                  <div className="p-4 bg-gray-800 rounded-lg">
                    <h4 className="font-semibold text-[#00B8FF] mb-2">Óleo Câmbio Automático</h4>
                    <p className="text-white">{searchResult.oleo_cambio_automatico}</p>
                    <p className="text-gray-400 text-sm mt-1">Capacidade: {searchResult.capacidade_cambio_automatico}</p>
                  </div>

                  <div className="p-4 bg-gray-800 rounded-lg">
                    <h4 className="font-semibold text-[#00B8FF] mb-2">Óleo Diferencial Dianteiro</h4>
                    <p className="text-white">{searchResult.oleo_diferencial_dianteiro}</p>
                    <p className="text-gray-400 text-sm mt-1">Capacidade: {searchResult.capacidade_diferencial_dianteiro}</p>
                  </div>

                  <div className="p-4 bg-gray-800 rounded-lg">
                    <h4 className="font-semibold text-[#00B8FF] mb-2">Óleo Diferencial Traseiro</h4>
                    <p className="text-white">{searchResult.oleo_diferencial_traseiro}</p>
                    <p className="text-gray-400 text-sm mt-1">Capacidade: {searchResult.capacidade_diferencial_traseiro}</p>
                  </div>

                  <div className="p-4 bg-gray-800 rounded-lg">
                    <h4 className="font-semibold text-[#00B8FF] mb-2">Óleo Caixa de Transferência</h4>
                    <p className="text-white">{searchResult.oleo_caixa_transferencia}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Filtros */}
            <Card className="border-2 border-[#00B8FF] shadow-xl bg-gray-900 mb-6">
              <CardHeader className="bg-[#00B8FF] text-white">
                <CardTitle className="flex items-center space-x-2">
                  <Filter className="w-6 h-6" />
                  <span>Filtros</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="p-4 bg-gray-800 rounded-lg">
                    <h4 className="font-semibold text-[#00B8FF] mb-2">Filtro de Óleo</h4>
                    <p className="text-white font-mono text-sm">{searchResult.filtro_oleo}</p>
                  </div>

                  <div className="p-4 bg-gray-800 rounded-lg">
                    <h4 className="font-semibold text-[#00B8FF] mb-2">Filtro de Ar</h4>
                    <p className="text-white font-mono text-sm">{searchResult.filtro_ar}</p>
                  </div>

                  <div className="p-4 bg-gray-800 rounded-lg">
                    <h4 className="font-semibold text-[#00B8FF] mb-2">Filtro de Combustível</h4>
                    <p className="text-white font-mono text-sm">{searchResult.filtro_combustivel}</p>
                  </div>

                  <div className="p-4 bg-gray-800 rounded-lg">
                    <h4 className="font-semibold text-[#00B8FF] mb-2">Filtro de Cabine</h4>
                    <p className="text-white font-mono text-sm">{searchResult.filtro_cabine}</p>
                  </div>

                  <div className="p-4 bg-gray-800 rounded-lg">
                    <h4 className="font-semibold text-[#00B8FF] mb-2">Filtro Óleo Câmbio</h4>
                    <p className="text-white font-mono text-sm">{searchResult.filtro_oleo_cambio}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Fluidos e Manutenção */}
            <Card className="border-2 border-[#00B8FF] shadow-xl bg-gray-900 mb-6">
              <CardHeader className="bg-[#00B8FF] text-white">
                <CardTitle className="flex items-center space-x-2">
                  <Wrench className="w-6 h-6" />
                  <span>Fluidos e Manutenção</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-800 rounded-lg">
                    <h4 className="font-semibold text-[#00B8FF] mb-2">Fluido de Direção</h4>
                    <p className="text-white">{searchResult.fluido_direcao}</p>
                  </div>

                  <div className="p-4 bg-gray-800 rounded-lg">
                    <h4 className="font-semibold text-[#00B8FF] mb-2">Fluido de Freio</h4>
                    <p className="text-white">{searchResult.fluido_freio}</p>
                  </div>

                  <div className="p-4 bg-gray-800 rounded-lg">
                    <h4 className="font-semibold text-[#00B8FF] mb-2">Torque de Aperto</h4>
                    <p className="text-white">{searchResult.torque_aperto}</p>
                  </div>

                  <div className="p-4 bg-gray-800 rounded-lg">
                    <h4 className="font-semibold text-[#00B8FF] mb-2">Palhetas do Limpador</h4>
                    <p className="text-white">{searchResult.palhetas_limpador}</p>
                  </div>

                  <div className="p-4 bg-gray-800 rounded-lg">
                    <h4 className="font-semibold text-[#00B8FF] mb-2">Aditivo do Radiador</h4>
                    <p className="text-white">{searchResult.aditivo_radiador}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* Features */}
      <section className="py-16 px-4 bg-gray-900">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-center text-white mb-12">
            Por que escolher a Tureggon?
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow border-[#00B8FF] bg-gray-800">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-[#00B8FF] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Car className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-xl font-semibold text-white mb-2">
                  Base Completa
                </h4>
                <p className="text-gray-300">
                  Milhares de veículos nacionais e importados em nossa base de dados atualizada.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow border-[#00B8FF] bg-gray-800">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-[#00B8FF] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-xl font-semibold text-white mb-2">
                  Consulta Rápida
                </h4>
                <p className="text-gray-300">
                  Resultados em segundos. Digite a placa e tenha todas as informações na tela.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow border-[#00B8FF] bg-gray-800">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-[#00B8FF] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-xl font-semibold text-white mb-2">
                  Dados Seguros
                </h4>
                <p className="text-gray-300">
                  Informações confiáveis e atualizadas com total segurança e privacidade.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer - Apenas logo em fundo preto */}
      <footer className="bg-black text-white py-8 border-t border-gray-800">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-4">
            <img 
              src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/a35d4fdc-ff2d-4d43-adae-18261b1533b1.png" 
              alt="Tureggon Logo" 
              className="h-12 w-auto"
            />
          </div>
          <div className="mt-6 pt-6 border-t border-gray-800 text-gray-400 text-sm">
            <p>&copy; 2024 Tureggon. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
