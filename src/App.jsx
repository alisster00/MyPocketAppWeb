import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { DashboardLayout } from './components/layouts/DashboardLayout';
import { DashboardHome } from './pages/dashboard/Home';
import { NotFound } from './pages/NotFound';

// Componente para proteger rutas (Si no hay login, te manda fuera)
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('token'); // Simulación simple
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
    return (
    <BrowserRouter>
      <Routes>
        {/* Rutas Públicas */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />

        <Route path="/register" element={<RegisterPage />} />

        {/* Rutas Privadas (Dashboard) */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardLayout /> {/* El Layout envuelve las páginas internas */}
          </ProtectedRoute>
        }>
          {/* Rutas Hijas (se renderizan donde pongas <Outlet /> en el Layout) */}
          <Route index element={<DashboardHome />} />
          <Route path="transactions" element={<div>Página de Transacciones</div>} />
          <Route path="accounts" element={<div>Página de Cuentas</div>} />
        </Route>


        {/* Redirección por defecto: página 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
    );
}

export default App;
