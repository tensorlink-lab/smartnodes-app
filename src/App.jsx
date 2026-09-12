import { SmartnodesDocs, SmartnodesLanding, SmartnodesApp } from "./pages";
import { 
  Navbar, 
  Footer, 
  NotFound, 
  Sidebar, 
  SmartnodesOverview, 
} from "./components";
import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useStateContext } from "./contexts/contextProvider";

const excludedPages = ["/"];

const useWindowSizeHandler = (setActiveMenu) => {
  useEffect(() => {
    const handleResize = () => {
      if (!excludedPages.includes(window.location.pathname)) {
        setActiveMenu(window.innerWidth >= 1130);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [setActiveMenu]);
};

const App = () => {
  const { activeMenu, setActiveMenu } = useStateContext();
  const [id, setId] = useState(() => {
    const savedUsername = localStorage.getItem("username");
    return savedUsername || "";
  });

  useEffect(() => {
    localStorage.setItem("username", id);
  }, [id]);

  // Set activeMenu to true for desktop on initial load
  useWindowSizeHandler(setActiveMenu);

  return (
    <div className="relative flex-row min-h-screen bg-zinc-100 dark:bg-[#0A0D13]">
      <BrowserRouter>
        {activeMenu && <Sidebar />}
        <div className={`flex flex-col min-h-screen w-full ${activeMenu ? "pl-[245px]" : ""} transition-all duration-300 ease-out`}>
          <div className="z-40 w-full"><Navbar /></div>
          <main className="flex-1 w-full overflow-x-hidden">
            <Routes>
              <Route index element={<SmartnodesLanding />} />
              <Route path="docs" element={<SmartnodesDocs />}>
                <Route index element={<SmartnodesOverview />} />
                <Route path="overview" element={<SmartnodesOverview />} />
              </Route>
              <Route path="app" element={<SmartnodesApp activeMenu={activeMenu} />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </div>
  );
};

export default App;
