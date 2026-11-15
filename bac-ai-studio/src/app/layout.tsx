import type { Metadata } from "next";
import "./globals.css";
import "katex/dist/katex.min.css";

export const metadata: Metadata = {
  title: "BAC AI TUNISIA — Educational Content Studio",
  description: "Studio local de création de contenu pédagogique pour le Baccalauréat Sciences de l'Informatique (2026–2027)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className="antialiased bg-[#070B14] text-slate-100">
        {children}
      </body>
    </html>
  );
}
