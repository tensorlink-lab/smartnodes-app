import { useState } from "react";
import { Code, Users, Cpu } from "lucide-react";


const WhyTensorlink = () => {
  const [activeCard, setActiveCard] = useState('developers');

  const features = [
    {
      id: 'developers',
      title: "For Developers",
      description: "Free AI APIs for your apps. Build chat interfaces, automation tools, or AI products without compute costs. Route queries to your own hardware or use sharded public models for privacy.",
      color: "bg-purple-500",
      icon: Code
    },
    {
      id: 'owners',
      title: "For GPU Owners",
      description: "Run a node to contribute compute and earn rewards through our blockchain-based system, and turn idle hardware into your own private AI server.",
      color: "bg-blue-500",
      icon: Cpu
    },
    {
      id: 'everyone',
      title: "For Everyone",
      description: "Access powerful AI models through simple APIs. No setup, no technical knowledge required, just start building.",
      color: "bg-red-400",
      icon: Users
    }
  ];

  return (
    <section className="relative z-20 mt-20 w-full overflow-hidden py-12" id="why-tensorlink">
      {/* Background */}
      <div className="absolute top-0 left-0 w-full h-full z-10 bg-gradient-to-b from-transparent to-zinc-300 dark:to-neutral-900 pointer-events-none"></div>
      <div 
        className="absolute top-0 left-0 w-full h-full z-5 opacity-5 dark:opacity-10 pointer-events-none" 
        style={{
          backgroundImage: "radial-gradient(circle at 20px 20px, rgba(120, 120, 120, 0.8) 2px, transparent 0)",
          backgroundSize: "40px 40px"
        }}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-14 relative z-20">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left column */}
          <div className="flex-1">
            <h2 className="text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight">
              Why<br />
              <span className="text-gradient bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-blue-500 to-red-400">
                Tensorlink?
              </span>
            </h2>
            <p className="mt-6 text-md text-gray-700 dark:text-gray-300 max-w-xl leading-relaxed">
              Running AI models shouldn't require expensive cloud services or high-end hardware. Tensorlink provides free APIs and 
              distributed compute, transforming any computer into part of a global AI network. Access cutting-edge models without 
              infrastructure headaches or cloud bills, and contribute your own GPU hardware for truly private AI.
            </p>
            
            <div className="mt-8">
              <a href="tensorlink/docs">
                <button className="px-8 py-3 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-medium rounded-lg transition-all shadow-lg hover:shadow-xl">
                  Learn More
                </button>
              </a>
            </div>
          </div>
          
          {/* Right column */}
          <div className="flex-1">
            <div className="space-y-2">
              {features.map((feature) => (
                <div 
                  key={feature.id}
                  className={`rounded-lg px-5 py-4 transition-all duration-300 border border-gray-200 dark:border-gray-700 ${
                    activeCard === feature.id 
                      ? `${feature.color} shadow-lg transform -translate-x-2` 
                      : 'bg-zinc-100 dark:bg-gray-800 hover:shadow-md'
                  }`}
                  onMouseEnter={() => setActiveCard(feature.id)}
                >
                  <div className="flex items-center">
                    <div className={`p-3 rounded-lg ${activeCard === feature.id ? 'bg-white bg-opacity-20' : feature.color}`}>
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className={`text-xl font-bold ml-4 ${activeCard === feature.id ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                      {feature.title}
                    </h3>
                  </div>
                  <p className={`mt-3 text-sm leading-relaxed ${activeCard === feature.id ? 'text-white text-opacity-95' : 'text-gray-700 dark:text-gray-300'}`}>
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyTensorlink;
