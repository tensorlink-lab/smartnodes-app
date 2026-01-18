import React from "react";
import { Book, Server, Users } from "lucide-react";
import AnimatedLottie from "./animations/AnimatedLottie";

const portals = [
  {
    title: "Tensorlink Docs",
    link: "/tensorlink/docs",
    img: null, // Your lottie animation
    icon: Book,
    description: "Complete guides, API references, and tutorials"
  },
  {
    title: "Running a Node",
    link: "/tensorlink/node-setup",
    img: null, // Your lottie animation
    icon: Server,
    description: "Set up your GPU to earn rewards or create private AI"
  },
  {
    title: "Join the Community",
    link: "https://discord.gg/aCW2kTNzJ2",
    img: null, // Your lottie animation
    icon: Users,
    description: "Connect with developers and get support"
  }
];

const GetStarted = () => (
  <section 
    className="relative z-20 w-full overflow-hidden py-16 bg-zinc-200 dark:bg-neutral-900"
    id="get-started"
  >
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
      <div className="w-full text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight mb-4">
          Get Started 
        </h2>
        <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
          Explore our tools and resources to start leveraging distributed computing for your AI workloads
        </p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {portals.map((portal, index) => (
          <PortalCard key={index} {...portal} />
        ))}
      </div>
    </div>
  </section>
);

const PortalCard = ({ title, link, img, icon: Icon, description }) => (
  <a href={link} className="no-underline group">
    <div className="feedback-card rounded-2xl p-6 flex flex-col items-center text-center h-full transition-all duration-300 hover:scale-105 hover:shadow-2xl border-2 border-transparent hover:border-purple-500/50">
      {/* Icon with animation */}
      <div className="mb-4 p-4 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-600 transition-all">
        <Icon className="w-8 h-8 text-white" />
      </div>
      
      {/* Title */}
      <h4 className="font-semibold text-xl text-white mb-2 group-hover:text-purple-300 transition-colors">
        {title}
      </h4>
      
      {/* Description */}
      <p className="text-sm text-gray-300 mb-4">
        {description}
      </p>
      
      {/* Lottie Animation */}
      {img && (
        <div className="w-32 h-32 mt-auto">
          <AnimatedLottie animationData={img} loop={true}/>
        </div>
      )}
      
      {/* Arrow indicator on hover */}
      <div className="mt-4 text-purple-400 group-hover:text-purple-300 transition-all group-hover:translate-x-1">
        <span className="text-sm font-medium">Learn more →</span>
      </div>
    </div>
  </a>
);

export default GetStarted;