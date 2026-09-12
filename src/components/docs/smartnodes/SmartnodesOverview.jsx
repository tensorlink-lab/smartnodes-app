import React from "react";

// Reusable gradient CTA — the same "glow behind a thin gradient border"
// treatment used for the Launch app / Dashboard buttons in the Navbar
// and Sidebar, so primary actions look consistent site-wide instead of
// each page inventing its own button style.
function GradientCta({ href, children, external = false, className = "" }) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={`group relative inline-block rounded-lg ${className}`}
    >
      <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500 blur-md opacity-0 group-hover:opacity-60 transition-opacity duration-300" />
      <span className="relative z-10 block rounded-lg p-[1.5px] bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500 bg-[length:200%_200%] animate-gradient-x">
        <span className="flex items-center justify-center gap-2 rounded-[7px] px-5 py-2.5 font-poppins font-semibold text-black dark:text-white bg-white dark:bg-zinc-900 transition-colors duration-300">
          {children}
        </span>
      </span>
    </a>
  );
}

const FEATURES = [
  {
    title: "P2P Network Layer",
    body: "Flexible node framework for distributed computing and resource sharing across applications",
    accent: "#4FD8C4",
  },
  {
    title: "Smart Contract Rewards",
    body: "Automated payment distribution for computational work and resource contributions",
    accent: "#A78BFA",
  },
  {
    title: "Python Native",
    body: "Built for Python developers to easily integrate with existing ML and scientific workloads",
    accent: "#60A5FA",
  },
];

const ROADMAP = [
  { title: "Smartnodes Testnet", body: "Reputation and reward system distributing testnet tokens to contributors, currently live on Base Sepolia", status: "done" },
  { title: "Tensorlink Release", body: "The first Smartnodes application showcasing P2P AI compute sharing", status: "done" },
  { title: "Standalone Library", body: "Core node framework extracted into a reusable Python library for other P2P applications", status: "active" },
  { title: "Second Application", body: "IoT hardware network exploring another Smartnodes use case (stay tuned!) 📡", status: "active" },
  { title: "Security Audit", body: "Smartnodes contract security audit.", status: "upcoming" },
  { title: "Smartnodes Mainnet & Airdrop", body: "Launch on Base mainnet post-audit, with rewards airdropped to testnet node operators.", status: "upcoming" },
];

function RoadmapDot({ status }) {
  if (status === "done") {
    return (
      <div className="flex-shrink-0 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center mr-4">
        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      </div>
    );
  }
  if (status === "active") {
    return (
      <div className="flex-shrink-0 w-8 h-8 bg-[#4FD8C4] rounded-full flex items-center justify-center mr-4 relative">
        <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
      </div>
    );
  }
  return (
    <div className="flex-shrink-0 w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center mr-4">
      <div className="w-3 h-3 bg-gray-400 dark:bg-gray-500 rounded-full" />
    </div>
  );
}

