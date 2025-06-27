import '../styles/globals.css';

import { Inter, Montserrat } from 'next/font/google';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const montserrat = Montserrat({ subsets: ['latin'], variable: '--font-montserrat' });

export const metadata = {
  title: 'PlayerDoge',
  description: 'Best in-game top-ups',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${montserrat.variable} bg-[#FEFFD2] text-[#1D1D1D]`}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
