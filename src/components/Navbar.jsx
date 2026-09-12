import { useState, useEffect, useRef } from "react";
import ThemeButton from "./ThemeButton";
import { close, logo, menu, dark_logo, logo_small } from "../assets";
import { navLinks } from "../constants";
import { useStateContext } from "../contexts/contextProvider";
import { motion } from "framer-motion";

const SIDEBAR_WIDTH = 240;
const COMPACT_BREAKPOINT = 768;

const useIsCompactNav = (sidebarOpen) => {
  const [isCompact, setIsCompact] = useState(false);

  useEffect(() => {
    const evaluate = () => {
      const availableWidth = window.innerWidth - (sidebarOpen ? SIDEBAR_WIDTH : 0);
      setIsCompact(availableWidth < COMPACT_BREAKPOINT);
    };
    evaluate();
    window.addEventListener("resize", evaluate);
    return () => window.removeEventListener("resize", evaluate);
  }, [sidebarOpen]);

  return isCompact;
};

// The sidebar toggle's height (h-12 = 48px) and how close it's allowed to get to the
// top/bottom edge of the viewport while being dragged.
const TOGGLE_HEIGHT = 48;
const TOGGLE_EDGE_MARGIN = 12;
const TOGGLE_POSITION_KEY = "tensorlink_toggle_top";

const clampToggleTop = (top) => {
  const min = TOGGLE_EDGE_MARGIN;
  const max = window.innerHeight - TOGGLE_HEIGHT - TOGGLE_EDGE_MARGIN;
  return Math.min(Math.max(top, min), max);
};

