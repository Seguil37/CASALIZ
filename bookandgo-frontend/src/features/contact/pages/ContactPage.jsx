// src/features/contact/pages/ContactPage.jsx
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { contactApi } from '../../../shared/utils/api';
import { Mail, Phone, Building2, Send } from 'lucide-react';

const ContactPage = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', serviceType: '', message: '' });
  const [success, setSuccess] = useState('');
  const mutation = useMutation(contactApi.submit, {
    onSuccess: (res) => {
      setSuccess(res.data.message);
      setForm({ name: '', email: '', phone: '', serviceType: '', message: '' });
    },
  });

  const handleChange = (e) => {
    setSuccess('');
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(form);
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="section bg-gradient-to-br from-orange-50 via-white to-blue-50">
        <div className="container-custom space-y-3">
          <p className="badge-accent">Contacto</p>
          <h1 className="text-4xl font-black text-slate-900">Cuéntanos sobre tu proyecto</h1>
          <p className="text-lg text-slate-600 max-w-3xl">
            Completa el formulario y uno de nuestros arquitectos o ingenieros te contactará para evaluar necesidades y próximos pasos.
          </p>
        </div>
      </div>

      <div className="section">
        <div className="container-custom grid lg:grid-cols-3 gap-6">
          <form onSubmit={handleSubmit} className="lg:col-span-2 bg-white border border-slate-100 rounded-2xl card-shadow p-6 space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-slate-700">Nombre completo</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full mt-1 rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:border-orange-500"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700">Correo electrónico</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full mt-1 rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:border-orange-500"
                  required
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-slate-700">Teléfono</label>
                <input
                  type="text"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full mt-1 rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:border-orange-500"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700">Tipo de servicio</label>
                <input
                  type="text"
                  name="serviceType"
                  value={form.serviceType}
                  onChange={handleChange}
                  className="w-full mt-1 rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:border-orange-500"
                  placeholder="Diseño, licencias, supervisión..."
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700">Mensaje</label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                rows="4"
                className="w-full mt-1 rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:border-orange-500"
                required
              />
            </div>
            {success && <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-xl p-3">{success}</p>}
            {mutation.error && (
              <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl p-3">
                Ocurrió un problema al enviar. Inténtalo nuevamente.
              </p>
            )}
            <button
              type="submit"
              className="btn-primary inline-flex items-center gap-2"
              disabled={mutation.isLoading}
            >
              <Send className="w-4 h-4" />
              {mutation.isLoading ? 'Enviando...' : 'Enviar mensaje'}
            </button>
          </form>

          <div className="space-y-4">
            <div className="bg-white border border-slate-100 rounded-2xl card-shadow p-6 space-y-2">
              <div className="flex items-center gap-3">
                <Mail className="w-6 h-6 text-orange-500" />
                <div>
                  <p className="text-sm text-slate-500">Correo</p>
                  <p className="font-semibold text-slate-900">contacto@casaliz.com</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-6 h-6 text-orange-500" />
                <div>
                  <p className="text-sm text-slate-500">Teléfonos</p>
                  <p className="font-semibold text-slate-900">+51 990 179 027</p>
                  <p className="font-semibold text-slate-900">+51 913 106 359</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Building2 className="w-6 h-6 text-orange-500" />
                <div>
                  <p className="text-sm text-slate-500">Oficina</p>
                  <p className="font-semibold text-slate-900">Cusco, Perú</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-900 to-blue-700 text-white rounded-2xl p-6 space-y-3">
              <p className="text-sm uppercase tracking-wide text-blue-100">Respaldo</p>
              <p className="text-2xl font-black">Cumplimiento normativo y acompañamiento en licencias.</p>
              <p className="text-sm text-blue-100">Coordinamos con municipalidades y revisores para evitar observaciones.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
