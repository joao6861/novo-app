import re
import os
from collections import defaultdict

try:
    import fitz  # PyMuPDF
except ImportError:
    raise SystemExit(
        "❌ Biblioteca PyMuPDF (pymupdf) não encontrada.\n"
        "Instale com:\n\n    pip install pymupdf\n"
    )

# -----------------------------
# CONFIGURAÇÕES
# -----------------------------

# Arquivo PDF com os carros (coloque o carros.pdf na raiz do projeto)
PDF_FILE = "carros.pdf"

# Caminho de saída do arquivo TS gerado
OUTPUT_TS = os.path.join("src", "lib", "vehicle-data.ts")

# Marcas que aparecem no PDF (títulos de seção)
BRANDS = [
    "ABARTH", "AGRALE", "ALFA", "ASIA", "AUDI", "BMW", "BMW MOTOS", "BYD",
    "CADILLAC", "CHANA", "CHERY", "CHEVROLET", "CHRYSLER", "CITROEN", "CN AUTO",
    "DAEWOO", "DAFRA", "DAIHATSU", "DODGE", "EFFA", "FERRARI", "FIAT", "FORD",
    "GEELY", "GWM", "HAFEI", "HARLEY DAVIDSON MOTOS", "HAVAL", "HONDA",
    "HONDA MOTOS", "HUMMER", "HYUNDAI", "INFINITI", "IVECO", "JAC", "JAGUAR",
    "JEEP", "JINBEI", "KAWASAKI MOTOS", "KIA", "LADA", "LAND ROVER", "LEXUS",
    "LIFAN", "MAHINDRA", "MASERATI", "MAZDA", "MERCEDES BENZ", "MINI",
    "MITSUBISHI", "NISSAN", "PEUGEOT", "PORSCHE", "RAM", "RELY", "RENAULT",
    "ROYAL ENFIELD MOTOS", "SEAT", "SMART", "SSANGYONG", "SUBARU", "SUZUKI",
    "SUZUKI MOTOS", "TOYOTA", "TRIUMPH MOTOS", "TROLLER", "VOLKSWAGEN",
    "VOLVO", "YAMAHA MOTOS",
]

# Remapeia algumas marcas para o que você quer de fato usar no sistema
# Ex.: ABARTH -> FIAT, BMW MOTOS -> BMW, etc.
BRAND_REMAP = {
    "ABARTH": "FIAT",
    "BMW MOTOS": "BMW",
    "HONDA MOTOS": "HONDA",
    "SUZUKI MOTOS": "SUZUKI",
    "TRIUMPH MOTOS": "TRIUMPH",
    "YAMAHA MOTOS": "YAMAHA",
    "HARLEY DAVIDSON MOTOS": "HARLEY DAVIDSON",
}


# -----------------------------
# FUNÇÕES AUXILIARES
# -----------------------------

def is_motor_line(line: str) -> bool:
    return "MOTOR" in line.upper()


def is_year_line(line: str) -> bool:
    up = line.upper()
    # Linhas que falam de ANO ou que têm dois anos tipo "2010 ATÉ 2012"
    if "ANO" in up and any(ch.isdigit() for ch in up):
        return True
    if re.search(r"\b\d{4}\b.*\b\d{4}\b", up):
        return True
    return False


def parse_years(line: str):
    """Extrai anos da linha, expandindo intervalos. Ex.: 'ANO 2010 ATÉ 2012' -> [2010, 2011, 2012]"""
    nums = re.findall(r"\d{4}", line)
    nums = [int(n) for n in nums]
    if not nums:
        return []
    if len(nums) == 1:
        return nums
    start, end = nums[0], nums[-1]
    years = []
    step = 1 if start <= end else -1
    for y in range(start, end + step, step):
        years.append(y)
    return years


def is_model_candidate(line: str) -> bool:
    l = line.strip()
    if not l:
        return False
    up = l.upper()

    # Ignorar textos gerais ou de instrução
    if "A SEGUIR VOU MANDAR OS CARROS" in up:
        return False

    # Ignorar se for claramente outra coisa que não modelo
    skip_prefixes = [
        "MOTOR", "CÂMBIO", "CAMBIO", "TRAÇÃO", "TRACAO",
        "MODELO", "VERSÃO", "VERSAO", "CHASSIS",
        "TRANSMISSÃO", "TRANSMISSAO",
        "VISUALIZAR",
    ]
    if any(up.startswith(p) for p in skip_prefixes):
        return False

    if up in BRANDS:
        return False

    # Precisa ter algum número (1.0, 16V, 185CV, etc) para ser modelo + motor
    if not any(ch.isdigit() for ch in up):
        return False

    return True


def split_model_and_engine_hint(line: str):
    """
    Separa o modelo da parte do motor com base no primeiro token que contém número.
    Ex.: 'PULSE 1.3 16V 185CV TURBO ABARTH'
         -> model='PULSE', engine_hint='1.3 16V 185CV TURBO ABARTH'
    """
    tokens = line.strip().split()
    if not tokens:
        return "", ""

    idx = None
    for i, t in enumerate(tokens):
        if any(ch.isdigit() for ch in t):
            idx = i
            break

    if idx is None:
        # Não achou número -> modelo inteiro
        model = " ".join(tokens).title()
        return model, ""

    model_tokens = tokens[:idx]
    engine_tokens = tokens[idx:]

    model = " ".join(model_tokens).title() if model_tokens else ""
    engine_hint = " ".join(engine_tokens).upper()
    return model, engine_hint


