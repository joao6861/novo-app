import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

// Força a rota a ser dinâmica (não gera durante build)
export const dynamic = 'force-dynamic'

/**
 * API Route: Gerar recomendações de manutenção com ChatGPT
 * POST /api/openai/maintenance
 */
export async function POST(request: NextRequest) {
  try {
    // Verifica se a API key está disponível
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { success: false, error: 'OPENAI_API_KEY não configurada' },
        { status: 500 }
      )
    }

    // Instancia o cliente OpenAI apenas em runtime
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    const { marca, modelo, ano, quilometragem } = await request.json()

    if (!marca || !modelo || !ano) {
      return NextResponse.json(
        { success: false, error: 'Marca, modelo e ano são obrigatórios' },
        { status: 400 }
      )
    }

    const prompt = `
Forneça recomendações de manutenção preventiva para:
- Veículo: ${marca} ${modelo} ${ano}
${quilometragem ? `- Quilometragem: ${quilometragem} km` : ''}

Liste as principais manutenções recomendadas, incluindo:
1. Trocas de óleo e filtros
2. Revisões periódicas
3. Itens de desgaste
4. Verificações importantes

Forneça a resposta como um array JSON de strings com as recomendações.
`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'Você é um especialista em manutenção automotiva. Forneça recomendações práticas e específicas.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    })

    const response = JSON.parse(completion.choices[0].message.content || '{}')
    const recommendations = response.recommendations || []

    return NextResponse.json({
      success: true,
      recommendations,
    })
  } catch (error) {
    console.error('Erro ao gerar recomendações:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao processar recomendações' },
      { status: 500 }
    )
  }
}
