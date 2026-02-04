import React, { useState, useEffect } from "react";
import { Network, Zap, Shield, MessageSquare } from "lucide-react";
import { LocalhostGPT } from ".";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-python";

const features = [
  {
    icon: Network,
    title: "Private & Global Networks",
    content: "Tap into a global peer-to-peer compute layer for public workloads, or spin up your own distributed AI network across personal GPUs."
  },
  {
    icon: Zap,
    title: "Distributed Performance",
    content: "Run inference and training across multiple devices with pipeline and model parallelism, connect via API or PyTorch."
  },
  {
    icon: Shield,
    title: "Trustless Infrastructure",
    content: "Keep full control of input data using specialized hybrid distributed models infrastructure that doesn’t depend on centralized cloud providers."
  }
];


const codeSnippets = {
  api: `const response = await fetch(
  "http://localhost:64747/v1/chat/completions",
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "Qwen/Qwen2.5-7B-Instruct",
      messages: [
        { role: "system", content: "You are helpful." },
        { role: "user", content: "Explain AI." }
      ],
      max_tokens: 128,
      temperature: 0.7,
      stream: true
    })
  }
);`,
  pytorch: `from tensorlink import DistributedModel

TRAIN = False

model = DistributedModel(
  "Qwen/Qwen2.5-7B-Instruct",
  training=TRAIN,
)

if TRAIN:
  optimizer = model.create_optimizer(
    optimizer_type="adamw",
    lr=1e-4,
    weight_decay=0.01,
  )`
};

