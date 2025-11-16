import "./globals.css";
import NavBar from "@/components/layout/NavBar";

export const metadata = {
  title: "Tureggon Store",
  description: "Sistema e aplicativo oficial da Tureggon Store",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="bg-[#001428] text-white">
        <NavBar />
        <main className="pt-4">{children}</main>
      </body>
    </html>
  );
}