def simplify_engine(text: str) -> str:
    """
    Tenta simplificar o motor para algo no estilo '1.3 TURBO'.
    Se não der, retona o texto em Title Case.
    """
    up = text.upper()

    # Pega a primeira cilindrada tipo 1.0, 1.3, 2.0, etc.
    m = re.search(r"\d\.\d", up)
    displacement = m.group(0) if m else None

    turbo = "TURBO" in up
    if displacement and turbo:
        return f"{displacement} TURBO"
    if displacement:
        return displacement

    # fallback
    return up.title()


# -----------------------------
# LEITURA DO PDF
# -----------------------------

if not os.path.exists(PDF_FILE):
    raise SystemExit(
        f"❌ Arquivo '{PDF_FILE}' não encontrado.\n"
        f"Coloque o carros.pdf na mesma pasta deste script e rode novamente."
    )

print(f"📄 Lendo PDF: {PDF_FILE}")
doc = fitz.open(PDF_FILE)

all_lines = []
for page in doc:
    text = page.get_text()
    for raw in text.splitlines():
        line = raw.strip()
        if line:
            all_lines.append(line)

print(f"➡️  Total de linhas lidas do PDF: {len(all_lines)}")

# -----------------------------
# PARSE DOS VEÍCULOS (BRUTO)
# -----------------------------

vehicles_raw = []

current_brand_raw = None
current_brand_norm = None
current_model_name = None
engine_parts = []     # pedaços de texto que falam de motor
current_year_line = None

for line in all_lines:
    line = line.strip()
    if not line:
        continue

    # Se for uma marca
    if line in BRANDS:
        # Finaliza o veículo anterior se estiver completo
        if current_brand_norm and current_model_name and current_year_line:
            years = parse_years(current_year_line)
            if years:
                if engine_parts:
                    engine_text = " / ".join(engine_parts)
                    engine_simple = simplify_engine(engine_text)
                    engines = [engine_simple] if engine_simple else []
                else:
                    engines = []

                vehicles_raw.append({
                    "brand": current_brand_norm,
                    "model": current_model_name,
                    "engines": engines,
                    "years": years,
                })

        # Inicia novo bloco de marca
        current_brand_raw = line
        current_brand_norm = BRAND_REMAP.get(line, line).title()
        current_model_name = None
        engine_parts = []
        current_year_line = None
        continue

    # Ano
    if is_year_line(line):
        current_year_line = line
        continue

    # Motor (linhas com "MOTOR ...")
    if is_motor_line(line):
        engine_parts.append(line)
        continue

    # Modelo (com motor embutido na mesma linha)
    if is_model_candidate(line) and current_model_name is None:
        model_name, engine_hint = split_model_and_engine_hint(line)
        if model_name:
            current_model_name = model_name
        if engine_hint:
            engine_parts.append(engine_hint)
        continue

# Finaliza o último veículo, se houver
if current_brand_norm and current_model_name and current_year_line:
    years = parse_years(current_year_line)
    if years:
        if engine_parts:
            engine_text = " / ".join(engine_parts)
            engine_simple = simplify_engine(engine_text)
            engines = [engine_simple] if engine_simple else []
        else:
            engines = []

        vehicles_raw.append({
            "brand": current_brand_norm,
            "model": current_model_name,
            "engines": engines,
            "years": years,
        })

print(f"🚗 Veículos brutos encontrados (com modelo/ano): {len(vehicles_raw)}")

# -----------------------------
# AGREGAÇÃO POR (MARCA, MODELO)
# -----------------------------

agg = defaultdict(lambda: {"brand": "", "model": "", "engines": set(), "years": set()})

for v in vehicles_raw:
    key = (v["brand"], v["model"])
    entry = agg[key]
    entry["brand"] = v["brand"]
    entry["model"] = v["model"]
    for e in v["engines"]:
        if e:
            entry["engines"].add(e)
    for y in v["years"]:
        entry["years"].add(y)

vehicles = []
for (brand, model), data in agg.items():
    engines = sorted(data["engines"])
    years = sorted(data["years"])
    vehicles.append({
        "brand": brand,
        "model": model,
        "engines": engines,
        "years": years,
    })

# Ordena pelo nome da marca e modelo
vehicles.sort(key=lambda v: (v["brand"], v["model"]))

print(f"✅ Veículos únicos (marca + modelo): {len(vehicles)}")

# -----------------------------
# GERAÇÃO DO ARQUIVO vehicle-data.ts
# -----------------------------

os.makedirs(os.path.dirname(OUTPUT_TS), exist_ok=True)

with open(OUTPUT_TS, "w", encoding="utf-8") as f:
    f.write("// ATENÇÃO: arquivo gerado automaticamente a partir de carros.pdf\n")
    f.write("// NÃO EDITE À MÃO – rode generate_vehicle_data_from_pdf.py novamente se precisar atualizar.\n\n")
    f.write("export type VehicleOption = {\n")
    f.write("  brand: string;\n")
    f.write("  model: string;\n")
    f.write("  engines: string[];\n")
    f.write("  years: number[];\n")
    f.write("};\n\n")
    f.write("export const vehicleOptions: VehicleOption[] = [\n")

    for v in vehicles:
        brand = v["brand"].replace('"', '\\"')
        model = v["model"].replace('"', '\\"')
        engines_list = ", ".join(f'"{e.replace(\'"\', \'\\\\"\')}"' for e in v["engines"])
        years_list = ", ".join(str(y) for y in v["years"])

        f.write("  {\n")
        f.write(f'    brand: "{brand}",\n')
        f.write(f'    model: "{model}",\n')
        f.write(f"    engines: [{engines_list}],\n")
        f.write(f"    years: [{years_list}],\n")
        f.write("  },\n")

    f.write("] as const;\n")

print(f"💾 Arquivo TypeScript gerado em: {OUTPUT_TS}")
print("Pronto! Agora é só importar em page.tsx:")
print('  import { vehicleOptions } from "@/lib/vehicle-data";')
