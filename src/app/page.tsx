'use client'

import { useState, useEffect } from 'react'
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
import { consultarPlacaFipe, validarPlacaBrasileira } from '@/lib/placafipe-api'
import { 
  loginAutoOleo, 
  fetchAutoOleoBrands, 
  fetchAutoOleoModels, 
  fetchAutoOleoYears, 
  fetchAutoOleoMotors,
  fetchAutoOleoVehicleInfo,
  type AutoOleoVehicle 
} from '@/lib/autooleo-scraper'

// Interface para dados do veículo (compatível com mock e API)
interface VehicleData {
  placa: string
  marca: string
  modelo: string
  ano: string
  motor?: string
  cor?: string
  municipio?: string
  uf?: string
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

const AUTOOLEO_CREDENTIALS = {
  email: 'contatoaldoscenter@gmail.com',
  password: '12345'
}

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
  
  // Estados para dados do AutoOleo
  const [autoOleoToken, setAutoOleoToken] = useState<string | null>(null)
  const [brands, setBrands] = useState<string[]>([])
  const [models, setModels] = useState<string[]>([])
  const [years, setYears] = useState<string[]>([])
  const [motors, setMotors] = useState<string[]>([])
  const [isLoadingBrands, setIsLoadingBrands] = useState(false)
  const [isLoadingModels, setIsLoadingModels] = useState(false)
  const [isLoadingYears, setIsLoadingYears] = useState(false)
  const [isLoadingMotors, setIsLoadingMotors] = useState(false)

  // Fazer login no AutoOleo ao carregar a página
  useEffect(() => {
    const initAutoOleo = async () => {
      try {
        setIsLoadingBrands(true)
        const token = await loginAutoOleo(AUTOOLEO_CREDENTIALS)
        if (token) {
          setAutoOleoToken(token)
          // Buscar marcas imediatamente após login
          const brandsData = await fetchAutoOleoBrands(token)
          setBrands(brandsData)
        }
      } catch (error) {
        console.error('Erro ao inicializar AutoOleo:', error)
      } finally {
        setIsLoadingBrands(false)
      }
    }

    initAutoOleo()
  }, [])

  // Buscar modelos quando marca for selecionada
  useEffect(() => {
    const loadModels = async () => {
      if (!selectedBrand || !autoOleoToken) return
      
      try {
        setIsLoadingModels(true)
        const modelsData = await fetchAutoOleoModels(autoOleoToken, selectedBrand)
        setModels(modelsData)
      } catch (error) {
        console.error('Erro ao buscar modelos:', error)
      } finally {
        setIsLoadingModels(false)
      }
    }

    loadModels()
  }, [selectedBrand, autoOleoToken])

  // Buscar anos quando modelo for selecionado
  useEffect(() => {
    const loadYears = async () => {
      if (!selectedBrand || !selectedModel || !autoOleoToken) return
      
      try {
        setIsLoadingYears(true)
        const yearsData = await fetchAutoOleoYears(autoOleoToken, selectedBrand, selectedModel)
        setYears(yearsData)
      } catch (error) {
        console.error('Erro ao buscar anos:', error)
      } finally {
        setIsLoadingYears(false)
      }
    }

    loadYears()
  }, [selectedBrand, selectedModel, autoOleoToken])

  // Buscar motores quando ano for selecionado
  useEffect(() => {
    const loadMotors = async () => {
      if (!selectedBrand || !selectedModel || !selectedYear || !autoOleoToken) return
      
      try {
        setIsLoadingMotors(true)
        const motorsData = await fetchAutoOleoMotors(autoOleoToken, selectedBrand, selectedModel, selectedYear)
        setMotors(motorsData)
      } catch (error) {
        console.error('Erro ao buscar motores:', error)
      } finally {
        setIsLoadingMotors(false)
      }
    }

    loadMotors()
  }, [selectedBrand, selectedModel, selectedYear, autoOleoToken])

