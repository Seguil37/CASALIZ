import { useLayoutEffect } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// One Lenis instance is owned and synchronized by PublicMotionProvider.
export default function useStudioMotion(rootRef) {
    useLayoutEffect(() => {
        const root = rootRef.current;
        if (!root) return undefined;
        const previousTitle = document.title;
        document.title = "CasaLiz";
        const match = gsap.matchMedia();
        const context = gsap.context(() => {
            match.add("(prefers-reduced-motion: no-preference)", () => {
                const grid = root.querySelector(".cz-grid");
                const cover = root.querySelector("[data-cz-cover]");
                const intro = gsap.timeline({
                    defaults: { ease: "power2.out" },
                });
                if (grid)
                    intro
                        .from(
                            grid.children,
                            {
                                scaleY: 0,
                                transformOrigin: "top",
                                duration: 0.7,
                                stagger: 0.08,
                            },
                            0,
                        )
                        .to(grid, { opacity: 0, duration: 1 }, 1.1);
                intro.from(
                    root.querySelectorAll("[data-cz-title]"),
                    { y: 18, opacity: 0, duration: 1.1, stagger: 0.09 },
                    0.15,
                );
                if (cover)
                    intro.from(
                        cover,
                        {
                            opacity: 0.7,
                            scale: 1.012,
                            duration: 1.5,
                        },
                        0.05,
                    );
                root.querySelectorAll("[data-cz-reveal]").forEach((element) => {
                    gsap.from(element, {
                        y: 14,
                        opacity: 0,
                        duration: 1,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: element,
                            start: "top 93%",
                            once: true,
                        },
                    });
                });
                root.querySelectorAll("[data-cz-image]").forEach((element) => {
                    gsap.from(element, {
                        opacity: 0,
                        y: 12,
                        ease: "power2.out",
                        duration: 1.2,
                        scrollTrigger: {
                            trigger: element,
                            start: "top 90%",
                            once: true,
                        },
                    });
                    const image = element.querySelector("img");
                    if (image)
                        gsap.fromTo(
                            image,
                            { scale: 1.018, yPercent: -0.4 },
                            {
                                scale: 1.008,
                                yPercent: 0.4,
                                ease: "none",
                                scrollTrigger: {
                                    trigger: element,
                                    start: "top bottom",
                                    end: "bottom top",
                                    scrub: 1.2,
                                },
                            },
                        );
                });
                root.querySelectorAll("[data-cz-line]").forEach((element) => {
                    gsap.from(element, {
                        scaleX: 0,
                        transformOrigin: "left",
                        duration: 1,
                        scrollTrigger: {
                            trigger: element,
                            start: "top 90%",
                            once: true,
                        },
                    });
                });
                root.querySelectorAll(".cz-manifesto h2>span").forEach(
                    (element) => {
                        gsap.fromTo(
                            element,
                            { opacity: 0.3 },
                            {
                                opacity: 1,
                                ease: "none",
                                scrollTrigger: {
                                    trigger: element,
                                    start: "top 87%",
                                    end: "top 55%",
                                    scrub: 0.4,
                                },
                            },
                        );
                    },
                );
            });
        }, root);
        let alive = true;
        const refresh = () => {
            if (alive) ScrollTrigger.refresh();
        };
        const images = [...root.querySelectorAll("img")];
        images.forEach((image) => image.addEventListener("load", refresh));
        document.fonts?.ready.then(refresh);
        return () => {
            alive = false;
            images.forEach((image) =>
                image.removeEventListener("load", refresh),
            );
            match.revert();
            context.revert();
            document.title = previousTitle;
        };
    }, [rootRef]);
}
