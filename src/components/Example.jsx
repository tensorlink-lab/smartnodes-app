import React, { useState, useRef, useEffect } from "react";
import { Send, RefreshCw } from "lucide-react";
import { features } from "../constants"

const codeSnippets = {
  api: `const http_serv = "http://smartnodes.ddns.net/tensorlink-api";

const response = await fetch(http_serv + '/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    hf_name: "Qwen/Qwen2.5-7B-Instruct",
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

  pytorch: `from tensorlink import DistributedModel, DistributedOptimizer
import torch.nn as nn
import torch.optim as optim

model = DistributedModel(nn.Linear(128, 10))
optimizer = DistributedOptimizer(
    optim.Adam(model.parameters(), lr=1e-3)
)`,
};

const Example = () => {
  const [activeTab, setActiveTab] = useState('api');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef(null);
  const inputRef = useRef(null);

  // Load conversation from state when component mounts
  useEffect(() => {
    const savedMessages = sessionStorage.getItem("exampleChatHistory");
    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages));
      } catch (e) {
        console.error("Failed to parse saved messages:", e);
        sessionStorage.removeItem("exampleChatHistory");
      }
    }
  }, []);

  // Save messages to state when they change
  useEffect(() => {
    if (messages.length > 0) {
      sessionStorage.setItem("exampleChatHistory", JSON.stringify(messages));
    }
  }, [messages]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      requestAnimationFrame(() => {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      });
    }
  }, [messages, isLoading]);

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
  };

  const tabs = ['api', 'pytorch'];

  const handleSendMessage = async () => {
    if (input.trim() === "" || isLoading) return;
    
    const userMessage = { 
      role: "user", 
      content: input.trim(),
      timestamp: new Date().toISOString()
    };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);
    
    try {
      // Prepare history (only if there are previous messages)
      const historyPayload = messages.length > 0 ? messages.map(msg => ({ 
        role: msg.role, 
        content: msg.content 
      })) : undefined;

      console.log("Sending request with payload:", {
        hf_name: "Qwen/Qwen2.5-7B-Instruct",
        message: userMessage.content,
        history: historyPayload,
      });

      const response = await fetch('https://smartnodes.ddns.net/tensorlink-api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          hf_name: "Qwen/Qwen3-8B",
          message: userMessage.content,
          max_length: 1024,
          max_new_tokens: 256,
          temperature: 0.7,
          do_sample: true,
          num_beams: 4,
          ...(historyPayload && { history: historyPayload }),
        }),
      });
      
      console.log("Response status:", response.status);
      
      if (!response.ok) {
        throw new Error(`API request failed with status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Received data:", data);
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      // Extract only the assistant's response (after the last "assistant" marker)
      let assistantResponse = data.response;
      
      // Split by "assistant" and get the last occurrence
      const parts = assistantResponse.split(/assistant\s*/);
      if (parts.length > 1) {
        assistantResponse = parts[parts.length - 1].trim();
      }
      
      assistantResponse = assistantResponse
        .replace(/^(system|user)\s+.*/gm, '')
        .trim();
      
      console.log("Final assistant response:", assistantResponse);
      
      setMessages([...updatedMessages, { 
        role: "assistant", 
        content: assistantResponse,
        timestamp: new Date().toISOString()
      }]);
      
    } catch (error) {
      console.error("Error generating response:", error);
      setMessages([...updatedMessages, { 
        role: "assistant", 
        content: `Sorry, I had trouble connecting to the model. Error: ${error.message}. This might be due to server load or timeout. Please try a shorter message or try again later.`,
        timestamp: new Date().toISOString(),
        isError: true
      }]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleReset = () => {
    setMessages([]);
    sessionStorage.removeItem("exampleChatHistory");
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-6">
      <div className="relative">
        <div className="bg-zinc-200 dark:bg-zinc-950 rounded-t-2xl px-6 sm:px-12 py-5 md:pt-8 border-x border-t border-gray-300 dark:border-gray-800 shadow-lg">          
          <div className="max-w-3xl mb-10">
            <h2 className="font-bold text-2xl sm:text-3xl md:text-4xl text-gray-900 dark:text-gray-100 mb-6 leading-tight">
              The Distributed<br />
              <span className="text-blue-400">Machine Learning</span><br />
              <span className="text-red-400">Toolkit</span>
            </h2>

            <p className="text-gray-700 dark:text-gray-300 text-sm md:text-md mb-8">
              Tensorlink is a Python library and peer-to-peer platform for running, training, and deploying PyTorch models across
              distributed hardware. Access powerful AI infrastructure without relying on centralized cloud services.
            </p>
            
            <div className="flex flex-wrap gap-3">
              <a href="/tensorlink/docs" target="_blank" rel="noopener noreferrer">
                <button className="sm:px-5 sm:py-2 px-2 py-1 sm:text-md text-sm bg-black dark:bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg border-2 border-black dark:border-gray-500 transition-transform hover:scale-105">
                  Documentation
                </button>
              </a>
              <a href="https://discord.com/invite/aCW2kTNzJ2" target="_blank" rel="noopener noreferrer">
                <button className="sm:px-5 sm:py-2 px-2 py-1 sm:text-md text-sm bg-indigo-700 hover:bg-blue-900 text-white font-medium rounded-lg border-2 border-indigo-700 transition-transform hover:scale-105">
                  Discord
                </button>
              </a>
              <button
                onClick={() => {
                  document.getElementById("demo")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="sm:px-5 sm:py-2 px-2 py-1 sm:text-md text-sm bg-gray-700 hover:bg-gray-900 text-white font-medium rounded-lg border-2 border-gray-600 transition-transform hover:scale-105"
              >
                Demo
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

        <div className="bg-gray-100 dark:bg-zinc-900 rounded-b-2xl px-6 py-10 border-x border-b border-gray-300 dark:border-gray-700 shadow-2xl" id="demo">
          <div className="text-center mb-8">
            <h3 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Get Started in Seconds
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-1">
              Simple, powerful API and PyTorch library for AI compute.
            </p>
            <p className="text-md text-gray-500 dark:text-gray-500 italic">
              Just a few lines of code to get started!
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden shadow-xl border border-gray-300 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all transform hover:scale-[1.02] flex flex-col">
              <div className="bg-gray-200 dark:bg-gray-800 px-4 py-2 flex items-center justify-between border-b border-gray-300 dark:border-gray-700">
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
                      className={`px-3 py-1 text-xs font-mono uppercase rounded transition-colors ${activeTab === tab ? 'bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
                    >
                      {tab === 'api' ? 'API' : 'PyTorch'}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => copyToClipboard(codeSnippets[activeTab])}
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                  title="Copy code"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>

              <pre className="p-4 overflow-x-auto text-xs flex-grow bg-white dark:bg-gray-900 max-h-[334px]">
                <code className="font-mono whitespace-pre-wrap text-gray-900 dark:text-white">
                  {activeTab === 'api' ? (
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
                  ) : (
                    <>
                      <span className="text-purple-400">from</span> <span className="text-blue-300">tensorlink</span> <span className="text-purple-400">import</span> DistributedModel, DistributedOptimizer{'\n'}
                      <span className="text-purple-400">import</span> <span className="text-blue-300">torch.nn</span> <span className="text-purple-400">as</span> nn{'\n'}
                      <span className="text-purple-400">import</span> <span className="text-blue-300">torch.optim</span> <span className="text-purple-400">as</span> optim{'\n\n'}
                      model = <span className="text-yellow-300">DistributedModel</span>(nn.<span className="text-yellow-300">Linear</span>(<span className="text-orange-400">128</span>, <span className="text-orange-400">10</span>)){'\n'}
                      optimizer = <span className="text-yellow-300">DistributedOptimizer</span>({'\n  '}optim.<span className="text-yellow-300">Adam</span>(model.<span className="text-yellow-300">parameters</span>(), lr=<span className="text-orange-400">1e-3</span>){'\n}'})
                    </>
                  )}
                </code>
              </pre>

              <div className="bg-gray-200 dark:bg-gray-800 px-4 py-2 border-t border-gray-300 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-500 text-xs font-mono">
                  {activeTab === 'api' ? 'JavaScript API Example' : 'PyTorch Library Example'}
                </span>
              </div>
            </div>

            <div className="bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden shadow-xl border border-gray-300 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all transform hover:scale-[1.02] flex flex-col">
              <div className="bg-gray-200 dark:bg-gray-800 px-4 py-2 flex items-center justify-between border-b border-gray-300 dark:border-gray-700">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <span className="text-gray-600 dark:text-gray-400 text-xs font-mono">Live Demo</span>
                <button
                  onClick={handleReset}
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                  title="Reset chat"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>

              <div 
                ref={chatContainerRef}
                className="h-64 overflow-y-auto p-3 bg-white dark:bg-gray-900 space-y-2 min-h-[300px]"
              >
                {messages.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-center text-gray-500 dark:text-gray-400 text-sm px-4">
                    <p>Try asking a question! This demo runs <strong className="text-blue-600 dark:text-blue-400">Qwen2.5-7B</strong> on distributed compute.</p>
                  </div>
                ) : (
                  messages.map((message, index) => (
                    <div 
                      key={index} 
                      className={`p-2 rounded text-xs ${
                        message.role === "user" 
                          ? "bg-blue-600 text-white ml-8" 
                          : message.isError 
                            ? "bg-red-100 dark:bg-red-900/50 text-red-900 dark:text-red-200 mr-8 border border-red-300 dark:border-red-700"
                            : "bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-200 mr-8"
                      }`}
                    >
                      <div className="font-medium mb-1 text-[10px] opacity-70">
                        {message.role === "user" ? "You" : "Qwen2.5"}
                      </div>
                      <div className="whitespace-pre-wrap">{message.content}</div>
                    </div>
                  ))
                )}
                
                {isLoading && (
                  <div className="flex items-center gap-2 p-2 rounded bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-200 mr-8">
                    <div className="flex space-x-1">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                      <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                      <div className="w-1.5 h-1.5 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                    </div>
                    <span className="text-xs">Thinking...</span>
                  </div>
                )}
              </div>

              <div className="bg-gray-200 dark:bg-gray-800 px-3 py-2 border-t border-gray-300 dark:border-gray-700">
                <div className="flex gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask something..."
                    className="flex-1 px-2 py-1 text-xs bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded border border-gray-300 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none"
                    disabled={isLoading}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={isLoading || input.trim() === ""}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                  >
                    <Send className="w-3 h-3" />
                    Send
                  </button>
                </div>
              </div>

              <div className="bg-gray-200 dark:bg-gray-800 px-4 py-2 border-t border-gray-300 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-500 text-xs font-mono">Interactive Chat Demo</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Example;