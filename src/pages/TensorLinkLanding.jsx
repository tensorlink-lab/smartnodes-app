import styles from "../style";
import React, { useEffect } from "react";
import { useStateContext } from "../contexts/contextProvider";
import { Example, ToPortal, WhyTensorlink, ParticleBackground } from '../components';

const TensorLinkLanding = () => {
  const { setActiveMenu } = useStateContext();

  return (
    <div className={`z-20 min-h-screen flex-col ${styles.flexCenter} min-w-full`}>
      <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 0 }}>
        <ParticleBackground />
      </div>
      <div className="z-10 mt-5 sm:mt-0 flex-col min-w-full">
        <Example />
        <WhyTensorlink />
        <ToPortal />
      </div>
    </div>
  )
}

export default TensorLinkLanding;
