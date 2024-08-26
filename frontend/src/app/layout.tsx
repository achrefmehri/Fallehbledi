import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "../components/navbar/Navbar"
import { ActiveProvider } from '../components/context/activeContext';
import {Toaster} from 'react-hot-toast'
import getUser from '../helpers/getUser'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Falleh Bledi",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>)

{
  const user = await getUser();
  
  return (
    <html lang="en">
      <body className={inter.className}>
        
        <ActiveProvider>
          <Navbar />
          <Toaster position="top-center"/>
          {children}
        </ActiveProvider>
      </body>
    </html>
  );
}