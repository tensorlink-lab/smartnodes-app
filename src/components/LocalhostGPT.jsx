import React, { useState, useEffect, useRef } from "react";
import { Send, RefreshCw, X, Github, Copy, CheckCheck, Settings, Trash2 } from "lucide-react";
import { ChatMessage } from "./.";

const LocalhostGPT = ({ onClose }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modelParams, setModelParams] = useState({
    model: "Qwen/Qwen2.5-7B-Instruct",
    temperature: 0.7,
    maxTokens: 4096,
    topP: 1.0,
    stream: true
  });
  const [showSettings, setShowSettings] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const chatContainerRef = useRef(null);
  const textareaRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Load conversation when component mounts
  useEffect(() => {
    const savedMessages = localStorage.getItem("localhostGPTHistory");
    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages));
      } catch (e) {
        console.error("Failed to parse saved messages:", e);
        localStorage.removeItem("localhostGPTHistory");
      }
    }
    
    const savedParams = localStorage.getItem("localhostGPTParams");
    if (savedParams) {
      try {
        setModelParams(JSON.parse(savedParams));
      } catch (e) {
        console.error("Failed to parse saved parameters:", e);
      }
    }
  }, []);

  // Save messages 
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("localhostGPTHistory", JSON.stringify(messages));
    }
  }, [messages]);

  // Save model parameters when changed
  useEffect(() => {
    localStorage.setItem("localhostGPTParams", JSON.stringify(modelParams));
  }, [modelParams]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [input]);

  // Handle sending a message with streaming
  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (input.trim() === "" || isLoading) return;

    const userMessage = {
      role: "user",
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);
    setError(null);

    try {
      const messagesPayload = updatedMessages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const response = await fetch(
        "https://smartnodes.ddns.net/tensorlink-api/v1/chat/completions",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: modelParams.model,
            messages: messagesPayload,
            max_tokens: modelParams.maxTokens,
            temperature: modelParams.temperature,
            top_p: modelParams.topP,
            stream: modelParams.stream,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      if (!modelParams.stream) {
        const data = await response.json();
        const assistantContent = data.choices?.[0]?.message?.content || "No response";
        
        setMessages([...updatedMessages, {
          role: "assistant",
          content: assistantContent,
          timestamp: new Date().toISOString(),
        }]);
      } else {
        let assistantIndex;
        setMessages((prev) => {
          assistantIndex = prev.length;
          return [
            ...prev,
            {
              role: "assistant",
              content: "",
              timestamp: new Date().toISOString(),
              streaming: true,
            },
          ];
        });

        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");

        let buffer = "";
        let done = false;

        while (!done) {
          const { value, done: doneReading } = await reader.read();
          done = doneReading;

          if (value) {
            buffer += decoder.decode(value, { stream: true });

            const lines = buffer.split("\n");
            buffer = lines.pop();

            for (const line of lines) {
              if (!line.startsWith("data: ")) continue;

              const data = line.slice(6).trim();

              if (data === "[DONE]") {
                setIsLoading(false);
                return;
              }

              try {
                const json = JSON.parse(data);
                const token = json.choices?.[0]?.delta?.content;

                if (token) {
                  setMessages((prev) => {
                    const next = [...prev];
                    next[assistantIndex] = {
                      ...next[assistantIndex],
                      content: next[assistantIndex].content + token,
                    };
                    return next;
                  });
                }
              } catch (err) {
                console.warn("Stream parse error:", err);
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("Streaming error:", error);
      setError(error.message);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Sorry, I had trouble connecting... Your browser may be blocking requests from Tensorlink.\n\nError: ${error.message}`,
          timestamp: new Date().toISOString(),
          isError: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset the conversation
  const handleReset = () => {
    if (messages.length > 0 && !confirm("Are you sure you want to clear the conversation?")) {
      return;
    }
    setMessages([]);
    setError(null);
    localStorage.removeItem("localhostGPTHistory");
  };

  // Update model parameters
  const updateModelParam = (param, value) => {
    setModelParams(prev => ({
      ...prev,
      [param]: value
    }));
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

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="flex justify-between items-center px-3 py-2.5 sm:px-4 sm:py-3 border-b border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm flex-shrink-0">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <h1 className="text-base sm:text-xl font-bold text-gray-900 dark:text-white truncate">localhostGPT</h1>
          <span className="hidden xs:block text-xs bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded-full text-gray-600 dark:text-gray-300 whitespace-nowrap">
            {modelParams.model.split('/').pop().replace('-Instruct', '')}
          </span>
        </div>
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          <button 
            onClick={handleReset} 
            className="p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-600 dark:text-gray-300"
            title="Reset conversation"
          >
            <RefreshCw size={14} />
          </button>
          <button 
            onClick={() => setShowSettings(true)}
            className="p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Settings"
          >
            <Settings size={18} className="text-gray-600 dark:text-gray-300" />
          </button>
          <button 
            onClick={onClose}
            className="p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Close"
          >
            <X size={18} className="text-gray-600 dark:text-gray-300" />
          </button>
        </div>
      </header>

      {/* Settings modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-gray-800 flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700 z-10">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Model Settings</h3>
              <button onClick={() => setShowSettings(false)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                <X size={20} />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Model</label>
                <select 
                  value={modelParams.model}
                  onChange={(e) => updateModelParam('model', e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="Qwen/Qwen2.5-7B-Instruct">Qwen 2.5 7B</option>
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
                  <span>Precise</span>
                  <span>Creative</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Max Tokens: {modelParams.maxTokens}
                </label>
                <input 
                  type="range"
                  min="128"
                  max="4096"
                  step="128"
                  value={modelParams.maxTokens}
                  onChange={(e) => updateModelParam('maxTokens', parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Top P: {modelParams.topP}
                </label>
                <input 
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.1"
                  value={modelParams.topP}
                  onChange={(e) => updateModelParam('topP', parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>

              <div className="flex items-center">
                <input
                  id="stream"
                  type="checkbox"
                  checked={modelParams.stream}
                  onChange={(e) => updateModelParam('stream', e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="stream" className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Enable streaming
                </label>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <button 
                  onClick={handleReset}
                  className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg text-sm flex items-center justify-center gap-2"
                >
                  <Trash2 size={16} />
                  Clear Conversation
                </button>
              </div>
            </div>
            <div className="sticky bottom-0 bg-white dark:bg-gray-800 p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end z-10">
              <button 
                onClick={() => setShowSettings(false)}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg text-sm"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chat container */}
      <div className="flex-1 flex flex-col overflow-hidden min-h-0">
        <div 
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-3 sm:p-4 bg-gray-50 dark:bg-gray-900"
        >
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center p-4">
              <div className="text-center text-gray-500 dark:text-gray-400 p-4 sm:p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 max-w-md mx-auto">
                <h3 className="text-lg sm:text-xl font-bold mb-2 text-gray-900 dark:text-white">Welcome to localhostGPT!</h3>
                <p className="text-sm mb-3">Running <code className="bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded">{modelParams.model.split('/').pop()}</code> on distributed resources.</p>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Leveraging Tensorlink to offload compute across peers for cloud-level performance with more control.
                </p>
                <div className="mt-4 flex gap-2 justify-center flex-wrap">
                  <a 
                    href="https://github.com/mattjhawken/localhostgpt" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-3 py-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-medium rounded-lg text-sm inline-flex items-center gap-2 shadow-md"
                  >
                    <Github size={16} />
                    <span>GitHub</span>
                  </a>
                  <button 
                    onClick={() => setShowSettings(true)}
                    className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg text-sm inline-flex items-center gap-2"
                  >
                    <Settings size={16} />
                    <span>Settings</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3 max-w-4xl mx-auto">
              {messages.map((message, index) => (
                <div 
                  key={index} 
                  className={`p-3 sm:p-4 rounded-lg ${
                    message.role === "user" 
                      ? "bg-gradient-to-r from-blue-500 to-purple-500 dark:text-white ml-auto" 
                      : `${message.isError ? "bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800" : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"}`
                  } max-w-[95%] sm:max-w-[85%] relative group`}
                >
                  <div className={`text-[10px] sm:text-xs font-medium mb-2 flex items-center justify-between ${
                    message.role === "user" 
                      ? "text-blue-100"
                      : "text-gray-500 dark:text-gray-400"
                  }`}>
                    <span>{message.role === "user" ? "You" : modelParams.model.split('/').pop().split('-')[0]}</span>
                    <span className="text-[10px] sm:text-xs">{formatTimestamp(message.timestamp)}</span>
                  </div>
                  
                  <div className="text-[12px] sm:text-base dark:text-white break-words">
                    {message.role === "assistant" ? (
                      <ChatMessage content={message.content} onCopy={copyToClipboard} />
                    ) : (
                      <div className="whitespace-pre-wrap">{message.content}</div>
                    )}
                  </div>
                  
                  {message.role === "assistant" && !message.isError && (
                    <button
                      onClick={() => copyToClipboard(message.content, index)}
                      className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                      title="Copy message"
                    >
                      {copiedIndex === index ? (
                        <CheckCheck size={14} className="text-green-500" />
                      ) : (
                        <Copy size={14} className="text-gray-500 dark:text-gray-400" />
                      )}
                    </button>
                  )}
                </div>
              ))}
              
              {isLoading && (
                <div className="flex items-center gap-2 p-3 sm:p-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 max-w-[85%]">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                    <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                  </div>
                  <span className="text-sm text-gray-500">Thinking...</span>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Input area */}
        <div className="p-3 sm:p-4 border-t border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 flex-shrink-0">
          <div className="flex gap-2 max-w-4xl mx-auto items-end">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask something..."
              rows={1}
              className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none min-h-[44px] max-h-[120px]"
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || input.trim() === ""}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white p-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 h-[44px] w-[44px] flex items-center justify-center"
              title="Send message"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocalhostGPT;
