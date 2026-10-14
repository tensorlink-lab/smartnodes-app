
import React, { useEffect } from "react";
import { Routes, Outlet, Route } from "react-router-dom";
import { SmartnodesOverview } from "../components";
import { useStateContext } from "../contexts/ContextProvider";

const SmartnodesDocs = () => {
  const { setActiveMenu } = useStateContext();

  useEffect(() => {
    setActiveMenu(true);
  }, []); 

  const Disclaimer = () => (
    <div className="bg-yellow-100 mt-7 p-4 border-l-4 border-yellow-500">
      <p className="text-yellow-800 dark:text-black font-medium">
        ⚠️ <strong>Smartnodes is under development,</strong> and is not recommended for production environments.
      </p>
    </div>
  );

  return (
    <div>
      <Routes>
        <Route index element={<SmartnodesOverview />} />
        <Route path="overview" element={<SmartnodesOverview />} />
      </Routes>
      {/* <Outlet /> */}
    </div>
  );
};

export default SmartnodesDocs;
