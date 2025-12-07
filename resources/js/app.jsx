import './bootstrap';
import '../css/app.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Layout } from './components/layout/Layout';
import Home from './pages/Home';
import Servicios from './pages/Servicios';
import Proyectos from './pages/Proyectos';
import ProyectoDetalle from './pages/ProyectoDetalle';
import Nosotros from './pages/Nosotros';
import Contacto from './pages/Contacto';

const queryClient = new QueryClient();

const container = document.getElementById('app');

if (container) {
    const root = ReactDOM.createRoot(container);
    root.render(
        <React.StrictMode>
            <QueryClientProvider client={queryClient}>
                <BrowserRouter>
                    <Layout>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/servicios" element={<Servicios />} />
                            <Route path="/proyectos" element={<Proyectos />} />
                            <Route path="/proyectos/:id" element={<ProyectoDetalle />} />
                            <Route path="/nosotros" element={<Nosotros />} />
                            <Route path="/contacto" element={<Contacto />} />
                            <Route path="*" element={<Navigate to="/" />} />
                        </Routes>
                    </Layout>
                </BrowserRouter>
            </QueryClientProvider>
        </React.StrictMode>
    );
}
