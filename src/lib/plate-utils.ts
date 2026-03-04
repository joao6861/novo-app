import { buscarVeiculosPorMarcaModelo } from "./vehicle-data";

export interface PlacaInfo {
    placa: string;
    marca: string | null;
    modelo: string | null;
    versao: string | null;
    ano: string | null;
    ano_modelo: string | null;
    cor: string | null;
    combustivel: string | null;
    potencia: string | null;
    cilindradas: string | null;
    passageiros: string | null;
    tipo_veiculo: string | null;
    segmento: string | null;
    uf: string | null;
    municipio: string | null;
    chassi: string | null;
}

export function tokenize(str: string | null | undefined): string[] {
    if (!str) return [];
    return str
        .toUpperCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^A-Z0-9]+/g, " ")
        .trim()
        .split(/\s+/)
        .filter((t) => t.length > 1);
}

export function canonicalizarMarcaPlaca(marcaPlaca: string) {
    let up = marcaPlaca.toUpperCase().trim();
    if (up.includes("/")) {
        const partes = up.split("/").map((p) => p.trim());
        if (partes.includes("ABARTH")) return "ABARTH";
        if (partes.includes("CHEVROLET")) return "CHEVROLET";
        up = partes[0];
    }
    if (up === "VW" || up.includes("VOLKS")) return "VOLKSWAGEN";
    if (up === "GM" || up.includes("CHEV")) return "CHEVROLET";
    if (up.includes("MERCEDES-BENZ") || up.includes("MERCEDES")) {
        return "MERCEDES BENZ";
    }
    if (up.includes("FIAT")) return "FIAT";
    if (up.includes("ABARTH")) return "ABARTH";
    if (up.includes("BMW") && up.includes("MOTO")) return "BMW MOTOS";
    if (up.includes("HARLEY")) return "HARLEY DAVIDSON MOTOS";
    if (up.includes("YAMAHA") && up.includes("MOTO")) return "YAMAHA MOTOS";
    if (up.includes("HONDA") && up.includes("MOTO")) return "HONDA MOTOS";
    return up;
}

export function calcularScoreMatch(info: PlacaInfo, v: any): number {
    let score = 0;
    const placaTokens = tokenize(`${info.modelo || ""}${info.versao || ""}`);
    const veicTokens = tokenize(v.veiculo_raw || "");
    const placaSet = new Set(placaTokens);
    const veicSet = new Set(veicTokens);

    let comuns = 0;
    placaSet.forEach((t) => {
        if (veicSet.has(t)) comuns++;
    });

    const importantTokens = placaTokens.filter(
        (t) =>
            !/^\d+$/.test(t) &&
            t.length > 2 &&
            !["FLEX", "GASOLINA", "ETANOL", "ALCOOL", "ÁLCOOL", "DIESEL"].includes(t)
    );

    let comunsImportantes = 0;
    importantTokens.forEach((t) => {
        if (veicSet.has(t)) comunsImportantes++;
    });

    if (comuns === 0) {
        score -= 10;
    } else {
        score += comuns * 4;
        score += comunsImportantes * 3;
    }

    const anoStr = info.ano_modelo || info.ano;
    const ano = anoStr ? parseInt(anoStr, 10) : NaN;
    const anoDe = v.ano_de as number | undefined;
    const anoAte = v.ano_ate as number | undefined;

    if (!isNaN(ano)) {
        if (anoDe && anoAte) {
            if (ano >= anoDe && ano <= anoAte) {
                score += 10;
            } else {
                const dist = ano < anoDe ? anoDe - ano : ano - anoAte;
                score -= Math.min(10, dist * 2);
            }
        } else if (anoDe && !anoAte) {
            if (ano >= anoDe) {
                score += 8;
            } else {
                score -= Math.min(8, (anoDe - ano) * 2);
            }
        }
    }

    if (info.combustivel && v.combustivel) {
        const normalizeFuel = (s: string) => {
            const upFuel = s.toUpperCase();
            if (upFuel.includes("DIE")) return "DIESEL";
            if (upFuel.includes("ALC") || upFuel.includes("ETAN")) return "ALCOOL";
            if (upFuel.includes("FLEX")) return "FLEX";
            if (upFuel.includes("GAS")) return "GASOLINA";
            return upFuel;
        };
        const fi = normalizeFuel(info.combustivel);
        const fv = normalizeFuel(String(v.combustivel));
        if (fi === fv) {
            score += 6;
        } else if (
            (fi === "FLEX" && (fv === "GASOLINA" || fv === "ALCOOL")) ||
            (fv === "FLEX" && (fi === "GASOLINA" || fi === "ALCOOL"))
        ) {
            score += 3;
        } else {
            score -= 2;
        }
    }

    if (info.potencia && v.potencia_cv != null) {
        const pi = parseInt(info.potencia.replace(/\D+/g, ""), 10);
        const pvRaw = v.potencia_cv;
        const pv =
            typeof pvRaw === "number"
                ? pvRaw
                : parseInt(String(pvRaw).replace(/\D+/g, ""), 10);

        if (!isNaN(pi) && !isNaN(pv)) {
            const diff = Math.abs(pi - pv);
            if (diff <= 5) score += 6;
            else if (diff <= 15) score += 3;
            else if (diff <= 30) score += 1;
            else score -= 2;
        }
    }

    return score;
}

