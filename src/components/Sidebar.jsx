import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";  
import { FaChevronDown } from "react-icons/fa";

import { sideLinks } from "../constants";

const Sidebar = ({ open, close }) => {
    const [openMenuId, setOpenMenuId] = useState(() => {
        return localStorage.getItem("tensorlink_sidebar_open");
    });  // Track which menu is open
    const navigate = useNavigate();
    const location = useLocation();

    // Track which top-level group (Smartnodes, Tensorlink, Links, etc.) is expanded.
    // This is NOT persisted - it's derived from whatever page we're currently on,
    // so refreshing/navigating always collapses everything except the active section.
    const [openGroupTitle, setOpenGroupTitle] = useState(null);

    const groupMatchesPath = (item, pathname) => {
        return item.links.some((link) => {
            const linkMatches = pathname === `/${link.id}` || pathname.startsWith(`/${link.id}/`);
            const sublinkMatches =
                link.sublinks &&
                link.sublinks.some((sub) => pathname.startsWith(`/${link.id}/${sub.id}`));
            return linkMatches || sublinkMatches;
        });
    };

    useEffect(() => {
        const activeGroup = sideLinks.find((item) => groupMatchesPath(item, location.pathname));
        if (activeGroup) {
            setOpenGroupTitle(activeGroup.title);
        }
        // If no group matches (e.g. an external "Links" page), leave whatever
        // was previously open as-is rather than forcing everything shut.
    }, [location.pathname]);

    const toggleGroup = (title) => {
        setOpenGroupTitle((prevTitle) => (prevTitle === title ? null : title));
    };

    const toggleMenu = (id) => {
        setOpenMenuId(prevId => (prevId === id ? null : id));
    };

    useEffect(() => {
        if (openMenuId) {
            localStorage.setItem("tensorlink_sidebar_open", openMenuId);
        } else {
            localStorage.removeItem("tensorlink_sidebar_open");
        }
    }, [openMenuId]);


    return (
        <div
            className="fixed inset-y-0 left-0 w-[240px] bg-slate-100 dark:bg-zinc-900 overflow-y-auto overflow-x-hidden border-r border-gray-500"
            style={{ zIndex: 1000000 }}
        >
            <div className="px-3 pt-6 pb-10 ml-1">
                {sideLinks.map((item) => {
                    const isGroupOpen = openGroupTitle === item.title;
                    return (
                    <div key={item.title} className="mb-8">
                        <p
                            onClick={() => toggleGroup(item.title)}
                            className="flex items-center justify-between text-gray-400 font-poppins text-lg dark:text-gray-300 px-2 py-1 uppercase font-medium cursor-pointer select-none"
                        >
                            {item.title}
                            <FaChevronDown
                                className={`text-gray-400 transition-transform duration-200 ${
                                    isGroupOpen ? "rotate-180" : ""
                                }`}
                                size={12}
                            />
                        </p>
                        <div
                            className={`
                            overflow-hidden transform origin-top transition-all duration-300 ease-in-out
                            ${isGroupOpen ? "max-h-[2000px] opacity-100 scale-y-100" : "max-h-0 opacity-0 scale-y-95"}
                            `}
                        >
                        {item.links.map((link) => {
                            const isDashboard = link.name === "Dashboard";
                            return (
                            <div
                                key={link.id}
                                className="mt-1 cursor-pointer"
                                onClick={() => {
                                    if (link.sublinks && link.sublinks.length > 0) {
                                        toggleMenu(link.id);
                                    } else if (item.title === "Links" || link.name === "Whitepaper" || link.name === "localhostGPT") {
                                        window.location.href = link.id;
                                    } else {
                                        navigate(`/${link.id}`);
                                    }
                                }}                                
                            >
                        {isDashboard ? (
                            <div className="group relative rounded-lg">
                                <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500 blur-md opacity-0 group-hover:opacity-60 transition-opacity duration-300"></span>
                                <span className="relative z-10 block rounded-lg p-[1.5px] bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500 bg-[length:200%_200%] animate-gradient-x">
                                    <span className="flex items-center justify-between rounded-[7px] px-4 py-2 font-poppins text-base font-semibold text-black dark:text-white bg-white dark:bg-zinc-900 transition-colors duration-300">
                                        {link.name}
                                    </span>
                                </span>
                            </div>
                        ) : (
                            <div className="flex items-center justify-between px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                                    <span className="font-poppins text-base dark:text-gray-300 text-gray-900">
                                        {link.name}
                                    </span>

                                    {link.sublinks && (
                                        <FaChevronDown
                                            className={`text-gray-500 transition-transform duration-200 ${
                                                openMenuId === link.id ? "rotate-180" : ""
                                            }`}
                                            size={14}
                                        />
                                    )}
                                </div>
                                )}
                                
                                {link.sublinks && (
                                    <div
                                        className={`
                                        ml-4 mt-1 overflow-hidden transform origin-top transition-all duration-500 ease-in-out
                                        ${openMenuId === link.id ? "max-h-96 opacity-100 scale-y-100" : "max-h-0 opacity-0 scale-y-95"}
                                        `}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        {link.sublinks.map((subLink) => (
                                        <Link
                                            key={subLink.id}
                                            to={`${link.id}/${subLink.id}`}
                                            className="block px-4 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                        >
                                            <span className="font-poppins text-sm dark:text-gray-400 text-gray-700">
                                            {subLink.name}
                                            </span>
                                        </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                            );
                        })}
                        </div>
                    </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Sidebar;
