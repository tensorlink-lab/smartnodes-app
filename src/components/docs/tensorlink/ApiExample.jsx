import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { NavButton } from "../..";

const codeSimple = `import requests

response = requests.post(
    "http://localhost:64747/v1/generate",
    json={
        "hf_name": "Qwen/Qwen2.5-7B-Instruct",
        "message": "Explain quantum computing in one sentence.",
        "max_new_tokens": 50,
        "temperature": 0.7,
        "top_p": 0.95,
        "stream": False,
    }
)

result = response.json()
print(result["generated_text"])`;

const codeStreaming = `import requests

response = requests.post(
    "http://localhost:64747/v1/generate",
    json={
        "hf_name": "Qwen/Qwen2.5-7B-Instruct",
        "message": "Write a haiku about distributed computing.",
        "max_new_tokens": 100,
        "stream": True,
    },
    stream=True,
)

print("Response: ", end="", flush=True)
for line in response.iter_lines():
    if line:
        decoded = line.decode()
        if decoded.strip() == "data: [DONE]":
            break
        if decoded.startswith("data: "):
            token = decoded[6:]
            print(token, end="", flush=True)
print()`;

const codeChat = `import requests

response = requests.post(
    "http://localhost:64747/v1/chat/completions",
    json={
        "model": "Qwen/Qwen2.5-7B-Instruct",
        "messages": [
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": "What are the benefits of distributed computing?"}
        ],
        "max_tokens": 150,
        "temperature": 0.8,
        "stream": False
    }
)

result = response.json()
print(result["choices"][0]["message"]["content"])`;

const codePreload = `import requests

# Request model be loaded across the network
requests.post(
    "http://localhost:64747/request-model",
    json={
        "hf_name": "Qwen/Qwen2.5-7B-Instruct",
        "model_type": "causal"
    }
)

# Subsequent inference is faster
response = requests.post(
    "http://localhost:64747/v1/generate",
    json={
        "hf_name": "Qwen/Qwen2.5-7B-Instruct",
        "message": "Hello!",
        "max_new_tokens": 50
    }
)

print(response.json()["generated_text"])`;

