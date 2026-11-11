import { useEffect } from "react";
import gsap from "gsap";

const CARDS = ".cz-hover-card, .cz-gallery-tile, .cz-project-pair-grid > a";
const BUTTONS = ".cz-button, .cz-pagination button, button[type='submit'], .cz-original-service-form > button";
const VARIABLES = ["--cz-near", "--cz-near-x", "--cz-near-y", "--cz-near-reveal"];
const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const smooth = (value) => value * value * (3 - 2 * value);

// Animate proximity before :hover, without replacing GSAP's scroll transforms.
export default function useProximityMotion(rootRef) {
    useEffect(() => {
        const root = rootRef.current;
        if (!root || !window.matchMedia) return undefined;
        const preference = window.matchMedia(
            "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
        );
        let dispose = () => {};

        const enable = () => {
            root.classList.add("cz-proximity-enabled");
            const records = new Map();
            const visible = new Set();
            let point = null;
            let frame = 0;
            const paint = (element, state) => {
                element.style.setProperty("--cz-near", state.strength.toFixed(4));
                element.style.setProperty("--cz-near-x", `${state.x.toFixed(3)}px`);
                element.style.setProperty("--cz-near-y", `${state.y.toFixed(3)}px`);
                const reveal = smooth(clamp((state.strength - 0.72) / 0.28));
                element.style.setProperty("--cz-near-reveal", reveal.toFixed(4));
            };
            const animate = (element, record, strength, x = 0, y = 0) => {
                if (Math.abs(record.target.strength - strength) < 0.002 &&
                    Math.abs(record.target.x - x) < 0.03 &&
                    Math.abs(record.target.y - y) < 0.03) return;
                record.target = { strength, x, y };
                record.tween?.kill();
                record.tween = gsap.to(record.state, {
                    strength, x, y,
                    duration: strength > record.state.strength ? 0.65 : 0.8,
                    ease: "sine.out",
                    onUpdate: () => paint(element, record.state),
                });
            };
            const reset = () => {
                point = null;
                records.forEach((record, element) => animate(element, record, 0));
            };
            const update = () => {
                frame = 0;
                if (!point) return;
                // Read layout first, then update animation targets.
                const bounds = [...visible].map((element) => [element, element.getBoundingClientRect()]);
                bounds.forEach(([element, rect]) => {
                    const record = records.get(element);
                    if (!record) return;
                    if (!rect.width || !rect.height || element.matches(":disabled")) {
                        animate(element, record, 0);
                        return;
                    }
                    const dx = Math.max(rect.left - point.x, 0, point.x - rect.right);
                    const dy = Math.max(rect.top - point.y, 0, point.y - rect.bottom);
                    const radius = record.kind === "card" ? 100 : 65;
                    const strength = smooth(clamp(1 - Math.hypot(dx, dy) / radius));
                    const x = record.kind === "button"
                        ? clamp((point.x - rect.left - rect.width / 2) / rect.width, -1, 1) * 3 * strength : 0;
                    const y = record.kind === "button"
                        ? clamp((point.y - rect.top - rect.height / 2) / rect.height, -1, 1) * 3 * strength : 0;
                    animate(element, record, strength, x, y);
                });
            };
            const schedule = () => {
                if (!frame && point) frame = requestAnimationFrame(update);
            };
            const intersection = window.IntersectionObserver
                ? new IntersectionObserver((entries) => {
                    entries.forEach(({ target, isIntersecting }) => {
                        if (isIntersecting) visible.add(target);
                        else {
                            visible.delete(target);
                            const record = records.get(target);
                            if (record) animate(target, record, 0);
                        }
                    });
                    schedule();
                }, { rootMargin: "110px" }) : null;
            const release = (element, record) => {
                record.tween?.kill();
                intersection?.unobserve(element);
                visible.delete(element);
                element.removeAttribute("data-cz-proximity");
                VARIABLES.forEach((name) => element.style.removeProperty(name));
            };
            const sync = () => {
                records.forEach((record, element) => {
                    if (!root.contains(element)) {
                        release(element, record);
                        records.delete(element);
                    }
                });
                root.querySelectorAll(`${CARDS}, ${BUTTONS}`).forEach((element) => {
                    if (records.has(element) || element.closest('[data-motion-ring-section], [aria-modal="true"]')) return;
                    const kind = element.matches(CARDS) ? "card" : "button";
                    const state = { strength: 0, x: 0, y: 0 };
                    records.set(element, { kind, state, target: { ...state } });
                    element.dataset.czProximity = kind;
                    paint(element, state);
                    if (intersection) intersection.observe(element);
                    else visible.add(element);
                });
                schedule();
            };
            const move = (event) => {
                if (event.pointerType && event.pointerType !== "mouse") return;
                if (event.target.closest?.('[aria-modal="true"]')) {
                    reset();
                    return;
                }
                point = { x: event.clientX, y: event.clientY };
                schedule();
            };
            sync();
            const mutations = new MutationObserver(sync);
            mutations.observe(root, { childList: true, subtree: true });
            window.addEventListener("pointermove", move, { passive: true });
            window.addEventListener("scroll", schedule, { passive: true, capture: true });
            window.addEventListener("resize", schedule, { passive: true });
            window.addEventListener("blur", reset);
            document.documentElement.addEventListener("pointerleave", reset);
            return () => {
                root.classList.remove("cz-proximity-enabled");
                cancelAnimationFrame(frame);
                mutations.disconnect();
                intersection?.disconnect();
                window.removeEventListener("pointermove", move);
                window.removeEventListener("scroll", schedule, true);
                window.removeEventListener("resize", schedule);
                window.removeEventListener("blur", reset);
                document.documentElement.removeEventListener("pointerleave", reset);
                records.forEach((record, element) => release(element, record));
                records.clear();
            };
        };
        const change = () => {
            dispose();
            dispose = preference.matches ? enable() : () => {};
        };
        change();
        preference.addEventListener("change", change);
        return () => {
            preference.removeEventListener("change", change);
            dispose();
        };
    }, [rootRef]);
}
