import AnimatedLottie from "./animations/AnimatedLottie";
import heroAnimation from "../assets/cloud-network.json";
import React, { useState, useEffect } from "react";

// Mock data for demonstration
const styles = {
  section: "flex justify-center items-center",
  animatedIcon: "w-full h-full"
};

const MainHero = () => {
  return (
    <div style={{ zIndex: 100 }}>
      <section className="relative max-w-7xl mx-auto py-12">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center border border-black dark:border-gray-200 rounded-2xl p-8 bg-white/50 dark:bg-black/20 backdrop-blur-md">
          {/* Left Column - Content */}
          <div className="space-y-8 lg:pr-10 md:ml-5">
            {/* Title */}
            <h1 className="font-bold text-3xl sm:text-4xl lg:text-5xl leading-tight">
              <span className="bg-gradient-to-r from-purple-500 to-purple-700 dark:from-purple-400 dark:to-purple-600 bg-clip-text text-transparent">
                Shared Power
              </span>
              <br />
              <span className="text-slate-900 dark:text-slate-100">for </span>
              <span className="bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-500 dark:to-blue-700 bg-clip-text text-transparent">
                Big Problems
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-slate-600 dark:text-slate-400 text-md lg:text-xl leading-relaxed max-w-xl">
              Smartnodes connects devices around the world into collaborative, peer-to-peer compute and data collection networks. 
              By uniting shared hardware, we power AI, scientific research, and large-scale computations.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <a
                href="/app"
                className="group inline-flex items-center justify-center px-4 py-2 text-white bg-slate-900 dark:bg-slate-100 dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-white rounded-lg font-semibold transition-all duration-200 hover:shadow-lg hover:scale-105"
              >
                <svg className="w-4 h-4 mr-2 group-hover:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Dashboard
              </a>
              <a
                href="/docs"
                className="group inline-flex items-center justify-center px-4 py-2 text-blue-600 dark:text-blue-400 border-2 border-blue-600 dark:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950 rounded-lg font-semibold transition-all duration-200"
              >
                <svg className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Documentation
              </a>
            </div>
          </div>

          {/* Right Column - Animation */}
          <div className="relative hidden lg:flex lg:h-[500px] items-center justify-center">
            <div className="w-full max-w-lg sm:hidden md:block">
              <AnimatedLottie animationData={heroAnimation} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MainHero;
