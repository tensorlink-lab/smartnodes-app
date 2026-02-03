import styles from "../style";
import React, { useState, useEffect } from "react";
import { data } from "../assets";
import { overview } from "../constants";
import AnimatedLottie from "./animations/AnimatedLottie";

const MainHero2 = () => {
  const words = ["Resource Sharing", "Global Collaboration", "Idle Hardware", "Edge Computing", "IoT Devices"];
  const animationDuration = 900;
  const [currentWord, setCurrentWord] = useState(" ");
  const [isTyping, setIsTyping] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let currentIndex = 0;

    const typeDeleteText = () => {
      setIsDeleting(true);

      const current = words[currentIndex];
      const nextIndex = (currentIndex + 1) % words.length;
      const next = words[nextIndex];

      let i = current.length;

      const deleteInterval = setInterval(() => {
        if (i > 0) {
          if (i === 1) {
            setCurrentWord(" ");
            i--;
          } else {
            setCurrentWord(current.substring(0, i - 1));
            i--;
          }
        } else {
          clearInterval(deleteInterval);
          setIsDeleting(false);
          setTimeout(() => {
            setIsTyping(true);
            let j = 0;
            const typeInterval = setInterval(() => {
              if (j < next.length) {
                setCurrentWord(next.substring(0, j + 1));
                j++;
              } else {
                clearInterval(typeInterval);
                setTimeout(() => {
                  setIsTyping(false);
                  setTimeout(() => {
                    currentIndex = nextIndex;
                    typeDeleteText();
                  }, animationDuration);
                }, animationDuration * 3.5);
              }
            }, animationDuration / next.length);
          }, animationDuration / 1.5);
        }
      }, animationDuration / current.length);
    };

    typeDeleteText();
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
      <div className="grid gap-8 lg:gap-16 items-center">
        
        {/* Left Column - Spacer */}
        <div className="hidden lg:block" />


        {/* Right Column - Content */}
        <div className="space-y-4">
          {/* Title */}
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100 leading-tight">
            Unlocking Value From
          </h2>

          {/* Typing Animation */}
          <div className="text-3xl sm:text-4xl font-bold min-h-[1.2em]">
            <span className="bg-gradient-to-r from-blue-600 to-blue-500 dark:from-blue-500 dark:to-blue-400 bg-clip-text text-transparent">
              {currentWord}
            </span>
            <span className="animate-pulse text-blue-400 dark:text-blue-500 ml-1">|</span>
          </div>

          {/* Description */}
          <p className="text-slate-600 dark:text-slate-400 text-md lg:text-lg leading-relaxed max-w-2xl">
            {overview.info}
          </p>

          {/* CTA Button */}
          <div className="pt-4">
            <a
              href="/app"
              className="inline-flex items-center px-6 py-3.5 text-white bg-slate-900 dark:bg-slate-100 dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-white rounded-lg font-semibold transition-all duration-200 hover:shadow-lg hover:scale-105"
            >
              Network Dashboard
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MainHero2;