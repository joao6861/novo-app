import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tureggon Store",
  description: "Sistema e aplicativo oficial da Tureggon Store",
  manifest: "/site.webmanifest",
  themeColor: "#00B8FF",
  icons: {
    icon: [
      { url: "/favicon.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    title: "Tureggon Store",
    description: "Sistema e aplicativo oficial da Tureggon Store",
    url: "https://tureggon.shop", // 🟦 Coloque seu domínio aqui
    siteName: "Tureggon Store",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Tureggon Store",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tureggon Store",
    description: "Sistema e aplicativo oficial da Tureggon Store",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
