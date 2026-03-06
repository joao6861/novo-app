"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { chloe } from '@/lib/chloe';
import { toast } from 'sonner';

interface NeuralConfig {
    urgencyEnabled: boolean;
    socialProofEnabled: boolean;
    exitIntentCoupon?: string;
}

const ChloeContext = createContext<NeuralConfig | null>(null);

export function ChloeProvider({ children }: { children: React.ReactNode }) {
    const [config, setConfig] = useState<NeuralConfig | null>(null);

    useEffect(() => {
        const loadConfig = async () => {
            const data = await chloe.getNeuralConfig();
            if (data && data.conversionRules) {
                try {
                    const rules = JSON.parse(data.conversionRules);
                    setConfig(rules);
                } catch (e) {
                    console.error("Erro ao processar as regras do Chloe HQ");
                }
            }
        };

        loadConfig();
    }, []);

    useEffect(() => {
        if (!config) return;

        // Implementação de Urgência (Exemplo: Notificação de estoque baixo aleatória)
        if (config.urgencyEnabled) {
            const interval = setInterval(() => {
                const rand = Math.random();
                if (rand > 0.8) {
                    toast("🔥 Oferta de Alta Procura!", {
                        description: "3 pessoas estão visualizando este item agora.",
                        duration: 5000,
                    });
                }
            }, 30000);
            return () => clearInterval(interval);
        }
    }, [config]);

    return (
        <ChloeContext.Provider value={config}>
            {children}
        </ChloeContext.Provider>
    );
}

export const useChloe = () => useContext(ChloeContext);
