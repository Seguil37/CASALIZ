import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { toPublicUrl } from "../../../shared/utils/api";
import fallback from "../../../assets/images/studio/home-cover.webp";

export default function TourCard({ tour }) {
    const image =
        toPublicUrl(
            tour.hero_image ||
                tour.featured_image ||
                tour.featured_images?.[0]?.path ||
                tour.images?.[0]?.path,
        ) || fallback;
    return (
        <Link to={`/projects/${tour.id}`} className="cz-hover-card cz-project-card">
            <figure>
                <img
                    data-project-cover
                    src={image}
                    alt={tour.title}
                    loading="lazy"
                    decoding="async"
                />
            </figure>
            <div>
                <small>
                    {tour.type || "Proyecto residencial"}
                    {tour.is_featured ? " / DESTACADO" : ""}
                </small>
                <h3>
                    {tour.title}
                    <ArrowUpRight size={22} aria-hidden="true" />
                </h3>
                <p>
                    {tour.city
                        ? `${tour.city}${tour.state && tour.state !== tour.city ? `, ${tour.state}` : ""}`
                        : "Ubicación por confirmar"}
                </p>
                <span className="cz-project-card-action">
                    Ver proyecto
                    <ArrowUpRight size={17} aria-hidden="true" />
                </span>
            </div>
        </Link>
    );
}
