// src/app/api/scrape/route.ts
import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

const LOGIN_URL = 'https://autooleoapp.com.br/app/login.html'; // TODO: trocar pela URL de login
const DATA_URL  = 'https://autooleoapp.com.br/app/index.html'; // TODO: trocar pela página que tem os veículos

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email e senha são obrigatórios' },
        { status: 400 }
      );
    }

    console.log('🚀 Iniciando scraping genérico...');

    // 1) LOGIN
    const loginBody = new URLSearchParams({
      // Ajuste os nomes dos campos conforme o formulário do site
      email,
      password,
    }).toString();

    const loginResponse = await fetch(LOGIN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
      body: loginBody,
      redirect: 'manual',
    });

    if (!loginResponse.ok) {
      const text = await loginResponse.text();
      console.error('❌ Falha no login:', loginResponse.status);
      return NextResponse.json(
        {
          error: 'Falha no login',
          details: `Status: ${loginResponse.status}`,
          responseSnippet: text.slice(0, 500),
        },
        { status: 401 }
      );
    }

    // Pega cookie de sessão
    const cookies = loginResponse.headers.get('set-cookie') ?? '';
    console.log('✅ Login realizado, cookies recebidos');

    // 2) ACESSAR PÁGINA COM DADOS
    const dataResponse = await fetch(DATA_URL, {
      method: 'GET',
      headers: {
        Cookie: cookies,
      },
    });

    if (!dataResponse.ok) {
      const text = await dataResponse.text();
      console.error('❌ Erro ao buscar página de dados:', dataResponse.status);
      return NextResponse.json(
        {
          error: 'Erro ao buscar página de dados',
          details: `Status: ${dataResponse.status}`,
          responseSnippet: text.slice(0, 500),
        },
        { status: 500 }
      );
    }

    const html = await dataResponse.text();
    const $ = cheerio.load(html);
    const pageTitle = $('title').first().text().trim() || null;

    // 3) EXEMPLO DE EXTRAÇÃO GENÉRICA (AJUSTE PRO SEU CASO)
    const vehicles: any[] = [];

    // Troque ".vehicle-card" e os seletores internos pelos do site que você tem permissão de raspar
    $('.vehicle-card').each((_, el) => {
      const marca = $(el).find('.vehicle-brand').text().trim();
      const modelo = $(el).find('.vehicle-model').text().trim();
      const motor = $(el).find('.vehicle-engine').text().trim();
      const ano   = $(el).find('.vehicle-year').text().trim();

      if (marca || modelo || motor || ano) {
        vehicles.push({
          marca,
          modelo,
          motor,
          ano,
          // aqui você pode adicionar mais campos conforme o HTML
        });
      }
    });

    const totalFound = vehicles.length;

    const responsePayload = {
      timestamp: new Date().toISOString(),
      method: 'scraping HTML com cheerio (modelo genérico)',
      pageTitle,
      totalFound,
      note: 'Ajuste LOGIN_URL, DATA_URL e os seletores para o site que você estiver usando e tiver autorização.',
      htmlSnippet: html.slice(0, 1000), // só um pedaço do HTML, se quiser ver
      vehicles,
    };

    console.log(`✅ Scraping concluído. Registros extraídos: ${totalFound}`);

    return NextResponse.json(responsePayload);
  } catch (error: any) {
    console.error('❌ Erro no scraping:', error);

    return NextResponse.json(
      {
        error: 'Erro ao fazer scraping',
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
