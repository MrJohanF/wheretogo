import './globals.css';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/app/context/AuthContext';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
});

export const metadata = {
  title: 'My Where to Go - Tu Guía de Viaje Personal',
  description: 'Descubre los mejores lugares, restaurantes, atracciones y joyas ocultas recomendadas por locales',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="preconnect" href="https://randomuser.me" />
      </head>
      <body className="bg-white">
        <AuthProvider>
          {children}
          <Toaster position="top-right" />
        </AuthProvider>
      </body>
    </html>
  );
}