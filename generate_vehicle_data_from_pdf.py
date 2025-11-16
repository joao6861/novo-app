# generate_vehicle_data_from_pdf.py
# ---------------------------------------------------------
# Lê o arquivo carros.pdf e gera src/lib/vehicle-data.ts
# com todos os veículos encontrados.
# ---------------------------------------------------------

import fitz  # PyMuPDF
from pathlib import Path

# Caminhos
PDF_PATH = Path("carros.pdf")                 # o seu PDF
OUTPUT_PATH = Path("src/lib/vehicle-data.ts")  # saída TS


def parse_pdf(path: Path):
    doc = fitz.open(path)
    vehicles = []

    for page in doc:
        # pega todas as linhas de texto da página
        lines = [l.strip() for l in page.get_text().splitlines() if l.strip()]
        i = 0

        while i < len(lines):
            # cada veículo começa em uma linha "VISUALIZAR"
            if lines[i] != "VISUALIZAR":
                i += 1
                continue

            start = i + 1
            j = start

            # bloco até o próximo "VISUALIZAR" ou fim da página
            while j < len(lines) and lines[j] != "VISUALIZAR":
                j += 1

            block = lines[start:j]

            # bloco pequeno demais → ignora
            if len(block) < 3:
                i = j
                continue

            # última linha do bloco é a MARCA (AUDI, BMW, FIAT, RENAULT, BMW MOTOS, etc.)
            brand = block[-1]
            content = block[:-1]  # resto das linhas

            # primeira linha costuma ser "modelo + motorização"
            title = content[0]

            year_line = ""
            engine_line = ""
            cambio_line = ""
            other_lines = []

            for l in content[1:]:
                txt = l.upper()
                if (not year_line) and "ANO" in txt:
                    year_line = l
                elif (not engine_line) and "MOTOR" in txt:
                    engine_line = l
                elif (not cambio_line) and ("CÂMBIO" in txt or "CAMBIO" in txt):
                    cambio_line = l
                else:
                    other_lines.append(l)

            # chute simples de categoria (você pode melhorar depois)
            brand_up = brand.upper()
            title_up = title.upper()
            if "MOTO" in brand_up or "MOTOS" in brand_up or "MOTO" in title_up:
                category = "moto"
            else:
                category = "carro"

            vehicles.append(
                {
                    "brand": brand,
                    "title": title,
                    "engine": engine_line,
                    "transmission": cambio_line,
                    "years": year_line,
                    "extra": other_lines,
                    "category": category,
                }
            )

            i = j

    return vehicles


def build_ts(vehicles):
    header = """// ATENÇÃO:
// Este arquivo foi gerado automaticamente a partir de carros.pdf
// Se você atualizar o PDF, rode novamente generate_vehicle_data_from_pdf.py

export type VehicleCategory =
  | "carro"
  | "moto"
  | "caminhonete"
  | "caminhão"
  | "ônibus"
  | "outro";

export interface Vehicle {
  brand: string;          // Marca (ex: "AUDI")
  title: string;          // Linha principal do modelo (modelo + motorização)
  engine?: string;        // Linha que contém "MOTOR"
  transmission?: string;  // Linha que contém "CÂMBIO"
  years?: string;         // Linha que contém "ANO"
  extra: string[];        // Outras informações úteis do bloco
  category: VehicleCategory;
}

export const vehicles: Vehicle[] = [
"""

    def esc(s: str) -> str:
        return s.replace("\\", "\\\\").replace('"', '\\"')

    lines = [header]

    for v in vehicles:
        extra_list = ", ".join(f'"{esc(x)}"' for x in v["extra"])

        lines.append(
            "  {\n"
            f'    brand: "{esc(v["brand"])}",\n'
            f'    title: "{esc(v["title"])}",\n'
            f'    engine: "{esc(v["engine"])}",\n'
            f'    transmission: "{esc(v["transmission"])}",\n'
            f'    years: "{esc(v["years"])}",\n'
            f'    extra: [{extra_list}],\n'
            f'    category: "{v["category"]}",\n'
            "  },\n"
        )

    lines.append("];\n\nexport default vehicles;\n")
    return "".join(lines)


def main():
    if not PDF_PATH.exists():
        raise SystemExit(f"PDF não encontrado: {PDF_PATH}")

    print(f"Lendo PDF: {PDF_PATH}")
    vehicles = parse_pdf(PDF_PATH)
    print(f"Encontrados {len(vehicles)} veículos.")

    ts_code = build_ts(vehicles)

    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_PATH.write_text(ts_code, encoding="utf-8")

    print(f"Arquivo TypeScript gerado em: {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
