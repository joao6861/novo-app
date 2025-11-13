import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  const supabase = getSupabaseAdmin();

  if (!supabase) {
    return NextResponse.json(
      { ok: false, error: "Cliente admin não carregou." },
      { status: 500 }
    );
  }

  // Teste simples: pegar apenas 1 linha da tabela vehicles (se existir)
  const { data, error } = await supabase
    .from("vehicles")
    .select("id, marca, modelo, ano")
    .limit(1);

  if (error) {
    return NextResponse.json(
      {
        ok: false,
        error: "Erro ao acessar Supabase com service_role",
        details: error.message,
      },
      { status: 500 }
    );
  }

  return NextResponse.json({
    ok: true,
    message: "Service Role funcionando!",
    result: data,
  });
}
