import { Mail, MapPin, Phone, Facebook, MessageCircle, Sparkles, ArrowRight } from 'lucide-react';

const contactChannels = [
  {
    title: 'Escríbenos',
    description: 'Cuéntanos tu proyecto y recibe una respuesta clara en menos de 24 horas.',
    value: 'lissyosores@hotmail.com',
    href: 'mailto:lissyosores@hotmail.com',
    icon: Mail,
    accent: 'from-[#233274] via-[#31469a] to-[#425cc2]',
  },
  {
    title: 'Llámanos',
    description: 'Habla directamente con nuestro equipo para resolver dudas o coordinar una reunión.',
    value: '+51 984 696 802',
    href: 'tel:+51984696802',
    icon: Phone,
    accent: 'from-[#e15f0b] via-[#ef7d2b] to-[#f6a45c]',
  },
  {
    title: 'Visítanos',
    description: 'Estamos en Cusco para atender proyectos residenciales, comerciales e inmobiliarios.',
    value: 'Cusco, Perú',
    href: null,
    icon: MapPin,
    accent: 'from-[#1f6f78] via-[#2e8f99] to-[#58b2bb]',
  },
];

const socialLinks = [
  {
    label: 'Síguenos en Facebook',
    href: 'https://www.facebook.com/CASALIZEIRL',
    icon: Facebook,
    bg: 'bg-[#1877f2] hover:bg-[#0f5ad2]',
  },
  {
    label: 'Escríbenos por WhatsApp',
    href: 'https://tinyurl.com/CasalizArquitectura',
    icon: MessageCircle,
    bg: 'bg-[#25d366] hover:bg-[#1ebe57]',
  },
];

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(35,50,116,0.12),_transparent_30%),linear-gradient(180deg,#fbf7f1_0%,#f6f1ea_100%)] pb-14">
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1e2a63] via-[#243883] to-[#f59e0b] px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-15" aria-hidden>
          <div className="absolute -left-16 top-0 h-72 w-72 rounded-full bg-[#fbbf24] blur-3xl" />
          <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-white/20 blur-3xl" />
        </div>

        <div className="container-custom relative z-10 grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#f9d29f] transition-transform duration-500 hover:translate-x-1">
              <Sparkles className="h-4 w-4 transition-transform duration-500 hover:scale-110 hover:rotate-12" />
              Contacto Casaliz
            </div>

            <h1 className="max-w-4xl text-4xl font-black leading-tight transition-transform duration-500 hover:translate-x-1 md:text-5xl lg:text-6xl">
              Hablemos de tu proyecto con una propuesta clara, técnica y bien ejecutada.
            </h1>

            <p className="max-w-3xl text-lg text-white/88 transition-colors duration-500 hover:text-white md:text-xl">
              En Casaliz integramos arquitectura, gestión técnica y acompañamiento cercano. Si estás evaluando una obra, licencia,
              remodelación o proyecto inmobiliario, aquí empieza la conversación correcta.
            </p>

            <div className="flex flex-wrap gap-4">
              <a
                href="https://tinyurl.com/CasalizArquitectura"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-bold text-[#233274] shadow-lg transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02]"
              >
                Escribir por WhatsApp
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#ubicacion"
                className="inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/10 px-6 py-3 font-bold text-white shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white/15"
              >
                Ver ubicación
              </a>
            </div>
          </div>

          <div className="rounded-[30px] border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur transition-all duration-500 hover:-translate-y-2 hover:bg-white/15">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#f9d29f]">Atención directa</p>
            <div className="mt-5 space-y-3">
              {[
                { label: 'Tiempo de respuesta', value: '24h' },
                { label: 'Ubicación base', value: 'Cusco' },
                { label: 'Especialidades', value: 'Arquitectura + Gestión' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between rounded-2xl bg-white/8 px-4 py-3 transition-all duration-300 hover:bg-white/14">
                  <span className="text-sm text-white/80">{item.label}</span>
                  <span className="text-lg font-black text-white">{item.value}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-2xl border border-white/15 bg-white/10 p-4 text-sm leading-6 text-white/85">
              Atendemos consultas para viviendas, oficinas, licencias, regularizaciones y servicios inmobiliarios con una ruta de
              trabajo más ordenada desde el primer contacto.
            </div>
          </div>
        </div>
      </section>

      <section className="container-custom -mt-8 relative z-10 space-y-10 px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-3">
          {contactChannels.map((item) => {
            const Icon = item.icon;

            return (
              <article
                key={item.title}
                className="group overflow-hidden rounded-[30px] border border-white/80 bg-white shadow-[0_24px_60px_rgba(77,58,31,0.10)] transition-all duration-500 hover:-translate-y-2"
              >
                <div className={`h-24 bg-gradient-to-br ${item.accent} px-6 py-5 text-white`}>
                  <div className="flex items-center justify-between">
                    <p className="text-2xl font-black">{item.title}</p>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
                      <Icon className="h-6 w-6" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4 p-6">
                  <p className="text-sm leading-6 text-[#6f6874]">{item.description}</p>
                  {item.href ? (
                    <a
                      href={item.href}
                      className="inline-flex items-center gap-2 rounded-full bg-[#f3eee5] px-4 py-2 text-sm font-bold text-[#233274] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#ede4d7]"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <span className="inline-flex items-center gap-2 rounded-full bg-[#f3eee5] px-4 py-2 text-sm font-bold text-[#233274]">
                      {item.value}
                    </span>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        <div
          id="ubicacion"
          className="overflow-hidden rounded-[34px] border border-[#e5ddd1] bg-white shadow-[0_25px_70px_rgba(77,58,31,0.08)]"
        >
          <div className="grid gap-0 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="bg-[linear-gradient(180deg,#fffdf9_0%,#f7f1e8_100%)] p-8 md:p-10">
              <div className="space-y-6">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#d14a00]">Nuestra ubicación</p>
                  <h2 className="mt-3 text-3xl font-black text-[#233274]">CasaLiz</h2>
                  <p className="mt-2 text-sm font-medium text-[#7d7783]">Arquitectos e Ingenieros</p>
                </div>

                <div className="rounded-[28px] border border-[#eadfce] bg-white p-6 shadow-sm">
                  <div className="space-y-5">
                    <div className="flex gap-4">
                      <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-[#f4ede3]">
                        <MapPin className="h-5 w-5 text-[#e15f0b]" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#9a98a0]">Dirección</p>
                        <p className="mt-1 text-sm font-semibold leading-6 text-[#233274]">
                          Av. Lloque Yupanqui, Edificio Ecological Plaza
                          <br />
                          2do. Nivel, Oficina 202
                          <br />
                          Wanchaq, Cusco
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-[#f4ede3]">
                        <Phone className="h-5 w-5 text-[#e15f0b]" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#9a98a0]">Teléfono</p>
                        <a href="tel:+51984696802" className="mt-1 inline-flex text-sm font-bold text-[#e15f0b] transition-colors hover:text-[#d14a00]">
                          +51 984 696 802
                        </a>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-[#f4ede3]">
                        <Mail className="h-5 w-5 text-[#e15f0b]" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#9a98a0]">Correo</p>
                        <a
                          href="mailto:lissyosores@hotmail.com"
                          className="mt-1 inline-flex break-all text-sm font-bold text-[#e15f0b] transition-colors hover:text-[#d14a00]"
                        >
                          lissyosores@hotmail.com
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {socialLinks.map((item) => {
                    const Icon = item.icon;

                    return (
                      <a
                        key={item.label}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 rounded-2xl border border-[#eadfce] bg-white px-4 py-4 shadow-sm transition-all duration-300 hover:-translate-y-1"
                      >
                        <span className={`flex h-11 w-11 items-center justify-center rounded-xl text-white transition-colors ${item.bg}`}>
                          <Icon className="h-5 w-5" />
                        </span>
                        <span className="text-sm font-semibold text-[#233274]">{item.label}</span>
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="relative min-h-[420px] overflow-hidden">
              <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between bg-gradient-to-b from-[#0f1b35]/80 to-transparent px-6 py-5 text-white">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#f9d29f]">Mapa</p>
                  <p className="mt-1 text-lg font-black">Encuéntranos en Cusco</p>
                </div>
              </div>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1371.5035743018245!2d-71.96059956528927!3d-13.523442715970118!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x916dd5fdb208814b%3A0xccb5144368db6c15!2sCasaLiz%20%E2%80%93%20Arquitectos%20%E2%80%93%20Ingenieros!5e0!3m2!1ses-419!2spe!4v1765583209300!5m2!1ses-419!2spe"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '420px' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="CasaLiz Ubicación"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
