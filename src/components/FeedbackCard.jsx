
// FeedbackCard Component
import { useState } from "react";
import AnimatedLottie from "./animations/AnimatedLottie";

const FeedbackCard = ({ content, name, title, img, blur, link }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Determine background color based on title (to create variety like in WhyTensorlink)
  const getBackgroundColor = () => {
    if (title.toLowerCase().includes("tensor") || title.toLowerCase().includes("train")) {
      return isHovered ? "bg-neutral-500 dark:bg-neutral-900" : "bg-neutral-900";
    } else if (title.toLowerCase().includes("data") || title.toLowerCase().includes("smart")) {
      return isHovered ? "bg-red-100" : "bg-red-100";
    } else {
      return isHovered ? "bg-blue-600" : "bg-blue-500";
    }
  };
  
  return (
    <a 
      href={link} 
      className="no-underline block w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    > 
      <div 
        className={`relative rounded-lg p-3 xs:p-5 transition-all duration-300 border border-gray-400 dark:border-gray-700 h-full shadow-lg
          ${blur ? 'opacity-50' : ''} 
          ${isHovered ? 'shadow-lg transform -translate-y-1' : 'bg-zinc-100 dark:bg-zinc-900 hover:shadow-md'}
          ${blur ? 'bg-gray-200 dark:bg-gray-700' : isHovered ? getBackgroundColor() : 'bg-white dark:bg-gray-800'}
        `}
      >
        <div className="flex items-center">
          {/* Smaller icon container for mobile */}
          <div className={`flex items-center justify-center rounded-lg w-10 h-10 sm:w-12 sm:h-12 ${isHovered ? 'bg-zinc-100 bg-opacity-20' : getBackgroundColor()}`}>
            {/* Animation container that fills its parent */}
            <div className="w-full h-full flex items-center justify-center p-1">
              <AnimatedLottie
                animationData={img}
                alt={name}
                loop={true}
              />
            </div>
          </div>
          <div className="ml-2 sm:ml-3 flex-1 min-w-0">
            <h3 className={`text-base sm:text-lg font-bold ${isHovered ? 'text-white' : 'text-gray-900 dark:text-white'} truncate`}>
              {title}
            </h3>
            <p className={`text-sm ${isHovered ? 'text-white text-opacity-80' : 'text-gray-600 dark:text-gray-400'}`}>
              {name}
            </p>
          </div>
        </div>
        
        <p className={`mt-3 px-2 sm:mt-4 ${isHovered ? 'text-white' : 'text-gray-700 dark:text-gray-300'} text-sm sm:text-md md:text-lg leading-relaxed line-clamp-4 sm:line-clamp-5`}>
          {content}
        </p>
        
        {/* Call to action button */}
        {!blur && (
          <div className="mt-3 sm:mt-4">
            <button 
              className={`px-2 sm:px-3 py-1 rounded-lg transition-all text-xs font-medium 
                ${isHovered 
                  ? 'bg-white text-gray-900 hover:bg-gray-100' 
                  : 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-400 hover:to-blue-600 text-white'
                }`}
            >
              Learn More
            </button>
          </div>
        )}
        
        {/* Overlay text for coming soon items */}
        {blur && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="bg-gradient-to-r from-purple-500 to-blue-500 text-transparent bg-clip-text text-lg sm:text-xl font-bold">
              Coming Soon
            </span>
          </div>
        )}
      </div>
    </a>
  );
};

export default FeedbackCard;
