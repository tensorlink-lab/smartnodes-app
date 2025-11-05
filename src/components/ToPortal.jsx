import styles from "../style";
import React from "react";
import { portals } from "../constants";
import AnimatedLottie from "./animations/AnimatedLottie";

const ToPortal = () => (
  <section 
    className="relative z-20 w-full overflow-hidden py-20 pb-3 bg-zinc-300 dark:bg-gray-900"
    id="get-started"
  >
    {/* Subtle background pattern - lighter than in LocalhostGPT */}
    
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 pb-48">
      <div className="w-full text-center pt-8 lg:pb-10">
        <h2 className={`text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight`}>
          Get Started 
        </h2>
        <p className="mt-6 text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
          Explore our tools and resources to start leveraging distributed computing for your AI workloads
        </p>
      </div>
      
      <div className="flex flex-wrap justify-center mt-10 gap-6">
        {portals.map((product, index) => (
          <div key={index} className="py-4 px-2">
            <CustomComponent {...product} wide={index === 1} />
          </div>
        ))}
      </div>
    </div>
  </section>
);

const CustomComponent = ({ title, link, img, wide }) => (
  <a href={link} className="no-underline">
    <div className={`feedback-card rounded-2xl py-1 flex flex-col justify-between xs:min-h-[265px] xs:max-h-[265px] md:min-w-[425px] lg:min-w-[350px] xs:min-w-[320px] min-w-[240px]`}>
      <div className="flex flex-col items-center justify-center h-full">
        <h4 className="font-poppins font-semibold lg:text-2xl text-xl mt-5 text-white mb-1 text-center">
          {title}
        </h4>
        <div className={`align-middle justify-center content-center max-w-[140px] min-w-[170px] max-h-[190px] min-h-[190px]
                          ${wide ? "overflow-hidden min-w-[240px] xs:min-w-[300px]" : " md:max-w-[150px] md:min-w-[180px] md:max-h-[200px] md:min-h-[200px]"}`}>
          <AnimatedLottie animationData={img} loop={true}/>
        </div>
      </div>
    </div>
  </a>
);

export default ToPortal;