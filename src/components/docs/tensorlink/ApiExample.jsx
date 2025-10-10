import React from "react";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import styles, { layout } from "../../../style";
import { NavButton } from "../..";

const codeStringPythonApi = `import requests

https_serv = "https://smartnodes-lab.ddns.net/tensorlink-api"  # May not work with all clients 
http_serv = "http://smartnodes-lab.ddns.net:443/tensorlink-api"  # Use this if HTTPS fails

payload = {
    "hf_name": "Qwen/Qwen3-8B",
    "message": "Describe the role of AI in medicine.",
    "max_length": 1024,
    "max_new_tokens": 256,
    "temperature": 0.7,
    "do_sample": True,
    "num_beams": 4,
    "history": [
        {"role": "user", "content": "What is artificial intelligence?"},
        {"role": "assistant", "content": "Artificial intelligence refers to..."}
    ]
}

response = requests.post(f"{http_serv}/generate", json=payload)
print(response.json())`;

const codeStringJavaScriptApi = `// Available endpoints (status may vary):
const https_serv = "https://smartnodes-lab.ddns.net/tensorlink-api";  // May not work with all clients
const http_serv = "http://smartnodes-lab.ddns.net:443/tensorlink-api"; // Use this if HTTPS fails

const response = await fetch(http_serv + '/generate', {
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

const result = await response.json();
console.log(result);`;

