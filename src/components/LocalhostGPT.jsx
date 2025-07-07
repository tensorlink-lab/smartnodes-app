import React, { useState, useEffect, useRef } from "react";
import { Send, RefreshCw, Menu, X, Github, ArrowLeft, AlertCircle, Copy, CheckCheck, Settings } from "lucide-react";
import { useStateContext } from "../contexts/contextProvider";
import { Link } from "react-router-dom";

const LocalhostGPT = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [infoVisible, setInfoVisible] = useState(false);
  const [modelParams, setModelParams] = useState({
    model: "Qwen/Qwen2.5-7B-Instruct",
    temperature: 0.5,
    maxLength: 512,
    maxNewTokens: 512,
    doSample: true,
    numBeams: 2
  });
  const [showSettings, setShowSettings] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const chatContainerRef = useRef(null);
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const { setActiveMenu } = useStateContext();

  // Load conversation from localStorage when component mounts
  useEffect(() => {
    setActiveMenu(true);

    const savedMessages = localStorage.getItem("localhostGPTHistory");
    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages));
      } catch (e) {
        console.error("Failed to parse saved messages:", e);
        localStorage.removeItem("localhostGPTHistory");
      }
    }
    
    // Load saved parameters if they exist
    const savedParams = localStorage.getItem("localhostGPTParams");
    if (savedParams) {
      try {
        setModelParams(JSON.parse(savedParams));
      } catch (e) {
        console.error("Failed to parse saved parameters:", e);
      }
    }
    // Scroll to the top of the component when mounted
    if (containerRef.current) {
      containerRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  }, []);

  // Save messages and scroll to bottom
  useEffect(() => {
    localStorage.setItem("localhostGPTHistory", JSON.stringify(messages));
    if (messages.length > 0) {
      if (chatContainerRef.current) {
        // Use requestAnimationFrame to ensure DOM has updated
        requestAnimationFrame(() => {
          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        });
      }
    }
  }, [messages]);

  const handleInputFocus = () => {
    setTimeout(() => {
      // Scroll to top to avoid keyboard pushing things around
      window.scrollTo({ top: 0, behavior: 'smooth' });
  
      // Handle Safari's scroll behavior
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
  
      // Refocus input to ensure it's ready for typing
      if (inputRef.current) {
        const input = inputRef.current;
        // Only refocus if not already focused
        if (document.activeElement !== input) {
          input.blur(); // temporarily blur
          input.focus(); // re-focus
        }
      }
    }, 100); // 100ms often works better across iOS/Android
  };  

  // Save model parameters when changed
  useEffect(() => {
    localStorage.setItem("localhostGPTParams", JSON.stringify(modelParams));
  }, [modelParams]);

  // Focus input on initial load and after sending a message
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [messages.length]);

  // Handle sending a message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (input.trim() === "") return;
    
    const userMessage = { 
      role: "user", 
      content: input.trim(),
      timestamp: new Date().toISOString()
    };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);
    setError(null);
    
    try {
      // Use the current model parameters for the API request
      const response = await fetch('https://smartnodes.ddns.net/tensorlink-api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          hf_name: modelParams.model,
          message: userMessage.content,
          max_length: modelParams.maxLength,
          max_new_tokens: modelParams.maxNewTokens,
          temperature: modelParams.temperature,
          do_sample: modelParams.doSample,
          num_beams: modelParams.numBeams,
          history: messages.map(msg => ({ 
            role: msg.role, 
            content: msg.content 
          })),
        }),
      });
      
      if (!response.ok) {
        throw new Error(`API request failed with status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setMessages([...updatedMessages, { 
        role: "assistant", 
        content: data.response,
        timestamp: new Date().toISOString()
      }]);
      
    } catch (error) {
      console.error("Error generating response:", error);
      setError(error.message);
      setMessages([...updatedMessages, { 
        role: "assistant", 
        content: `Sorry, I had trouble connecting to the model. Error: ${error.message}`,
        timestamp: new Date().toISOString(),
        isError: true
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset the conversation
  const handleReset = () => {
    setMessages([]);
    setError(null);
    localStorage.removeItem("localhostGPTHistory");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Toggle info panel
  const toggleInfo = () => {
    setInfoVisible(!infoVisible);
  };

  // Toggle settings panel
  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  // Update model parameters
  const updateModelParam = (param, value) => {
    setModelParams(prev => ({
      ...prev,
      [param]: value
    }));
  };

  // Format message content for display
  const formatMessageContent = (content) => {
    // Handle code blocks with syntax highlighting
    const codeBlockRegex = /```([a-z]*)\n([\s\S]*?)```/g;
    let formattedContent = content;
    let match;
    let parts = [];
    let lastIndex = 0;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      // Add text before the code block
      if (match.index > lastIndex) {
        parts.push(
          <span key={`text-${lastIndex}`} className="whitespace-pre-wrap">
            {content.substring(lastIndex, match.index)}
          </span>
        );
      }

      // Add the code block with syntax highlighting
      const language = match[1] || "plaintext";
      parts.push(
        <div key={`code-${match.index}`} className="my-2 bg-gray-800 rounded-md p-3 relative group">
          <div className="flex justify-between items-center text-xs text-gray-400 mb-1">
            <span>{language}</span>
            <button 
              onClick={() => copyToClipboard(match[2])} 
              className="text-gray-400 hover:text-white"
              title="Copy code"
            >
              <Copy size={14} />
            </button>
          </div>
          <pre className="text-green-400 overflow-x-auto">
            <code>{match[2]}</code>
          </pre>
        </div>
      );

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text after the last code block (or all text if no code blocks)
    if (lastIndex < content.length) {
      parts.push(
        <span key={`text-${lastIndex}`} className="whitespace-pre-wrap">
          {content.substring(lastIndex)}
        </span>
      );
    }

    return parts.length > 0 ? parts : formattedContent;
  };

  // Copy text to clipboard
  const copyToClipboard = async (text, messageIndex) => {
    try {
      await navigator.clipboard.writeText(text);
      if (messageIndex !== undefined) {
        setCopiedIndex(messageIndex);
        setTimeout(() => setCopiedIndex(null), 2000);
      }
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div
      className="flex flex-col h-screen short:max-h-[450px] tall:max-h-[750px] max-h-[1300px] bg-gray-100 dark:bg-gray-900 mt-5 border-t border-black dark:border-white"
      ref={containerRef}
    >
      {/* Header - Always visible */}
      <header className="flex justify-between items-center p-3 border-b border-gray-300 dark:border-gray-700 bg-zinc-200 dark:bg-zinc-800 shadow-sm">
        <div className="flex items-center">
          <button 
            onClick={toggleInfo}
            className="mr-3 sm:p-1 rounded-md dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label={infoVisible ? "Close info panel" : "Open info panel"}
          >
            {infoVisible ? <X size={20} /> : <Menu size={20} />}
          </button>
          <h1 className="text-md sm:text-xl hidden xs:block font-bold text-gray-900 dark:text-white">localhostGPT</h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-full text-gray-600 dark:text-gray-300">
            {modelParams.model.split('/').pop().replace('-Instruct', '')}
          </span>
          <button 
            onClick={toggleSettings}
            className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded-md text-xs"
            title="Model settings"
          >
            <Settings size={14} />
            <span className="hidden sm:inline">Settings</span>
          </button>
          <button 
            onClick={handleReset} 
            className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-md text-xs"
            title="Reset conversation"
          >
            <RefreshCw size={14} />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </header>

      {/* Main content - Responsive layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Info sidebar - Conditional render based on screen size and toggle state */}
        {infoVisible && (
          <div className="sm:w-80 md:w-96 bg-zinc-200 dark:bg-zinc-700 border-r border-gray-300 dark:border-zinc-700 flex-shrink-0 overflow-auto z-10 sm:relative">
            {/* On mobile: full screen overlay with proper positioning */}
            <div className="static xs:max-w-full max-w-[250px] inset-0 sm:inset-auto bg-zinc-200 dark:bg-zinc-700 sm:bg-transparent sm:dark:bg-transparent pt-16 sm:pt-0">
              <div className="p-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  About localhostGPT
                </h2>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                  This demo features <strong>localhostGPT</strong>, a desktop and mobile app designed for running chatbots and other AI tools. 
                  By leveraging Tensorlink to offload compute across peers, localhostGPT combines cloud-level performance while giving you more control of your models and data.
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                  <strong>Note:</strong> This website feature is a demonstration of the app, and many of the features you might expect from a chatbot are not available in this website format.
                  If you're interested in learning more or getting involved, feel free to explore the GitHub link below.
                </p>
                <div className="flex flex-col space-y-3">
                  <a 
                    href="https://github.com/mattjhawken/localhostgpt" 
                    className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-medium rounded-lg text-sm flex items-center gap-2 shadow-md"
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <Github size={16} />
                    <span>GitHub Repository</span>
                  </a>
                  <Link 
                    to="/tensorlink"
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg text-sm flex items-center gap-2 shadow-md"
                  >
                    <ArrowLeft size={16} />
                    <span>Back to Home</span>
                  </Link>
                </div>
                
                {/* Mobile-only close button */}
                <button 
                  onClick={toggleInfo}
                  className="mt-6 sm:hidden w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white font-medium rounded-lg text-sm flex items-center justify-center gap-2"
                >
                  <X size={16} />
                  <span>Close panel</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Settings modal - conditionally rendered */}
        {showSettings && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-zinc-100 dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
              <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Model Settings</h3>
                <button onClick={toggleSettings} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                  <X size={20} />
                </button>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Model</label>
                  <select 
                    value={modelParams.model}
                    onChange={(e) => updateModelParam('model', e.target.value)}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-slate-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="Qwen/Qwen2.5-7B-Instruct">Qwen 2.5 7B Instruct</option>
                    {/* <option value="meta-llama/Llama-2-7b-chat-hf">Llama 2 7B Chat</option>
                    <option value="mistralai/Mistral-7B-Instruct-v0.2">Mistral 7B Instruct</option> */}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Temperature: {modelParams.temperature}
                  </label>
                  <input 
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.1"
                    value={modelParams.temperature}
                    onChange={(e) => updateModelParam('temperature', parseFloat(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>More precise</span>
                    <span>More creative</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Max New Tokens: {modelParams.maxNewTokens}
                  </label>
                  <input 
                    type="range"
                    min="128"
                    max="1024"
                    step="128"
                    value={modelParams.maxNewTokens}
                    onChange={(e) => updateModelParam('maxNewTokens', parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
                
                <div className="flex items-center">
                  <input
                    id="doSample"
                    type="checkbox"
                    checked={modelParams.doSample}
                    onChange={(e) => updateModelParam('doSample', e.target.checked)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="doSample" className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Enable sampling
                  </label>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Number of Beams: {modelParams.numBeams}
                  </label>
                  <input 
                    type="range"
                    min="1"
                    max="4"
                    step="1"
                    value={modelParams.numBeams}
                    onChange={(e) => updateModelParam('numBeams', parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
              <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                <button 
                  onClick={toggleSettings}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg text-sm"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Chat container - Takes remaining space */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          {/* Messages area - Scrollable */}
          <div 
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-4 bg-gray-200 dark:bg-zinc-900"
          >
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center text-gray-500 dark:text-gray-400 p-6 bg-zinc-200 dark:bg-gray-800 rounded-lg border border-gray-400 dark:border-gray-700 max-w-md mx-auto">
                  <h3 className="text-xl font-bold mb-2">Welcome to localhostGPT!</h3>
                  <p className="text-sm">This is a demo that runs <code>{modelParams.model.split('/').pop()}</code> on distributed resources. Conversations can be powerful, but it's best to keep interactions short and hit the reset button occasionally.  </p>
                  <div className="mt-4 flex gap-2 justify-center">
                    {!infoVisible && (
                      <button 
                        onClick={toggleInfo}
                        className="px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white font-medium rounded-lg text-sm inline-flex items-center gap-2"
                      >
                        <Menu size={16} />
                        <span>Learn more</span>
                      </button>
                    )}
                    <button 
                      onClick={toggleSettings}
                      className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg text-sm inline-flex items-center gap-2"
                    >
                      <Settings size={16} />
                      <span>Model settings</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3 max-w-3xl mx-auto">
                {messages.map((message, index) => (
                  <div 
                    key={index} 
                    className={`p-3 rounded-lg ${
                      message.role === "user" 
                        ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white ml-auto max-w-[80%]" 
                        : `${message.isError ? "bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800" : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"} dark:text-gray-300 mr-auto max-w-[80%]`
                    } relative group`}
                  >
                    {/* Message header */}
                    <div className={`text-xs font-medium mb-1 ${
                      message.role === "user" 
                        ? "text-blue-100" 
                        : "text-gray-500 dark:text-gray-400"
                    }`}>
                      {message.role === "user" ? "You" : modelParams.model.split('/').pop().split('-')[0]}
                    </div>
                    
                    <div className={`text-md ${message.role === "assistant" ? "" : ""}`}>
                      {message.role === "assistant" 
                        ? formatMessageContent(message.content)
                        : message.content}
                    </div>
                    
                    {/* Message metadata and actions */}
                    <div className={`flex justify-between items-center mt-2 pt-2 text-xs ${
                      message.role === "user" 
                        ? "text-blue-100" 
                        : "text-gray-500 dark:text-gray-400"
                    }`}>
                      <span>{message.timestamp ? formatTimestamp(message.timestamp) : ""}</span>
                      
                      {message.role === "assistant" && (
                        <button
                          onClick={() => copyToClipboard(message.content, index)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Copy message"
                        >
                          {copiedIndex === index ? <CheckCheck size={14} /> : <Copy size={14} />}
                        </button>
                      )}
                    </div>
                    
                    {/* Error indicator */}
                    {message.isError && (
                      <div className="absolute top-2 right-2">
                        <AlertCircle size={16} className="text-red-500" />
                      </div>
                    )}
                  </div>
                ))}
                
                {/* Loading indicator */}
                {isLoading && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 mr-auto max-w-[80%]">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                      <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                    </div>
                    <span className="text-sm text-gray-500">Processing query on {modelParams.model.split('/').pop()}...</span>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Input form - Fixed at bottom */}
          <div className="p-3 py-5 border-t border-gray-300 dark:border-gray-700 bg-zinc-200 dark:bg-zinc-800">
            <form onSubmit={handleSendMessage} className="flex gap-2 max-w-3xl mx-auto">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onFocus={handleInputFocus}
                placeholder="Ask something..."
                className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || input.trim() === ""}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white p-3 rounded-lg disabled:opacity-50 flex-shrink-0"
                title="Send message"
              >
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocalhostGPT;
