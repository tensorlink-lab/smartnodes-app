import React, { useState, useRef, useEffect } from 'react';
import {
  MdSettings,
  MdWork,
  MdPersonAdd,
  MdVerifiedUser,
} from 'react-icons/md';

const ActionMenu = ({ onActionClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // Kept in the brand accent palette used across the dashboard (teal,
  // purple, amber) rather than the old red/green/purple traffic-light set.
  const actions = [
    {
      id: 'request-job',
      name: 'Request Job',
      icon: <MdWork size={18} />,
      accent: '#A78BFA',
      description: 'Request Job',
    },
    {
      id: 'create-user',
      name: 'Create User',
      icon: <MdPersonAdd size={18} />,
      accent: '#4FD8C4',
      description: 'Create User',
    },
    {
      id: 'create-validator',
      name: 'Create Validator',
      icon: <MdVerifiedUser size={18} />,
      accent: '#F59E0B',
      description: 'Create Validator',
    },
  ];

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
    onActionClick?.(actionId);
    setIsOpen(false);
  };

  // Calculate positions for circular arrangement
  const getActionPosition = (index, total) => {
    const angle = (Math.PI / (total + 1)) * (index + 1) - (1.75 * Math.PI);
    const radius = 68;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    return { x, y };
  };

  return (
    <div ref={menuRef} className="relative ml-2 xs:ml-4" style={{ zIndex: 100000000 }}>
      {/* Action items in circular arrangement */}
      <div className="relative z-50">
        {actions.map((action, index) => {
          const position = getActionPosition(index, actions.length);

          return (
            <div
              key={action.id}
              className={`absolute transition-all duration-300 group ${
                isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
              }`}
              style={{
                transform: isOpen ? `translate(${position.x}px, ${position.y}px)` : 'translate(0, 0)',
                transitionDelay: isOpen ? `${index * 80}ms` : '0ms',
              }}
            >
              <button
                onClick={() => handleActionClick(action.id)}
                className="flex h-11 w-11 items-center justify-center rounded-full border shadow-lg backdrop-blur-sm transition-transform duration-200 hover:scale-110 focus:outline-none"
                style={{
                  backgroundColor: `${action.accent}1A`,
                  borderColor: `${action.accent}40`,
                  color: action.accent,
                }}
              >
                {action.icon}
              </button>

              {/* Tooltip */}
              <div className="pointer-events-none absolute left-1/2 top-full mt-1.5 -translate-x-1/2 whitespace-nowrap rounded-md border border-white/10 bg-gray-900 dark:bg-[#12151c] px-2 py-1 text-[11px] font-medium text-white opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100">
                {action.description}
              </div>
            </div>
          );
        })}
      </div>

      {/* Main trigger */}
      <button
        onClick={() => setIsOpen((o) => !o)}
        className={`relative flex h-8 w-8 xs:h-10 xs:w-10 items-center justify-center rounded-full border transition-all duration-300 ${
          isOpen
            ? 'border-[#4FD8C4]/50 bg-[#4FD8C4]/10 text-[#4FD8C4]'
            : 'border-gray-200 dark:border-white/10 bg-white dark:bg-white/[0.03] text-gray-500 dark:text-[#8B93A7] hover:border-gray-300 dark:hover:border-white/20'
        }`}
      >
        <MdSettings className={`text-lg xs:text-xl transition-transform duration-500 ${isOpen ? 'rotate-180' : 'rotate-0'}`} />
      </button>
    </div>
  );
};

export default ActionMenu;
