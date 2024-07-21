import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/context/AuthProvider";
import {Toaster} from 'sonner';

export const metadata: Metadata = {
  title: 'Mystery Message - whisper silently',
  description: "Mystery Message is an anonymous messaging app where you can send messages to anyone without revealing your identity. The recipient will not be able to identify who sent the message, ensuring complete anonymity.Stuck for words? Don't worry! Our AI-powered message generator suggests thought-provoking questions and messages to help you get started. Whether you want to ask a burning question, share a secret, or simply spark a conversation, Mystery Message has got you covered."
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
