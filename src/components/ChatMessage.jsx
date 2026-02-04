import React from "react";
import { Copy } from "lucide-react";
import ReactMarkdown from "react-markdown";

// ChatMessage component with ReactMarkdown
const ChatMessage = ({ content, onCopy }) => {
  return (
    <div className="prose prose-sm dark:prose-invert max-w-none">
      <ReactMarkdown
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            const language = match ? match[1] : '';
            
            if (!inline) {
              return (
                <div className="relative group my-3">
                  <div className="flex justify-between items-center bg-gray-700 px-3 py-1 rounded-t-md">
                    <span className="text-xs text-gray-300">{language || 'code'}</span>
                    <button
                      onClick={() => onCopy?.(String(children))}
                      className="text-gray-400 hover:text-white transition-colors"
                      title="Copy code"
                    >
                      <Copy size={14} />
                    </button>
                  </div>
                  <pre className="bg-gray-800 rounded-b-md p-3 overflow-x-auto mt-0">
                    <code className="text-green-400 text-sm" {...props}>
                      {children}
                    </code>
                  </pre>
                </div>
              );
            }
            
            return (
              <code className="bg-gray-700 dark:bg-gray-600 px-1.5 py-0.5 rounded text-sm" {...props}>
                {children}
              </code>
            );
          },
          
          a({ children, href, ...props }) {
            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 underline"
                {...props}
              >
                {children}
              </a>
            );
          },
          
          ul({ children, ...props }) {
            return <ul className="list-disc list-inside space-y-1 my-2" {...props}>{children}</ul>;
          },
          
          ol({ children, ...props }) {
            return <ol className="list-decimal list-inside space-y-1 my-2" {...props}>{children}</ol>;
          },
          
          p({ children, ...props }) {
            return <p className="mb-2 last:mb-0" {...props}>{children}</p>;
          },
          
          h1({ children, ...props }) {
            return <h1 className="text-xl font-bold mt-3 mb-2" {...props}>{children}</h1>;
          },
          
          h2({ children, ...props }) {
            return <h2 className="text-lg font-bold mt-3 mb-2" {...props}>{children}</h2>;
          },
          
          h3({ children, ...props }) {
            return <h3 className="text-md font-bold mt-2 mb-1" {...props}>{children}</h3>;
          },
          
          blockquote({ children, ...props }) {
            return (
              <blockquote className="border-l-4 border-gray-500 pl-3 italic my-2" {...props}>
                {children}
              </blockquote>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default ChatMessage;
