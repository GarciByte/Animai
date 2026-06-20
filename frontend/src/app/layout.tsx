import type { Metadata } from 'next';
import { Nunito } from 'next/font/google';
import './globals.css';
import { CharacterProvider } from '@/context/CharacterContext';
import { NavBar } from '@/components/layout/NavBar';

// next/font descarga y sirve la fuente localmente, sin peticiones
// externas en tiempo de ejecución (mejor rendimiento y privacidad).
const nunito = Nunito({
  subsets: ['latin'],
  display: 'swap', // evita FOUT (Flash of Unstyled Text)
  variable: '--font-nunito',
  weight: ['400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: {
    default: 'Animai',
    // Las páginas que definan su propio title se mostrarán como "Título | Animai"
    template: '%s | Animai',
  },
  description:
    'Explora animes, personajes y chatea con IA que interpreta a tus personajes favoritos.',
  // favicon.ico, icon0.svg, icon1.png, apple-icon.png y manifest.json
  // se detectan automáticamente porque están en src/app/ siguiendo la
  // convención de archivos de Next.js. No hace falta declararlos aquí.
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" data-scroll-behavior="smooth" className={nunito.variable}>
      <body className="bg-background font-sans text-foreground antialiased">
        {/*
          CharacterProvider es un Client Component. El layout en sí
          sigue siendo Server Component, por lo que `export const
          metadata` sigue funcionando sin problema.
        */}
        <CharacterProvider>
          <NavBar />
          <main className="min-h-[calc(100dvh-4rem)] sm:min-h-[calc(100dvh-5rem)]">
            {children}
          </main>
        </CharacterProvider>
      </body>
    </html>
  );
}
