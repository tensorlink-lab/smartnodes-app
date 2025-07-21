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
            className="h-screen ml-3 lg:overflow-hidden border-r border-black dark:border-gray-500 overflow-auto md:hover:overflow-auto pb-10"
            style={{ zIndex: 1000000 }}
        >
            <div className="flex justify-between items-center">
                <Link to="/" className="bg-gray-400 rounded-xl ml-2 mt-4 px-3">
                    <img className="w-40" src={logo} alt="Logo" />
                </Link>

                <button
                    onClick={() => setActiveMenu(!activeMenu)}
                    className="rounded-full px-3 mt-10 mr-3 sm:mt-4 p-6 cursor-pointer"
                >
                    <MdOutlineCancel size={20} color="grey" /> {/* Increased from default to 36px */}
                </button>

            </div>
            <div className="mt-10">
                {sideLinks.map((item) => (
                    <div key={item.title} className="mb-20 ml-1">
                        <p className="text-gray-400 font-poppins text-lg dark:text-gray-300 m-3 mt-4 uppercase">
                            {item.title}
                        </p>
                        {item.links.map((link) => (
                            <div
                                key={link.id}
                                className="mt-5 cursor-pointer"
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
                                <div className="flex items-center">
                                    <div className="flex items-center gap-3 ml-5">
                                        <span className="font-poppins font-xl dark:text-gray-300 text-gray-900">
                                            {link.name}
                                        </span>
                                    </div>

                                    {link.sublinks && (
                                        <FaChevronDown
                                            className={`ml-2 text-gray-500 transition-transform duration-200 ${
                                                openMenuId === link.id ? "rotate-180" : ""
                                            }`}
                                        />
                                    )}
                                </div>
                                {link.sublinks && openMenuId === link.id && (
                                    <div
                                        className="ml-6"
                                        onClick={(e) => e.stopPropagation()} // Prevent collapse when clicking sublinks
                                    >
                                        {link.sublinks.map((subLink) => (
                                            <Link
                                                key={subLink.id}
                                                to={`${link.id}/${subLink.id}`}
                                                className="block mt-5"
                                            >
                                                <span className="ml-5 font-poppins font-xl dark:text-gray-400 text-gray-900">
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
