import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";  
import { MdOutlineCancel } from "react-icons/md";
import { FaChevronDown } from "react-icons/fa";

import { logo } from "../assets";
import { useStateContext } from "../contexts/contextProvider";
import { sideLinks } from "../constants";

const Sidebar = ({ open, close }) => {
    const { activeMenu, setActiveMenu } = useStateContext();
    const [openMenuId, setOpenMenuId] = useState(null);  // Track which menu is open
    const navigate = useNavigate();

    const toggleMenu = (id) => {
        setOpenMenuId(prevId => (prevId === id ? null : id));
    };

    return (
        <div
            className="fixed inset-y-0 left-0 w-[245px] bg-slate-100 dark:bg-zinc-800 overflow-y-auto overflow-x-hidden"
            style={{ zIndex: 1000000 }}
        >
            <div className="flex justify-between items-center p-3">
                <Link to="/" className="bg-slate-300 rounded-xl px-3 py-1">
                    <img className="w-40" src={logo} alt="Logo" />
                </Link>

                <button
                    onClick={() => setActiveMenu(!activeMenu)}
                    className="rounded-full p-2 ml-2 cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                    <MdOutlineCancel size={20} color="grey" />
                </button>
            </div>
            
            <div className="px-3 pb-10 ml-1">
                {sideLinks.map((item) => (
                    <div key={item.title} className="mb-8">
                        <p className="text-gray-400 font-poppins text-lg dark:text-gray-300 px-2 py-2 uppercase font-medium">
                            {item.title}
                        </p>
                        {item.links.map((link) => (
                            <div
                                key={link.id}
                                className="mt-2 cursor-pointer"
                                onClick={() => {
                                    if (link.sublinks && link.sublinks.length > 0) {
                                        toggleMenu(link.id);
                                    } else if (item.title === "Links") {
                                        window.location.href = link.id;
                                    } else {
                                        navigate(`/${link.id}`);
                                    }
                                }}                                
                            >
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
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Sidebar;