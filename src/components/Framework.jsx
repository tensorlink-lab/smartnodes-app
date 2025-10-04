import React from "react";

const Framework = () => {
  const features = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2-2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      title: "Modular Architecture",
      description: "Flexible framework for building custom resource sharing applications with extensible node types."
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: "Secure Network",
      description: "Validator staking and identity verification ensure trusted interactions across the peer-to-peer network."
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: "Earn Rewards",
      description: "Share your resources and get rewarded with SNO tokens through our dynamic incentive system."
    }
  ];

  return (
    <section
      id="framework"
      className="py-16 px-2 sm:px-6 lg:px-8 max-w-7xl mx-auto" zIndex={100}
    > 
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-zinc-900 dark:to-slate-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl overflow-hidden z-100">
        <div className="relative rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-zinc-900 dark:to-slate-900">
          <div className="flex flex-col lg:flex-row">
            {/* Left Column */}
            <div className="flex-1 px-3 pt-8 md:px-12 md:pt-12">
              <h2 className="font-bold text-3xl sm:text-4xl lg:text-5xl text-gray-900 dark:text-gray-100 leading-tight mb-6">
                A Modular <br />
                <span className="bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">
                  Node Framework
                </span>
                <br />
                for{" "}
                <span className="bg-gradient-to-r from-yellow-500 to-yellow-300 bg-clip-text text-transparent">
                  Python
                </span>
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-md leading-relaxed mb-8 max-w-xl">
                Transform any device into a network participant with our powerful, extensible Python framework. 
                Build custom nodes that contribute to the world's largest collaborative compute network.
              </p>
            </div>

            {/* Right Column - Features */}
            <div className="flex-1 p-2 sm:p-5 lg:pl-8">
              <div className="space-y-2">
                {features.map((feature, index) => (
                  <div 
                    key={index}
                    className="group p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 transition-all duration-300 hover:shadow-lg"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:space-x-4 space-y-3 sm:space-y-0">
                      <div className="flex-shrink-0 p-3 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-300 max-w-[48px]">
                        {feature.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 mb-1">
                          {feature.title}
                        </h3>
                        <p className="text-gray-600 text-md dark:text-gray-300 leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Framework;