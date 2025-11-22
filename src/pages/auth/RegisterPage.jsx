import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button'; // Asegúrate de tener este componente
import { UserPlus, DollarSign, Loader } from 'lucide-react';
import { authService } from '../../services/authService';
import { AlertCircle } from 'lucide-react';


export const RegisterPage = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
        setError("");
    };


    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (formData.password != formData.confirmPassword) {
            setError("Las contraseñas no coinciden");
            setLoading(false);
            return;
        }

        const { confirmPassword, ...registerData } = formData;


        const result = await authService.register(registerData);

        if (result.success) {
            localStorage.setItem('token', 'true');
            localStorage.setItem('user', JSON.stringify(result.user));

            navigate("/login");
        } else {
            setError(result.message);
        }

        setLoading(false);

    };

    return (
        <div className="min-h-screen flex bg-slate-50">

            {/* IZQUIERDA: Background (Mismo estilo para consistencia) */}
            <div className="hidden lg:flex w-1/1 relative overflow-hidden items-center justify-center p-12">
                <img
                    src="public\Background.png"
                    alt="Background Register"
                    className="absolute inset-0 w-full h-full object-cover"
                    onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; e.target.parentElement.style.backgroundColor = '#1e3a8a'; }}
                />
                <div className="absolute inset-0 bg-indigo-900/60 mix-blend-multiply"></div>

                <div className="relative z-10 text-white max-w-lg text-center p-8 shadow-2xl rounded-2xl border-white/20 bg-slate-40 border-slate-20 ">
                    <div className="inline-flex p-4 bg-white/10 backdrop-blur-md rounded-2xl mb-6 border border-white/20 shadow-xl">
                        <UserPlus size={40} className="text-emerald-400" />
                    </div>
                    <h1 className="text-4xl font-bold mb-8">Únete a MyPocket</h1>
                    <p className="text-lg text-indigo-100">
                        El primer paso hacia tu libertad financiera comienza aquí. Crea tu cuenta gratis.
                    </p>
                </div>
            </div>

            {/* DERECHA: Formulario de Registro */}

            {/* Mensaje de Error */}
            {error && (
                <div className="mt-4 p-3 bg-rose-50 text-rose-600 rounded-lg flex items-center gap-2 text-sm">
                    <AlertCircle size={18} />
                    {error}
                </div>
            )}

            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-100">
                <div className="w-full max-w-md bg-white p-10 rounded-3xl shadow-xl border border-slate-100">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-slate-900">Crear Cuenta</h2>
                        <p className="mt-2 text-slate-500">Rellena tus datos para comenzar</p>
                    </div>

                    <form onSubmit={handleRegister} className="space-y-5">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Nombre Completo</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
                                placeholder="Tu nombre completo"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Correo Electrónico</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
                                placeholder="ejemplo@correo.com"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Contraseña</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Confirmar</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <Button className="w-full py-3.5 mt-2" variant="primary" disabled={loading}>
                            {loading ? <Loader /> : 'Registrarme'}
                        </Button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-sm text-slate-500">
                            ¿Ya tienes cuenta?
                            <Link to="/login" className="font-bold text-indigo-600 hover:text-indigo-500 ml-1 transition-colors">
                                Inicia Sesión
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};