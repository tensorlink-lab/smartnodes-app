import styles from "../style";
import React, { useState, useEffect } from "react";
import { data } from "../assets";
import { overview } from "../constants";
import AnimatedLottie from "./animations/AnimatedLottie";

const MainHero = () => {
  const words = ["Resource Sharing", "Global Collaboration", "Idle Hardware", "Edge Computing", "IoT Devices"];
  const animationDuration = 900; // Adjust the duration for typing and pause
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
                }, animationDuration * 3.5); // Longer pause after typing word
              }
            }, animationDuration / next.length);
          }, animationDuration / 1.5); // Short pause after deleting word
        }
      }, animationDuration / current.length);
    };

    typeDeleteText();
  }, []);

  return (
    <section className={`${styles.section}`}>
      <div className={`items-center lg:px-0 px-20 rounded-md mt-10 ${styles.content} `}>
        <div className={`${styles.contentBox} flex-row mt-2 mb-2`}>
          <div className="min-w-[305px] mr-10 hidden md:block">
            <AnimatedLottie animationData={data} loop={true} />
          </div>
          <div className="max-w-[310px] xs:max-w-2xl justify-center items-center" style={{ zIndex: 10 }}>

            <div className="py-10 justify-items-left bg-gradient-to-bl from-gray-50 to-gray-100 dark:from-zinc-900 dark:to-zinc-950 px-8 xs:px-14 rounded-xl border border-gray-300 dark:border-gray-800 backdrop-blur-sm dark:shadow-black shadow-indigo-950 shadow-md">
              {/* Title */}
              <h2 className="text-[24px] ss:text-[32px] md:text-[40px] font-extrabold text-gray-800 dark:text-gray-200 leading-tight">
                Unlocking  
                <br /> Value From
              </h2>

              {/* Typing Animation */}
              <div className="text-[24px] ss:text-[32px] md:text-[40px] font-bold text-orange-500 mb-2">
                <span className={`typing ${isTyping ? "animate-typing" : ""}`}>
                  {currentWord}
                  <span className="animate-pulse font-light leading-tight">|</span>
                </span>
              </div>

              {/* Paragraph */}
              <p className="text-gray-800 dark:text-gray-200 text-md md:text-lg leading-relaxed py-2">
                {overview.info}
              </p>

              {/* Call to Action */}
              {/* <a
                href="/app"
                className="mt-5 inline-block px-4 py-3 text-white bg-orange-600 border border-gray-700 hover:bg-blue-600 rounded-md text-sm md:text-base font-semibold transition duration-300 ease-in-out"
              >
                Network Dashboard
              </a> */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MainHero;
