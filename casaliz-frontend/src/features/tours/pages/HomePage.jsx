// src/features/tours/pages/HomePage.jsx

import HeroSection from "../components/HeroSection";
import WhyUsSection from "../components/WhyUsSection";
import CTASection from "../components/CTASection";
import PopularLocationsSection from "../components/PopularLocationsSection";
import FeaturedToursSection from "../components/FeaturedToursSection";
import FeaturedServiceSection from "../components/FeaturedServiceSection";
import PopularCountriesSection from "../components/PopularCountriesSection";
import { useRef } from "react";
import { StudioClosing } from "../../../shared/studio/StudioElements";
import useStudioMotion from "../../../shared/studio/useStudioMotion";
import "./HomePage.css";
import "../../../shared/studio/StudioCatalog.css";

const HomePage = () => {
    const rootRef = useRef(null);
    useStudioMotion(rootRef);
    return (
        <div className="cz-page cz-home" ref={rootRef}>
            <HeroSection />
            <PopularCountriesSection />
            <div>
                <CTASection />
            </div>
            <div>
                <FeaturedServiceSection />
            </div>
            <div>
                <FeaturedToursSection />
            </div>
            <div>
                <WhyUsSection />
            </div>
            <div>
                <PopularLocationsSection />
            </div>
            <StudioClosing
                asset="countryResidence"
                imageAlt="Render de casa de campo del archivo visual de CasaLiz"
                caption="CASA DE CAMPO / ARCHIVO VISUAL CASALIZ"
            />
        </div>
    );
};

export default HomePage;
