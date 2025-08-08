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
              Toolbox.
            </div>
          </h2>

          <div className="my-6 sm:mb-8 mt-8 md:mb-10 bg-gray-100 dark:bg-gray-800 rounded-lg p-4 xs:p-7 shadow-lg border border-gray-400 dark:border-gray-700">
            <p className="text-gray-700 dark:text-gray-300 text-sm xs:text-md sm:text-lg leading-relaxed">
            Smartnodes equips developers with cutting-edge tools designed to simplify and accelerate data acquisition and computation, broadening the accessibility of 
            resources across a wide range of scientific and research domains. These powerful functionalities are encapsulated in dedicated networks 
            and made available through programming libraries and APIs.
            </p>
          </div>
        </div>
          
        {/* Right column with animation - hide on smaller screens */}
        <div className="flex-1 items-center justify-center mt-6 lg:mt-0 hidden lg:block">
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
