import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { ScreenReaderProvider } from "@/context/ScreenReaderContext";
import { AuthProvider } from "@/context/AuthContext";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AccessibilityMenu } from "@/components/layout/AccessibilityMenu";
import { VotingImportanceTicker } from "@/components/ui/VotingImportanceTicker";
import { AuthModalWrapper } from "@/components/ui/AuthModalWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ElectiQ — Democracy Verified",
  description:
    "ElectiQ is India's most advanced voter intelligence platform. Verify election claims, find polling booths, bust myths, and understand your rights — powered by Google Vertex AI.",
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    shortcut: "/favicon.svg",
  },
  keywords: ["election", "ECI", "voter", "India", "fact check", "polling booth", "democracy"],
  openGraph: {
    title: "ElectiQ — Democracy Verified",
    description: "Verify claims, find booths, and understand the Constitution — powered by Vertex AI.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[var(--bg)] text-[var(--text)] transition-colors">
        <AuthProvider>
          <ThemeProvider>
            <ScreenReaderProvider>
              <Header />
              <main className="flex-grow pt-20">
                {children}
              </main>
              <VotingImportanceTicker />
              <Footer />
              <AccessibilityMenu />
              {/* Render AuthModal at root level for proper centering */}
              <AuthModalWrapper />
            </ScreenReaderProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
