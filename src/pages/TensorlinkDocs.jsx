import React, { useState, useEffect } from "react";
import { Routes, Outlet, Route } from "react-router-dom";
import { Overview, WalletSetup, Installation, ApiExample, Community, Mining, GettingStarted, ModelExample, Nodes } from "../components";
import { useStateContext } from "../contexts/contextProvider";
import { Helmet } from "react-helmet-async";

const TensorlinkDocs = () => {
  const { setActiveMenu } = useStateContext();
  const [showDisclaimer1, setShowDisclaimer1] = React.useState(true);
  const [showDisclaimer2, setShowDisclaimer2] = React.useState(true);

  useEffect(() => {
    setActiveMenu(true);

    setShowDisclaimer1(localStorage.getItem("hideDisclaimer1") !== "true");
    setShowDisclaimer2(localStorage.getItem("hideDisclaimer2") !== "true");
  }, []);

  const Disclaimer1 = () => (
    showDisclaimer1 && (
      <div className="relative bg-red-100 mt-7 p-4 pr-10 border-l-4 border-red-500 sm:text-sm text-xs">
        <button
          onClick={() => {
            setShowDisclaimer1(false);
            localStorage.setItem("hideDisclaimer1", "true");
          }}
          className="absolute top-2 right-2 text-black/60 hover:text-black text-sm font-bold"
          aria-label="Close disclaimer"
        >
          ✕
        </button>
        <p className="text-black font-medium">
          ⚠️ Tensorlink is under active development and evolving quickly.
          <strong> For critical production systems, test thoroughly before deploying.</strong>
        </p>
      </div>
    )
  );

  const Disclaimer2 = () => (
    showDisclaimer2 && (
      <div className="relative bg-yellow-100 mt-1 p-4 pr-10 border-l-4 border-yellow-500 sm:text-sm text-xs">
        <button
          onClick={() => {
            setShowDisclaimer2(false);
            localStorage.setItem("hideDisclaimer2", "true");
          }}
          className="absolute top-2 right-2 text-black/60 hover:text-black text-sm font-bold"
          aria-label="Close disclaimer"
        >
          ✕
        </button>
        <p className="text-yellow-800 dark:text-black font-medium">
          Model availability on the public network is currently limited. If you have a capable machine, please consider{" "}
          <a href="/tensorlink/docs/mining" className="text-blue-600 dark:text-blue-400 underline">running a node</a>{" "}
          to support the project. For questions, feedback, or to get involved, join the discussion on{" "}
          <a href="https://discord.gg/aCW2kTNzJ2" className="text-blue-600 dark:text-blue-400 underline">Discord</a>.
        </p>
      </div>
    )
  );

  return (
    <>
      <Helmet>
        <title>Smartnodes › Tensorlink Docs</title>
        <meta
          name="description"
          content="Documentation for Tensorlink, including setup, API usage, running nodes, and more."
        />
        <link rel="canonical" href="https://smartnodes.ca/tensorlink/docs" />
        <script type="application/ld+json">
          {`
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Smartnodes",
                "item": "https://smartnodes.ca/"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Tensorlink",
                "item": "https://smartnodes.ca/tensorlink"
              }
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Tensorlink Docs",
                "item": "https://smartnodes.ca/tensorlink/docs"
              }
            ]
          }
          `}
        </script>
      </Helmet>

      <div className="bg-zinc-50 dark:bg-neutral-900 mt-2 border-t border-t-black dark:border-t-white">
        <Disclaimer1 />
        <Disclaimer2 />
        <Routes>
          <Route index element={<Overview />} />
          <Route path="overview" element={<Overview />} />
          <Route path="start" element={<GettingStarted />} />
          <Route path="install" element={<Installation />} />
          <Route path="model" element={<ModelExample />} />
          <Route path="api" element={<ApiExample />} />
          <Route path="nodes" element={<Nodes />} />
          <Route path="mining" element={<Mining />} />
          <Route path="community" element={<Community />} />
          <Route path="wallet" element={<WalletSetup />} />
        </Routes>
        {/* <Outlet /> */}
      </div>
    </>
  );
};

export default TensorlinkDocs;
