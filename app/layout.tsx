import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Providers from "@/components/Providers";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Sunil Tech Store",
  description: "By Makhosi Ncube",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <link rel="shortcut icon" href="/ico.jpg" type="image/x-icon" />
      <body
      
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >

        <div className="w-full min-h-screen bg-slate-800 text-gray-300">
          <Providers>
            <ToastContainer/>
            <Navigation/>
            <div className="mt-[65px]">
              {children}
            </div>
          </Providers>
          
        </div>
        
      </body>
    </html>
  );
}
