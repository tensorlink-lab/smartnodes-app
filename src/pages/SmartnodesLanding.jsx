import styles from "../style";
import React, { useEffect } from "react";
import { useStateContext } from "../contexts/contextProvider";
import { Testimonials, LaunchApp, MainHero, MainHero2, Opportunity, ParticleBackground } from '../components';

const SmartnodesLanding = () => {
  const { setActiveMenu } = useStateContext();

  // Use useEffect to call setActiveMenu only once after the component mounts
  useEffect(() => {
    setActiveMenu(false);
  }, []);

  return (
    <div className={`min-h-screen flex-col ${styles.flexCenter} w-full`}>
      {/* <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 0 }}>
        <ParticleBackground />
      </div> */}
      <div className="md:mt-1 mt-5 flex-col">
        <MainHero />
        <MainHero2 />
        <Opportunity />
        <Testimonials style={{ zIndex: 0 }} />
        <LaunchApp />
      </div>
    </div>
  )
}

export default SmartnodesLanding;
