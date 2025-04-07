import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../services/api';
import './AuthForms.css';

function SecurityVerification() {
    const navigate = useNavigate();
    const location = useLocation();
    const securityQ = location.state?.securityQ || ''; // Obtener la pregunta desde el state
    const [securityA, setSecurityA] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const tempToken = localStorage.getItem('tempToken');
            const response = await api.post('/auth/verify-security', {
                tempToken,
                answer: securityA
            });

            localStorage.setItem('token', response.data.access_token);
            navigate('/dashboard');
        } catch (err) {
            setError('Respuesta incorrecta');
        }
    };

    return (
        <div className="auth-container">
            <h2>Verificación de Seguridad</h2>
            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Pregunta de seguridad:</label>
                    <p className="security-question">{securityQ}</p>
                </div>

                <div className="form-group">
                    <label>Respuesta</label>
                    <input
                        type="text"
                        value={securityA}
                        onChange={(e) => setSecurityA(e.target.value)}
                        required
                    />
                </div>

                <button type="submit" className="auth-button">Verificar</button>
            </form>
        </div>
    );
}

export default SecurityVerification;
