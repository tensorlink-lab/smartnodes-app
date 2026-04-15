import { useState, useEffect } from "react";
import { FaChevronDown } from "react-icons/fa"; // Import FaChevronDown
import ThemeButton from "./ThemeButton";
import { close, logo, menu, dark_logo, logo_small, logo_dark_small } from "../assets";
import { navLinks } from "../constants";
import { HiOutlineMenu } from "react-icons/hi";
import { useStateContext } from "../contexts/contextProvider";
import { motion } from "framer-motion";


const Navbar = () => {
  const [active, setActive] = useState(false);
  const [toggle, setToggle] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");
  const [networksOpen, setNetworksOpen] = useState(false);
  const { activeMenu, setActiveMenu } = useStateContext();

  useEffect(() => {
    const handleThemeChange = () => {
      setTheme(localStorage.getItem("theme") || "dark");
    };
    window.addEventListener("storage", handleThemeChange);
    return () => {
      window.removeEventListener("storage", handleThemeChange);
    };
  }, []);

  const logoSrc = logo;
  const smallLogoSrc = logo_small;
  const handleActiveMenu = () => setActiveMenu(!activeMenu);

  return (
    <motion.nav className="w-full flex z-20 pt-2 sm:pt-4 px-5 ml-1 md:ml-5 justify-between items-center" style={{ maxWidth: "1440px", margin: "0 auto", zIndex: 100000 }}>
      {/* Logo and menu for desktop */}
      {!activeMenu ? (
        <div
          className={`flex flex-row bg-slate-300 rounded-xl px-3 py-0 cursor-pointer`}
          style={{ zIndex: 100000 }}
          onClick={() => {
              setActiveMenu(!activeMenu);
          }}
        >
          <img src={logoSrc} alt="task" className="w-auto h-auto max-w-[235px] max-h-[150px] hidden md:block" />
          <img src={smallLogoSrc} alt="task" className="w-[60px] h-[60px] md:hidden mb-1 my-1.5" />
        </div>      
      ) : (
        <div></div>
      )}

      {/* Desktop navbar */}
      <ul className="list-none md:flex hidden justify-end px-5 py-1 items-center flex-1">
        {navLinks.map((nav, index) => (
          <li
            key={nav.id}
            className={`font-poppins font-normal cursor-pointer text-[16px] ${
              active === nav.title ? "dark:text-white text-black" : "dark:text-dimWhite text-gray-500"
            } ${index === navLinks.length - 1 ? "mr-0" : "mr-10"} ${nav.title === "Dashboard" ? "transition-transform duration-300 hover:scale-105" : ""}`}
            onClick={() => setActive(nav.title)}
            style={{ zIndex: 10000 }}
          >
            {nav.title === "GitHub" ? (
              <a href="https://github.com/tensorlink-lab">{nav.title}</a>
            ) : nav.title === "Networks" ? (
              <div className="relative">
                <button
                  className="flex items-center"
                  onClick={() => setNetworksOpen(!networksOpen)}
                >
                  Networks
                  <FaChevronDown className={`ml-2 transition-transform duration-300 ease-in-out ${networksOpen ? "rotate-180" : ""}`}/>
                </button>
                
                {/* Enhanced Desktop Networks Dropdown */}
                <div className={`
                  absolute top-full mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden
                  transform origin-top transition-all duration-300 ease-out
                  ${networksOpen 
                    ? "scale-y-100 opacity-100 translate-y-0 pointer-events-auto" 
                    : "scale-y-0 opacity-0 -translate-y-2 pointer-events-none"
                  }
                `}>
                  <ul className="p-1">
                    {nav.networks.map((networkObj, idx) => (
                      <li
                        key={networkObj.link}
                        className={`
                          transform transition-all duration-200 ease-out
                          ${networksOpen ? `translate-x-0 opacity-100` : `translate-x-2 opacity-0`}
                        `}
                        style={{ 
                          transitionDelay: networksOpen ? `${idx * 50}ms` : '0ms' 
                        }}
                      >
                        <a
                          href={`/${networkObj.link}`}
                          className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors duration-150"
                        >
                          {networkObj.network}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
          ) : nav.title == "Dashboard" ? (
              <a 
                href="/app#dashboard"
                className="relative px-4 py-2 rounded-lg font-semibold text-white overflow-hidden group"
              >
                <span className="relative z-10">{nav.title}</span>
                <span className="absolute inset-0 bg-gradient-to-r rounded-lg from-purple-500/60 via-blue-500/60 to-pink-500/60 animate-gradient-x group-hover:from-purple-500/70 group-hover:via-blue-500/70 group-hover:to-pink-500/70 transition-all duration-300"></span>
                <span className="absolute inset-0 bg-gradient-to-r rounded-lg from-purple-500/60 via-blue-500/60 to-pink-500/60 blur-md opacity-75 animate-gradient-x group-hover:opacity-100 group-hover:blur-md transition-all duration-300"></span>
              </a>
            ) : (
              <a href={`/${nav.id}`}>{nav.title}</a>
            )}
          </li>
        ))}
        <div className="ml-5" style={{ zIndex: 100000 }}>
          <ThemeButton className="px-20" />
        </div>
      </ul>

      {/* Mobile menu */}
      <div className="md:hidden flex flex-1 px-5 justify-end items-center" style={{ zIndex: 1000000 }}>
        <img
          src={toggle ? close : menu}
          alt="menu"
          className="w-[24px] h-[24px] object-contain cursor-pointer"
          onClick={() => setToggle(!toggle)}
        />
        <div
          className={`
            absolute top-16 right-0 mx-4 mt-4 min-w-[140px]
            border border-gray-300 p-6 dark:bg-slate-600 bg-slate-200
            rounded-xl shadow-xl z-30
            transform origin-top transition-all duration-300 ease-out
            ${toggle ? "scale-y-100 opacity-100 pointer-events-auto" : "scale-y-0 opacity-0 pointer-events-none"}
          `}
        >
          <ul className="list-none flex flex-col items-start">
            <div className="mb-3" style={{ zIndex: 100000 }}>
              <ThemeButton className="px-20" />
            </div>

            {navLinks.map((nav) => (
              <li
                key={nav.id}
                className={`font-poppins font-medium cursor-pointer text-[16px] ${
                  active === nav.title ? "dark:text-white" : "dark:text-dimWhite"
                } mb-4 z-50`}
                onClick={() => setActive(nav.title)}
              >
                {nav.title === "GitHub" ? (
                  <a href="https://github.com/tensorlink-lab">{nav.title}</a>
                ) : nav.title === "Networks" ? (
                  <div className="relative">
                    <button
                      className="flex items-center"
                      onClick={() => setNetworksOpen(!networksOpen)}
                    >
                      Networks
                      <FaChevronDown className={`ml-2 transition-transform duration-300 ease-in-out ${networksOpen ? "rotate-180" : ""}`}/>
                    </button>
                    
                    {/* Enhanced Mobile Networks Dropdown */}
                    <div className={`
                      ml-4 bg-gray-800 rounded-lg shadow-lg overflow-hidden
                      transform origin-top transition-all duration-300 ease-out
                      ${networksOpen 
                        ? "scale-y-100 opacity-100 max-h-96 pointer-events-auto mt-4" 
                        : "scale-y-0 opacity-0 max-h-0 pointer-events-none"
                      }
                    `}>
                      <ul >
                        {nav.networks.map((networkObj, idx) => (
                          <li
                            key={networkObj.link}
                            className={`
                              transform transition-all duration-200 ease-out
                              ${networksOpen 
                                ? `translate-x-0 opacity-100` 
                                : `translate-x-4 opacity-0`
                              }
                            `}
                            style={{ 
                              transitionDelay: networksOpen ? `${idx * 75}ms` : '0ms' 
                            }}
                          >
                            <a
                              href={`/${networkObj.link}`}
                              className="block px-4 py-2 hover:bg-gray-700 rounded-md text-white transition-colors duration-150"
                            >
                              {networkObj.network}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : nav.title == "Dashboard" ? (
                  <a href="/app#dashboard">
                    {nav.title}
                  </a>
                ) : (
                  <a href={`/${nav.id}`}>{nav.title}</a>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;