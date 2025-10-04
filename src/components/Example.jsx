import React, { useState } from "react";
import styles, { layout } from "../style";
import { features } from "../constants";
import { AirdropIndicator } from ".";

const codeSnippets = {
  python: `import requests

https_serv = "https://smartnodes-lab.ddns.net/tensorlink-api"
http_serv = "http://smartnodes-lab.ddns.net:443/tensorlink-api"

payload = {
  "hf_name": "Qwen/Qwen3-8B",
  "message": "Describe the role of AI in medicine.",
  "max_length": 1024,
  "max_new_tokens": 256,
  "temperature": 0.7,
  "do_sample": True,
  "num_beams": 4,
  "history": [
    {"role": "user", "content": "What is AI?"},
    {"role": "assistant", "content": "AI refers to..."}
  ]
}

response = requests.post(f"{http_serv}/generate", json=payload)
print(response.json())`,

  javascript: `const http_serv = "http://smartnodes-lab.ddns.net:443/tensorlink-api";

const response = await fetch(http_serv + '/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    hf_name: "Qwen/Qwen3-8B",
    message: "Describe the role of AI in medicine.",
    max_length: 1024,
    max_new_tokens: 256,
    temperature: 0.7,
    do_sample: true,
    num_beams: 4,
    history: [
      { role: "user", content: "What is AI?" },
      { role: "assistant", content: "AI refers to..." }
    ],
  }),
});

const result = await response.json();
console.log(result);`,

  terminal: `curl -X POST "http://smartnodes-lab.ddns.net:443/tensorlink-api/generate" \\
  -H "Content-Type: application/json" \\
  -d '{
    "hf_name": "Qwen/Qwen3-8B",
    "message": "Describe the role of AI in medicine.",
    "max_length": 1024,
    "max_new_tokens": 256,
    "temperature": 0.7,
    "do_sample": true,
    "num_beams": 4,
    "history": [
      {"role": "user", "content": "What is AI?"},
      {"role": "assistant", "content": "AI refers to..."}
    ]
  }'`,
};

const torchCode = `from tensorlink import DistributedModel, DistributedOptimizer
import torch.nn as nn
import torch.optim as optim

model = DistributedModel(nn.Linear(128, 10))
optimizer = DistributedOptimizer(
    optim.Adam(model.parameters(), lr=1e-3)
)`;

