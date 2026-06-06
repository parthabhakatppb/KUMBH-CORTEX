import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kumbh-Cortex | AI Command Center",
  description:
    "Predictive AI-Powered Command Center Dashboard for Ujjain Mahakumbh 2028 — Real-time crowd management, incident response, and strategic operations for 300M+ pilgrims.",
  keywords: "Mahakumbh 2028, AI, crowd management, command center, Ujjain, smart city",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-slate-950 text-slate-100 antialiased">
        {children}
      </body>
    </html>
  );
}