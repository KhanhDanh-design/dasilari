import type { Metadata } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { LanguageProvider } from "@/components/providers/language-provider";
import FloatingChatbox from "../components/chat/FloatingChatbox";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-body",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DasiLari | Du lich Da Lat thong minh",
  description:
    "Nen tang du lich Da Lat ca nhan hoa bang ban do tuong tac va tro ly AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${plusJakartaSans.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background text-foreground">
        <LanguageProvider>
          <div className="relative flex min-h-screen flex-col overflow-x-clip">
            <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[420px] bg-[radial-gradient(70%_60%_at_10%_0%,rgba(188,224,205,0.5),transparent),radial-gradient(40%_45%_at_85%_15%,rgba(244,228,179,0.45),transparent)]" />
            <Navbar />
            <main className="flex-1 px-4 pb-10 pt-24 sm:px-8 lg:px-12">
              {children}
            </main>
            <Footer />
            <FloatingChatbox />
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
}
