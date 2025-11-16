import "./globals.css";

export const metadata = {
  title: "Tureggon Store",
  description: "Sistema Tureggon igual ao layout da Lasy",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen w-full">
        {children}
      </body>
    </html>
  );
}
