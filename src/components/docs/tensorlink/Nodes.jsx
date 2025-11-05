import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { NavButton } from "../..";

const privateNetworkExample = `from tensorlink import UserNode, ValidatorNode, WorkerNode, DistributedModel
import torch, logging, time
from transformers import AutoTokenizer

# Local setup parameters
LOCAL = True          # Force localhost-only connections (127.0.0.1)
UPNP = not LOCAL      # Disable UPnP to prevent external exposure
OFFCHAIN = LOCAL      # Use off-chain job coordination (fully private)

model_name = 'TinyLlama/TinyLlama-1.1B-Chat-v1.0'

# Run on Device 1
user = UserNode(upnp=UPNP, off_chain_test=OFFCHAIN, local_test=LOCAL, print_level=logging.DEBUG)

# Run on Device 1 (will remove the need for also spawning a validator soon!)
validator = ValidatorNode(upnp=UPNP, off_chain_test=OFFCHAIN, local_test=LOCAL, print_level=logging.DEBUG)

# Run on Device 2+
worker = WorkerNode(upnp=UPNP, off_chain_test=OFFCHAIN, local_test=LOCAL, print_level=logging.DEBUG)

# Connect worker and user to validator manually
val_key, val_host, val_port = validator.send_request("info", None)  # Get device information

# Connected to main device for each other device
worker.connect_node(val_host, val_port, node_id=val_key)
user.connect_node(val_host, val_port, node_id=val_key)

# Request a distributed inference model
distributed_model = DistributedModel(model_name, training=False, node=user)
tokenizer = AutoTokenizer.from_pretrained(model_name)

# Perform local inference loop on the user's device
for _ in range(5):
    input_text = "You: Hello Bot."
    inputs = tokenizer(input_text, return_tensors="pt", padding=True, truncation=True)
    with torch.no_grad():
        outputs = distributed_model.generate(
            inputs,
            max_new_tokens=256,
            temperature=0.7,
            eos_token_id=tokenizer.eos_token_id,
            do_sample=True
        )
    print("Bot:", tokenizer.decode(outputs[0], skip_special_tokens=True))

# Shutdown
user.cleanup()
worker.cleanup()
validator.cleanup()`;

const Nodes = () => (
  <section className="px-5 md:px-10 flex flex-col border-t dark:border-neutral-800 border-neutral-200 items-center h-full">
    <div className="text-left py-7 max-w-[1200px] w-full">

      {/* Title */}
      <div className="pb-4 mb-4 border-b dark:border-neutral-800 border-neutral-200">
        <h1 className="text-4xl font-bold dark:text-white text-neutral-900 mb-2">
          Nodes & Communication
        </h1>
        <p className="text-lg dark:text-neutral-400 text-neutral-600">
          Local, private, and public networks for collaborative ML workflows
        </p>
      </div>

      {/* Intro */}
      <div className="mb-12">
        <p className="text-base leading-relaxed dark:text-neutral-300 text-neutral-700">
          Tensorlink enables secure, distributed computing across local, private, and public networks. 
          Each node—whether a <strong>User</strong>, <strong>Worker</strong>, or <strong>Validator</strong>—plays a role 
          in powering collaborative machine learning workflows.
        </p>
        <p className="text-base leading-relaxed dark:text-neutral-300 text-neutral-700 mt-4">
          By default, the <code className="bg-neutral-100 dark:bg-neutral-900 px-2 py-0.5 rounded font-mono text-sm">DistributedModel</code> 
          spawns a User node in the background, automatically connecting to Tensorlink's public GPU resources. 
          Nodes can also be customized for local and private workloads.
        </p>
      </div>

      {/* Node Types */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold dark:text-white text-neutral-900 mb-3 pb-2 border-b dark:border-neutral-800 border-neutral-200">
          Node Types
        </h2>
        <p className="text-base leading-relaxed dark:text-neutral-300 text-neutral-700 mb-4">
          Tensorlink provides three primary node classes for distributed machine learning workflows. 
          Nodes can operate on a public, contract-secured network for shared access, or on a private 
          network for localized jobs.
        </p>
        <ul className="list-disc pl-6 text-base dark:text-neutral-300 text-neutral-700 space-y-2">
          <li>
            <code className="bg-neutral-100 dark:bg-neutral-900 px-1 rounded font-mono">UserNode</code> – Initiates jobs 
            and coordinates distributed model communication.
          </li>
          <li>
            <code className="bg-neutral-100 dark:bg-neutral-900 px-1 rounded font-mono">WorkerNode</code> – Processes model 
            segments and provides training or inference outputs to the UserNode.
          </li>
          <li>
            <code className="bg-neutral-100 dark:bg-neutral-900 px-1 rounded font-mono">ValidatorNode</code> – Ensures 
            security, validates tasks, and upholds network integrity.
          </li>
        </ul>
      </div>

      {/* Private Example */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold dark:text-white text-neutral-900 mb-3 pb-2 border-b dark:border-neutral-800 border-neutral-200">
          Private Workload Example
        </h2>
        <p className="text-base leading-relaxed dark:text-neutral-300 text-neutral-700 mb-4">
          The following example demonstrates how nodes can interact for a fully private job on a group of devices, 
          simulated in the same script for simplicity:
        </p>
        <div className="w-full overflow-x-auto">
          <div className="max-w-[90vw] sm:max-w-[600px] md:max-w-full mx-auto rounded-lg">
            <SyntaxHighlighter
              language="python"
              style={vscDarkPlus}
              className="text-xs sm:text-sm md:text-base p-2 sm:p-4 rounded-lg"
            >
              {privateNetworkExample}
            </SyntaxHighlighter>
          </div>
        </div>
      </div>
    </div>

    {/* Navigation */}
    <div className="flex mt-8 mb-10 justify-between max-w-[1200px] w-full pt-8 border-t dark:border-neutral-800 border-neutral-200">
      <NavButton className="text-left" title="Inference APIs" subtitle="Previous" page="tensorlink/docs/api" />
      <NavButton className="text-right" title="Mining" subtitle="Next" page="tensorlink/docs/mining" />
    </div>
  </section>
);

export default Nodes;
