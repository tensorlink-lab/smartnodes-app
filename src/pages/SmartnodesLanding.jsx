import styles from "../style";
import React, { useEffect } from "react";
import { useStateContext } from "../contexts/ContextProvider";
import { Testimonials, LaunchApp, MainHero, MainHero2, Opportunity, ParticleBackground, Framework } from '../components';

const SmartnodesLanding = () => {
  const { activeMenu, setActiveMenu } = useStateContext();

  useEffect(() => {
    setActiveMenu(false);
  }, []);

  return (
  <div className={`min-h-screen flex-col ${styles.flexCenter} w-full relative`}>
      {/* Particle layer: scoped to hero height, fades out at the bottom */}
      <div
        className="absolute inset-x-0 pointer-events-none"
        style={{
          height: "1600px", // roughly MainHero's rendered height
          zIndex: 0,
          maskImage: "linear-gradient(to bottom, black 0%, black 55%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 00%, black 55%, transparent 100%)",
        }}
      >
        <ParticleBackground />
      </div>

      <div
        className="md:mt-1 mt-5 flex-col md:mx-5 lg:mx-14 transition-transform duration-300 relative"
        style={{ zIndex: 10 }}
      >
        <MainHero />
        <Framework />
        <MainHero2 />
        <Opportunity />
        <Testimonials style={{ zIndex: 0 }} />
      </div>
    </div>
  )
}

export default SmartnodesLanding;