import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

const basicUsage = `from tensorlink.ml import DistributedModel
from transformers import AutoTokenizer

MODEL_NAME = "Qwen/Qwen3-14B"

# Initialize distributed model on the public network
model = DistributedModel(
    model=MODEL_NAME,
    training=False
)

# Tokenize input
tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
inputs = tokenizer("Explain the theory of relativity.", return_tensors="pt")

# Generate response (distributed execution)
outputs = model.generate(**inputs, max_new_tokens=100)
response = tokenizer.decode(outputs[0], skip_special_tokens=True)

print(response)`;

const trainingExample = `
# Create distributed optimizer
optimizer = distributed_model.create_optimizer(
    lr=0.001,
    weight_decay=0.01,
    optimizer_type="adamw"  # Supports: adam, adamw, sgd
)

# Standard PyTorch training loop
tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
train_loader = DataLoader(your_dataset, batch_size=8)

for epoch in range(3):
    for batch in train_loader:
        inputs = tokenizer(batch["text"], return_tensors="pt", padding=True)
        
        # Forward pass (distributed across workers)
        outputs = model(**inputs, labels=inputs["input_ids"])
        loss = outputs.loss
        
        # Backward pass (gradients aggregated across workers)
        loss.backward()
        optimizer.step()
        optimizer.zero_grad()
        
        print(f"Epoch {epoch}, Loss: {loss.item():.4f}")

# Save trained model
model.save_pretrained("./fine-tuned-model")`;

const privateCluster = `from tensorlink.ml import DistributedModel
from tensorlink.nodes import User, UserConfig
from custom_model import CustomModel

# Create node instance pointing to your private validator
node = User(
    UserConfig(
        priority_nodes=[["192.168.2.42", 38751]]  # Your validator IP and port
    )
)

# Load custom model with trusted execution
model = DistributedModel(
    model=CustomModel(),  # Can also be a path to model weights
    training=False,
    trusted=True,  # Required for custom models
    node=node      # Use private infrastructure
)

# Use like any PyTorch model
import torch
input_ids = torch.randint(0, 50000, (1, 128))
outputs = model(input_ids)`;

const checkpointExample = `# Save to local directory
model.save_pretrained("./my-fine-tuned-model")

# Or push to Hugging Face Hub
model.push_to_hub("username/model-name")`;

const generationExample = `outputs = model.generate(
    **inputs,
    max_new_tokens=256,
    temperature=0.7,
    top_p=0.95,
    top_k=50,
    do_sample=True,
    num_return_sequences=1
)`;

