import { Bangers, Luckiest_Guy, Fredoka, Righteous, Zen_Dots, Electrolize } from 'next/font/google';
import './globals.css';

const bangers = Bangers({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-bangers',
});
const zenDots = Zen_Dots({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-zen-dots',
});
const electrolize = Electrolize({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-electrolize',
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${bangers.variable} ${zenDots.variable} ${electrolize.variable} antialiased bg-black`}
      >
        {children}
      </body>
    </html>
  );
}
