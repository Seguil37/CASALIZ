import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { toPublicUrl } from "../../../shared/utils/api";
import fallback from "../../../assets/images/studio/home-cover.webp";

export default function CatalogServiceCard({ service }) {
    const image = toPublicUrl(service.cover_image || service.gallery?.[0]?.path) || fallback;
    const value = service.is_featured ?? service.featured;
    const featured = value === true || value === 1 || value === "1" || String(value).toLowerCase() === "true";
    return (
        <Link
            to={`/services/${service.slug || service.id}`}
            aria-label={`Ver detalle: ${service.title}`}
            className="cz-hover-card cz-service-card cz-original-service-card group relative rounded-none shadow-lg overflow-hidden block h-full bg-gradient-to-br from-[#1b274f] via-[#1f2f63] to-[#0f193a] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_28px_55px_rgba(15,25,58,0.26)]"
            data-motion-card
        >
                  <div className="p-4 pb-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="inline-flex bg-[#f8f5ef] text-[#233274] text-xs font-semibold uppercase tracking-wide px-3 py-1 rounded-full border border-[#ebe7df]">
                        {service.category || 'Servicio'}
                      </span>
                      {featured && (
                        <span className="inline-flex items-center gap-1 bg-[#e15f0b] text-white text-xs font-semibold uppercase tracking-wide px-3 py-1 rounded-full shadow-md">
                          <Sparkles className="w-4 h-4" />
                          Destacado
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="relative aspect-[4/3] w-full bg-[#f8f5ef] flex items-center justify-center">
                    <img
                      src={image}
                      alt={service.title}
                      loading="lazy"
                      decoding="async"
                className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="cz-card-reveal absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-center px-6 text-white">
                      <h3 data-hover-detail className="text-2xl font-bold mb-2">{service.title}</h3>
                      <p data-hover-detail className="text-sm font-medium">Haz clic para ver el detalle</p>
                    </div>
                  </div>
                </Link>
    );
}
