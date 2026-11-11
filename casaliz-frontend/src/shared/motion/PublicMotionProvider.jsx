import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { PublicMotionContext } from "./publicMotionContext";
import { shouldUsePublicMotion } from "./publicMotionRoutes";

gsap.registerPlugin(ScrollTrigger);
gsap.ticker.lagSmoothing(0);

const HEADER_SCROLL_OFFSET = -96;
const MOTION_SELECTOR =
    "[data-motion-section], [data-motion-card], [data-motion-item], [data-motion-title] [data-motion-letter]";

const prefersReducedMotion = () =>
    window.matchMedia
        ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
        : false;

const getMotionOffset = (effect) => {
    if (effect === "left") return { x: -14, y: 0, scale: 1 };
    if (effect === "right") return { x: 14, y: 0, scale: 1 };
    if (effect === "scale") return { x: 0, y: 12, scale: 0.995 };
    return { x: 0, y: 16, scale: 1 };
};

const nativeScrollTo = (target, options = {}) => {
    const behavior =
        options.immediate || prefersReducedMotion() ? "auto" : "smooth";

    if (typeof target === "number") {
        window.scrollTo({ top: target, behavior });
        return;
    }

    const element =
        typeof target === "string" ? document.querySelector(target) : target;

    if (element instanceof HTMLElement) {
        element.scrollIntoView({ behavior, block: "start" });
    }
};

const createReveal = (element, options = {}) => {
    const effect = element.dataset.motionEffect || options.effect || "up";
    const { x, y, scale } = getMotionOffset(effect);

    element.dataset.motionBound = "true";

    const tween = gsap.fromTo(
        element,
        {
            autoAlpha: 0,
            x,
            y,
            scale,
        },
        {
            autoAlpha: 1,
            x: 0,
            y: 0,
            scale: 1,
            clearProps: "opacity,visibility,transform",
            delay: options.delay || 0,
            duration: options.duration || 1,
            ease: "power2.out",
            overwrite: "auto",
            scrollTrigger: {
                trigger: element,
                start:
                    options.start || element.dataset.motionStart || "top 84%",
                once: true,
            },
        },
    );

    return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
        element.removeAttribute("data-motion-bound");
        gsap.set(element, { clearProps: "opacity,visibility,transform" });
    };
};

