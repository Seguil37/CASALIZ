// src/features/contact/pages/ContactPage.jsx

import { Mail, MapPin, Phone, Users } from 'lucide-react';

const owners = [
  {
    name: 'Lavilla Pillco Elizabeth Carina',
    phone: '+51 990 179 027',
    tel: 'tel:+51990179027',
  },
  {
    name: 'Nuñez Marroquin Dana Ishaya',
    phone: '+51 913 106 359',
    tel: 'tel:+51913106359',
  },
  {
    name: 'Machacca Gutierrez Armando',
    phone: '+51 949 141 112',
    tel: 'tel:+51949141112',
  },
  {
    name: 'Seguil Osores Jhojan Vidal',
    phone: '+51 949 758 387',
    tel: 'tel:+51949758387',
  },
];

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f5ef] via-[#f8f5ef] to-[#e15f0b] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#e15f0b] to-[#d14a00] rounded-2xl shadow-xl">
            <Mail className="w-10 h-10 text-[#233274]" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[#d14a00] uppercase tracking-wide">Estamos aquí para ayudarte</p>
            <h1 className="text-4xl font-black text-[#233274]">Contáctanos</h1>
            <p className="text-[#9a98a0] mt-2 max-w-2xl mx-auto">
              Escríbenos, llama o comunícate con cualquiera de los dueños de Book&Go. Estamos listos para resolver tus dudas y colaborar contigo.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-[#f8f5ef] rounded-2xl shadow-xl p-6 space-y-4 border border-[#f8f5ef]">
            <div className="w-12 h-12 rounded-xl bg-[#f8f5ef] flex items-center justify-center">
              <Mail className="w-6 h-6 text-[#e15f0b]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#233274]">Escríbenos</h2>
              <p className="text-[#9a98a0] mt-1">Envíanos un correo y responderemos en menos de 24 horas.</p>
            </div>
            <a
              href="mailto:info@bookandgo.com"
              className="inline-flex items-center gap-2 text-[#e15f0b] font-semibold hover:text-[#d14a00]"
            >
              info@bookandgo.com
            </a>
          </div>

          <div className="bg-[#f8f5ef] rounded-2xl shadow-xl p-6 space-y-4 border border-[#f8f5ef]">
            <div className="w-12 h-12 rounded-xl bg-[#f8f5ef] flex items-center justify-center">
              <Phone className="w-6 h-6 text-[#e15f0b]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#233274]">Llámanos</h2>
              <p className="text-[#9a98a0] mt-1">Habla directamente con nuestro equipo de atención.</p>
            </div>
            <a
              href="tel:+51990179027"
              className="inline-flex items-center gap-2 text-[#e15f0b] font-semibold hover:text-[#d14a00]"
            >
              +51 990 179 027
            </a>
          </div>

          <div className="bg-[#f8f5ef] rounded-2xl shadow-xl p-6 space-y-4 border border-[#f8f5ef]">
            <div className="w-12 h-12 rounded-xl bg-[#f8f5ef] flex items-center justify-center">
              <MapPin className="w-6 h-6 text-[#e15f0b]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#233274]">Visítanos</h2>
              <p className="text-[#9a98a0] mt-1">Coordinemos una reunión para conocer tus necesidades.</p>
            </div>
            <span className="inline-flex items-center gap-2 text-[#e15f0b] font-semibold">
              Cusco, Perú
            </span>
          </div>
        </div>

        <div className="bg-[#f8f5ef] rounded-3xl shadow-2xl p-8 md:p-10 border border-[#f8f5ef]">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-[#f8f5ef] flex items-center justify-center">
              <Users className="w-6 h-6 text-[#e15f0b]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#d14a00] uppercase tracking-wide">Dueños</p>
              <h2 className="text-2xl font-bold text-[#233274]">Comunícate con nosotros directamente</h2>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {owners.map((owner) => (
              <a
                key={owner.name}
                href={owner.tel}
                className="flex items-center justify-between p-4 rounded-2xl border border-[#f8f5ef] hover:border-[#e15f0b] hover:shadow-lg transition-all"
              >
                <div>
                  <p className="text-lg font-semibold text-[#233274]">{owner.name}</p>
                  <p className="text-[#9a98a0]">{owner.phone}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#e15f0b] to-[#d14a00] flex items-center justify-center text-[#233274] font-bold">
                  <Phone className="w-5 h-5" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
