import "./globals.css";

export const metadata = {
  title: "Tureggon Store",
  description: "Sistema e aplicativo oficial da Tureggon Store",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="bg-gradient-to-b from-[#009dff] via-[#0064d4] to-[#001428] text-white min-h-screen">
  {children}
</body>

        {/* NavBar removido */}
        <main>{children}</main>
      </body>
    </html>
  );
}
