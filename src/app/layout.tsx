import type { Metadata } from "next";
import { Mali } from "next/font/google";
import "./globals.css";

const font = Mali({ 
  weight: ['400', '500', '600', '700'],
  subsets: ["latin", "thai"] 
});

export const metadata: Metadata = {
  title: "Class Fund App 🌸",
  description: "Manage class income and expenses adorably",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={font.className}>
        <div className="min-h-screen">
          <header className="bg-white/80 backdrop-blur-sm border-b-2 border-pink-200 sticky top-0 z-10">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
              <h1 className="text-2xl font-bold text-pink-500 tracking-wide">
                🌸 เงินกองกลางห้อง 🌸
              </h1>
            </div>
          </header>
          <main className="container mx-auto px-4 py-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
