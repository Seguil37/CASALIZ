// src/features/tours/components/PopularCountriesSection.jsx

import { useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Globe2, Star } from 'lucide-react';
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';
import MotionTitle from '../../../shared/motion/MotionTitle';
import viviendasImg from '../../../assets/images/servicios-principales/viviendas_unifamiliares_multifamiliares.png';
import casasCampoImg from '../../../assets/images/servicios-principales/casas_de_campo.png';
import interiores3dImg from '../../../assets/images/servicios-principales/diseno_interiores_3d.png';
import expedienteLicenciaImg from '../../../assets/images/servicios-principales/expediente_licencia_construccion.png';
import declaratoriaImg from '../../../assets/images/servicios-principales/declaratoria_de_fabrica.png';
import independizacionesImg from '../../../assets/images/servicios-principales/independizaciones.png';
import habilitacionesImg from '../../../assets/images/servicios-principales/habilitaciones_urbanas.png';
import subdivisionImg from '../../../assets/images/servicios-principales/subdivision_de_lote.png';
import acumulacionImg from '../../../assets/images/servicios-principales/acumulacion_de_lote.png';
import prescripcionImg from '../../../assets/images/servicios-principales/prescripcion_adquisitiva.png';
import visacionImg from '../../../assets/images/servicios-principales/visacion_de_planos.png';
import levantamientosImg from '../../../assets/images/servicios-principales/levantamientos_topograficos.png';
import licenciaFuncionamientoImg from '../../../assets/images/servicios-principales/licencia_de_funcionamiento.png';
import compraVentaImg from '../../../assets/images/servicios-principales/compra_venta_de_terrenos.png';
import expedientesTecnicosImg from '../../../assets/images/servicios-principales/expedientes_tecnicos.png';

gsap.registerPlugin(Draggable);

const services = [
  {
    name: 'Viviendas unifamiliares y multifamiliares',
    subtitle: 'Diseno y proyectos residenciales',
    image: viviendasImg,
    projectsCount: 45,
    rating: 4.9,
  },
  {
    name: 'Casas de campo',
    subtitle: 'Arquitectura rural y descanso',
    image: casasCampoImg,
    projectsCount: 28,
    rating: 4.8,
  },
  {
    name: 'Diseno de interiores con vistas en 3D',
    subtitle: 'Visualizacion precisa',
    image: interiores3dImg,
    projectsCount: 32,
    rating: 4.9,
  },
  {
    name: 'Expediente de licencia de construccion',
    subtitle: 'Permisos municipales',
    image: expedienteLicenciaImg,
    projectsCount: 60,
    rating: 4.8,
  },
  {
    name: 'Declaratoria de fabrica',
    subtitle: 'Formalizacion de obra',
    image: declaratoriaImg,
    projectsCount: 22,
    rating: 4.7,
  },
  {
    name: 'Independizaciones',
    subtitle: 'Segregacion de propiedades',
    image: independizacionesImg,
    projectsCount: 35,
    rating: 4.8,
  },
  {
    name: 'Habilitaciones urbanas',
    subtitle: 'Desarrollo territorial',
    image: habilitacionesImg,
    projectsCount: 18,
    rating: 4.7,
  },
  {
    name: 'Subdivision de lote',
    subtitle: 'Division tecnica de predios',
    image: subdivisionImg,
    projectsCount: 25,
    rating: 4.8,
  },
  {
    name: 'Acumulacion de lote',
    subtitle: 'Unificacion de predios',
    image: acumulacionImg,
    projectsCount: 16,
    rating: 4.7,
  },
  {
    name: 'Prescripcion adquisitiva',
    subtitle: 'Derechos de propiedad',
    image: prescripcionImg,
    projectsCount: 14,
    rating: 4.8,
  },
  {
    name: 'Visacion de planos',
    subtitle: 'Revision tecnica',
    image: visacionImg,
    projectsCount: 40,
    rating: 4.9,
  },
  {
    name: 'Levantamientos topograficos',
    subtitle: 'Medicion de terrenos',
    image: levantamientosImg,
    projectsCount: 38,
    rating: 4.8,
  },
  {
    name: 'Licencia de funcionamiento',
    subtitle: 'Permisos comerciales',
    image: licenciaFuncionamientoImg,
    projectsCount: 45,
    rating: 4.7,
  },
  {
    name: 'Compra-venta de terrenos',
    subtitle: 'Asesoria inmobiliaria',
    image: compraVentaImg,
    projectsCount: 52,
    rating: 4.9,
  },
  {
    name: 'Expedientes tecnicos',
    subtitle: 'Documentacion de obra',
    image: expedientesTecnicosImg,
    projectsCount: 48,
    rating: 4.8,
  },
];

