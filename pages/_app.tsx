import '../src/App.css';
import '../src/components/Dashboard.css';
import '../src/components/Chatbot.css';
import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
