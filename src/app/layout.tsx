import "./globals.css";

export const metadata = {
  title: "Tureggon Store",
  description: "Sistema e aplicativo oficial da Tureggon Store",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="bg-[#001428] text-white">
        {/* NavBar removido */}
        <main>{children}</main>
      </body>
    </html>
  );
}
