import { useState } from 'react';
import { api } from '../api/client';
import { useServices } from '../hooks/useServices';

const initialForm = {
  name: '',
  email: '',
  phone: '',
  service_type: '',
  message: '',
};

export default function Contacto() {
  const { data: services = [] } = useServices();
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState({ type: '', message: '' });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ type: '', message: '' });

    if (!form.name || !form.email || !form.service_type || !form.message) {
      setStatus({ type: 'error', message: 'Por favor completa los campos obligatorios.' });
      return;
    }

    try {
      const { data } = await api.post('/contact', form);
      setStatus({ type: 'success', message: data.message });
      setForm(initialForm);
    } catch (error) {
      setStatus({ type: 'error', message: 'No pudimos enviar tu mensaje. Intenta nuevamente.' });
    }
  };

  return (
    <section className="container">
      <div className="section-header">
        <p className="badge">Contacto</p>
        <h2 className="section-title">Cuéntanos sobre tu proyecto</h2>
        <p className="section-subtitle">Respondemos en menos de 24 horas hábiles.</p>
      </div>

      {status.message && (
        <div className="alert" style={{ color: status.type === 'error' ? '#c0392b' : 'var(--secondary)' }}>
          {status.message}
        </div>
      )}

      <form className="contact-form" onSubmit={handleSubmit}>
        <div className="input-field">
          <label>Nombre y apellido *</label>
          <input name="name" value={form.name} onChange={handleChange} required placeholder="Tu nombre" />
        </div>
        <div className="input-field">
          <label>Correo electrónico *</label>
          <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="nombre@correo.com" />
        </div>
        <div className="input-field">
          <label>Teléfono</label>
          <input name="phone" value={form.phone} onChange={handleChange} placeholder="Ej. +51 999 888 777" />
        </div>
        <div className="input-field">
          <label>Tipo de servicio *</label>
          <select name="service_type" value={form.service_type} onChange={handleChange} required>
            <option value="">Selecciona una opción</option>
            {services.map((service) => (
              <option key={service.slug} value={service.slug}>
                {service.name}
              </option>
            ))}
          </select>
        </div>
        <div className="input-field">
          <label>Mensaje *</label>
          <textarea name="message" value={form.message} onChange={handleChange} required placeholder="Cuéntanos qué necesitas" />
        </div>
        <button type="submit" className="btn btn-primary">
          Enviar mensaje
        </button>
      </form>
    </section>
  );
}
