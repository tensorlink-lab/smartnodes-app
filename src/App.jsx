import { TensorlinkDocs, Smartnodes, SmartnodesDocs, SmartnodesLanding, SmartnodesApp, TensorLinkLanding } from "./pages";
import { Navbar, WalletSetup, Footer, Sidebar, Overview, ApiExample, SmartnodesOverview, GettingStarted, ModelExample, LocalhostGPT, Nodes, Mining, Community } from "./components";
import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useStateContext } from "./contexts/contextProvider";

const useWindowSizeHandler = (setActiveMenu) => {
  useEffect(() => {
    const handleResize = () => {
      setActiveMenu(window.innerWidth >= 1130);
    };

    // Set initial state
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Cleanup
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

  useEffect(() => {
    if (location.pathname === '/localhostGPT') {
      window.location.href = '/tensorlink/localhostGPT';
    }
  }, [location.pathname]);

  // Set activeMenu to true for desktop on initial load
  useWindowSizeHandler(setActiveMenu);

  return (
    <div className="relative flex min-h-screen bg-gray-300 dark:bg-zinc-900">
      <BrowserRouter>
        {/* Sidebar - now properly fixed */}
        {activeMenu && <Sidebar />}
        
        {/* Main content area */}
        <div className={`flex flex-col min-h-screen w-full ${activeMenu ? "pl-[245px]" : ""} transition-all duration-300 ease-out`}>
          <div className="z-40 w-full">
            <Navbar />
          </div>
          
          <main className="flex-1 w-full overflow-x-hidden">
            <Routes>
              <Route index element={<Smartnodes />} />
              
              <Route path="docs" element={<SmartnodesDocs />}>
                <Route index element={<SmartnodesOverview />} />
                <Route path="overview" element={<SmartnodesOverview />} />
              </Route>

              {/* TensorLink routes - properly nested */}
              <Route path="tensorlink" element={<TensorLinkLanding />} />
              
              {/* Docs routes */}
              <Route path="tensorlink/docs" element={<TensorlinkDocs />}>
                <Route index element={<Overview />} />
                <Route path="overview" element={<Overview />} />
                <Route path="install" element={<GettingStarted />} />
                <Route path="wallet" element={<WalletSetup />} />
                <Route path="model" element={<ModelExample />} />
                <Route path="api" element={<ApiExample />} />
                <Route path="nodes" element={<Nodes />} />
                <Route path="mining" element={<Mining />} />
                <Route path="community" element={<Community />} />
              </Route>

              <Route path="tensorlink/localhostGPT/*" element={<LocalhostGPT />} />
              <Route path="app" element={<SmartnodesApp />} />
              <Route path="*" element={<Smartnodes />} />
            </Routes>
          </main>
          
          <Footer />
        </div>
      </BrowserRouter>
    </div>
  );
};

export default App;