const ApiExample = () => (
  <section className="px-5 md:px-10 flex flex-col border-t dark:border-neutral-800 border-neutral-200 items-center h-full">
    <div className="text-left py-7 max-w-[1200px] w-full">
      {/* Navigation */}
      <div className="flex mb-10 justify-between max-w-[1200px] w-full">
        <div className="text-left">
          <div className="text-sm dark:text-neutral-500 text-neutral-500 mb-1">Previous</div>
          <a href="/tensorlink/docs/install" className="text-sm sm:text-base font-medium dark:text-blue-400 text-blue-600 hover:underline">
            Getting Started
          </a>
        </div>
        <div className="text-right">
          <div className="text-sm dark:text-neutral-500 text-neutral-500 mb-1">Next</div>
          <a href="/tensorlink/docs/model" className="text-sm sm:text-base font-medium dark:text-blue-400 text-blue-600 hover:underline">
            Distributed Models
          </a>
        </div>
      </div>
      {/* Title */}
      <div className="pb-4 mb-6 border-b dark:border-neutral-800 border-neutral-200">
        <h1 className="text-2xl font-bold dark:text-white text-neutral-900 mb-2">
          Inference APIs with Tensorlink
        </h1>
        <p className="text-lg dark:text-neutral-400 text-neutral-600">
          OpenAI-compatible and native HTTP APIs for distributed inference.
        </p>
      </div>

      {/* Intro */}
      <div className="mb-12">
        <p className="text-base leading-relaxed dark:text-neutral-300 text-neutral-700">
          Tensorlink exposes lightweight HTTP APIs for running Hugging Face models
          across a decentralized network. You can use simple generation,
          streaming responses, or OpenAI-compatible chat completions for easy
          integration with existing tooling.
        </p>
      </div>

      {/* Simple */}
      <div className="mb-12">
        <h2 className="text-lg font-semibold dark:text-white text-neutral-900 mb-3 pb-2 border-b dark:border-neutral-800 border-neutral-200">
          Simple Generation
        </h2>
        <SyntaxHighlighter language="python" style={vscDarkPlus} className="rounded-lg">
          {codeSimple}
        </SyntaxHighlighter>
      </div>

      {/* Streaming */}
      <div className="mb-12">
        <h2 className="text-lg font-semibold dark:text-white text-neutral-900 mb-3 pb-2 border-b dark:border-neutral-800 border-neutral-200">
          Streaming Tokens (SSE)
        </h2>
        <SyntaxHighlighter language="python" style={vscDarkPlus} className="rounded-lg">
          {codeStreaming}
        </SyntaxHighlighter>
      </div>

      {/* Chat */}
      <div className="mb-12">
        <h2 className="text-lg font-semibold dark:text-white text-neutral-900 mb-3 pb-2 border-b dark:border-neutral-800 border-neutral-200">
          OpenAI-Compatible Chat
        </h2>
        <SyntaxHighlighter language="python" style={vscDarkPlus} className="rounded-lg">
          {codeChat}
        </SyntaxHighlighter>
      </div>

      {/* Preload */}
      <div className="mb-12">
        <h2 className="text-lg font-semibold dark:text-white text-neutral-900 mb-3 pb-2 border-b dark:border-neutral-800 border-neutral-200">
          Model Preloading
        </h2>
        <SyntaxHighlighter language="python" style={vscDarkPlus} className="rounded-lg">
          {codePreload}
        </SyntaxHighlighter>
      </div>

      {/* Params */}
      <div className="mb-12">
        <h2 className="text-lg font-semibold dark:text-white text-neutral-900 mb-3 pb-2 border-b dark:border-neutral-800 border-neutral-200">
          Common Parameters
        </h2>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-800">
            <thead>
              <tr>
                <th className="px-3 py-3 text-left text-sm sm:text-base dark:text-neutral-300 text-neutral-700 font-semibold">Field</th>
                <th className="px-3 py-3 text-left text-sm sm:text-base dark:text-neutral-300 text-neutral-700 font-semibold">Type</th>
                <th className="px-3 py-3 text-left text-sm sm:text-base dark:text-neutral-300 text-neutral-700 font-semibold">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800 text-sm">
              {[
                ["hf_name / model", "string", "Hugging Face model identifier"],
                ["message", "string", "Input prompt for generation"],
                ["messages", "array", "Chat message list (OpenAI format)"],
                ["max_new_tokens", "int", "Maximum tokens to generate"],
                ["temperature", "float", "Sampling temperature"],
                ["top_p", "float", "Nucleus sampling probability"],
                ["stream", "boolean", "Enable token streaming"],
              ].map(([a,b,c])=>(
                <tr key={a} className="text-sm sm:text-base dark:text-neutral-300 text-neutral-700">
                  <td className="px-3 py-3"><code className="bg-gray-200 dark:bg-gray-800 px-1 rounded">{a}</code></td>
                  <td className="px-3 py-3">{b}</td>
                  <td className="px-3 py-3">{c}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>

    {/* Navigation */}
    <div className="flex mt-8 mb-10 justify-between max-w-[1200px] w-full pt-8 border-t dark:border-neutral-800 border-neutral-200">
      <div className="text-left">
        <div className="text-sm dark:text-neutral-500 text-neutral-500 mb-1">Previous</div>
        <a href="/tensorlink/docs/install" className="text-sm sm:text-base font-medium dark:text-blue-400 text-blue-600 hover:underline">
          Getting Started
        </a>
      </div>
      <div className="text-right">
        <div className="text-sm dark:text-neutral-500 text-neutral-500 mb-1">Next</div>
        <a href="/tensorlink/docs/model" className="text-sm sm:text-base font-medium dark:text-blue-400 text-blue-600 hover:underline">
          Distributed Models
        </a>
      </div>
    </div>
  </section>
);

export default ApiExample;
