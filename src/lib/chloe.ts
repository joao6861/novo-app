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
        // Busca a URL da API do ambiente. Se não houver, usa o IP da VPS de produção
        this.baseUrl = process.env.NEXT_PUBLIC_CHLOE_API_URL || 'http://187.77.50.68:3001';

        // Se ainda estivermos no navegador em localhost, forçamos o localhost para desenvolvimento
        if (typeof window !== 'undefined') {
            const host = window.location.hostname;
            if (host === 'localhost' || host === '127.0.0.1') {
                this.baseUrl = 'http://localhost:3001';
            }
        }

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