const ApiExample = () => (
  <section className="px-5 md:px-10 flex flex-col border-t dark:border-neutral-800 border-neutral-200 items-center h-full">
    <div className="text-left py-7 max-w-[1200px] w-full">

      {/* Page Title */}
      <div className="pb-4 mb-4 border-b dark:border-neutral-800 border-neutral-200">
        <h1 className="text-4xl font-bold dark:text-white text-neutral-900 mb-2">
          Inference APIs with Tensorlink
        </h1>
        <p className="text-lg dark:text-neutral-400 text-neutral-600">
          Lightweight APIs for distributed inference
        </p>
      </div>

      {/* Intro */}
      <div className="mb-12">
        <p className="text-base leading-relaxed dark:text-neutral-300 text-neutral-700 mb-4">
          Tensorlink provides a lightweight API for distributed inference, 
          offering on-demand access to pre-trained Hugging Face models. 
          Both free and paid inference options are supported. The public 
          model list is maintained on our GitHub and updated regularly.
        </p>wq3
      </div>

      {/* Example: Python */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold dark:text-white text-neutral-900 mb-4 pb-2 border-b dark:border-neutral-800 border-neutral-200">
          Example: Python (requests)
        </h2>
        <SyntaxHighlighter
          language="python"
          style={vscDarkPlus}
          className="rounded-lg text-sm sm:text-base"
        >
          {codeStringPythonApi}
        </SyntaxHighlighter>
      </div>

      {/* Example: JavaScript */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold dark:text-white text-neutral-900 mb-4 pb-2 border-b dark:border-neutral-800 border-neutral-200">
          Example: JavaScript (fetch)
        </h2>
        <SyntaxHighlighter
          language="javascript"
          style={vscDarkPlus}
          className="rounded-lg text-sm sm:text-base"
        >
          {codeStringJavaScriptApi}
        </SyntaxHighlighter>
      </div>

      {/* Parameters Table */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold dark:text-white text-neutral-900 mb-4 pb-2 border-b dark:border-neutral-800 border-neutral-200">
          API Parameters
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-800">
            <thead>
              <tr>
                <th className="px-3 py-3 text-left text-sm font-semibold dark:text-neutral-200 text-neutral-900">Field</th>
                <th className="px-3 py-3 text-left text-sm font-semibold dark:text-neutral-200 text-neutral-900">Type</th>
                <th className="px-3 py-3 text-left text-sm font-semibold dark:text-neutral-200 text-neutral-900">Required</th>
                <th className="px-3 py-3 text-left text-sm font-semibold dark:text-neutral-200 text-neutral-900">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800 text-sm dark:text-neutral-300 text-neutral-700">
            <tr>
              <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm dark:text-gray-300 text-gray-700"><code className="bg-gray-200 dark:bg-gray-800 px-1 py-0.5 rounded">hf_name</code></td>
              <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm dark:text-gray-300 text-gray-700">string</td>
              <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm dark:text-gray-300 text-gray-700">✓</td>
              <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm dark:text-gray-300 text-gray-700">Name of the Hugging Face model</td>
            </tr>
            <tr>
              <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm dark:text-gray-300 text-gray-700"><code className="bg-gray-200 dark:bg-gray-800 px-1 py-0.5 rounded">message</code></td>
              <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm dark:text-gray-300 text-gray-700">string</td>
              <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm dark:text-gray-300 text-gray-700">✓</td>
              <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm dark:text-gray-300 text-gray-700">The user's input prompt or question</td>
            </tr>
            <tr>
              <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm dark:text-gray-300 text-gray-700"><code className="bg-gray-200 dark:bg-gray-800 px-1 py-0.5 rounded">max_length</code></td>
              <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm dark:text-gray-300 text-gray-700">int</td>
              <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm dark:text-gray-300 text-gray-700">✕</td>
              <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm dark:text-gray-300 text-gray-700">Total token limit (input + output)</td>
            </tr>
            <tr>
              <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm dark:text-gray-300 text-gray-700"><code className="bg-gray-200 dark:bg-gray-800 px-1 py-0.5 rounded">max_new_tokens</code></td>
              <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm dark:text-gray-300 text-gray-700">int</td>
              <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm dark:text-gray-300 text-gray-700">✕</td>
              <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm dark:text-gray-300 text-gray-700">Maximum number of tokens to generate</td>
            </tr>
            <tr>
              <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm dark:text-gray-300 text-gray-700"><code className="bg-gray-200 dark:bg-gray-800 px-1 py-0.5 rounded">temperature</code></td>
              <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm dark:text-gray-300 text-gray-700">float</td>
              <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm dark:text-gray-300 text-gray-700">✕</td>
              <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm dark:text-gray-300 text-gray-700">Sampling temperature (e.g., <code className="bg-gray-200 dark:bg-gray-800 px-1 py-0.5 rounded">0.7</code> = more creative)</td>
            </tr>
            <tr>
              <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm dark:text-gray-300 text-gray-700"><code className="bg-gray-200 dark:bg-gray-800 px-1 py-0.5 rounded">do_sample</code></td>
              <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm dark:text-gray-300 text-gray-700">boolean</td>
              <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm dark:text-gray-300 text-gray-700">✕</td>
              <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm dark:text-gray-300 text-gray-700">Whether to sample (<code className="bg-gray-200 dark:bg-gray-800 px-1 py-0.5 rounded">True</code>) or use greedy decoding</td>
            </tr>
            <tr>
              <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm dark:text-gray-300 text-gray-700"><code className="bg-gray-200 dark:bg-gray-800 px-1 py-0.5 rounded">num_beams</code></td>
              <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm dark:text-gray-300 text-gray-700">int</td>
              <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm dark:text-gray-300 text-gray-700">✕</td>
              <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm dark:text-gray-300 text-gray-700">Beam search width (<code className="bg-gray-200 dark:bg-gray-800 px-1 py-0.5 rounded">1</code> for greedy, <code className="bg-gray-200 dark:bg-gray-800 px-1 py-0.5 rounded">&gt;1</code> for diversity)</td>
            </tr>
            <tr>
              <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm dark:text-gray-300 text-gray-700"><code className="bg-gray-200 dark:bg-gray-800 px-1 py-0.5 rounded">history</code></td>
              <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm dark:text-gray-300 text-gray-700">array</td>
              <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm dark:text-gray-300 text-gray-700">✕</td>
              <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm dark:text-gray-300 text-gray-700">Conversation history (<code className="bg-gray-200 dark:bg-gray-800 px-1 py-0.5 rounded"></code>)</td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Notes */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 mb-12">
        <p className="text-sm dark:text-blue-200 text-blue-800 font-medium mb-2">
          Notes
        </p>
        <ul className="list-disc pl-6 text-sm dark:text-blue-200 text-blue-800 space-y-1">
          <li>Currently limited to select Hugging Face models</li>
          <li>Custom model support coming soon</li>
          <li>Keep histories concise for faster response</li>
          <li>Performance depends on network/node availability</li>
        </ul>
      </div>
    </div>

    {/* Navigation */}
    <div className="flex mt-8 mb-10 justify-between max-w-[1200px] w-full pt-8 border-t dark:border-neutral-800 border-neutral-200">
      <NavButton className="text-left" title="Models" subtitle="Previous" page="tensorlink/docs/model" />
      <NavButton className="text-right" title="Nodes" subtitle="Next" page="tensorlink/docs/nodes" />
    </div>
  </section>
);

export default ApiExample;
