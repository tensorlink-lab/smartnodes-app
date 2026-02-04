import React, { useEffect, useState } from "react";
import { dark1, dark2 } from "../assets";

const ThemeButton = () => {
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

    const toggleTheme = () => {
        const newTheme = theme === "dark" ? "light" : "dark";
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);
        
        // Apply theme to document
        if (newTheme === "dark") {
        document.documentElement.classList.add("dark");
        } else {
        document.documentElement.classList.remove("dark");
        }
        
        // Dispatch custom event for other components
        window.dispatchEvent(new Event("themeChange"));
    };

    return (
        <button onClick={toggleTheme} className="">
            <img src={dark1} alt={theme === "dark" ? "Light Logo" : "Dark Logo"} className="w-[28px] dark:bg-gray-300 rounded-xl"/>
        </button>
    )
}

export default ThemeButton;
