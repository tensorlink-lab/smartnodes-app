import React from "react";
import styles, { layout } from "../style";
import { features } from "../constants";
import Spline from "@splinetool/react-spline";

const Example = () => {
  return (
    <section className={`${styles.section} rounded-xl xs:px-4 px-4 sm:px-10 mt-10 items-center flex flex-row`}>
      <div className="dark:bg-zinc-950 bg-zinc-200 sm:py-10 py-8 sm:px-12 lg:px-16 rounded-2xl px-7 flex flex-col sm:mx-0 z-20 border border-gray-300 dark:border-gray-800 shadow-lg transition-all hover:shadow-xl">
        {/* <Spline className="z-64 rotate-0 opacity-100 dark:opacity-90 xs:ml-0 md:ml-32 xs:left-0 md:left-72 inset-0" 
          scene="https://prod.spline.design/Xxt3bSypHSqTeDaz/scene.splinecode"
          frameRate={30}
        /> */}
        {/* Title & Description Section */}
        <div className="flex-1 w-full flex flex-col items-center xxs:items-start max-w-2xl z-0 mx-auto md:mx-7 md:py-10 py-6 mb-5">
          <h2 className="flex-1 font-poppins font-extrabold lg:text-6xl sm:text-5xl text-3xl text-gray-900 dark:text-gray-100 mt-2 text-left" style={{ letterSpacing: '0.05rem', lineHeight: '1.2' }}>
            Distributed<br />
            <span className="text-blue-600 dark:text-blue-400">Machine Learning</span><br />
            <span className="text-red-500">Infrastructure</span>
            <br />
          </h2>

          {/* Subtitle */}
          <div className="mt-6 max-w-2xl">
            <p className={`${styles.landingText} text-gray-700 dark:text-gray-300 text-center xs:text-left text-lg`}>
              Tensorlink is a Python library and computational platform that provides powerful tools and APIs for large-scale neural network inference and fine-tuning with PyTorch models.
            </p>
            
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a href="tensorlink/docs" className="w-full sm:w-auto">
                <button className="px-8 py-3 bg-purple-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors w-full h-12 flex items-center justify-center">
                  Documentation
                </button>
              </a>
              <a href="tensorlink/localhostGPT" className="w-full sm:w-auto">
                <div className="relative rounded-lg overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600 w-full h-12 flex items-center justify-center">
                  <div className="bg-black text-white font-medium w-full h-full px-8 flex items-center justify-center">
                    Demo
                  </div>
                </div>
              </a>
              <a href="https://discord.com/invite/aCW2kTNzJ2" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                <button className="px-8 py-3 border-2 border-black dark:border-gray-300 bg-indigo-700 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors w-full h-12 flex items-center justify-center">
                  Discord
                </button>
              </a>
            </div>
            <div className="hidden xs:flex space-x-4 mt-5">
              <a
                href="https://github.com/smartnodes-lab/tensorlink/releases/latest"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center px-4 py-2 bg-black text-white text-sm font-semibold rounded-full hover:bg-gray-800 transition"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
                Node - Latest
              </a>
              <a
                href="https://pypi.org/project/tensorlink/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-red-400 text-white text-sm font-semibold rounded-full hover:bg-blue-700 transition"
              >
                PyPI - Latest
              </a>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="w-full items-center">
          <div className="flex justify-center min-w-full">
            <div className="mb-10 z-10 flex max-w-6xl flex-col md:flex-row md:items-stretch justify-center items-center w-full gap-6 lg:gap-8">
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  className={`p-6 rounded-xl bg-gray-100 dark:bg-gray-800 shadow-sm hover:shadow-md transition-all flex-1 
                              border border-gray-200 dark:border-gray-700 flex flex-col`}
                >
                  <div className="flex items-center mb-4">
                    {feature.icon && <feature.icon className="w-6 h-6 mr-3 text-blue-600" />}
                    <p className="text-xl font-bold text-gray-900 dark:text-white">{feature.title}</p>
                  </div>
                  <div className="w-16 h-1 bg-blue-600 mb-4"></div>
                  <p className="text-gray-700 dark:text-gray-300 text-base flex-grow">{feature.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Example;
