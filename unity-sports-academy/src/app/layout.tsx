import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers/Providers";
import { ConditionalNav, ConditionalFooter } from "@/components/ConditionalNav";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-heading",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Unity Sports Academy | Kenya's Premier Football Development",
  description: "Developing Kenya's next football legends at Tatu City, Nairobi. Elite training, professional pathways, and athletic excellence.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${jakarta.variable} font-sans antialiased`}>
        <Providers>
          <ConditionalNav />
          <main>{children}</main>
          <ConditionalFooter />
        </Providers>
      </body>
    </html>
  );
}
