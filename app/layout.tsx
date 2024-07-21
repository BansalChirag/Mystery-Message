import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/context/AuthProvider";
import {Toaster} from 'sonner';

export const metadata: Metadata = {
  title: 'Mystery Message',
  description: 'Message Annonymously',
}

const inter = Inter({subsets: ["latin"], weight: ["100", "200", "300", "400", "500", "700"]})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <AuthProvider>
      <body className={inter.className}>
        <Toaster richColors />
        {children}
        </body>
      </AuthProvider>
    </html>
  );
}
