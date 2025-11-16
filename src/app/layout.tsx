import "./globals.css";

export const metadata = {
  title: "Tureggon",
  description: "Sistema Tureggon iguais ao layout da Lasy",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className="bg-gradient-to-b from-[#02C4FF] via-[#0091FF] to-[#001F3F] min-h-screen text-white">
        {children}
      </body>
    </html>
  );
}

