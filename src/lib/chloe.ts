export interface ChloeOrder {
    storeId: string;
    contact: {
        name: string;
        email: string;
        phone: string;
    };
    total: number;
    items: Array<{
        name: string;
        sku: string;
        price: number;
        quantity: number;
    }>;
}

export class ChloeClient {
    private baseUrl: string;
    private storeSlug: string;

    constructor() {
        this.baseUrl = process.env.NEXT_PUBLIC_CHLOE_API_URL || 'http://localhost:3001';
        this.storeSlug = 'tureggon-elite';
    }

    async sendOrder(orderData: ChloeOrder) {
        try {
            const response = await fetch(`${this.baseUrl}/events/order`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...orderData,
                    slug: this.storeSlug,
                    timestamp: new Date().toISOString()
                }),
            });

            if (!response.ok) {
                console.error('Erro ao enviar pedido para Chloe HQ');
            }

            return await response.json();
        } catch (error) {
            console.error('Falha na comunicação com Chloe HQ:', error);
            return null;
        }
    }

    async getNeuralConfig() {
        try {
            const response = await fetch(`${this.baseUrl}/marketing/neural-config?slug=${this.storeSlug}`);
            if (!response.ok) return null;
            return await response.json();
        } catch (error) {
            return null;
        }
    }
}

export const chloe = new ChloeClient();
