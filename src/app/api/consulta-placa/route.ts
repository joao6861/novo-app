import { NextRequest, NextResponse } from "next/server";
import type { PlateApiRoot } from "@/lib/plate-api-types"; // ⬅️ usa as interfaces que você criou em src/lib/plate-api-types.ts

export async function POST(req: NextRequest) {
  try {
    const { placa } = await req.json();

    if (!placa) {
      return NextResponse.json(
        { error: true, message: "Informe a placa." },
        { status: 400 }
      );
    }

    // Normaliza a placa (tira espaços e caracteres estranhos)
    const limpa = placa.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();

    const formData = new URLSearchParams();
    // o endpoint espera exatamente o campo "placa"
    formData.set("placa", limpa);

    const externalResponse = await fetch(
      "https://consultaplaca.store/proxy.php",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        },
        body: formData.toString(),
      }
    );

    if (!externalResponse.ok) {
      const text = await externalResponse.text();
      return NextResponse.json(
        {
          error: true,
          message: "Falha na API externa",
          details: text,
        },
        { status: 500 }
      );
    }

    // 👇 aqui usamos o tipo PlateApiRoot pra tipar TUDO que vem da API
    const data: PlateApiRoot = await externalResponse.json();

    // data é exatamente:
    // {
    //   error: false,
    //   message: "Requisição processada com sucesso",
    //   response: { ...todos aqueles campos que você me mandou... },
    //   api_limit,
    //   api_limit_for,
    //   api_limit_used
    // }

    // Se você quiser reaproveitar TODOS os dados no front,
    // é só retornar o objeto inteiro sem mexer:
    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: true, message: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