const ModelExample = () => (
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
          <a href="/tensorlink/docs/nodes" className="text-sm sm:text-base font-medium dark:text-blue-400 text-blue-600 hover:underline">
            Nodes
          </a>
        </div>
      </div>

      {/* Header */}
      <div className="pb-4 mb-4 border-b border-neutral-200 dark:border-neutral-800">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
          Distributed Models & Optimizers
        </h1>
        <p className="text-md text-neutral-600 dark:text-neutral-400">
          Core Tensorlink primitives: <code className="font-mono bg-neutral-100 dark:bg-neutral-900 px-1.5 py-0.5 rounded">DistributedModel</code> and{" "}
          <code className="font-mono bg-neutral-100 dark:bg-neutral-900 px-1.5 py-0.5 rounded">DistributedOptimizer</code>
        </p>
      </div>

      {/* Introduction */}
      <div className="mb-12">
        <p className="text-sm sm:text-base leading-relaxed text-neutral-700 dark:text-neutral-300 mb-4">
          Tensorlink exposes two core abstractions:{" "}
          <code className="font-mono bg-neutral-100 dark:bg-neutral-900 px-1.5 py-0.5 rounded text-sm">DistributedModel</code> and{" "}
          <code className="font-mono bg-neutral-100 dark:bg-neutral-900 px-1.5 py-0.5 rounded text-sm">DistributedOptimizer</code>.
          Together, they behave like native PyTorch components while transparently executing across remote GPU workers.
        </p>


        <p className="text-sm sm:text-base leading-relaxed text-neutral-700 dark:text-neutral-300 mb-4">
          The system handles all the complexity of distributed execution: discovering available workers, intelligently sharding 
          model layers across GPUs, orchestrating forward and backward passes, and aggregating results. From your code's perspective, 
          you're simply working with a PyTorch model that happens to execute on remote infrastructure.
        </p>

        <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg p-5">
          <p className="text-sm sm:text-base dark:text-neutral-300 text-neutral-700 mb-3">
            <strong className="dark:text-white text-neutral-900">Common Use Cases:</strong>
          </p>
          <ul className="space-y-2 text-sm sm:text-base dark:text-neutral-300 text-neutral-700">
            <li>• Running large language models (14B+ parameters) without local VRAM constraints</li>
            <li>• Fine-tuning models across distributed GPU infrastructure</li>
            <li>• Executing custom PyTorch architectures on private clusters</li>
            <li>• Prototyping with state-of-the-art models without GPU investment</li>
            <li>• Building production AI services with distributed compute backends</li>
          </ul>
        </div>
      </div>

      {/* Basic Usage */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold dark:text-white text-neutral-900 mb-3 pb-2 border-b dark:border-neutral-800 border-neutral-200">
          DistributedModel
        </h2>
        <p className="text-sm sm:text-base leading-relaxed dark:text-neutral-300 text-neutral-700 mb-4">
          <code className="bg-neutral-100 dark:bg-neutral-900 px-1.5 py-0.5 rounded text-sm font-mono">DistributedModel</code> is the
          primary interface for running PyTorch and Hugging Face models on the Tensorlink network. It supports loading models from
          Hugging Face, custom PyTorch modules, or large weight files that exceed local VRAM.
        </p>


        <SyntaxHighlighter language="python" style={vscDarkPlus} className="rounded-lg !bg-[#1e1e1e] border border-neutral-700 text-sm">
          {basicUsage}
        </SyntaxHighlighter>

        <div className="bg-neutral-50 dark:bg-neutral-900/50 border-l-4 border-blue-500 p-4 my-6">
          <p className="text-sm dark:text-neutral-300 text-neutral-700 mb-2">
            <strong className="dark:text-white text-neutral-900">What's happening behind the scenes:</strong>
          </p>
          <ul className="space-y-1 text-sm dark:text-neutral-300 text-neutral-700">
            <li>1. Tensorlink queries the network to find available worker nodes with capacity</li>
            <li>2. The model architecture is analyzed and intelligently sharded across GPU(s) if needed</li>
            <li>3. Forward passes execute across distributed workers with automatic tensor routing</li>
          </ul>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold dark:text-white text-neutral-900 mb-3">
              Key Parameters
            </h3>
            <div className="space-y-1">
              <div className="bg-neutral-50 dark:bg-neutral-900/50 p-3 rounded-lg border border-neutral-200 dark:border-neutral-800">
                <h4 className="font-mono text-sm font-semibold dark:text-blue-400 text-blue-600 mb-2">
                  model: str | torch.nn.Module
                </h4>
                <p className="text-sm dark:text-neutral-300 text-neutral-700">
                  Hugging Face model name (e.g., "gpt2"), 
                  a custom PyTorch module instance, or a path to model weights.
                </p>
              </div>

              <div className="bg-neutral-50 dark:bg-neutral-900/50 p-3 rounded-lg border border-neutral-200 dark:border-neutral-800">
                <h4 className="font-mono text-sm font-semibold dark:text-blue-400 text-blue-600 mb-2">
                  training: bool = False
                </h4>
                <p className="text-sm dark:text-neutral-300 text-neutral-700">
                  When <code className="bg-neutral-100 dark:bg-neutral-900 px-1.5 py-0.5 rounded text-sm font-mono">True</code>, enables 
                  gradient synchronization and distributed optimization. Set to <code className="bg-neutral-100 dark:bg-neutral-900 px-1.5 py-0.5 rounded text-sm font-mono">False</code> for 
                  inference-only workloads.
                </p>
              </div>

              <div className="bg-neutral-50 dark:bg-neutral-900/50 p-3 rounded-lg border border-neutral-200 dark:border-neutral-800">
                <h4 className="font-mono text-sm font-semibold dark:text-blue-400 text-blue-600 mb-2">
                  device: str = "cuda"
                </h4>
                <p className="text-sm dark:text-neutral-300 text-neutral-700">
                  Target device for worker execution. Typically <code className="bg-neutral-100 dark:bg-neutral-900 px-1.5 py-0.5 rounded text-sm font-mono">"cuda"</code> for 
                  GPU acceleration. Workers without compatible hardware will be filtered automatically.
                </p>
              </div>

              <div className="bg-neutral-50 dark:bg-neutral-900/50 p-3 rounded-lg border border-neutral-200 dark:border-neutral-800">
                <h4 className="font-mono text-sm font-semibold dark:text-blue-400 text-blue-600 mb-2">
                  trusted: bool = False
                </h4>
                <p className="text-sm dark:text-neutral-300 text-neutral-700">
                  Allows execution of custom user-supplied models. Must be set to <code className="bg-neutral-100 dark:bg-neutral-900 px-1.5 py-0.5 rounded text-sm font-mono">True</code> for 
                  custom architectures. Requires private worker nodes configured with <code className="bg-neutral-100 dark:bg-neutral-900 px-1.5 py-0.5 rounded text-sm font-mono">trusted: true</code>.
                </p>
              </div>

              <div className="bg-neutral-50 dark:bg-neutral-900/50 p-3 rounded-lg border border-neutral-200 dark:border-neutral-800">
                <h4 className="font-mono text-sm font-semibold dark:text-blue-400 text-blue-600 mb-2">
                  node: User | None = None
                </h4>
                <p className="text-sm dark:text-neutral-300 text-neutral-700">
                  Explicit node configuration for private clusters. When <code className="bg-neutral-100 dark:bg-neutral-900 px-1.5 py-0.5 rounded text-sm font-mono">None</code>, 
                  connects to the public network. See "Private Clusters" section for details.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6 mt-6">
          <div>
            <h3 className="text-lg font-semibold dark:text-white text-neutral-900 mb-3">
              Model Sharding
            </h3>
            <p className="text-sm sm:text-base leading-relaxed dark:text-neutral-300 text-neutral-700 mb-3">
              For large models that exceed a single GPU's capacity, layers are intelligently distributed 
              across multiple workers with pipeline parallelism capabilities. Tensorlink automatically determines 
              the optimal sharding strategy based on model architecture and available worker resources.
            </p>
            <p className="text-sm dark:text-neutral-400 text-neutral-600 italic">
              Manual sharding control and data parallelism options are planned for future releases.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold dark:text-white text-neutral-900 mb-3">
              Checkpointing and Persistence
            </h3>
            <p className="text-sm sm:text-base leading-relaxed dark:text-neutral-300 text-neutral-700 mb-3">
              Trained models can be saved using standard Hugging Face methods:
            </p>
            <SyntaxHighlighter language="python" style={vscDarkPlus} className="rounded-lg !bg-[#1e1e1e] border border-neutral-700 text-sm">
              {checkpointExample}
            </SyntaxHighlighter>
          </div>

          <div>
            <h3 className="text-lg font-semibold dark:text-white text-neutral-900 mb-3">
              Generation Parameters
            </h3>
            <p className="text-sm sm:text-base leading-relaxed dark:text-neutral-300 text-neutral-700 mb-3">
              For inference tasks, <code className="bg-neutral-100 dark:bg-neutral-900 px-1.5 py-0.5 rounded text-sm font-mono">model.generate()</code> supports 
              all standard Hugging Face generation parameters:
            </p>
            <SyntaxHighlighter language="python" style={vscDarkPlus} className="rounded-lg !bg-[#1e1e1e] border border-neutral-700 text-sm">
              {generationExample}
            </SyntaxHighlighter>
          </div>
        </div>
      </div>

      {/* Training */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold dark:text-white text-neutral-900 mb-3 pb-2 border-b dark:border-neutral-800 border-neutral-200">
          DistributedOptimizer
        </h2>

        <p className="text-sm sm:text-base leading-relaxed dark:text-neutral-300 text-neutral-700 mb-4">
          When <code className="bg-neutral-100 dark:bg-neutral-900 px-1.5 py-0.5 rounded text-sm font-mono">training=True</code>,
          Tensorlink enables gradient synchronization and exposes a{" "}
          <code className="bg-neutral-100 dark:bg-neutral-900 px-1.5 py-0.5 rounded text-sm font-mono">DistributedOptimizer</code>
          via <code className="bg-neutral-100 dark:bg-neutral-900 px-1.5 py-0.5 rounded text-sm font-mono">create_optimizer()</code>.
          This coordinates parameter updates across all participating workers.
        </p>

        <div className="space-y-4 mt-5">
          <div>
            <h3 className="text-lg font-semibold dark:text-white text-neutral-900 mb-3">
              DistributedOptimizer Options
            </h3>
            <p className="text-sm sm:text-base leading-relaxed dark:text-neutral-300 text-neutral-700 mb-4">
              The <code className="bg-neutral-100 dark:bg-neutral-900 px-1.5 py-0.5 rounded text-sm font-mono">create_optimizer()</code> method 
              mirrors standard PyTorch optimizers while coordinating parameter updates across remote workers:
            </p>
            
            <div className="space-y-1">
              <div className="bg-neutral-50 dark:bg-neutral-900/50 p-3 rounded-lg border border-neutral-200 dark:border-neutral-800">
                <h4 className="font-mono text-sm font-semibold dark:text-blue-400 text-blue-600 mb-2">
                  optimizer_type: str = "adamw"
                </h4>
                <p className="text-sm dark:text-neutral-300 text-neutral-700">
                  Optimizer algorithm: <code className="bg-neutral-100 dark:bg-neutral-900 px-1.5 py-0.5 rounded text-sm font-mono">"adam"</code>, 
                  <code className="bg-neutral-100 dark:bg-neutral-900 px-1.5 py-0.5 rounded text-sm font-mono">"adamw"</code>, 
                  or <code className="bg-neutral-100 dark:bg-neutral-900 px-1.5 py-0.5 rounded text-sm font-mono">"sgd"</code>. 
                  AdamW is recommended for most language model fine-tuning.
                </p>
              </div>

              <div className="bg-neutral-50 dark:bg-neutral-900/50 p-3 rounded-lg border border-neutral-200 dark:border-neutral-800">
                <h4 className="font-mono text-sm font-semibold dark:text-blue-400 text-blue-600 mb-2">
                  **kwargs
                </h4>
                <p className="text-sm dark:text-neutral-300 text-neutral-700">
                  lr, weight_decay, etc.
                </p>
              </div>
            </div>
          </div>

          <SyntaxHighlighter language="python" style={vscDarkPlus} className="rounded-lg !bg-[#1e1e1e] border border-neutral-700 text-sm">
            {trainingExample}
          </SyntaxHighlighter>

          <div className="bg-amber-50 dark:bg-amber-950/20 border-l-4 border-amber-500 p-3">
            <p className="text-sm dark:text-amber-200 text-amber-900 font-medium mb-2">
              💡 Performance Tip
            </p>
            <p className="text-sm dark:text-amber-100 text-amber-800">
              Low-shot fine-tuning (few epochs, small datasets) is more practical than large-scale pre-training over 
              internet connections due to network latency. For optimal training performance, use local or LAN-based 
              clusters to minimize network latency. While distributed training works on the public network, connection 
              quality significantly impacts throughput. 
            </p>
          </div>
        </div>
      </div>

      {/* Private Clusters */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold dark:text-white text-neutral-900 mb-3 pb-2 border-b dark:border-neutral-800 border-neutral-200">
          Nodes & Infrastructure
        </h2>

        <p className="text-sm sm:text-base leading-relaxed dark:text-neutral-300 text-neutral-700 mb-4">
          Tensorlink separates compute from orchestration using nodes. Validators coordinate jobs and expose APIs, while workers
          execute model shards. You can use the public network or connect directly to private infrastructure for trusted execution.
        </p>

        <SyntaxHighlighter language="python" style={vscDarkPlus} className="rounded-lg !bg-[#1e1e1e] border border-neutral-700 text-sm">
          {privateCluster}
        </SyntaxHighlighter>

        <div className="bg-amber-50 dark:bg-amber-950/20 border-l-4 border-amber-500 p-4 my-6">
          <p className="text-sm dark:text-amber-200 text-amber-900 font-medium mb-2">
            ⚠️ Custom Model Requirements
          </p>
          <ul className="space-y-1 text-sm dark:text-amber-100 text-amber-800">
            <li>• All worker nodes must have <code className="bg-amber-100 dark:bg-amber-900 px-1.5 py-0.5 rounded text-sm font-mono">"trusted": true</code> in 
            their config.json</li>
            <li>• Models must be serializable (no complex external dependencies)</li>
            <li>• The <code className="bg-amber-100 dark:bg-amber-900 px-1.5 py-0.5 rounded text-sm font-mono">forward()</code> method 
            defines the distributed compute graph</li>
            <li>• Custom models cannot currently run on the public network for security reasons. This will be addressed in future releases.</li>
          </ul>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold dark:text-white text-neutral-900 mb-3">
              Node Topology
            </h3>
            <p className="text-sm sm:text-base leading-relaxed dark:text-neutral-300 text-neutral-700 mb-4">
              To run private clusters, you need at least one validator node and one or more worker nodes. The validator 
              coordinates jobs and optionally exposes HTTP endpoints, while workers execute the actual model operations.
            </p>
            
            <div className="bg-neutral-50 dark:bg-neutral-900/50 p-4 rounded-lg border border-neutral-200 dark:border-neutral-800">
              <h4 className="font-semibold dark:text-white text-neutral-900 mb-2">Example Network Setup:</h4>
              <pre className="overflow-auto text-sm dark:text-neutral-300 text-neutral-700 font-mono">
{`Validator Node (192.168.2.42:38751)
    ├── Worker Node 1 (192.168.2.43:38752) - 24GB VRAM
    └── Worker Node 2 (192.168.2.44:38753) - 12GB VRAM`}
              </pre>
            </div>

            <p className="text-sm sm:text-base leading-relaxed dark:text-neutral-300 text-neutral-700 mt-4">
              For detailed configuration examples, node setup instructions, and network architecture patterns, see the{" "}
              <a href="/tensorlink/docs/mining" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                Node Setup Guide
              </a>.
            </p>
          </div>
        </div>
      </div>

      {/* Best Practices */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold dark:text-white text-neutral-900 mb-4 pb-2 border-b dark:border-neutral-800 border-neutral-200">
          Best Practices
        </h2>
        
        <div className="space-y-4">
          <div className="bg-neutral-50 dark:bg-neutral-900/50 p-4 rounded-lg border border-neutral-200 dark:border-neutral-800">
            <h4 className="font-semibold dark:text-white text-neutral-900 mb-2">
              🎯 Choose the Right Network Mode
            </h4>
            <p className="text-sm dark:text-neutral-300 text-neutral-700">
              Use the public network for quick prototyping and inference with verified Hugging Face models. For production 
              workloads, sensitive data, or custom architectures, deploy private clusters on your own infrastructure.
            </p>
          </div>

          <div className="bg-neutral-50 dark:bg-neutral-900/50 p-4 rounded-lg border border-neutral-200 dark:border-neutral-800">
            <h4 className="font-semibold dark:text-white text-neutral-900 mb-2">
              ⚡ Optimize for Network Latency
            </h4>
            <p className="text-sm dark:text-neutral-300 text-neutral-700">
              For training workloads, prefer local or LAN-based clusters over internet-distributed execution. Fiber connections 
              and wired Ethernet significantly outperform Wi-Fi for distributed tensor operations.
            </p>
          </div>

          <div className="bg-neutral-50 dark:bg-neutral-900/50 p-4 rounded-lg border border-neutral-200 dark:border-neutral-800">
            <h4 className="font-semibold dark:text-white text-neutral-900 mb-2">
              💾 Handle Resource Constraints Gracefully
            </h4>
            <p className="text-sm dark:text-neutral-300 text-neutral-700">
              On the public network, models may experience longer queue times or failures due to 
              limited worker availability. Consider contributing your own GPU resources or using private infrastructure for 
              large-scale models.
            </p>
          </div>

          <div className="bg-neutral-50 dark:bg-neutral-900/50 p-4 rounded-lg border border-neutral-200 dark:border-neutral-800">
            <h4 className="font-semibold dark:text-white text-neutral-900 mb-2">
              🔒 Security for Custom Models
            </h4>
            <p className="text-sm dark:text-neutral-300 text-neutral-700">
              Never enable <code className="bg-neutral-100 dark:bg-neutral-900 px-1.5 py-0.5 rounded text-sm font-mono">trusted: true</code> on 
              public worker nodes. This setting allows arbitrary code execution and should only be used on infrastructure you control.
            </p>
          </div>
        </div>
      </div>

      {/* Next Steps */}
      <div className="mb-8 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg p-6">
        <h3 className="text-lg font-semibold dark:text-white text-neutral-900 mb-3">
          What's Next?
        </h3>
        <ul className="space-y-2 text-sm sm:text-base dark:text-neutral-300 text-neutral-700">
          <li>
            • Learn how to <a href="/tensorlink/docs/mining" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
            set up your own nodes</a> for custom device configurations and contributing resources to the network
          </li>
          <li>
            • Explore <a href="/tensorlink/docs/api" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
            HTTP API access</a> for serverless and web application integration
          </li>
          <li>
            • Browse <a href="https://github.com/mattjhawken/tensorlink/tree/main/docs/examples" target="_blank" rel="noopener noreferrer" 
            className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
            complete examples</a> on GitHub for common workflows
          </li>
          <li>
            • Join the <a href="https://discord.gg/aCW2kTNzJ2" target="_blank" rel="noopener noreferrer" 
            className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
            Discord community</a> to share projects and get help
          </li>
        </ul>
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
        <a href="/tensorlink/docs/nodes" className="text-sm sm:text-base font-medium dark:text-blue-400 text-blue-600 hover:underline">
          Nodes
        </a>
      </div>
    </div>
  </section>
);

export default ModelExample;
