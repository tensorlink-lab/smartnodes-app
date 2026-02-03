// Testimonials Component
import { feedback } from "../constants";
import styles from "../style";
import FeedbackCard from "./FeedbackCard";
import AnimatedLottie from "./animations/AnimatedLottie";
import { features } from "../assets";
import React, { useState } from "react";

const Testimonials = () => {
  const [activeSection, setActiveSection] = useState(null);
    
  return (
    <section
      id="tools"
      className="
        relative pt-6 lg:pt-1 pb-20 mb-14 px-4 sm:px-6 lg:px-8
        rounded-2xl
        border border-white/10
        bg-gradient-to-br from-slate-900/90 via-neutral-900/90 to-black/90
        backdrop-blur-xl
        shadow-[0_0_60px_-15px_rgba(99,102,241,0.1)]
        overflow-hidden
      "
    >
      <div className="max-w-7xl mx-auto p-1 xs:p-6">

        {/* Header Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-5">
          {/* Left - Title */}
          <div>
            <h2 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-slate-900 dark:text-slate-100 leading-tight">
              The{" "}
              <span className="bg-gradient-to-r from-purple-500 via-blue-500 to-red-500 dark:from-purple-300 dark:via-blue-300 dark:to-red-300 bg-clip-text text-transparent">
                Smartnodes
              </span>
              {" "}Ecosystem.
            </h2>
          </div>

          {/* Right - Animation */}
          <div className="hidden lg:flex items-center justify-center">
            <div className="w-full max-w-md">
              <AnimatedLottie animationData={features} loop={true} />
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mb-16 space-y-4 max-w-4xl">
          <p className="text-slate-700 dark:text-slate-300 text-sm sm:text-md md:text-lg leading-relaxed">
            Smartnodes connects specialized networks into one ecosystem, each optimized for different computational and data challenges. This modular design 
            allows new networks to emerge organically, with block rewards distributed based on community utility and value.
          </p>
          <p className="text-slate-700 dark:text-slate-300 text-sm sm:text-md md:text-lg leading-relaxed">
            Validators stake SNO tokens to secure network activity and coordinate resources. Workers contribute resources, while users tap into this
            power through their own nodes or directly via APIs.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {feedback.map((card) => (
            <FeedbackCard key={card.id} {...card} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;