import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import { Toaster } from "@/components/ui/sonner";

export const metadata = {
  title: "Tureggon Store | Elite Auto Parts",
  description: "A maior loja de auto peças premium do Brasil.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="dark">
      <body className="min-h-screen w-full bg-premium-dark text-white antialiased">
        <CartProvider>
          {children}
          <Toaster position="top-right" expand={false} richColors />
        </CartProvider>
      </body>
    </html>
  );
}