const SmartnodesOverview = () => (
  <section className="px-5 mt-6 md:px-12 flex flex-col border-t dark:border-t-white border-t-black items-center justify-center h-full w-full font-poppins">
    <div className="text-left px-5 xs:px-0 mt-5 max-w-[1380px] justify-center items-center">
      {/* Header */}
      <div className="flex items-center mb-6 mt-5">
        <div className="bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500 h-8 w-2 mr-4 rounded-lg" />
        <h1 className="text-xl sm:text-3xl dark:text-zinc-100 font-bold">Smartnodes</h1>
      </div>

      {/* Current status banner */}
      <div className="bg-white/60 dark:bg-white/[0.03] border border-emerald-500/30 border-l-4 border-l-emerald-500 p-5 mb-8 rounded-r-lg backdrop-blur-sm">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-6 w-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div className="ml-3 flex-1">
            <h3 className="text-base font-bold dark:text-zinc-100 mb-2">Testnet Now Live on Tensorlink</h3>
            <p className="text-sm dark:text-gray-300 text-gray-700 mb-4">
              Join the testnet to support the development and stress test of Smartnodes and Tensorlink!
            </p>
            <GradientCta href="https://tensorlink.io/docs/mining" external>
              Set Up a Node
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </GradientCta>
          </div>
        </div>
      </div>

      {/* What is Smartnodes */}
      <div className="mb-10">
        <p className="text-base dark:text-gray-300 text-gray-700 mb-6 leading-relaxed">
          Smartnodes is a modular peer-to-peer framework for Python that enables distributed resource sharing.
          It provides the infrastructure for building applications that require data processing & computing power,
          handling peer networking, resource coordination, and a built-in smart contract reward system.
        </p>

        <div className="grid md:grid-cols-3 gap-5">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-lg border border-gray-200 dark:border-white/10 bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm p-5"
            >
              <div className="flex items-center mb-3">
                <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: f.accent }} />
                <h4 className="font-semibold dark:text-zinc-100 text-zinc-800">{f.title}</h4>
              </div>
              <p className="text-sm dark:text-gray-400 text-gray-600">{f.body}</p>
            </div>
          ))}
        </div>

        <p className="text-base dark:text-gray-300 text-gray-700 my-8 leading-relaxed">
          This page will host the official documentation for the Smartnodes library once it has been modularized
          from the Tensorlink codebase. The library will expose the same core peer-to-peer networking and compute
          coordination modules that currently power Tensorlink, allowing developers to create other decentralized
          resource sharing applications.
        </p>
      </div>

      {/* Current implementation */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold dark:text-zinc-100 mb-4">Current Implementation: Tensorlink</h2>
        <p className="text-base dark:text-gray-300 text-gray-700 mb-6 leading-relaxed">
          The Smartnodes framework is currently powering Tensorlink, a peer-to-peer network for AI compute sharing.
          This testnet deployment demonstrates the full capabilities of the system in production.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-lg border border-gray-200 dark:border-white/10 bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm p-6 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center mb-3">
              <svg className="w-5 h-5 text-[#60A5FA] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-lg font-semibold dark:text-zinc-100">Documentation</h3>
            </div>
            <p className="text-sm dark:text-gray-400 text-gray-600 mb-4">
              Learn how the network operates and how to participate as a node operator
            </p>
            <a
              className="inline-flex items-center text-[#4FD8C4] hover:text-[#6EE2D1] hover:underline font-medium transition-colors"
              href="https://tensorlink.io/docs"
              target="_blank"
              rel="noopener noreferrer"
            >
              View Tensorlink Docs
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>

          <div className="rounded-lg border border-gray-200 dark:border-white/10 bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm p-6 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center mb-3">
              <svg className="w-5 h-5 text-[#A78BFA] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <h3 className="text-lg font-semibold dark:text-zinc-100">Dashboard</h3>
            </div>
            <p className="text-sm dark:text-gray-400 text-gray-600 mb-4">
              Monitor your node performance and track your testnet rewards
            </p>
            <a
              className="inline-flex items-center text-[#4FD8C4] hover:text-[#6EE2D1] hover:underline font-medium transition-colors"
              href="/app"
            >
              Open Dashboard
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Roadmap */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold dark:text-zinc-100 mb-4">Roadmap</h2>
        <div className="space-y-4">
          {ROADMAP.map((item) => (
            <div key={item.title} className={`flex items-start ${item.status === "upcoming" ? "opacity-60" : ""}`}>
              <RoadmapDot status={item.status} />
              <div className="flex-1">
                <h3 className="font-semibold dark:text-zinc-100 mb-1">{item.title}</h3>
                <p className="text-sm dark:text-gray-400 text-gray-600">{item.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Learn more */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold dark:text-zinc-100 mb-4">Learn More</h2>
        <div className="rounded-lg border border-gray-200 dark:border-white/10 bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm p-6">
          <p className="text-base dark:text-gray-300 text-gray-700 mb-4">
            Read the technical whitepaper to understand the architecture, reward mechanisms, and vision for the Smartnodes ecosystem.
          </p>
          <a
            className="inline-flex items-center text-[#4FD8C4] hover:text-[#6EE2D1] hover:underline font-medium transition-colors"
            href="https://github.com/tensorlink-lab/smartnodes-core/blob/main/whitepaper.md"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read the Whitepaper
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>

      {/* Return home */}
      <div className="my-8 text-center">
        <GradientCta href="/">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Return Home
        </GradientCta>
      </div>
    </div>
  </section>
);

export default SmartnodesOverview;
