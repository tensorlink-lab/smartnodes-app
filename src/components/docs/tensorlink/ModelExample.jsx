import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import styles from "../../../style";
import { NavButton } from "../..";

// --- Code Snippets ---
const codeStringDistributedModel = `from tensorlink import DistributedModel
from torch.optim import AdamW
from my_custom_model import CustomModel
import torch

# Hugging Face model
distributed_model = DistributedModel(
    model="Qwen/Qwen3-8B",
    training=False,
    device="cuda",
    dtype=torch.float16,
    verbose=True
)

# Custom model (experimental)
distributed_model = DistributedModel(
    model=CustomModel(),
    training=True,
    optimizer_type=AdamW
)

# Local file (experimental)
# distributed_model = DistributedModel(
#     model="path/to/model_weights.pt",
#     training=False,
#     optimizer_type=AdamW
# )`;

const codeStringInference = `from transformers import AutoTokenizer
import torch

tokenizer = AutoTokenizer.from_pretrained("Qwen/Qwen3-8B")
prompt = "Explain quantum computing in simple terms."
inputs = tokenizer(prompt, return_tensors="pt").to("cuda")

with torch.no_grad():
    outputs = distributed_model(**inputs)

print(tokenizer.decode(outputs[0], skip_special_tokens=True))`;

const codeStringTrainingLoop = `optimizer = distributed_model.create_optimizer(lr=5e-5)
loss_fn = torch.nn.CrossEntropyLoss()

epochs = 3
for epoch in range(epochs):
    for batch in dataloader:
        input_ids = batch["input_ids"].to("cuda")
        attention_mask = batch["attention_mask"].to("cuda")
        labels = batch["label"].to("cuda")

        optimizer.zero_grad()
        outputs = distributed_model(input_ids, attention_mask=attention_mask, labels=labels)
        loss = outputs.loss
        loss.backward()
        optimizer.step()

    print(f"Epoch {epoch+1}/{epochs} completed")`;

const ModelOverview = () => (
  <section className="px-5 md:px-10 flex flex-col border-t dark:border-neutral-800 border-neutral-200 items-center h-full">
    <div className="text-left py-7 max-w-[1200px] w-full">
      
      {/* Page Title */}
      <div className="pb-4 mb-4 border-b dark:border-neutral-800 border-neutral-200">
        <h1 className="text-4xl font-bold dark:text-white text-neutral-900 mb-2">
          Training and Inference
        </h1>
        <p className="text-lg dark:text-neutral-400 text-neutral-600">
          Using <code className="bg-neutral-100 dark:bg-neutral-900 px-2 py-0.5 rounded font-mono text-sm">DistributedModel</code> in Tensorlink
        </p>
      </div>

      {/* Introduction */}
      <div className="mb-12">
        <p className="text-base leading-relaxed dark:text-neutral-300 text-neutral-700 mb-4">
          <code className="bg-neutral-100 dark:bg-neutral-900 px-2 py-0.5 rounded font-mono text-sm">DistributedModel</code> is a wrapper 
          that automatically connects your machine to the Tensorlink network and offloads your model to available workers. 
          It behaves like a standard PyTorch model and supports three initialization methods:
        </p>
        <ul className="list-disc pl-6 text-base dark:text-neutral-300 text-neutral-700 space-y-2">
          <li>Hugging Face model name (e.g., <code className="bg-neutral-100 dark:bg-neutral-900 px-2 py-0.5 rounded font-mono text-sm">"Qwen/Qwen3-8B"</code>)</li>
          <li>Custom <code className="bg-neutral-100 dark:bg-neutral-900 px-2 py-0.5 rounded font-mono text-sm">torch.nn.Module</code> object</li>
          <li>Local file path with weights (<code className="bg-neutral-100 dark:bg-neutral-900 px-2 py-0.5 rounded font-mono text-sm">.pt</code> / <code className="bg-neutral-100 dark:bg-neutral-900 px-2 py-0.5 rounded font-mono text-sm">.bin</code>)</li>
        </ul>
      </div>

      {/* Distributed Model Example */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold dark:text-white text-neutral-900 mb-3 pb-2 border-b dark:border-neutral-800 border-neutral-200">
          Defining a Distributed Model
        </h2>
        <SyntaxHighlighter language="python" style={vscDarkPlus} className="rounded-md">
          {codeStringDistributedModel}
        </SyntaxHighlighter>
      </div>

      {/* Inference Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold dark:text-white text-neutral-900 mb-3 pb-2 border-b dark:border-neutral-800 border-neutral-200">
          Inference Example
        </h2>
        <p className="text-base leading-relaxed dark:text-neutral-300 text-neutral-700 mb-4">
          For inference, initialize your model with <code className="bg-neutral-100 dark:bg-neutral-900 px-2 py-0.5 rounded font-mono text-sm">training=False</code>. 
          This mode is optimized for efficient evaluation workloads.
        </p>
        <SyntaxHighlighter language="python" style={vscDarkPlus} className="rounded-md">
          {codeStringInference}
        </SyntaxHighlighter>
      </div>

      {/* Training Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold dark:text-white text-neutral-900 mb-3 pb-2 border-b dark:border-neutral-800 border-neutral-200">
          Training Example
        </h2>
        <p className="text-base leading-relaxed dark:text-neutral-300 text-neutral-700 mb-4">
          With <code className="bg-neutral-100 dark:bg-neutral-900 px-2 py-0.5 rounded font-mono text-sm">training=True</code>, 
          you can fine-tune or train models like in standard PyTorch. Optimizers created through 
          <code className="bg-neutral-100 dark:bg-neutral-900 px-2 py-0.5 rounded font-mono text-sm"> create_optimizer</code> 
          automatically synchronize updates across workers.
        </p>
        <SyntaxHighlighter language="python" style={vscDarkPlus} className="rounded-md">
          {codeStringTrainingLoop}
        </SyntaxHighlighter>
      </div>

      {/* Coming Soon Note */}
      <div className="bg-blue-50 dark:bg-blue-950/20 border-l-4 border-blue-500 p-4 mb-12 rounded">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          <strong>Coming Soon:</strong> Training progress and network activity will be viewable in the{" "}
          <a href="https://smartnodes.ca/app" className="underline">Smartnodes Dashboard</a>.
        </p>
      </div>
    </div>

    {/* Navigation */}
    <div className="flex mt-8 mb-10 justify-between max-w-[1200px] w-full pt-8 border-t dark:border-neutral-800 border-neutral-200">
      <NavButton className="text-left" title="Getting Started" subtitle="Previous" page="tensorlink/docs/install" />
      <NavButton className="text-right" title="Inference APIs" subtitle="Next" page="tensorlink/docs/api" />
    </div>
  </section>
);

export default ModelOverview;
