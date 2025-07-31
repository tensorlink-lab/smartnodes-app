import { React } from "react";
import styles from "../style";
import AnimatedLottie from "./animations/AnimatedLottie";
import heroAnimation from "../assets/cloud-network.json";
import { python_logo } from "../assets";
import { Link } from "react-router-dom";

const MainHero = () => {
  return (
    <section id="home" className={`${styles.section} rounded-md xs:px-7 px-12`}>
      <div className="dark:bg-gradient-to-br dark:from-zinc-900 dark:to-slate-900 bg-gradient-to-br from-zinc-50 to-gray-100 rounded-xl px-5 flex sm:mx-10 md:flex-row flex-col z-20 border border-gray-300 dark:border-gray-800 backdrop-blur-sm dark:shadow-black shadow-indigo-950 shadow-lg">
        {/* Left Column - Title & Description */}
        <div className="flex-1 w-full flex-col items-center max-w-xl sm:min-w-[350px] z-0 mx-3 sm:mx-5 md:mx-10 md:py-10 py-6 mb-5">
        
          {/* Title */}
          <h1 className="flex-1 font-poppins font-extrabold lg:text-[56px] xs:text-[36px] ss:text-[46px] text-[32px] text-gray-900 dark:text-gray-100 ss:leading-[80.8px] leading-[55px] mt-3">
            <span className="inline bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
              Shared Power 
            </span>
            <br/>
            <span className="inline">for </span>
            <span className="inline bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">
              Big Problems
            </span>
          </h1>

          {/* Subtitle */}
          <div className="mt-6 mr-2">
            <p className="text-gray-700 dark:text-gray-300 text-md xs:text-lg leading-relaxed max-w-lg">
              Smartnodes connects devices around the world into collaborative peer-to-peer compute and data collection networks, powering science, AI, and research with global collaboration.
            </p>
          </div>

          {/* Enhanced CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-10">
            <a
              href="/app"
              className="group inline-flex items-center justify-center px-6 py-3 text-white bg-gradient-to-r from-gray-900 to-black hover:from-gray-800 hover:to-gray-900 rounded-lg text-sm md:text-base font-semibold transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg"
            >
              <svg className="w-4 h-4 mr-2 group-hover:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Network Interface
            </a>
            <a
              href="/docs"
              className="group inline-flex items-center justify-center px-6 py-3 text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg text-sm md:text-base font-semibold transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg"
            >
              <svg className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Developer Docs
            </a>
          </div>
        </div>

        {/* Right Column - Animation */}
        <div className='flex-1 items-center mt-1 max-w-3xl relative'>
          <div className={`${styles.animatedIcon} align-middle relative`} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <AnimatedLottie animationData={heroAnimation}/>
          </div>
          
          {/* Enhanced gradient background */}
          <div style={{ zIndex: -1 }} className="absolute w-[40%] dark:h-[45%] h-[35%] left-0 opacity-30 white__gradient dark:black__gradient top-80"/>
          <div style={{ zIndex: -2 }} className="absolute w-[30%] h-[30%] right-0 opacity-20 bg-gradient-to-l from-purple-400 to-blue-500 dark:from-purple-600 dark:to-blue-800 rounded-full blur-3xl top-60"/>
        </div>
      </div>
    </section>
  );
};

export default MainHero;
