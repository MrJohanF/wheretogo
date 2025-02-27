import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Localist - Your Personal Travel Guide',
  description: 'Discover the best places, restaurants, attractions and hidden gems recommended by locals',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="preconnect" href="https://randomuser.me" />
      </head>
      <body className={`\${inter.className} bg-white`}>
        {children}
      </body>
    </html>
  );
}