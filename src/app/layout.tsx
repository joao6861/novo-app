import "./globals.css";
import NavBar from "@/components/layout/NavBar";

export const metadata = {
  title: "Tureggon Store",
  description: "Sistema e aplicativo oficial da Tureggon Store",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className="bg-gradient-to-b from-[#009dff] via-[#0064d4] to-[#001428] text-white min-h-screen">
        <NavBar />
        <main className="pt-4">{children}</main>
      </body>
    </html>
  );
}
