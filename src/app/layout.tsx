import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: "HARU Leather | Calzado en Cuero Artesanal",
  description:
    "Calzado artesanal en cuero genuino hecho en Colombia. Tenis casuales desde $175.000 COP y botas en cuero desde $239.900 COP. Envio a todo el pais. Estilo premium, elegancia masculina.",
  keywords: [
    "calzado cuero",
    "zapatos cuero Colombia",
    "botas cuero hombre",
    "tenis cuero",
    "HARU Leather",
    "calzado artesanal",
    "cuero genuino",
  ],
  openGraph: {
    title: "HARU Leather | Calzado en Cuero Artesanal",
    description:
      "Calzado artesanal en cuero genuino hecho en Colombia. Estilo premium, elegancia masculina.",
    type: "website",
    locale: "es_CO",
    siteName: "HARU Leather",
  },
  twitter: {
    card: "summary_large_image",
    title: "HARU Leather | Calzado en Cuero Artesanal",
    description:
      "Calzado artesanal en cuero genuino hecho en Colombia. Estilo premium, elegancia masculina.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
