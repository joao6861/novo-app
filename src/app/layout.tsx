import "./globals.css";
import NavBar from "@/components/layout/NavBar";
import BottomNav from "@/components/layout/BottomNav";

export const metadata = {
  title: "Tureggon Store",
  description: "Sistema e aplicativo oficial da Tureggon Store",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="bg-[#001428] text-white">
        <NavBar />

        {/* Conteúdo da página */}
        <main className="pt-4 pb-20">{children}</main>

        {/* Navegação inferior estilo app */}
        <BottomNav />
      </body>
    </html>
  );
}
