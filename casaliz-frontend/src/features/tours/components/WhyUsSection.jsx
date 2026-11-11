import { ClipboardCheck, DraftingCompass, ShieldCheck } from "lucide-react";

const features = [
    {
        icon: ShieldCheck,
        title: "Tu proyecto, nuestra prioridad",
        description:
            "Acompañamos cada etapa: idea, diseño, planos y obra. El resultado se alinea con tu estilo, presupuesto y necesidades reales.",
    },
    {
        icon: DraftingCompass,
        title: "Diseño funcional y estético",
        description:
            "Ordenamos iluminación, circulación, materiales y detalle constructivo para lograr espacios útiles, durables y coherentes.",
    },
    {
        icon: ClipboardCheck,
        title: "Gestión integral y transparente",
        description:
            "Coordinamos especialistas, expediente, permisos y ejecución para que el avance técnico sea claro en todo momento.",
    },
];

export default function WhyUsSection() {
    return (
        <section id="nosotros" className="cz-home-method cz-section">
            <div className="cz-wrap cz-method-layout">
                <div className="cz-method-intro" data-cz-reveal>
                    <p className="cz-method-eyebrow">MÉTODO CASALIZ</p>
                    <h2>Un equipo técnico para decisiones importantes.</h2>
                    <p>
                        Integramos arquitectura, ingeniería y gestión para que
                        cada decisión avance con sustento técnico, presupuesto
                        claro y documentación ordenada.
                    </p>
                </div>
                <div className="cz-method-features">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <article key={feature.title} data-cz-reveal>
                                <span className="cz-method-icon">
                                    <Icon size={27} aria-hidden="true" />
                                </span>
                                <div>
                                    <span className="cz-method-number">
                                        0{index + 1}
                                    </span>
                                    <h3>{feature.title}</h3>
                                    <p>{feature.description}</p>
                                </div>
                            </article>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
