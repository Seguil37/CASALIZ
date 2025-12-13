import { Mail, MapPin, Phone, Facebook } from 'lucide-react';

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f5ef] via-[#f8f5ef] to-[#e15f0b] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#e15f0b] to-[#d14a00] rounded-2xl shadow-xl">
            <Mail className="w-10 h-10 text-[#233274]" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[#d14a00] uppercase tracking-wide">Conectemos tu visión con la realidad</p>
            <h1 className="text-4xl font-black text-[#233274]">Contáctanos</h1>
            <p className="text-[#9a98a0] mt-2 max-w-2xl mx-auto">
              En CasaLiz transformamos espacios en experiencias. Estamos aquí para escuchar tus proyectos y colaborar en su desarrollo.
            </p>
          </div>
        </div>

        {/* Contact Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Email */}
          <div className="bg-[#f8f5ef] rounded-2xl shadow-xl p-6 space-y-4 border border-[#f8f5ef]">
            <div className="w-12 h-12 rounded-xl bg-[#f8f5ef] flex items-center justify-center">
              <Mail className="w-6 h-6 text-[#e15f0b]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#233274]">Escríbenos</h2>
              <p className="text-[#9a98a0] mt-1">Te responderemos en menos de 24 horas.</p>
            </div>
            <a
              href="mailto:lissyosores@hotmail.com"
              className="inline-flex items-center gap-2 text-[#e15f0b] font-semibold hover:text-[#d14a00]"
            >
              lissyosores@hotmail.com
            </a>
          </div>

          {/* Phone */}
          <div className="bg-[#f8f5ef] rounded-2xl shadow-xl p-6 space-y-4 border border-[#f8f5ef]">
            <div className="w-12 h-12 rounded-xl bg-[#f8f5ef] flex items-center justify-center">
              <Phone className="w-6 h-6 text-[#e15f0b]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#233274]">Llámanos</h2>
              <p className="text-[#9a98a0] mt-1">Habla directamente con nuestro equipo.</p>
            </div>
            <a
              href="tel:+51984696802"
              className="inline-flex items-center gap-2 text-[#e15f0b] font-semibold hover:text-[#d14a00]"
            >
              +51 984 696 802
            </a>
          </div>

          {/* Location */}
          <div className="bg-[#f8f5ef] rounded-2xl shadow-xl p-6 space-y-4 border border-[#f8f5ef]">
            <div className="w-12 h-12 rounded-xl bg-[#f8f5ef] flex items-center justify-center">
              <MapPin className="w-6 h-6 text-[#e15f0b]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#233274]">Visítanos</h2>
              <p className="text-[#9a98a0] mt-1">Nos ubicamos en el corazón de Cusco.</p>
            </div>
            <span className="inline-block text-[#e15f0b] font-semibold text-sm">
              Cusco, Perú
            </span>
          </div>
        </div>

        {/* Address and Map Section */}
        <div className="bg-[#f8f5ef] rounded-3xl shadow-2xl overflow-hidden border border-[#f8f5ef]">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Address Card */}
            <div className="p-8 md:p-10 flex flex-col justify-center bg-[#f8f5ef]">
              <div className="space-y-6">
                <div>
                  <p className="text-sm font-semibold text-[#d14a00] uppercase tracking-wide mb-2">Nuestra ubicación</p>
                  <h2 className="text-2xl font-bold text-[#233274]">CasaLiz</h2>
                  <p className="text-[#9a98a0] text-sm font-medium mt-1">Arquitectos – Ingenieros</p>
                </div>
                
                <div className="space-y-4 pt-4 border-t border-gray-300">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[#f0ebe3] flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-[#e15f0b]" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#9a98a0]">Dirección</p>
                      <p className="text-[#233274] font-semibold mt-1 text-sm">
                        Av. Lloque Yupanqui – Edificio Ecological Plaza<br />
                        2do. Nivel, Oficina 202<br />
                        Wanchaq – Cusco
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[#f0ebe3] flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-[#e15f0b]" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#9a98a0]">Teléfono</p>
                      <a href="tel:+51984696802" className="text-[#e15f0b] font-semibold hover:text-[#d14a00]">
                        +51 984 696 802
                      </a>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[#f0ebe3] flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-[#e15f0b]" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#9a98a0]">Correo</p>
                      <a href="mailto:lissyosores@hotmail.com" className="text-[#e15f0b] font-semibold hover:text-[#d14a00] break-all text-sm">
                        lissyosores@hotmail.com
                      </a>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-300 flex gap-3">
                    <a
                      href="https://www.facebook.com/CASALIZEIRL"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-12 h-12 rounded-lg bg-[#e15f0b] hover:bg-[#d14a00] transition-colors"
                    >
                      <Facebook className="w-6 h-6 text-white" />
                    </a>
                    <span className="flex items-center text-sm text-[#9a98a0]">
                      Síguenos en Facebook
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="h-96 md:h-auto overflow-hidden">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1371.5035743018245!2d-71.96059956528927!3d-13.523442715970118!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x916dd5fdb208814b%3A0xccb5144368db6c15!2sCasaLiz%20%E2%80%93%20Arquitectos%20%E2%80%93%20Ingenieros!5e0!3m2!1ses-419!2spe!4v1765583209300!5m2!1ses-419!2spe"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '400px' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="CasaLiz Ubicación"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;