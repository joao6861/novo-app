import "./globals.css";
import NavBar from "@/components/layout/NavBar";

export const metadata = {
  title: "Tureggon Store",
  description: "Sistema e aplicativo oficial da Tureggon Store",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className="bg-gradient-to-b from-[#02C4FF] via-[#0091FF] to-[#001F3F] text-white min-h-screen">
        <NavBar />
        <main className="pt-4">
          {children}
        </main>
      </body>
    </html>
  );
}
