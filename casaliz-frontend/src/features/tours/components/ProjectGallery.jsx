import {
    forwardRef,
    useCallback,
    useEffect,
    useId,
    useRef,
    useState,
} from "react";
import { createPortal } from "react-dom";
import { ArrowUpRight, ChevronLeft, ChevronRight, Plus, X } from "lucide-react";
import { toPublicUrl } from "../../../shared/utils/api";
import { usePublicMotion } from "../../../shared/motion/publicMotionContext";
import "./ProjectGallery.css";

const ProjectGallery = forwardRef(function ProjectGallery(
    { images = [], title, description },
    ref,
) {
    const [activeIndex, setActiveIndex] = useState(null);
    const dialogRef = useRef(null);
    const openerRef = useRef(null);
    const headingId = useId();
    const { lenis } = usePublicMotion();
    const isOpen = activeIndex !== null;
    const activeImage = isOpen ? images[activeIndex] : null;
    const move = useCallback(
        (direction) => {
            setActiveIndex((index) =>
                index === null
                    ? null
                    : (index + direction + images.length) % images.length,
            );
        },
        [images.length],
    );

    useEffect(() => {
        if (!isOpen) return undefined;
        const dialog = dialogRef.current;
        const previousOverflow = document.body.style.overflow;
        const resumeLenis = lenis && !lenis.isStopped;
        document.body.style.overflow = "hidden";
        if (resumeLenis) lenis.stop();
        dialog.querySelector("button")?.focus({ preventScroll: true });
        const handleKey = (event) => {
            if (event.key === "Escape") {
                event.preventDefault();
                setActiveIndex(null);
            }
            if (event.key === "ArrowLeft") {
                event.preventDefault();
                move(-1);
            }
            if (event.key === "ArrowRight") {
                event.preventDefault();
                move(1);
            }
            if (event.key !== "Tab") return;
            const controls = [...dialog.querySelectorAll("button")].filter(
                (button) => !button.disabled,
            );
            const first = controls[0],
                last = controls.at(-1);
            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last?.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first?.focus();
            }
        };
        dialog.addEventListener("keydown", handleKey);
        return () => {
            dialog.removeEventListener("keydown", handleKey);
            document.body.style.overflow = previousOverflow;
            if (resumeLenis) lenis.start();
            openerRef.current?.focus({ preventScroll: true });
        };
    }, [isOpen, lenis, move]);

    return (
        <section
            className="cz-project-gallery"
            id="galeria"
            aria-labelledby={headingId}
        >
            <header className="cz-gallery-heading">
                <div>
                    <p className="cz-gallery-eyebrow">
                        <span aria-hidden="true">↗</span> GALERÍA DEL PROYECTO
                    </p>
                    <h2 id={headingId} className="cz-gallery-title">
                        Recorrido <em>visual.</em>
                    </h2>
                    <p className="cz-gallery-intro">
                        {description ||
                            "Explora los espacios, las vistas y los detalles del proyecto."}
                    </p>
                </div>
                <div className="cz-gallery-count">
                    <strong>{String(images.length).padStart(2, "0")}</strong>
                    <span>
                        {images.length === 1 ? "imagen" : "imágenes"}
                        <br />
                        Selecciona para ampliar
                    </span>
                </div>
            </header>
            <div className="cz-gallery-grid" id="galeria-fotos" ref={ref}>
                {images.map((image, index) => (
                    <button
                        key={image.id ?? image.path ?? index}
                        type="button"
                        className={`cz-gallery-tile${index === 0 ? " cz-gallery-tile-featured" : ""}`}
                        onClick={(event) => {
                            openerRef.current = event.currentTarget;
                            setActiveIndex(index);
                        }}
                        aria-label={`Ampliar imagen ${index + 1}: ${image.caption || title}`}
                        data-motion-card
                    >
                        <figure>
                            <img
                                src={toPublicUrl(image.path)}
                                alt={
                                    image.caption ||
                                    `${title} — vista ${index + 1}`
                                }
                                loading="lazy"
                                decoding="async"
                            />
                        </figure>
                        <span className="cz-gallery-tile-caption">
                            <span className="cz-gallery-number">
                                {String(index + 1).padStart(2, "0")}
                            </span>
                            <span className="cz-gallery-caption-text">
                                {image.caption ||
                                    `Vista del proyecto ${String(index + 1).padStart(2, "0")}`}
                            </span>
                            <span className="cz-gallery-expand">
                                <span>Ampliar</span>
                                <Plus size={19} aria-hidden="true" />
                            </span>
                        </span>
                    </button>
                ))}
            </div>
            <p className="cz-gallery-note">
                {title}
                <ArrowUpRight size={16} aria-hidden="true" />
                <span>Imágenes originales del proyecto.</span>
            </p>
            {activeImage &&
                createPortal(
                    <div
                        className="cz-gallery-lightbox"
                        data-lenis-prevent
                        onClick={(event) => {
                            if (event.target === event.currentTarget)
                                setActiveIndex(null);
                        }}
                    >
                        <div
                            ref={dialogRef}
                            className="cz-gallery-dialog"
                            role="dialog"
                            aria-modal="true"
                            aria-label={`Galería de ${title}`}
                            data-lenis-prevent
                        >
                            <div className="cz-gallery-toolbar">
                                <span>{title}</span>
                                <button
                                    type="button"
                                    onClick={() => setActiveIndex(null)}
                                    aria-label="Cerrar imagen ampliada"
                                >
                                    Cerrar
                                    <X size={21} aria-hidden="true" />
                                </button>
                            </div>
                            <figure className="cz-gallery-enlarged">
                                <img
                                    src={toPublicUrl(activeImage.path)}
                                    alt={
                                        activeImage.caption ||
                                        `${title} — vista ${activeIndex + 1}`
                                    }
                                />
                            </figure>
                            <div className="cz-gallery-lightbox-footer">
                                <div>
                                    <span
                                        className="cz-gallery-position"
                                        aria-live="polite"
                                    >
                                        {activeIndex + 1} / {images.length}
                                    </span>
                                    <p>
                                        {activeImage.caption ||
                                            "Vista del proyecto"}
                                    </p>
                                </div>
                                <nav aria-label="Navegación de imágenes">
                                    <button
                                        type="button"
                                        onClick={() => move(-1)}
                                        disabled={images.length < 2}
                                        aria-label="Imagen anterior"
                                    >
                                        <ChevronLeft
                                            size={22}
                                            aria-hidden="true"
                                        />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => move(1)}
                                        disabled={images.length < 2}
                                        aria-label="Imagen siguiente"
                                    >
                                        <ChevronRight
                                            size={22}
                                            aria-hidden="true"
                                        />
                                    </button>
                                </nav>
                            </div>
                        </div>
                    </div>,
                    document.body,
                )}
        </section>
    );
});

export default ProjectGallery;