const Example = ({ activeMenu }) => {
  const [copiedApi, setCopiedApi] = useState(false);
  const [copiedPytorch, setCopiedPytorch] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);

  useEffect(() => {
    Prism.highlightAll();
  }, []);

  const copyToClipboard = (code, type) => {
    navigator.clipboard.writeText(code);
    if (type === 'api') {
      setCopiedApi(true);
      setTimeout(() => setCopiedApi(false), 2000);
    } else {
      setCopiedPytorch(true);
      setTimeout(() => setCopiedPytorch(false), 2000);
    }
  };

  useEffect(() => {
    if (showChatbot) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [showChatbot]);


  return (
    <section className="relative w-full h-full">
      <section className="w-full max-w-7xl mx-auto sm:px-4 px-2 py-6">
        <div className="relative">
          <div className="bg-zinc-200 dark:bg-zinc-950 rounded-t-2xl px-6 sm:px-12 py-5 md:pt-8 border-x border-t border-gray-300 dark:border-gray-800 shadow-lg">
            <div className="max-w-3xl mb-6">
              <h2 className="font-bold text-2xl sm:text-3xl md:text-4xl text-gray-900 dark:text-gray-100 mb-6 leading-tight">
                Peer-to-Peer<br />
                <span className="text-blue-400">Machine Learning</span><br />
                <span className="text-red-400">Infrastructure</span>
              </h2>
              <p className="text-gray-700 dark:text-gray-300 text-sm md:text-md mb-5">
                Tensorlink is a Python library and peer-to-peer platform for running, training, and deploying PyTorch models across distributed hardware. Access powerful AI infrastructure without relying on centralized cloud services.
              </p>
              <div className="flex flex-wrap gap-2">
                <a href="/tensorlink/docs" target="_blank" rel="noopener noreferrer">
                  <button className="sm:px-4 sm:py-2 px-2 py-1 sm:text-md text-sm bg-black dark:bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg border-2 border-black dark:border-gray-500 transition-transform hover:scale-105">
                    Documentation
                  </button>
                </a>
                <a href="https://discord.com/invite/aCW2kTNzJ2" target="_blank" rel="noopener noreferrer">
                  <button className="sm:px-4 sm:py-2 px-2 py-1 sm:text-md text-sm bg-indigo-700 hover:bg-blue-900 text-white font-medium rounded-lg border-2 border-neutral-400 transition-transform hover:scale-105">
                    Discord
                  </button>
                </a>
                <button 
                  onClick={() => setShowChatbot(true)}
                  className="sm:px-3 sm:py-2 px-2 py-1 sm:text-md text-sm bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium rounded-lg border-2 border-neutral-400 transition-transform hover:scale-105 flex items-center gap-2"
                >
                  <MessageSquare size={16} />
                  Demo Chat
                </button>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="p-4 rounded-xl bg-gray-100 dark:bg-gray-800 shadow-sm hover:shadow-md transition-all border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-center mb-2">
                    <feature.icon className="w-6 h-6 mr-3 text-blue-600" />
                    <p className="text-[17px] font-bold text-gray-900 dark:text-white">{feature.title}</p>
                  </div>
                  <div className="w-16 h-1 bg-blue-600 mb-3"></div>
                  <p className="md:text-sm text-xs text-gray-700 dark:text-gray-300">{feature.content}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 shadow-lg shadow-purple-500/50"></div>

          <div className="bg-gray-100 dark:bg-zinc-900 rounded-b-2xl px-6 py-8 border-x border-b border-gray-300 dark:border-gray-700 shadow-2xl">
            <div className="text-center mb-6">
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                Get Started in Seconds
              </h3>
              <p className="text-md text-gray-500 dark:text-gray-500 italic">
                Just a few lines of code to get started!
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {/* API Example */}
              <div className="bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden shadow-xl border border-gray-300 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all transform hover:scale-[1.02] flex flex-col">
                <div className="bg-gray-200 dark:bg-gray-800 px-4 py-2 flex items-center justify-between border-b border-gray-300 dark:border-gray-700">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <span className="text-gray-600 dark:text-gray-400 text-xs font-mono uppercase font-bold">API</span>
                  <button
                    onClick={() => copyToClipboard(codeSnippets.api, 'api')}
                    className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                    title="Copy code"
                  >
                    {copiedApi ? (
                      <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    )}
                  </button>
                </div>
                <pre className="p-4 overflow-x-auto text-xs flex-grow bg-white dark:bg-gray-900 max-h-[334px]">
                  <code className="font-mono whitespace-pre-wrap text-gray-900 dark:text-white">
                      <>
                        <span className="text-purple-400">const</span> <span className="text-blue-300">http_serv</span> = <span className="text-green-400">"http://smartnodes.ddns.net/tensorlink-api"</span>;{'\n\n'}
                        <span className="text-purple-400">const</span> <span className="text-blue-300">response</span> = <span className="text-purple-400">await</span> <span className="text-yellow-300">fetch</span>(<span className="text-blue-300">http_serv</span> + <span className="text-green-400">'/generate'</span>, {'{\n  '}
                        <span className="text-blue-300">method</span>: <span className="text-green-400">'POST'</span>,{'\n  '}
                        <span className="text-blue-300">headers</span>: {'{ '}<span className="text-green-400">'Content-Type'</span>: <span className="text-green-400">'application/json'</span> {' },\n  '}
                        <span className="text-blue-300">body</span>: <span className="text-yellow-300">JSON</span>.<span className="text-yellow-300">stringify</span>({'({\n    '}
                        <span className="text-blue-300">hf_name</span>: <span className="text-green-400">"Qwen/Qwen2.5-7B-Instruct"</span>,{'\n    '}
                        <span className="text-blue-300">message</span>: <span className="text-green-400">"User input..."</span>,{'\n    '}
                        <span className="text-blue-300">max_length</span>: <span className="text-orange-400">1024</span>,{'\n    '}
                        <span className="text-blue-300">max_new_tokens</span>: <span className="text-orange-400">256</span>,{'\n    '}
                        <span className="text-blue-300">temperature</span>: <span className="text-orange-400">0.7</span>,{'\n    '}
                        <span className="text-blue-300">do_sample</span>: <span className="text-orange-400">true</span>,{'\n    '}
                        <span className="text-blue-300">num_beams</span>: <span className="text-orange-400">4</span>,{'\n    '}
                        <span className="text-blue-300">history</span>: {'[\n      { '}
                        <span className="text-blue-300">role</span>: <span className="text-green-400">"assistant"</span>, <span className="text-blue-300">content</span>: <span className="text-green-400">"Hi, how may I help you?"</span> {'},'} {'\n\t  { '}
                        <span className="text-blue-300">role</span>: <span className="text-green-400">"user"</span>, <span className="text-blue-300">content</span>: <span className="text-green-400">"Hello there!"</span> {' },\n'}
                        {'\t]\n  }))'}
                        {'\n});'}{'\n\n'}
                        <span className="text-purple-400">const</span> <span className="text-blue-300">result</span> = <span className="text-purple-400">await</span> <span className="text-blue-300">response</span>.<span className="text-yellow-300">json</span>();{'\n'}
                        <span className="text-blue-300">console</span>.<span className="text-yellow-300">log</span>(<span className="text-blue-300">result</span>);
                      </>
                  </code>
                </pre>
                <div className="bg-gray-200 dark:bg-gray-800 px-4 py-2 border-t border-gray-300 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-500 text-xs font-mono">
                    OpenAI-Compatible API
                  </span>
                </div>
              </div>

              {/* PyTorch Example */}
              <div className="bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden shadow-xl border border-gray-300 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all transform hover:scale-[1.02] flex flex-col">
                <div className="bg-gray-200 dark:bg-gray-800 px-4 py-2 flex items-center justify-between text-[10px] border-b border-gray-300 dark:border-gray-700">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <span className="text-gray-600 dark:text-gray-400 text-xs font-mono uppercase font-bold">PyTorch</span>
                  <button
                    onClick={() => copyToClipboard(codeSnippets.pytorch, 'pytorch')}
                    className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                    title="Copy code"
                  >
                    {copiedPytorch ? (
                      <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    )}
                  </button>
                </div>

                <pre className="p-4 overflow-x-auto text-xs flex-grow bg-white dark:bg-gray-900 max-h-[334px]">
                  <code className="font-mono whitespace-pre-wrap text-gray-900 dark:text-white">
                      <>
                        <span className="text-purple-400">from</span> <span className="text-blue-300">tensorlink</span> <span className="text-purple-400">import</span> DistributedModel{'\n\n'}
                        TRAIN = <span className="text-orange-400">True</span>{'\n\n'}
                        model = <span className="text-yellow-300">DistributedModel</span>({'\n\t'}
                        <span className="text-green-400">"Qwen/Qwen2.5-7B-Instruct"</span>,{'\n\t'}
                        training=<span className="text-purple-400">True</span>{'\n'}){'\n\n'}
                        <span className="text-purple-400">if</span> TRAIN:{'\n  '}
                        optimizer = model.create_optimizer({'\n    '}
                        optimizer_type=<span className="text-green-400">"adamw"</span>,{'\n    '}
                        lr=<span className="text-orange-400">1e-4</span>,{'\n    '}
                        weight_decay=<span className="text-orange-400">0.01</span>,{'\n  '}
                        ){'\n'}
                      </>
                  </code>
                </pre>
                <div className="bg-gray-200 dark:bg-gray-800 px-4 py-2 border-t border-gray-300 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-500 text-xs font-mono">
                    PyTorch Library Example
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Chatbot Popup Modal */}
      {showChatbot && (
        <div
          className={`fixed inset-y-0 right-0 z-50 flex items-center justify-center sm:p-4 bg-black bg-opacity-0 backdrop-blur-md transition-all duration-300
          ${activeMenu ? "left-[245px]" : "left-0"}`}
        >
          <div className="w-full mt-10 sm:mt-32 sm:mb-20 h-[75vh] sm:h-[80vh] max-w-5xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border-2 border-gray-300 dark:border-gray-700 flex flex-col">
            <LocalhostGPT onClose={() => setShowChatbot(false)} />
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      {!showChatbot && (
        <button
          onClick={() => setShowChatbot(true)}
          className="fixed bottom-6 right-6 w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-full shadow-2xl flex items-center justify-center transition-transform hover:scale-110 z-40"
          aria-label="Open chatbot"
        >
          <MessageSquare size={24} />
        </button>
      )}
    </section>
  );
};

export default Example;
