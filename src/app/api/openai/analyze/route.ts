import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

// Força a rota a ser dinâmica (não gera durante build)
export const dynamic = 'force-dynamic'

/**
 * API Route: Analisar dados de veículo com ChatGPT
 * POST /api/openai/analyze
 */
export async function POST(request: NextRequest) {
  try {
    // Instancia o cliente OpenAI apenas em runtime
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    const { vehicleData, context } = await request.json()

    if (!vehicleData) {
      return NextResponse.json(
        { success: false, error: 'Dados do veículo não fornecidos' },
        { status: 400 }
      )
    }

    const prompt = `
Analise as seguintes informações de um veículo e forneça:
1. Um resumo técnico
2. Recomendações de manutenção
3. Avisos importantes (se houver)
4. Dicas de cuidados

Dados do veículo:
${JSON.stringify(vehicleData, null, 2)}

${context ? `Contexto adicional: ${context}` : ''}

Forneça a resposta em formato JSON com as chaves: summary, recommendations (array), warnings (array), maintenanceTips (array).
`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'Você é um especialista em manutenção automotiva. Forneça análises técnicas precisas e recomendações práticas.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    })

    const analysis = JSON.parse(completion.choices[0].message.content || '{}')

    return NextResponse.json({
      success: true,
      analysis,
    })
  } catch (error) {
    console.error('Erro ao analisar com ChatGPT:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao processar análise' },
      { status: 500 }
    )
  }
}
