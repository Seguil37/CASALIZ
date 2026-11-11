import { useEffect, useLayoutEffect, useRef } from "react";
import { flushSync } from "react-dom";
import { useLocation, useNavigate } from "react-router-dom";
import gsap from "gsap";
import { shouldUsePublicMotion } from "./publicMotionRoutes";
import "./PageTransition.css";

const reduceMotion = () =>
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

export default function PageTransition({ children }) {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const navigateRef = useRef(navigate);
    const surface = useRef(null);
    const activeTransition = useRef(null);
    const currentPath = useRef(pathname);
    const initialized = useRef(false);

    useLayoutEffect(() => {
        navigateRef.current = navigate;
    }, [navigate]);

    useLayoutEffect(() => {
        currentPath.current = pathname;
        if (!initialized.current) {
            initialized.current = true;
            return undefined;
        }
        // Back/forward and browsers without View Transitions stay responsive.
        if (activeTransition.current || reduceMotion() || !shouldUsePublicMotion(pathname))
            return undefined;
        const element = surface.current;
        const tween = gsap.fromTo(element, { opacity: 0.94 }, {
            opacity: 1,
            duration: 0.45,
            ease: "power2.out",
            clearProps: "opacity",
        });
        return () => {
            tween.kill();
            gsap.set(element, { clearProps: "opacity" });
        };
    }, [pathname]);

    useEffect(() => {
        const handleLink = (event) => {
            if (event.defaultPrevented || event.button !== 0 || event.metaKey ||
                event.ctrlKey || event.shiftKey || event.altKey || reduceMotion() ||
                !document.startViewTransition) return;
            const link = event.target.closest?.("a[href]");
            if (!link || link.hasAttribute("download") ||
                (link.target && link.target !== "_self") ||
                link.hasAttribute("data-no-page-transition")) return;
            const url = new URL(link.href, window.location.href);
            if (url.origin !== window.location.origin ||
                url.pathname === currentPath.current ||
                !shouldUsePublicMotion(currentPath.current) ||
                !shouldUsePublicMotion(url.pathname)) return;

            event.preventDefault();
            activeTransition.current?.skipTransition();
            const transition = document.startViewTransition(async () => {
                flushSync(() => navigateRef.current(`${url.pathname}${url.search}${url.hash}`));
                // Keep the outgoing snapshot while the next cover decodes.
                // A bounded wait keeps navigation responsive on slow connections.
                const covers = [...(surface.current?.querySelectorAll(
                    '.cz-hero img, .cz-contact-intro img',
                ) || [])].filter((image) => !image.complete && image.decode).slice(0, 2);
                if (covers.length) {
                    let timer;
                    await Promise.race([
                        Promise.all(covers.map((image) => image.decode().catch(() => {}))),
                        new Promise((resolve) => { timer = window.setTimeout(resolve, 450); }),
                    ]);
                    window.clearTimeout(timer);
                }
            });
            activeTransition.current = transition;
            transition.finished.catch(() => {}).finally(() => {
                if (activeTransition.current === transition)
                    activeTransition.current = null;
            });
        };
        const preference = window.matchMedia?.("(prefers-reduced-motion: reduce)");
        const updatePreference = () => {
            if (preference.matches) activeTransition.current?.skipTransition();
        };
        document.addEventListener("click", handleLink, true);
        preference?.addEventListener("change", updatePreference);
        return () => {
            document.removeEventListener("click", handleLink, true);
            preference?.removeEventListener("change", updatePreference);
            activeTransition.current?.skipTransition();
        };
    }, []);

    return <main className="cz-route-content flex-1" ref={surface}>{children}</main>;
}
