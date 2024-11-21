import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "@/lib/auth-providwe";

export const metadata: Metadata = {
  title: "KDA GROUP - X5",
  description: "Tilta não",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body className={`antialiased font-inter`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