const PopularCountriesSection = () => {
  const sectionRef = useRef(null);
  const sceneRef = useRef(null);
  const ringRef = useRef(null);
  const cardRefs = useRef([]);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const scene = sceneRef.current;
    const ring = ringRef.current;
    const cards = cardRefs.current.filter(Boolean);
    if (!section || !scene || !ring || cards.length === 0) return undefined;

    let refreshFrame = 0;
    let ringRadius = 0;
    let rotation = 0;
    let degreesPerPixel = 0;
    let snapTween;
    let autoplayTween;
    const surfaces = cards.map((card) => card.querySelector('[data-ring-card-surface]'));
    const links = cards.map((card) => card.querySelector('a'));
    const previousButton = section.querySelector('[data-ring-prev]');
    const nextButton = section.querySelector('[data-ring-next]');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const fullCircle = 360;
    const angleStep = fullCircle / cards.length;

    const updateCardFocus = () => {
      const ringRotation = Number(gsap.getProperty(ring, 'rotationY')) || 0;
      const cardAngles = cards.map((_, index) => {
        const rawAngle = index * angleStep + ringRotation;
        return gsap.utils.wrap(-180, 180, rawAngle);
      });
      const activeIndex = cardAngles.reduce(
        (closestIndex, angle, index) =>
          Math.abs(angle) < Math.abs(cardAngles[closestIndex]) ? index : closestIndex,
        0,
      );
      const hiddenLimit = Math.min(75, angleStep * 2.5);

      cards.forEach((card, index) => {
        const angularDistance = Math.abs(cardAngles[index]);
        const distanceInCards = angularDistance / angleStep;
        const isActive = index === activeIndex;
        const isVisible = angularDistance < hiddenLimit;
        const frontProgress = Math.min(1, distanceInCards);
        // Continuous focus avoids a flash when the nearest card changes mid-drag.
        const fade = Math.max(0, 1 - (distanceInCards - 1) / (hiddenLimit / angleStep - 1));
        const opacity = isVisible ? (1 - frontProgress * 0.28) * Math.min(1, fade) : 0;
        const scale = 1 - frontProgress * 0.08 - Math.min(1, Math.max(0, distanceInCards - 1)) * 0.04;
        const brightness = 1 - frontProgress * 0.25;

        const surface = surfaces[index];
        if (surface) {
          surface.style.opacity = String(opacity);
          surface.style.transform = `scale(${scale})`;
          surface.style.filter = `brightness(${brightness})`;
        }

        card.style.visibility = isVisible ? 'visible' : 'hidden';
        card.style.pointerEvents = isActive ? 'auto' : 'none';
        card.setAttribute('aria-hidden', String(!isActive));
        if (links[index]) links[index].tabIndex = isActive ? 0 : -1;
      });
    };

    const positionCards = () => {
      const cardWidth = cards[0].offsetWidth;
      const baseRadius = cards.length > 2 ? cardWidth / (2 * Math.tan(Math.PI / cards.length)) : cardWidth;
      const separation = Number(getComputedStyle(scene).getPropertyValue('--ring-separation')) || 0.96;
      ringRadius = Math.ceil(baseRadius * separation);
      degreesPerPixel = angleStep / (cardWidth * 0.65);

      cards.forEach((card, index) => {
        const cardAngle = index * angleStep;
        card.dataset.ringAngle = String(cardAngle);
        card.style.setProperty('--card-angle', `${cardAngle}deg`);
      });

      scene.style.setProperty('--ring-radius', `${ringRadius}px`);
      gsap.set(ring, { z: -ringRadius, force3D: true });
      updateCardFocus();
    };

    const stopAutoplay = () => {
      autoplayTween?.kill();
      autoplayTween = undefined;
    };

    const snapTo = (targetRotation) => {
      snapTween?.kill();
      snapTween = gsap.to(ring, {
        rotationY: targetRotation,
        duration: reducedMotion.matches ? 0 : 0.7,
        ease: 'power3.out',
        overwrite: true,
        onUpdate: updateCardFocus,
        onComplete: () => {
          rotation = gsap.utils.wrap(-180, 180, targetRotation);
          gsap.set(ring, { rotationY: rotation });
          updateCardFocus();
          startAutoplay();
        },
      });
    };

    const startAutoplay = () => {
      stopAutoplay();
      autoplayTween = gsap.to(ring, {
        rotationY: '-=360',
        duration: cards.length * 5,
        ease: 'none',
        repeat: -1,
        force3D: true,
        overwrite: true,
        onUpdate: updateCardFocus,
      });
    };

    const scheduleLayout = () => {
      cancelAnimationFrame(refreshFrame);
      refreshFrame = requestAnimationFrame(() => {
        positionCards();
      });
    };

    const ctx = gsap.context(() => {
      const dragProxy = document.createElement('div');
      dragProxy.setAttribute('aria-hidden', 'true');
      dragProxy.style.cssText =
        'position:fixed;left:-10000px;top:-10000px;width:1px;height:1px;pointer-events:none;';
      document.body.appendChild(dragProxy);

      gsap.set(ring, {
        rotationY: 0,
        transformOrigin: '50% 50%',
        transformStyle: 'preserve-3d',
        force3D: true,
      });

      let pressX = 0;
      let pressRotation = 0;
      const draggable = Draggable.create(dragProxy, {
        type: 'x',
        trigger: scene,
        allowNativeTouchScrolling: true,
        dragClickables: true,
        minimumMovement: 4,
        cursor: 'grab',
        activeCursor: 'grabbing',
        onPress() {
          stopAutoplay();
          snapTween?.kill();
          rotation = Number(gsap.getProperty(ring, 'rotationY')) || 0;
          pressX = this.x;
          pressRotation = rotation;
        },
        onDrag() {
          rotation = pressRotation + (this.x - pressX) * degreesPerPixel;
          gsap.set(ring, { rotationY: rotation, force3D: true });
          updateCardFocus();
        },
        onRelease() {
          const currentRotation = Number(gsap.getProperty(ring, 'rotationY')) || 0;
          const targetRotation = Math.round(currentRotation / angleStep) * angleStep;
          snapTo(targetRotation);
          gsap.set(dragProxy, { x: 0, y: 0 });
          this.update();
        },
      })[0];

      const goToPrevious = () => {
        stopAutoplay();
        const currentRotation = Number(gsap.getProperty(ring, 'rotationY')) || 0;
        snapTo(Math.round(currentRotation / angleStep) * angleStep + angleStep);
      };

      const goToNext = () => {
        stopAutoplay();
        const currentRotation = Number(gsap.getProperty(ring, 'rotationY')) || 0;
        snapTo(Math.round(currentRotation / angleStep) * angleStep - angleStep);
      };

      previousButton?.addEventListener('click', goToPrevious);
      nextButton?.addEventListener('click', goToNext);

      // A non-scrolling proxy makes Draggable choose "manipulation"; keep horizontal touch for the ring.
      gsap.set(scene, { touchAction: 'pan-y' });
      positionCards();
      startAutoplay();

      return () => {
        draggable?.kill();
        snapTween?.kill();
        stopAutoplay();
        previousButton?.removeEventListener('click', goToPrevious);
        nextButton?.removeEventListener('click', goToNext);
        dragProxy.remove();
      };
    }, section);

    const loadedImages = Array.from(section.querySelectorAll('img'));
    loadedImages.forEach((image) => {
      if (!image.complete) {
        image.addEventListener('load', scheduleLayout, { once: true });
      }
    });

    const resizeObserver = new ResizeObserver(scheduleLayout);
    resizeObserver.observe(section);
    resizeObserver.observe(scene);
    resizeObserver.observe(cards[0]);
    window.addEventListener('resize', scheduleLayout);
    scheduleLayout();

    return () => {
      cancelAnimationFrame(refreshFrame);
      loadedImages.forEach((image) => image.removeEventListener('load', scheduleLayout));
      resizeObserver.disconnect();
      window.removeEventListener('resize', scheduleLayout);
      ctx.revert();
      scene.style.removeProperty('--ring-radius');
      cards.forEach((card, index) => {
        card.style.removeProperty('--card-angle');
        card.style.removeProperty('visibility');
        card.style.removeProperty('pointer-events');
        card.removeAttribute('aria-hidden');
        delete card.dataset.ringAngle;
        if (links[index]) links[index].removeAttribute('tabindex');
        ['opacity', 'transform', 'filter'].forEach(property => surfaces[index]?.style.removeProperty(property));
      });
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex h-[100svh] min-h-[760px] flex-col overflow-hidden bg-[#101828] py-8 text-white sm:py-10 lg:py-12"
      data-motion-ring-section
    >
      <header className="container-custom shrink-0 pb-6 sm:pb-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-4xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-black uppercase tracking-[0.18em] text-[#f6a24a] backdrop-blur">
              <Globe2 className="h-4 w-4" />
              Servicios principales
            </div>
            <MotionTitle
              as="h2"
              className="text-3xl font-black leading-tight text-[#f8f5ef] sm:text-4xl lg:text-5xl"
            >
              Explora nuestras lineas tecnicas mientras avanzas.
            </MotionTitle>
          </div>

          <Link
            to="/services#servicios-listado"
            className="inline-flex items-center gap-2 self-start rounded-lg border border-white/20 bg-white/10 px-5 py-3 text-sm font-bold text-white backdrop-blur transition hover:bg-white/20 lg:self-auto"
          >
            Ver lista completa
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </header>

      <div
        className="relative min-h-0 w-full flex-1 overflow-hidden"
      >
        <button
          type="button"
          data-ring-prev
          aria-label="Servicio anterior"
          title="Servicio anterior"
          className="absolute left-3 top-1/2 z-20 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-[#101828]/80 text-white shadow-lg backdrop-blur transition hover:scale-105 hover:bg-[#e15f0b] focus:outline-none focus:ring-4 focus:ring-[#f6a24a]/40 sm:left-5"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        <div
          ref={sceneRef}
          className="scene relative h-full min-h-0 w-full"
          data-motion-ring-scene
        >
          <div ref={ringRef} className="ring" data-motion-ring>
            {services.map((service, index) => (
              <article
                key={service.name}
                ref={(element) => {
                  cardRefs.current[index] = element;
                }}
                className="service-card"
                data-ring-card
              >
                <div
                  className="service-card__surface group relative overflow-hidden rounded-lg border border-white/20 bg-[#f8f5ef] shadow-2xl shadow-black/30"
                  data-ring-card-surface
                >
                  <img
                    src={service.image}
                    alt={service.name}
                    className="absolute inset-0 h-full w-full object-cover"
                    draggable="false"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#101828]/65 via-[#101828]/10 to-[#101828]/90" />

                  <div className="absolute inset-x-4 top-4 sm:inset-x-5 sm:top-5">
                    <h3 className="max-w-[92%] rounded-lg border border-white/20 bg-[#101828]/85 px-4 py-3 text-xl font-black leading-tight text-white shadow-lg backdrop-blur-md sm:text-2xl">
                      {service.name}
                    </h3>
                  </div>

                  <div className="absolute inset-x-4 bottom-4 sm:inset-x-5 sm:bottom-5">
                    <div className="rounded-lg border border-white/70 bg-[#f8f5ef]/95 p-4 text-[#233274] shadow-xl backdrop-blur-md">
                      <div className="mb-2 flex items-center gap-3 text-xs font-black uppercase tracking-[0.16em] text-[#0f766e]">
                        <span>{service.projectsCount}+ casos</span>
                        <span className="inline-flex items-center gap-1 text-[#e15f0b]">
                          <Star className="h-3.5 w-3.5 fill-current" />
                          {service.rating}
                        </span>
                      </div>
                      <p className="text-sm font-semibold leading-relaxed text-[#4b5565] sm:text-base">
                        {service.subtitle}
                      </p>
                    </div>

                    <Link
                      to="/services#servicios-listado"
                      state={{ prefill: service.name }}
                      className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-[#e15f0b] px-4 py-3 text-center text-sm font-black text-white shadow-lg transition-colors hover:bg-[#d14a00] focus:outline-none focus:ring-4 focus:ring-[#f6a24a]/40"
                    >
                      Explorar servicios de este tipo
                      <ArrowRight className="h-4 w-4 flex-shrink-0" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <button
          type="button"
          data-ring-next
          aria-label="Siguiente servicio"
          title="Siguiente servicio"
          className="absolute right-3 top-1/2 z-20 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-[#101828]/80 text-white shadow-lg backdrop-blur transition hover:scale-105 hover:bg-[#e15f0b] focus:outline-none focus:ring-4 focus:ring-[#f6a24a]/40 sm:right-5"
        >
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>
    </section>
  );
};

export default PopularCountriesSection;
