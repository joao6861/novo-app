import { NextRequest, NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from "mercadopago";

const client = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN || "",
    options: { timeout: 5000 },
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { items, payer, back_urls, external_reference } = body;

        if (!items || items.length === 0) {
            return NextResponse.json({ error: "Nenhum item no carrinho." }, { status: 400 });
        }

        const preference = new Preference(client);

        const result = await preference.create({
            body: {
                items: items.map((item: any) => ({
                    id: String(item.id),
                    title: item.name,
                    quantity: item.quantity,
                    unit_price: Number(item.price),
                    currency_id: "BRL",
                    picture_url: item.image,
                })),
                payer: {
                    name: payer?.name || "",
                    email: payer?.email || "",
                    phone: {
                        area_code: payer?.phone?.slice(0, 2) || "",
                        number: payer?.phone?.slice(2) || "",
                    },
                    identification: {
                        type: "CPF",
                        number: payer?.cpf?.replace(/\D/g, "") || "",
                    },
                    address: {
                        zip_code: payer?.cep?.replace(/\D/g, "") || "",
                        street_name: payer?.endereco || "",
                        street_number: payer?.numero ? String(payer.numero) : "0",
                    },
                },
                back_urls: {
                    success: back_urls?.success || `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success`,
                    failure: back_urls?.failure || `${process.env.NEXT_PUBLIC_BASE_URL}/checkout`,
                    pending: back_urls?.pending || `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success`,
                },
                auto_return: "approved",
                external_reference: external_reference || `TRG-${Date.now()}`,
                statement_descriptor: "TUREGGON",
                payment_methods: {
                    installments: 10,
                    excluded_payment_types: [],
                },
            },
        });

        // Integração Chloe HQ: Notificar sobre a intenção de compra
        try {
            const { chloe } = await import("@/lib/chloe");
            await chloe.sendOrder({
                storeId: "tureggon-elite",
                contact: {
                    name: payer?.name || "Cliente Tureggon",
                    email: payer?.email || "",
                    phone: payer?.phone || "",
                },
                total: items.reduce((acc: number, item: any) => acc + (Number(item.price) * item.quantity), 0),
                items: items.map((item: any) => ({
                    name: item.name,
                    sku: item.sku || `SKU-${item.id}`,
                    price: Number(item.price),
                    quantity: item.quantity
                }))
            });
        } catch (chloeError) {
            console.error("Erro silencioso na integração Chloe HQ:", chloeError);
        }

        return NextResponse.json({
            id: result.id,
            init_point: result.init_point,
            sandbox_init_point: result.sandbox_init_point,
        });
    } catch (error: any) {
        console.error("Mercado Pago error:", error);
        return NextResponse.json(
            { error: "Erro ao criar preferência de pagamento.", details: error.message },
            { status: 500 }
        );
    }
}
