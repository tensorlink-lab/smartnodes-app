import React, { useState, useRef, useEffect } from 'react';
import { 
  MdAdd, 
  MdWork, 
  MdPersonAdd, 
  MdVerifiedUser,
  MdClose,
} from 'react-icons/md';

const ActionMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const menuRef = useRef(null);

  const actions = [
    {
      id: 'request-job',
      name: 'Request Job',
      icon: <MdWork className="text-xl" />,
      color: 'bg-purple-400 hover:bg-purple-600',
      description: 'Request Job'
    },
    {
      id: 'create-user',
      name: 'Create User',
      icon: <MdPersonAdd className="text-xl" />,
      color: 'bg-green-400 hover:bg-green-600',
      description: 'Create User'
    },
    {
      id: 'create-validator',
      name: 'Create Validator',
      icon: <MdVerifiedUser className="text-xl" />,
      color: 'bg-blue-400 hover:bg-blue-600',
      description: 'Create Validator'
    }
  ];

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleActionClick = (actionId) => {
    console.log(`Action clicked: ${actionId}`);
    setIsOpen(false);
  };

  // Calculate positions for circular arrangement
  const getActionPosition = (index, total) => {
    const angle = (Math.PI / (total + 1)) * (index + 1) - (1.75 * Math.PI);
    const radius = 70;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    return { x, y };
  };

  return (
    <div ref={menuRef} className="ml-2 xs:ml-4" style={{ zIndex: 100000000 }}>
      {/* Action Items in circular arrangement */}
      <div className="relative z-50">
        {actions.map((action, index) => {
          const position = getActionPosition(index, actions.length);

          return (
            <div
              key={action.id}
              className={`absolute transition-all duration-300 group ${
                isOpen 
                  ? 'opacity-100 pointer-events-auto' 
                  : 'opacity-0 pointer-events-none'
              }`}
              style={{
                transform: isOpen 
                  ? `translate(${position.x}px, ${position.y}px)` 
                  : 'translate(0, 0)',
                transitionDelay: isOpen ? `${index * 100}ms` : '0ms'
              }}
            >
              <button
                onClick={() => handleActionClick(action.id)}
                className={`
                  ${action.color} 
                  w-12 h-12 rounded-full shadow-lg 
                  flex items-center justify-center text-white
                  transform transition-all duration-200
                  hover:scale-110 hover:shadow-xl
                  focus:outline-none focus:ring-2 focus:ring-white/30
                `}
              >
                {action.icon}
              </button>
              
              {/* Tooltip */}
              <div className="absolute top-full left-1/2 transform -translate-x-[75%] mt-1 bg-black/80 text-white px-2 py-1 rounded text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                {action.description}
              </div>
            </div>
          );
        })}
      </div>

      {/* Main FAB Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`
          relative w-10 xs:w-12 h-10 xs:h-12 rounded-full shadow-xl
          flex items-center justify-center text-white text-2xl
          transform transition-all duration-300
          outline-none ring-4 ring-blue-300/50
          ${isOpen ? 'bg-red-500 hover:bg-red-600 rotate-45' : 'bg-blue-600 hover:bg-blue-700'}
          ${isHovered || isOpen ? 'scale-110' : 'scale-100'}
        `}
      >
        {isOpen ? <MdClose /> : <MdAdd />}
      </button>      
    </div>
  );
};

export default ActionMenu;