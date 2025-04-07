import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./AuthForms.css";

function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        securityQ: '',
        securityA: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Solo registramos al usuario
            await api.post('/auth/register', formData);

            setSuccess(true);
            // Redirigimos después de 2 segundos
            setTimeout(() => navigate('/'), 2000);

        } catch (err) {
            setError((err as any).response?.data?.message || 'Error al registrar. Intente nuevamente.');
            console.error(err);
        }
    };

    return (
        <div className="auth-container">
            <h2>Registro de Usuario</h2>
            {error && <div className="error-message">{error}</div>}
            {success && (
                <div className="success-message">
                    ¡Registro exitoso! Redirigiendo a inicio de sesión...
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Nombre completo</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Contraseña</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        minLength={6}
                    />
                </div>

                <div className="form-group">
                    <label>Pregunta de seguridad</label>
                    <select
                        name="securityQ"
                        value={formData.securityQ}
                        onChange={(e) => setFormData({ ...formData, securityQ: e.target.value })}
                        required
                    >
                        <option value="">Seleccione una pregunta</option>
                        <option value="¿Cuál es el nombre de tu primera mascota?">¿Cuál es el nombre de tu primera mascota?</option>
                        <option value="¿En qué ciudad naciste?">¿En qué ciudad naciste?</option>
                        <option value="¿Cuál es tu comida favorita?">¿Cuál es tu comida favorita?</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Respuesta de seguridad</label>
                    <input
                        type="text"
                        name="securityA"
                        value={formData.securityA}
                        onChange={handleChange}
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="auth-button"
                    disabled={success} // Deshabilitar botón después de registro exitoso
                >
                    {success ? '✔ Registrado' : 'Registrarse'}
                </button>
            </form>

            <p className="auth-link">
                ¿Ya tienes cuenta? <span onClick={() => navigate('/')}>Inicia sesión</span>
            </p>
        </div>
    );
}

export default Register;