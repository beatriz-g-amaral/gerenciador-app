import '../App.css';
import '../components/Dashboard.css';
import '../components/Chatbot.css';
import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
