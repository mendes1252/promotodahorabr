import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import "./globals.css";

const montserrat = Montserrat({ subsets: ["latin"], weight: ["400", "600", "700", "800"] });

export const metadata: Metadata = {
  title: "promotodahoraBR | As melhores ofertas do Brasil",
  description: "Curadoria das melhores promoções e descontos reais da Amazon, Shopee e Mercado Livre para você economizar com facilidade.",
  keywords: ["ofertas", "promoções", "descontos", "cupons", "amazon", "shopee", "mercado livre", "achadinhos"],
  authors: [{ name: "promotodahoraBR" }],
  openGraph: {
    title: "promotodahoraBR | As Melhores Ofertas",
    description: "Encontramos e filtramos descontos reais na Amazon, Shopee e Mercado Livre para você não perder tempo.",
    url: "https://www.promotodahorabr.com.br", // Substitua pelo seu domínio final
    siteName: "promotodahoraBR",
    images: [
      {
        url: "/assets/image3.jpeg", // Pode ser substituída por um banner largo 1200x630
        width: 800,
        height: 600,
        alt: "promotodahoraBR Logo",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={montserrat.className}>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
