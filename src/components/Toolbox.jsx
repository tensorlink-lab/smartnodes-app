// Testimonials Component
import { feedback } from "../constants";
import styles from "../style";
import FeedbackCard from "./FeedbackCard";
import AnimatedLottie from "./animations/AnimatedLottie";
import { features } from "../assets";
import { useState } from "react";

const Testimonials = () => {
  const [activeSection, setActiveSection] = useState(null);
    
  return (
    <section
      id="tools"
      className="relative z-20 pt-20 py-8 px-3 sm:px-4 md:px-6 lg:px-10 w-screen bg-slate-300 dark:bg-zinc-900 pb-24"
    >
      <div className="w-full mx-auto relative z-20 max-w-[300px] xs:max-w-6xl">

        {/* Row with title (left) and animation (right) */}
        <div className="flex flex-row gap-6 md:gap-8 mb-6 md:mb-10">
          {/* Left column with heading */}
          <div className="flex-1">
            <h2 className="text-left ml-3 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight">
              <div className="inline-block">The</div>
              <div className="mt-1 sm:mt-2">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-blue-500 to-red-400">
                  Smartnodes
                </span>
              </div>
              <div className="mt-1 sm:mt-2">Ecosystem.</div>
            </h2>
          </div>

          {/* Right column with animation */}
          <div className="flex-1 items-center justify-center mt-5 lg:mt-0 hidden lg:flex">
            <div className="w-full h-full">
              <AnimatedLottie animationData={features} loop={true} />
            </div>
          </div>
        </div>

        {/* Text box now spans under BOTH columns */}
        <div className="my-6 sm:mb-8 mt-8 md:mb-10 bg-gray-100 dark:bg-gray-800 rounded-lg p-4 xs:p-7 shadow-lg border border-gray-400 dark:border-gray-700">
          <p className="text-gray-700 dark:text-gray-300 text-sm xs:text-md sm:text-[17px] leading-relaxed">
            Smartnodes connects specialized networks into one ecosystem, each optimized for different computational and data challenges. This modular design 
            allows new networks to emerge organically, with block rewards distributed based on community utility and value.
          </p>
          <br />
          <p className="text-gray-700 dark:text-gray-300 text-sm xs:text-md sm:text-[17px] leading-relaxed">
            Validators stake SNO tokens to secure computations and coordinate networks. Workers contribute resources, while users tap into this
             power through their own nodes or directly via APIs, creating a unified system where governance, infrastructure, and access reinforce each other.
          </p>
        </div>

        {/* Feedback cards */}
        <div className="mt-6 sm:mt-8 md:mt-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {feedback.map((card) => (
              <FeedbackCard key={card.id} {...card} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );

};

export default Testimonials;