// Lets the sidebar toggle be dragged up/down and remembers where the user left it
// (stored as a fraction of viewport height so it stays sensible across screen sizes).
const useDraggableToggle = (onTap) => {
  const [top, setTop] = useState(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem(TOGGLE_POSITION_KEY) : null;
    const fraction = saved ? parseFloat(saved) : 0.5;
    const fallback = window.innerHeight * (Number.isNaN(fraction) ? 0.5 : fraction) - TOGGLE_HEIGHT / 2;
    return clampToggleTop(fallback);
  });

  const drag = useRef({ dragging: false, moved: false, startY: 0, startTop: 0, lastTop: top });

  useEffect(() => {
    const handleResize = () => setTop((prev) => clampToggleTop(prev));
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handlePointerDown = (e) => {
    drag.current = { dragging: true, moved: false, startY: e.clientY, startTop: top, lastTop: top };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    const state = drag.current;
    if (!state.dragging) return;
    const deltaY = e.clientY - state.startY;
    if (!state.moved && Math.abs(deltaY) > 4) {
      state.moved = true;
    }
    if (state.moved) {
      const newTop = clampToggleTop(state.startTop + deltaY);
      state.lastTop = newTop;
      setTop(newTop);
    }
  };

  const handlePointerUp = () => {
    const state = drag.current;
    if (!state.dragging) return;
    state.dragging = false;
    if (state.moved) {
      const fraction = (state.lastTop + TOGGLE_HEIGHT / 2) / window.innerHeight;
      localStorage.setItem(TOGGLE_POSITION_KEY, String(fraction));
    }
  };

  const handleClick = () => {
    // A drag ends with a click event too - swallow that one so it doesn't also toggle.
    if (drag.current.moved) {
      drag.current.moved = false;
      return;
    }
    onTap();
  };

  // Double-click/tap to snap back to the vertical center, in case someone drags it
  // somewhere awkward and wants an easy way back rather than fiddling to re-drag it.
  const handleDoubleClick = () => {
    const centered = clampToggleTop(window.innerHeight / 2 - TOGGLE_HEIGHT / 2);
    setTop(centered);
    localStorage.removeItem(TOGGLE_POSITION_KEY);
  };

  return { top, handlePointerDown, handlePointerMove, handlePointerUp, handleClick, handleDoubleClick };
};

const Navbar = () => {
  const [active, setActive] = useState(false);
  const [toggle, setToggle] = useState(false);
  const [theme, setTheme] = useState("dark");
  const { activeMenu, setActiveMenu } = useStateContext();
  const isCompact = useIsCompactNav(activeMenu);

  useEffect(() => {
    localStorage.removeItem("theme");
    setTheme("dark");
    document.documentElement.classList.add("dark");
  }, []);

  const logoSrc = logo;
  const tensorlinkLogoSrc = dark_logo;
  const smallLogoSrc = logo_small;
  const handleActiveMenu = () => setActiveMenu(!activeMenu);
  const dragToggle = useDraggableToggle(handleActiveMenu);

  return (
    <>
      {/* Sidebar toggle - docked to the screen edge (or the sidebar's edge once it's
          open) so it never competes for space in the navbar. Drag it up/down to
          reposition; double-click/tap to snap it back to center. */}
      <button
        onClick={dragToggle.handleClick}
        onDoubleClick={dragToggle.handleDoubleClick}
        onPointerDown={dragToggle.handlePointerDown}
        onPointerMove={dragToggle.handlePointerMove}
        onPointerUp={dragToggle.handlePointerUp}
        onPointerCancel={dragToggle.handlePointerUp}
        aria-label={activeMenu ? "Close sidebar" : "Open sidebar"}
        aria-expanded={activeMenu}
        className="fixed flex items-center justify-center w-5 h-12 rounded-r-full bg-white/30 dark:bg-white/20 backdrop-blur-md border border-l-0 border-white/30 dark:border-white/10 opacity-40 hover:opacity-100 focus-visible:opacity-100 hover:bg-white/60 dark:hover:bg-white/20 cursor-grab active:cursor-grabbing touch-none select-none transition-[left,background-color,opacity] duration-300 ease-out"
        style={{ left: activeMenu ? SIDEBAR_WIDTH : 0, top: dragToggle.top, zIndex: 100001 }}
      >
        <span className="relative w-2.5 h-[8px] flex flex-col justify-between">
          <span
            className={`block h-[1.5px] w-full bg-zinc-700 dark:bg-zinc-100 rounded-full origin-center transition-transform duration-300 ease-out ${
              activeMenu ? "translate-y-[3.5px] rotate-45" : ""
            }`}
          />
          <span
            className={`block h-[1.5px] w-full bg-zinc-700 dark:bg-zinc-100 rounded-full transition-opacity duration-200 ease-out ${
              activeMenu ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            className={`block h-[1.5px] w-full bg-zinc-700 dark:bg-zinc-100 rounded-full origin-center transition-transform duration-300 ease-out ${
              activeMenu ? "-translate-y-[3.5px] -rotate-45" : ""
            }`}
          />
        </span>
      </button>

      <motion.nav className="w-full flex z-20 pt-2 sm:pt-4 px-5 ml-1 md:ml-5 justify-between items-center" style={{ maxWidth: "1440px", margin: "0 auto", zIndex: 100000 }}>
        {/* Logo - always visible, same size and position regardless of sidebar state */}
        <a
          href="/"
          className="flex flex-row bg-slate-300 rounded-xl px-3 py-0"
          style={{ zIndex: 100000 }}
        >
          <img src={logoSrc} alt="task" className={`w-auto h-auto max-w-[235px] max-h-[150px] ${isCompact ? "hidden" : "block"}`}/>
          <img src={smallLogoSrc} alt="task" className={`w-[60px] h-[60px] ${isCompact ? "block" : "hidden"} mb-1 my-1.5`} />
        </a>

      {/* Desktop navbar */}
      <ul className={`list-none ${isCompact ? "hidden" : "flex"} justify-end px-5 py-1 items-center flex-1`}>
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
            ) : nav.site ? (
              <a
                href={nav.link}
                className="transition-opacity duration-200 opacity-70 font-medium hover:opacity-100"
              >
                {nav.title}
              </a>
          ) : nav.title == "Dashboard" ? (
              <a href={nav.id} className="group relative inline-block rounded-lg">
                {/* soft glow, only shows on hover */}
                <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500 blur-md opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>

                {/* the gradient: becomes the "border" via padding */}
                <span className="relative z-10 block rounded-lg p-[1px] bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500 bg-[length:200%_200%] animate-gradient-x">
                  {/* solid interior */}
                  <span className="flex items-center justify-center rounded-[7px] px-4 py-2 font-semibold text-black dark:text-white bg-white dark:bg-zinc-900 transition-colors duration-300">
                    {nav.title}
                  </span>
                </span>
              </a>
            ) : (
              <a href={`/${nav.id}`}>{nav.title}</a>
            )}
          </li>
        ))}
        {/* <div className="ml-5" style={{ zIndex: 100000 }}>
          <ThemeButton className="px-20" />
        </div> */}
      </ul>

      {/* Mobile menu */}
      <div className={`${isCompact ? "flex" : "hidden"} flex-1 px-5 justify-end items-center`} style={{ zIndex: 100000000 }}>
        <img
          src={toggle ? close : menu}
          alt="menu"
          className="w-[24px] h-[24px] object-contain cursor-pointer"
          onClick={() => setToggle(!toggle)}
        />
        <div
          className={`
            absolute top-16 right-0 mx-4 mt-4 min-w-[140px]
            border border-gray-300 p-6 dark:bg-zinc-700 bg-slate-200
            rounded-xl shadow-xl z-30
            transform origin-top transition-all duration-300 ease-out
            ${toggle ? "scale-y-100 opacity-100 pointer-events-auto" : "scale-y-0 opacity-0 pointer-events-none"}
          `}
        >
          <ul className="list-none flex flex-col items-start">
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
                ) : nav.site ? (
                  <a
                    href={nav.link}
                    className="font-medium"
                  >
                    {nav.title}
                  </a>
                ) : nav.title == "Dashboard" ? (
                  <a href={nav.id} onClick={() => console.log("dashboard clicked")}>
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
    </>
  );
};

export default Navbar;