const Example = () => {
  const [activeTab, setActiveTab] = useState('python');

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
  };

  const tabs = ['python', 'javascript', 'terminal'];

  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-6">
      {/* Airdrop Indicator Placeholder */}
      <div className="px-1 mb-2">
        <AirdropIndicator />
      </div>
      
      {/* Main Card Container */}
      <div className="relative">
        {/* Top Section - Original Example Content */}
        <div className="bg-zinc-200 dark:bg-zinc-950 rounded-t-2xl px-6 sm:px-12 py-5 md:pt-8 border-x border-t border-gray-300 dark:border-gray-800 shadow-lg">          
          {/* Title & Description */}
          <div className="max-w-3xl mb-10">
            <h2 className="font-bold text-3xl sm:text-4xl md:text-5xl text-gray-900 dark:text-gray-100 mb-6 leading-tight">
              Peer-to-peer<br />
              <span className="text-blue-400">Machine Learning</span><br />
              <span className="text-red-400">Infrastructure</span>
            </h2>

            <p className="text-gray-700 dark:text-gray-300 text-lg mb-8">
              Tensorlink is a Python library and computational platform that provides powerful AI tools and APIs for PyTorch models.
            </p>
            
            <div className="flex flex-wrap gap-3">
              <a href="tensorlink/docs">
                <button className="px-5 py-2 bg-purple-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-transform hover:scale-105">
                  Documentation
                </button>
              </a>
              <a href="tensorlink/localhostGPT">
                <button className="px-5 py-2 bg-black dark:bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg border-2 border-black dark:border-gray-500 transition-transform hover:scale-105">
                  Demo
                </button>
              </a>
              <a href="https://discord.com/invite/aCW2kTNzJ2" target="_blank" rel="noopener noreferrer">
                <button className="px-5 py-2 bg-indigo-700 hover:bg-blue-700 text-white font-medium rounded-lg border-2 border-indigo-600 transition-transform hover:scale-105">
                  Discord
                </button>
              </a>
            </div>
          </div>

          {/* Features Section */}
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="p-4 rounded-xl bg-gray-100 dark:bg-gray-800 shadow-sm hover:shadow-md transition-all border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center mb-2">
                  <feature.icon className="w-6 h-6 mr-3 text-blue-600" />
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{feature.title}</p>
                </div>
                <div className="w-16 h-1 bg-blue-600 mb-3"></div>
                <p className="md:text-md text-sm text-gray-700 dark:text-gray-300">{feature.content}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Connector Bar with Glow Effect */}
        <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 shadow-lg shadow-purple-500/50"></div>

        {/* Bottom Section - Code Examples (Popping Out) */}
        <div className="bg-gray-100 dark:bg-zinc-900 rounded-b-2xl px-6 sm:px-12 py-10 border-x border-b border-gray-300 dark:border-gray-700 shadow-2xl">
          <div className="text-center mb-8">
            <h3 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-3">
              Get Started in Seconds
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Simple, powerful API and PyTorch library for AI compute.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* API Example Card */}
            <div className="bg-gray-900 rounded-lg overflow-hidden shadow-xl border border-gray-700 hover:border-blue-500 transition-all transform hover:scale-[1.02]">
              <div className="bg-gray-800 px-4 py-2 flex items-center justify-between border-b border-gray-700">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="flex space-x-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-3 py-1 text-xs font-mono uppercase rounded transition-colors
                        ${activeTab === tab ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'}`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => copyToClipboard(codeSnippets[activeTab])}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>

              <pre className="p-4 overflow-x-auto text-xs h-64">
                <code className="font-mono text-gray-100 whitespace-pre-wrap">
                  {codeSnippets[activeTab]}
                </code>
              </pre>

              <div className="bg-gray-800 px-4 py-2 border-t border-gray-700">
                <span className="text-gray-500 text-xs font-mono">API Example</span>
              </div>
            </div>

            {/* PyTorch Example Card */}
            <div className="bg-gray-900 rounded-lg overflow-hidden shadow-xl border border-gray-700 hover:border-blue-500 transition-all transform hover:scale-[1.02]">
              <div className="bg-gray-800 px-4 py-3 flex items-center justify-between border-b border-gray-700">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <span className="text-gray-400 text-xs font-mono">torch.py</span>
                <button
                  onClick={() => copyToClipboard(torchCode)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>

              <pre className="p-4 overflow-x-auto text-xs h-64">
                <code className="font-mono text-gray-100">
                  <span className="text-purple-400">from</span> <span className="text-blue-300">tensorlink</span> <span className="text-purple-400">import</span> DistributedModel, DistributedOptimizer{'\n'}
                  <span className="text-purple-400">import</span> <span className="text-blue-300">torch.nn</span> <span className="text-purple-400">as</span> nn{'\n'}
                  <span className="text-purple-400">import</span> <span className="text-blue-300">torch.optim</span> <span className="text-purple-400">as</span> optim{'\n\n'}
                  model = <span className="text-yellow-300">DistributedModel</span>(nn.<span className="text-yellow-300">Linear</span>(<span className="text-green-400">128</span>, <span className="text-green-400">10</span>)){'\n'}
                  optimizer = <span className="text-yellow-300">DistributedOptimizer</span>({'\n  '}optim.<span className="text-yellow-300">Adam</span>(model.<span className="text-yellow-300">parameters</span>(), lr=<span className="text-green-400">1e-3</span>){'\n}'})
                </code>
              </pre>
              
              <div className="bg-gray-800 px-4 py-2 border-t border-gray-700">
                <span className="text-gray-500 text-xs font-mono">PyTorch Model Example</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Example;