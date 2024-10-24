import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
  
    const handleLogin = async (e) => {
      e.preventDefault();
      try {
        const response = await axios.post('http://localhost:5000/api/auth/login', {
          username,
          password,
        });
        const token = response.data.token;
        localStorage.setItem('token', token);
        console.log('Login bem-sucedido!');
        // Redireciona o usuário para o dashboard
        navigate('/dashboard');
      } catch (error) {
        console.error('Erro ao fazer login:', error);
      }
    };
  
    return (
      <div style={{ padding: '20px' }}>
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <div>
            <label>Nome de Usuário:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Senha:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
    );
};
  
export default LoginPage;