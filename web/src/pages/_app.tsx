import type { AppProps } from 'next/app';

import { AuthProvider } from '../context/AuthContext';

import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    // Aplicando Provider de autenticação em nossa aplicação
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default MyApp
