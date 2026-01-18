import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Writing Practice",
  description: "A personal fiction writing practice app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
