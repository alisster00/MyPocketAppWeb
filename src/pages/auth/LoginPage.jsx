import React, { useState, useEffect } from "react";
import { Button } from "../../components/ui/Button";
import { Link, useNavigate } from "react-router-dom";
import { DollarSign, TrendingUp, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { authService } from "../../services/authService";
import { Modal } from "../../components/ui/Modal";


export const LoginPage = () => {
  const navigate = useNavigate();

  
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

     const [modalState, setModalState] = useState({
        isOpen: false,
        title: '',
        message: '',
        type: 'success', // 'success' o 'error'
    });

    const handleModalClose = () => {
        const { redirect } = modalState;
        setModalState({ isOpen: false, title: '', message: '', type: 'error', redirect: false });
        if (!redirect) {
            navigate('/login'); 
        }
    };

    useEffect(() => {
        let timer;
        
        // El temporizador se aplica SÓLO al modal de éxito con redirección
        if (modalState.isOpen && modalState.type === 'success' && modalState.redirect) {
            timer = setTimeout(() => {

                handleModalClose(); 
            }, 10000); // 10 segundos
        }

        // Limpieza: Cancela el temporizador si el estado cambia
        return () => {
            if (timer) {
                clearTimeout(timer);
            }
        };
    }, [modalState.isOpen, modalState.type, modalState.redirect]);



  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name === 'password' ? 'password' : 'email']: e.target.value
    });
     if (modalState.isOpen && modalState.type === 'error') {
            setModalState(prev => ({ ...prev, isOpen: false }));
        }
  };



  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await authService.login(formData.email, formData.password);

    if (result.success) {
      localStorage.setItem('token', 'true');
      localStorage.setItem('user', JSON.stringify(result.user));
      localStorage.setItem('name', result.user.name);
      setTimeout(() => {

        setModalState({
                isOpen: true,
                title: "¡Bienvenido de nuevo! 👋",
                message: `Inicio de sesión exitoso. Serás redirigido al panel de control en 3 segundos.`,
                type: 'success',
                redirect: true 
            });
      }, 10000);
      navigate("/dashboard");
    } else {
      setModalState({
                isOpen: true,
                title: "Error al Iniciar Sesión",
                message: result.message,
                type: 'error',
                redirect: false
            });

     navigate("/login");
  }
    setLoading(false);
  };


  return (
    <div className="min-h-screen flex bg-slate-50">

       {/* Modal de Alerta/Éxito */}
            <Modal
                isOpen={modalState.isOpen}
                onClose={handleModalClose}
                title={modalState.title}
                message={modalState.message}
                type={modalState.type}
            />

      {/*Background a la izquierda con imagen (CÓDIGO ORIGINAL DEL USUARIO MANTENIDO)*/}
      <div className="hidden lg:flex w-1/1 relative overflow-hidden items-center justify-center p-10">
        <img
          src="public/Background.png"
          alt="Background"
          className="absolute inset-0 w-full h-full object-fit"
          // Fallback para entornos donde la imagen no carga
          onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; e.target.parentElement.style.backgroundColor = '#1e3a8a'; }}
        />
        <div className="absolute inset-0 bg-indigo-900/60 mix-blend-multiply"></div>

        <div className="relative z-10 text-white max-w-lg">
          {/* Contenido de Branding agregado para llenar el espacio, respetando el contenedor original */}

        </div>
      </div>

      {/* DERECHA: Formulario */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-50">
        <div className="w-full max-w-md bg-white p-10 rounded-3xl shadow-xl border border-slate-100">
          <h2 className="text-3xl font-bold text-slate-900">Bienvenido</h2>

          <form onSubmit={handleLogin} className="space-y-6 mt-8">
            {/* Input Correo */}
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
            {/* Input Contraseña */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Contraseña</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
                placeholder="Contraseña"
                required
              />
            </div>

            <Button className="w-full" disabled={loading}>
              {loading ? <Loader /> : "Iniciar Sesión"}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-slate-500">
              ¿No tienes cuenta?
              {/* Usamos Link en lugar de <a> para no recargar la página */}
              <Link to="/register" className="font-bold text-indigo-600 ml-1 hover:underline">
                Crear cuenta gratis
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};