const PublicMotionProvider = ({ children }) => {
    const { pathname, search } = useLocation();
    const lenisRef = useRef(null);
    const [lenis, setLenis] = useState(null);
    const [reducedMotion, setReducedMotion] = useState(prefersReducedMotion);
    const enabled = shouldUsePublicMotion(pathname);
    const motionKey = `${pathname}${search}`;

    useEffect(() => {
        const query = window.matchMedia?.("(prefers-reduced-motion: reduce)");
        if (!query) return undefined;
        const update = () => setReducedMotion(query.matches);
        query.addEventListener("change", update);
        return () => query.removeEventListener("change", update);
    }, []);

    useEffect(() => {
        if (!enabled || reducedMotion) {
            lenisRef.current = null;
            setLenis(null);
            return undefined;
        }

        const currentLenis = new Lenis({
            anchors: {
                offset: HEADER_SCROLL_OFFSET,
                duration: 1.1,
                easing: (t) => 1 - Math.pow(1 - t, 3),
            },
            gestureOrientation: "vertical",
            lerp: 0.08,
            prevent: (node) =>
                Boolean(
                    node.closest(
                        '[data-lenis-prevent], [role="dialog"], [aria-modal="true"], .modal, .lightbox, input, textarea, select',
                    ),
                ),
            respectReducedMotion: true,
            smoothWheel: true,
            stopInertiaOnNavigate: true,
            syncTouch: false,
        });

        lenisRef.current = currentLenis;
        setLenis(currentLenis);

        const removeScrollListener = currentLenis.on("scroll", () =>
            ScrollTrigger.update(),
        );
        const updateLenis = (time) => currentLenis.raf(time * 1000);

        gsap.ticker.add(updateLenis);
        document.documentElement.setAttribute("data-public-motion", "enabled");
        requestAnimationFrame(() => ScrollTrigger.refresh());

        return () => {
            removeScrollListener();
            gsap.ticker.remove(updateLenis);
            currentLenis.destroy();

            if (lenisRef.current === currentLenis) {
                lenisRef.current = null;
            }

            setLenis((activeLenis) =>
                activeLenis === currentLenis ? null : activeLenis,
            );
            document.documentElement.removeAttribute("data-public-motion");
            requestAnimationFrame(() => ScrollTrigger.refresh());
        };
    }, [enabled, reducedMotion]);

    useEffect(() => {
        if (!enabled || !lenisRef.current) return;

        requestAnimationFrame(() => {
            lenisRef.current?.resize();
            ScrollTrigger.refresh();
        });
    }, [enabled, motionKey, reducedMotion]);

    useEffect(() => {
        if (!enabled) return undefined;

        if (prefersReducedMotion()) {
            gsap.set(MOTION_SELECTOR, {
                clearProps: "opacity,visibility,transform",
            });
            return undefined;
        }

        const cleanupTasks = [];
        let setupFrame = 0;
        let refreshFrame = 0;

        const setupMotion = () => {
            document
                .querySelectorAll("[data-motion-hero]:not([data-motion-bound])")
                .forEach((hero) => {
                    hero.dataset.motionBound = "true";

                    const items = hero.querySelectorAll("[data-motion-item]");
                    if (items.length > 0) {
                        const tween = gsap.fromTo(
                            items,
                            { autoAlpha: 0, y: 14 },
                            {
                                autoAlpha: 1,
                                y: 0,
                                clearProps: "opacity,visibility,transform",
                                delay: 0.08,
                                duration: 1,
                                ease: "power2.out",
                                stagger: 0.08,
                                overwrite: "auto",
                            },
                        );

                        cleanupTasks.push(() => {
                            tween.kill();
                            gsap.set(items, {
                                clearProps: "opacity,visibility,transform",
                            });
                        });
                    }

                    hero.querySelectorAll("[data-motion-parallax]").forEach(
                        (element) => {
                            const yPercent = Number(
                                element.dataset.motionParallax || 8,
                            );
                            const tween = gsap.to(element, {
                                yPercent,
                                ease: "none",
                                scrollTrigger: {
                                    trigger: hero,
                                    start: "top top",
                                    end: "bottom top",
                                    scrub: true,
                                },
                            });

                            cleanupTasks.push(() => {
                                tween.scrollTrigger?.kill();
                                tween.kill();
                                gsap.set(element, { clearProps: "transform" });
                            });
                        },
                    );

                    cleanupTasks.push(() =>
                        hero.removeAttribute("data-motion-bound"),
                    );
                });

            document
                .querySelectorAll(
                    "[data-motion-title]:not([data-motion-title-bound])",
                )
                .forEach((title) => {
                    const letters = title.querySelectorAll(
                        "[data-motion-letter]",
                    );
                    if (letters.length === 0) return;

                    title.dataset.motionTitleBound = "true";

                    const tween = gsap.fromTo(
                        letters,
                        {
                            autoAlpha: 0,
                            rotateX: 0,
                            yPercent: 16,
                            transformOrigin: "50% 50% -18px",
                        },
                        {
                            autoAlpha: 1,
                            rotateX: 0,
                            yPercent: 0,
                            clearProps:
                                "opacity,visibility,transform,transformOrigin",
                            duration: 0.95,
                            ease: "power2.out",
                            stagger: {
                                amount: Math.min(0.3, letters.length * 0.006),
                                from: "start",
                            },
                            scrollTrigger: {
                                trigger: title,
                                start: title.dataset.motionStart || "top 86%",
                                once: true,
                            },
                        },
                    );

                    cleanupTasks.push(() => {
                        tween.scrollTrigger?.kill();
                        tween.kill();
                        title.removeAttribute("data-motion-title-bound");
                        gsap.set(letters, {
                            clearProps:
                                "opacity,visibility,transform,transformOrigin",
                        });
                    });
                });

            document
                .querySelectorAll(
                    "[data-motion-section]:not([data-motion-bound])",
                )
                .forEach((element) => {
                    cleanupTasks.push(createReveal(element));
                });

            document
                .querySelectorAll("[data-motion-card]:not([data-motion-bound])")
                .forEach((element, index) => {
                    cleanupTasks.push(
                        createReveal(element, {
                            delay: Math.min((index % 6) * 0.035, 0.18),
                            duration: 0.9,
                            start: "top 88%",
                        }),
                    );
                });

            cancelAnimationFrame(refreshFrame);
            refreshFrame = requestAnimationFrame(() => ScrollTrigger.refresh());
        };

        const scheduleSetup = () => {
            cancelAnimationFrame(setupFrame);
            setupFrame = requestAnimationFrame(setupMotion);
        };

        scheduleSetup();

        const observedRoot = document.querySelector("main") || document.body;
        const observer = new MutationObserver(scheduleSetup);
        observer.observe(observedRoot, { childList: true, subtree: true });

        window.addEventListener("load", scheduleSetup);
        window.addEventListener("resize", scheduleSetup);

        return () => {
            cancelAnimationFrame(setupFrame);
            cancelAnimationFrame(refreshFrame);
            observer.disconnect();
            window.removeEventListener("load", scheduleSetup);
            window.removeEventListener("resize", scheduleSetup);
            cleanupTasks.splice(0).forEach((cleanup) => cleanup());
        };
    }, [enabled, motionKey, reducedMotion]);

    const scrollTo = useCallback(
        (target, options = {}) => {
            const activeLenis = lenisRef.current;

            if (enabled && activeLenis) {
                activeLenis.scrollTo(target, {
                    offset:
                        typeof target === "number" ? 0 : HEADER_SCROLL_OFFSET,
                    duration: options.immediate ? 0 : 1.1,
                    easing: (t) => 1 - Math.pow(1 - t, 3),
                    force: true,
                    ...options,
                });
                return;
            }

            nativeScrollTo(target, options);
        },
        [enabled],
    );

    const contextValue = useMemo(
        () => ({
            enabled,
            lenis,
            scrollTo,
        }),
        [enabled, lenis, scrollTo],
    );

    return (
        <PublicMotionContext.Provider value={contextValue}>
            {children}
        </PublicMotionContext.Provider>
    );
};

export default PublicMotionProvider;
