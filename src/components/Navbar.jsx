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
  const [networksOpen, setNetworksOpen] = useState(false); // Track networks dropdown
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
    <motion.nav className="w-full flex z-20 pt-5 px-5 ml-1 md:ml-5 justify-between items-center" style={{ maxWidth: "1440px", margin: "0 auto", zIndex: 100000 }}>
      {/* Logo and menu for desktop */}
      {!activeMenu ? (
        <div
          className={`flex flex-row bg-gray-400 rounded-xl px-3 py-0 cursor-pointer`}
          style={{ zIndex: 100000 }}
          onClick={() => {
              setActiveMenu(!activeMenu);
          }}
        >
          <img src={logoSrc} alt="task" className="w-auto h-auto max-w-[325px] max-h-[160px] hidden md:block" />
          <img src={smallLogoSrc} alt="task" className="w-[70px] h-[70px] md:hidden mb-1 my-1.5" />
        </div>      
      ) : (
        <div></div>
      )}

      {/* Desktop navbar */}
      <ul className="list-none md:flex hidden justify-end px-5 items-center flex-1">
        {navLinks.map((nav, index) => (
          <li
            key={nav.id}
            className={`font-poppins font-normal cursor-pointer text-[16px] ${
              active === nav.title ? "dark:text-white text-black" : "dark:text-dimWhite text-gray-500"
            } ${index === navLinks.length - 1 ? "mr-0" : "mr-10"}`}
            onClick={() => setActive(nav.title)}
            style={{ zIndex: 10000 }}
          >
            {nav.title === "GitHub" ? (
              <a href="https://github.com/smartnodes-lab">{nav.title}</a>
            ) : nav.title === "Networks" ? (
              <div className="relative">
                <button
                  className="flex items-center"
                  onClick={() => setNetworksOpen(!networksOpen)}
                >
                  Networks
                  <FaChevronDown className={`ml-2 transition-transform duration-200 ${networksOpen ? "rotate-180" : ""}`}/>
                </button>
                {networksOpen && (
                  <ul className="absolute top-full mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg px-2 py-2 transition-transform duration-1000">
                    {nav.networks.map((networkObj) => (
                      <a
                        key={networkObj.link}
                        href={`/${networkObj.link}`}
                        className="block px-4 py-1 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        {networkObj.network}
                      </a>
                    ))}
                  </ul>
                )}
              </div>
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
      <div className="md:hidden flex flex-1 px-5 justify-end items-center" style={{ zIndex: 40 }}>
        <img
          src={toggle ? close : menu}
          alt="menu"
          className="w-[28px] h-[28px] object-contain cursor-pointer"
          onClick={() => setToggle(!toggle)}
        />

        <div
          className={`${
            !toggle ? "hidden" : "flex"
          } p-6 bg-slate-500 absolute z-10 top-20 right-0 mx-4 mt-10 min-w-[140px] rounded-xl sidebar`}
        >
          <ul className="list-none flex flex-col items-start">
            <div className="mb-3" style={{ zIndex: 100000 }}>
              <ThemeButton className="px-20" />
            </div>

            {navLinks.map((nav) => (
              <li
                key={nav.id}
                className={`font-poppins font-medium cursor-pointer text-[16px] ${
                  active === nav.title ? "text-white" : "text-dimWhite"
                } mb-4 z-50`}
                onClick={() => setActive(nav.title)}
              >
                {nav.title === "GitHub" ? (
                  <a href="https://github.com/smartnodes-lab">{nav.title}</a>
                ) : nav.title === "Networks" ? (
                  <div className="relative">
                    <button
                      className="flex items-center"
                      onClick={() => setNetworksOpen(!networksOpen)}
                    >
                      Networks
                      <FaChevronDown className={`ml-2 transition-transform duration-200 ${networksOpen ? "rotate-180" : ""}`}/>
                    </button>
                    {networksOpen && (
                      <ul className="ml-4 mt-2 bg-gray-800 rounded shadow-lg">
                        {nav.networks.map((networkObj) => (
                          <a
                            key={networkObj.link}
                            href={`/${networkObj.link}`}
                            className="block px-4 py-1 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            {networkObj.network}
                          </a>
                        ))}
                      </ul>
                    )}
                  </div>
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
