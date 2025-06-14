import type { Metadata } from "next";
import { Montserrat, Geist_Mono } from "next/font/google"; // Changed Geist to Montserrat for the main font
import "./globals.css";

const montserrat = Montserrat({ // Changed from geistSans to montserrat
  variable: "--font-montserrat", // Changed variable name
  subsets: ["latin"],
  display: 'swap', // Added display swap for better performance
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${montserrat.variable} ${geistMono.variable} antialiased`} // Changed geistSans.variable to montserrat.variable
      >
        {children}
      </body>
    </html>
  );
}
