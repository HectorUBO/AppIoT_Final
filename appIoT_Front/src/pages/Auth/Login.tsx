import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './AuthForms.css';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await api.post('/auth/initial-login', {
        email: formData.email,
        password: formData.password
      });

      localStorage.setItem('tempToken', response.data.tempToken);
      navigate('/verify-security', { state: { securityQ: response.data.securityQ } });
    } catch (err) {
      setError('Email o contraseña incorrectos');
      console.error('Error en login:', err.response?.data || err.message);
    }
  };

  return (
    <div className="auth-container">
      <h2>Iniciar Sesión</h2>
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>Contraseña</label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
        </div>

        <button type="submit" className="auth-button">Continuar</button>
      </form>

      <p className="auth-link">
        ¿No tienes cuenta? <span onClick={() => navigate('/register')}>Regístrate</span>
      </p>
    </div>
  );
}

export default Login;