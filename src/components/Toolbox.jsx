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
    <section id="tools" className="relative z-20 pt-20 overflow-hidden py-8 px-3 sm:px-4 md:px-6 lg:px-10 w-screen bg-slate-300 dark:bg-zinc-900 pb-24">
      {/* Enhanced background with gradient and pattern - matching WhyTensorlink */}
      <div className="w-full mx-auto relative z-20 max-w-[300px] xs:max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-6 md:gap-8 lg:gap-12 mb-6 md:mb-10">
          {/* Left column with heading and description */}
          <div className="flex-1">
          <h2 className="text-left ml-3 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight">
            <div className="inline-block">The</div>
            <div className="mt-1 sm:mt-2">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-blue-500 to-red-400">
                Smartnodes
              </span>
            </div>
            <div className="mt-1 sm:mt-2">
              Ecosystem.
            </div>
          </h2>

          <div className="my-6 sm:mb-8 mt-8 md:mb-10 bg-gray-100 dark:bg-gray-800 rounded-lg p-4 xs:p-7 shadow-lg border border-gray-400 dark:border-gray-700">
            <p className="text-gray-700 dark:text-gray-300 text-sm xs:text-md sm:text-[17px] leading-relaxed">
              Rather than building isolated tools, Smartnodes creates an interconnected ecosystem of specialized networks, each optimized for different computational or data-intensive challenges. This modular approach enables organic innovation where new networks emerge as technology evolves. The community determines which networks receive block reward distribution, creating a natural selection mechanism where networks remain active based on utility and community value.
            </p>
            <br/>
            <p className="text-gray-700 dark:text-gray-300 text-sm xs:text-md sm:text-[17px] leading-relaxed">
              Validators stake SNO tokens to serve as gatekeepers who validate computations and coordinate network interactions. Worker nodes contribute resources to power these validator-secured networks, and end users access the resulting processing power through either direct User Node connections with full encryption, or validator-managed APIs for streamlined integration. This unified design ensures that governance, infrastructure, and access all reinforce each other to maintain an ecosystem focused on delivering real-world value.
            </p>
          </div>
        </div>
          
        {/* Right column with animation - hide on smaller screens */}
        <div className="flex-1 items-center justify-center mt-5 lg:mt-0 hidden lg:block">
          <div className="w-full h-full">
            <AnimatedLottie 
              animationData={features} 
              loop={true} 
            />
          </div>
        </div>
      </div>

      {/* Feedback cards section */}
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
