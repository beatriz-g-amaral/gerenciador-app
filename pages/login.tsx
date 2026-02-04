import React, { useState } from 'react';
import { useRouter } from 'next/router';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('/api/lhc/restapi/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          username,
          password,
          generate_token: 'true',
          device: 'android'
        }).toString(),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Login successful', data);
        
        localStorage.setItem('isLoggedIn', 'true');
        if (data.token) {
          localStorage.setItem('auth_token', data.token);
        }

        router.push('/');
      } else {
        const errorData = await response.json().catch(() => ({}));
        setError(errorData.message || 'Falha no login. Verifique suas credenciais.');
      }
    } catch (err) {
      console.error(err);
      setError('Erro ao conectar com o servidor.');
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#f0f2f5',
      fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif'
    }}>
      <div style={{
        padding: '2rem',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <h1 style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#333' }}>Login Zap3stor</h1>
        {error && <div style={{ 
          backgroundColor: '#fee2e2', 
          color: '#991b1b', 
          padding: '0.75rem', 
          borderRadius: '4px', 
          marginBottom: '1rem', 
          textAlign: 'center',
          fontSize: '0.875rem'
        }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="username" style={{ display: 'block', marginBottom: '0.5rem', color: '#4b5563', fontSize: '0.875rem', fontWeight: 500 }}>Usuário</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                fontSize: '1rem',
                outline: 'none',
                boxSizing: 'border-box'
              }}
              required
            />
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="password" style={{ display: 'block', marginBottom: '0.5rem', color: '#4b5563', fontSize: '0.875rem', fontWeight: 500 }}>Senha</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                fontSize: '1rem',
                outline: 'none',
                boxSizing: 'border-box'
              }}
              required
            />
          </div>
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '1rem',
              cursor: 'pointer',
              fontWeight: '600',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1d4ed8'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