  const handleSearch = async () => {
    if (!searchPlate.trim()) return

    setIsSearching(true)
    setError(null)
    
    try {
      // Validar formato da placa
      if (!validarPlacaBrasileira(searchPlate)) {
        setError('Formato de placa inválido. Use ABC1234 ou ABC1D23')
        setSearchResult(null)
        setIsSearching(false)
        return
      }

      // Consultar API real do PlacaFIPE
      const placaData = await consultarPlacaFipe(searchPlate)
      
      // Converter dados da API para formato VehicleData
      const vehicle: VehicleData | null = placaData ? {
        placa: placaData.placa,
        marca: placaData.marca,
        modelo: placaData.modelo,
        ano: placaData.ano,
        motor: placaData.motor || 'N/A',
        cor: placaData.cor,
        municipio: placaData.municipio,
        uf: placaData.uf,
        // Dados de manutenção virão do AutoOleo posteriormente
        oleo_motor: 'Consulte manual do veículo',
        capacidade_oleo_motor: 'N/A',
        oleo_cambio_manual: 'N/A',
        capacidade_cambio_manual: 'N/A',
        oleo_cambio_automatico: 'N/A',
        capacidade_cambio_automatico: 'N/A',
        oleo_diferencial_dianteiro: 'N/A',
        capacidade_diferencial_dianteiro: 'N/A',
        oleo_diferencial_traseiro: 'N/A',
        capacidade_diferencial_traseiro: 'N/A',
        oleo_caixa_transferencia: 'N/A',
        filtro_oleo: 'N/A',
        filtro_ar: 'N/A',
        filtro_combustivel: 'N/A',
        filtro_cabine: 'N/A',
        filtro_oleo_cambio: 'N/A',
        fluido_direcao: 'N/A',
        fluido_freio: 'N/A',
        torque_aperto: 'N/A',
        palhetas_limpador: 'N/A',
        aditivo_radiador: 'N/A',
      } : null
      
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
    if (!selectedBrand || !selectedModel || !selectedYear || !selectedMotor || !autoOleoToken) return

    setIsSearching(true)
    setError(null)
    
    try {
      // Buscar informações completas do veículo no AutoOleo
      const vehicleInfo = await fetchAutoOleoVehicleInfo(
        autoOleoToken,
        selectedBrand,
        selectedModel,
        selectedYear,
        selectedMotor
      )
      
      if (vehicleInfo) {
        // Converter AutoOleoVehicle para VehicleData
        const vehicle: VehicleData = {
          placa: 'SEM PLACA',
          marca: vehicleInfo.marca,
          modelo: vehicleInfo.modelo,
          ano: vehicleInfo.ano,
          motor: vehicleInfo.motor,
          oleo_motor: vehicleInfo.oleo_motor || 'N/A',
          capacidade_oleo_motor: vehicleInfo.capacidade_oleo_motor || 'N/A',
          oleo_cambio_manual: vehicleInfo.oleo_cambio_manual || 'N/A',
          capacidade_cambio_manual: vehicleInfo.capacidade_cambio_manual || 'N/A',
          oleo_cambio_automatico: vehicleInfo.oleo_cambio_automatico || 'N/A',
          capacidade_cambio_automatico: vehicleInfo.capacidade_cambio_automatico || 'N/A',
          oleo_diferencial_dianteiro: vehicleInfo.oleo_diferencial_dianteiro || 'N/A',
          capacidade_diferencial_dianteiro: vehicleInfo.capacidade_diferencial_dianteiro || 'N/A',
          oleo_diferencial_traseiro: vehicleInfo.oleo_diferencial_traseiro || 'N/A',
          capacidade_diferencial_traseiro: vehicleInfo.capacidade_diferencial_traseiro || 'N/A',
          oleo_caixa_transferencia: vehicleInfo.oleo_caixa_transferencia || 'N/A',
          filtro_oleo: vehicleInfo.filtro_oleo || 'N/A',
          filtro_ar: vehicleInfo.filtro_ar || 'N/A',
          filtro_combustivel: vehicleInfo.filtro_combustivel || 'N/A',
          filtro_cabine: vehicleInfo.filtro_cabine || 'N/A',
          filtro_oleo_cambio: vehicleInfo.filtro_oleo_cambio || 'N/A',
          fluido_direcao: vehicleInfo.fluido_direcao || 'N/A',
          fluido_freio: vehicleInfo.fluido_freio || 'N/A',
          torque_aperto: vehicleInfo.torque_aperto || 'N/A',
          palhetas_limpador: vehicleInfo.palhetas_limpador || 'N/A',
          aditivo_radiador: vehicleInfo.aditivo_radiador || 'N/A',
        }
        
        setSearchResult(vehicle)
      } else {
        setSearchResult(null)
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
            <a href="https://tureggon.com/" target="_blank" rel="noopener noreferrer">
              <img 
                src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/a35d4fdc-ff2d-4d43-adae-18261b1533b1.png" 
                alt="Tureggon Logo" 
                className="h-16 w-auto cursor-pointer hover:opacity-80 transition-opacity"
              />
            </a>
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
                        setModels([])
                        setYears([])
                        setMotors([])
                        setError(null)
                      }}>
                        <SelectTrigger className="w-full border-2 border-[#00B8FF] bg-gray-800 text-white">
                          <SelectValue placeholder={isLoadingBrands ? "Carregando marcas..." : "Selecione a marca"} />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-[#00B8FF]">
                          {brands.map(brand => (
                            <SelectItem key={brand} value={brand} className="text-white hover:bg-[#00B8FF]">
                              {brand}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {isLoadingBrands && (
                        <p className="text-xs text-[#00B8FF] mt-1">🔄 Carregando marcas do AutoOleo...</p>
                      )}
                    </div>

                    <div>
                      <label className="text-sm text-gray-400 mb-1 block">Modelo</label>
                      <Select 
                        value={selectedModel} 
                        onValueChange={(value) => {
                          setSelectedModel(value)
                          setSelectedYear('')
                          setSelectedMotor('')
                          setYears([])
                          setMotors([])
                          setError(null)
                        }}
                        disabled={!selectedBrand || isLoadingModels}
                      >
                        <SelectTrigger className="w-full border-2 border-[#00B8FF] bg-gray-800 text-white disabled:opacity-50">
                          <SelectValue placeholder={isLoadingModels ? "Carregando modelos..." : "Selecione o modelo"} />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-[#00B8FF]">
                          {models.map(model => (
                            <SelectItem key={model} value={model} className="text-white hover:bg-[#00B8FF]">
                              {model}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {isLoadingModels && (
                        <p className="text-xs text-[#00B8FF] mt-1">🔄 Carregando modelos...</p>
                      )}
                    </div>

                    <div>
                      <label className="text-sm text-gray-400 mb-1 block">Ano</label>
                      <Select 
                        value={selectedYear} 
                        onValueChange={(value) => {
                          setSelectedYear(value)
                          setSelectedMotor('')
                          setMotors([])
                          setError(null)
                        }}
                        disabled={!selectedModel || isLoadingYears}
                      >
                        <SelectTrigger className="w-full border-2 border-[#00B8FF] bg-gray-800 text-white disabled:opacity-50">
                          <SelectValue placeholder={isLoadingYears ? "Carregando anos..." : "Selecione o ano"} />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-[#00B8FF]">
                          {years.map(year => (
                            <SelectItem key={year} value={year} className="text-white hover:bg-[#00B8FF]">
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {isLoadingYears && (
                        <p className="text-xs text-[#00B8FF] mt-1">🔄 Carregando anos...</p>
                      )}
                    </div>

                    <div>
                      <label className="text-sm text-gray-400 mb-1 block">Motor</label>
                      <Select 
                        value={selectedMotor} 
                        onValueChange={(value) => {
                          setSelectedMotor(value)
                          setError(null)
                        }}
                        disabled={!selectedYear || isLoadingMotors}
                      >
                        <SelectTrigger className="w-full border-2 border-[#00B8FF] bg-gray-800 text-white disabled:opacity-50">
                          <SelectValue placeholder={isLoadingMotors ? "Carregando motores..." : "Selecione o motor"} />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-[#00B8FF]">
                          {motors.map(motor => (
                            <SelectItem key={motor} value={motor} className="text-white hover:bg-[#00B8FF]">
                              {motor}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {isLoadingMotors && (
                        <p className="text-xs text-[#00B8FF] mt-1">🔄 Carregando motores...</p>
                      )}
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
            <a href="https://tureggon.com/" target="_blank" rel="noopener noreferrer">
              <img 
                src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/a35d4fdc-ff2d-4d43-adae-18261b1533b1.png" 
                alt="Tureggon Logo" 
                className="h-12 w-auto cursor-pointer hover:opacity-80 transition-opacity"
              />
            </a>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-800 text-gray-400 text-sm">
            <p>&copy; 2024 Tureggon. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
