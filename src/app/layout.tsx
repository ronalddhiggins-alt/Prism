import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Prism - The Partnership",
  description: "A tool for multi-perspective understanding.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Instrument+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet" />
      </head>
      <body className="flex flex-col min-h-screen">
        <div className="flex-grow">
          {children}
        </div>
        <footer className="py-8 text-center text-xs text-gray-400 dark:text-gray-600 space-y-2">
          <p>
            <span className="font-bold">Prism v2.0</span> • Created by <span className="font-bold">Ron Higgins & Antigravity</span>
          </p>
          <p className="opacity-75">
            Original Concept (v1.0) developed with Claude 4.5 Sonnet
          </p>
          <p className="text-[10px] uppercase tracking-wider opacity-50">
            Open Source Soul • CC BY-NC-SA 4.0
          </p>
        </footer>
      </body>
    </html>
  );
}
