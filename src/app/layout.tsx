import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import { Toaster } from "@/components/ui/sonner";
import { ChloeProvider } from "@/components/ChloeProvider";
import { ChloeSupport } from "@/components/ChloeSupport";

export const metadata = {
  title: "Tureggon Store | Elite Auto Parts",
  description: "A maior loja de auto peças premium do Brasil.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen w-full bg-white text-slate-900 antialiased">
        <ChloeProvider>
          <CartProvider>
            {children}
            <Toaster position="top-right" expand={false} richColors />
            <ChloeSupport />
          </CartProvider>
        </ChloeProvider>
      </body>
    </html>
  );
}
