import React, { createContext, useContext, useState, useEffect } from "react";

const StateContext = createContext();

export const useTheme = () => {
    return useContext(StateContext);
}

const initialState = {
    chat: false,
    cart: false,
    userProfile: false,
    notification: false
} 

// No saved value yet (first-ever visit) falls back to a width check, so
// desktop visitors still see it open by default rather than closed.
const getInitialActiveMenu = () => {
    const saved = localStorage.getItem("tensorlink_active_menu");
    if (saved !== null) return saved === "true";
    return typeof window !== "undefined" ? window.innerWidth >= 1130 : true;
};

export const ContextProvider = ({ children }) => {
    const [activeMenu, setActiveMenu] = useState(getInitialActiveMenu);
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark" );

    useEffect(() => {
        localStorage.setItem("tensorlink_active_menu", String(activeMenu));
    }, [activeMenu]);

    useEffect(() => {
        if (theme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }

        localStorage.setItem("theme", theme);
    }, [theme]);

    const handleThemeSwitch = () => {
        setTheme(theme === "dark" ? "light" : "dark");
    };

    return (
        <StateContext.Provider
            value={{
                activeMenu,
                setActiveMenu,
                theme,
                handleThemeSwitch
            }}>
            {children}
        </StateContext.Provider>
    )
}

export const useStateContext = () => useContext(StateContext);
