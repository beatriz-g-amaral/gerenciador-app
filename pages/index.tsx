import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Dashboard from '../src/components/Dashboard';

function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      router.push('/login');
    } else {
      setLoading(false);
    }
  }, [router]);

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Carregando...</div>;
  }

  return (
    <div className="App">
      <Dashboard />
    </div>
  );
}

export default Home;
