import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const response = await fetch("https://consultaplaca.store");

    const text = await response.text();

    return NextResponse.json({
      status: response.status,
      length: text.length
    });

  } catch (error: any) {
    return NextResponse.json({
      error: error.message
    }, { status: 500 });
  }
}
