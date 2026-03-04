"use client";

/**
 * Simple shipping calculation logic for Brazil.
 * This is a mockup of what a "Melhor Envio" or "Correios" integration would look like.
 */

export interface ShippingOption {
    id: string;
    name: string;
    price: number;
    days: number;
}

export const calculateShipping = (cep: string): ShippingOption[] => {
    // Basic validation
    const cleanCep = cep.replace(/\D/g, "");
    if (cleanCep.length !== 8) return [];

    const firstDigit = parseInt(cleanCep[0]);

    // Simulated logic based on Brazil's CEP regions
    // 0-3: SP, RJ, ES, MG (Sudeste)
    // 4: BA, SE (Nordeste)
    // 5: PE, AL, PB, RN (Nordeste)
    // 6: CE, PI, MA, PA, AP, AM, RR, AC (Norte/Nordeste)
    // 7: DF, GO, TO, MT, MS (Centro-Oeste)
    // 8: PR, SC (Sul)
    // 9: RS (Sul)

    const isSudeste = firstDigit <= 3;
    const isSul = firstDigit >= 8;

    const options: ShippingOption[] = [
        {
            id: "sedex",
            name: "SEDEX Express",
            price: isSudeste ? 25.90 : isSul ? 45.00 : 85.00,
            days: isSudeste ? 2 : isSul ? 4 : 7,
        },
        {
            id: "pac",
            name: "PAC Econômico",
            price: isSudeste ? 14.90 : isSul ? 28.00 : 55.00,
            days: isSudeste ? 5 : isSul ? 8 : 15,
        },
    ];

    // Free shipping over certain criteria (mockup)
    if (isSudeste) {
        options.push({
            id: "retirada",
            name: "Retirada em Loja (Tureggon SP)",
            price: 0,
            days: 0,
        });
    }

    return options;
};
