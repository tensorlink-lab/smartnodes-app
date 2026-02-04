import styles from "../style";
import React, { useEffect } from "react";
import { useStateContext } from "../contexts/contextProvider";
import { Testimonials, LaunchApp, MainHero, MainHero2, Opportunity, ParticleBackground, Framework } from '../components';

const SmartnodesLanding = () => {
  const { activeMenu, setActiveMenu } = useStateContext();

  useEffect(() => {
    setActiveMenu(false);
  }, []);

  return (
    <div className={`min-h-screen flex-col ${styles.flexCenter} w-full`}>
      <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 0 }}>
        <ParticleBackground />
      </div>
      <div 
        className="md:mt-1 mt-5 flex-col md:mx-5 lg:mx-14 transition-transform duration-300"
        style={{ zIndex: 1000000000000 }}
      >
        <MainHero />
        <Framework />
        <MainHero2 />
        <Opportunity />
        <Testimonials style={{ zIndex: 0 }} />
        {/* <LaunchApp /> */}
      </div>
    </div>
  )
}

export default SmartnodesLanding;