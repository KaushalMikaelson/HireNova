import type { Metadata } from "next";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/ui/header";
import { ClerkProvider } from "@clerk/nextjs";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HireNova",
  description: "AI-Powered Talent Intelligence Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >

        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {/* Header */}
            <Header />  
            <main className="min-h-screen">
            {children}
            </main>
            
            
            
            <footer className="bg-muted/50 py-12">
              <div className="container mx-auto px-4 text-center text-gray-500">
                <p>Made by <span className="text-primary">Kaushal</span></p>
              </div>
            </footer>
          </ThemeProvider>
        
      </body>
    </html>
    </ClerkProvider>
  );
}