export function buscarVeiculosPorPlacaNaBase(info: PlacaInfo): any[] {
    if (!info.marca || !info.modelo) return [];
    const marcaCanon = canonicalizarMarcaPlaca(info.marca);
    const modeloUp = (info.modelo || "").toUpperCase();
    const versaoUp = (info.versao || "").toUpperCase();
    const tokens = modeloUp.split(/\s+/).filter(Boolean);

    const mainToken =
        tokens.find(
            (t) =>
                !/\d/.test(t) &&
                t.length > 2 &&
                !["FLEX", "GASOLINA", "ETANOL", "ALCOOL", "ÁLCOOL", "DIESEL"].includes(t)
        ) || tokens[0];

    const searchTerms: string[] = [];
    const fullWithVersion = `${modeloUp} ${versaoUp}`.trim();
    if (fullWithVersion) searchTerms.push(fullWithVersion);
    if (modeloUp && !searchTerms.includes(modeloUp)) searchTerms.push(modeloUp);
    if (mainToken && !searchTerms.includes(mainToken)) searchTerms.push(mainToken);

    const cleanTokens = tokens.filter(
        (t) =>
            !/\d/.test(t) &&
            t.length > 2 &&
            !["FLEX", "GASOLINA", "ETANOL", "ALCOOL", "ÁLCOOL", "DIESEL"].includes(t)
    );
    for (const t of cleanTokens) {
        if (!searchTerms.includes(t)) searchTerms.push(t);
    }

    let candidatos: any[] = [];
    for (const term of searchTerms) {
        const r = buscarVeiculosPorMarcaModelo(marcaCanon, term);
        if (r && r.length > 0) {
            candidatos = candidatos.concat(r);
        }
    }

    if (candidatos.length === 0) return [];

    const seen = new Set<string>();
    candidatos = candidatos.filter((v) => {
        const key = `${v.marca}::${v.veiculo_raw}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });

    const scored = candidatos
        .map((v) => ({
            v,
            score: calcularScoreMatch(info, v),
        }))
        .sort((a, b) => b.score - a.score);

    const maxScore = scored[0]?.score ?? -Infinity;
    if (maxScore <= 0) {
        return [scored[0].v];
    }

    const limite = Math.max(12, maxScore * 0.65);
    const filtrados = scored.filter((s) => s.score >= limite);
    const principais = (filtrados.length ? filtrados : scored).slice(0, 3);

    if (principais.length === 3) {
        const s0 = principais[0].score;
        const s2 = principais[2].score;
        if (s0 - s2 > 6) {
            return principais.slice(0, 2).map((x) => x.v);
        }
    }

    if (principais.length >= 2) {
        const s0 = principais[0].score;
        const s1 = principais[1].score;
        if (s0 - s1 > 8) {
            return [principais[0].v];
        }
    }

    return principais.map((x) => x.v);
}

export function montarDetalhesVeiculo(r: any): string {
    const extra = r.extra || {};
    const mm = r.marca_modelo || extra.marca_modelo || {};
    const marca = r.marca || r.MARCA || mm.marca;
    const modelo = r.modelo || r.MODELO || mm.modelo;
    const versao = r.VERSAO || mm.versao;
    const anoFab = extra.ano_fabricacao || r.ano;
    const anoMod = extra.ano_modelo || r.ano_modelo || r.anoModelo;
    const placa = r.placa_modelo_novo || r.placa || extra.placa;
    const chassi = extra.chassi || r.chassi;
    const tipoVeiculo = r.tipo_veiculo?.tipo_veiculo;
    const segmento = mm.segmento;
    const cor =
        r.cor_veiculo?.cor || extra.cor_veiculo?.cor || r.cor || extra.cor;
    const combustivel = extra.combustivel || r.combustivel;
    const potencia = extra.potencia || r.potencia;
    const cilindradas = extra.cilindradas || r.cilindradas;
    const passageiros = extra.quantidade_passageiro || r.quantidade_passageiro;
    const municipio = extra.municipio?.municipio || r.municipio;
    const uf =
        extra.municipio?.uf || r.uf_placa || r.uf || extra.uf_placa || extra.uf;
    const renavam = extra.renavam ?? "Não informado";

    const partes: string[] = [];
    if (marca || modelo) {
        partes.push([marca, modelo, versao].filter(Boolean).join(" "));
    }
    if (tipoVeiculo) partes.push(`Tipo: ${tipoVeiculo}`);
    if (segmento) partes.push(`Segmento: ${segmento}`);
    if (anoFab || anoMod) {
        partes.push(`Ano: ${anoFab || "?"}/${anoMod || "?"}`);
    }
    if (placa) partes.push(`Placa: ${placa}`);
    if (chassi) partes.push(`Chassi: ${chassi}`);
    if (cor) partes.push(`Cor: ${cor}`);
    if (combustivel) partes.push(`Combustível: ${combustivel}`);
    if (potencia) partes.push(`Potência: ${potencia} cv`);
    if (cilindradas) partes.push(`Cilindradas: ${cilindradas} cc`);
    if (passageiros) partes.push(`Passageiros: ${passageiros}`);
    if (municipio || uf) {
        partes.push(`Local: ${municipio || "?"}/${uf || "?"}`);
    }
    partes.push(`Renavam: ${renavam}`);

    return partes.join(" • ");
}
