import { useState } from "react";
import { Shield, Zap, DollarSign, Bot, Network, Sparkles } from "lucide-react";

const UseCases = () => {
  const [hoveredCase, setHoveredCase] = useState(null);

  const cases = [
    {
      id: "private-hybrid",
      emoji: "🔐",
      title: "Private Hybrid AI",
      description: "Combine your GPU with public nodes in a hybrid distributed model to obfuscate inputs and outputs, achieve privacy through distributed compute.",
      color: "bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/40 dark:to-purple-800/30",
      borderColor: "border-purple-300 dark:border-purple-700",
      icon: Shield
    },
    {
      id: "multi-gpu",
      emoji: "💻",
      title: "Multi-Device Clusters",
      description: "Link multiple personal GPUs across your devices to run 70B+ models privately without relying on external infrastructure.",
      color: "bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-800/30",
      borderColor: "border-blue-300 dark:border-blue-700",
      icon: Network
    },
    {
      id: "earn-compute",
      emoji: "💰",
      title: "Earn While You Contribute",
      description: "Donate idle GPU cycles to the network and earn blockchain rewards, monetize your hardware when you're not using it.",
      color: "bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/40 dark:to-green-800/30",
      borderColor: "border-green-300 dark:border-green-700",
      icon: DollarSign
    },
    {
      id: "free-agents",
      emoji: "⚡",
      title: "Agentic Workflows",
      description: "Deploy autonomous AI agents and complex workflows with distributed intelligence, build the next generation of automation.",
      color: "bg-gradient-to-br from-pink-100 to-pink-200 dark:from-pink-900/40 dark:to-pink-800/30",
      borderColor: "border-pink-300 dark:border-pink-700",
      icon: Zap
    },
  ];

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-14">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
            Powerful Use Cases
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            From privacy-first hybrid models to free AI services—Tensorlink adapts to your needs
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {cases.map((useCase) => (
            <div 
              key={useCase.id}
              className={`${useCase.color} rounded-xl p-5 transition-all duration-300 border-2 ${
                hoveredCase === useCase.id ? useCase.borderColor : 'border-transparent'
              } hover:shadow-xl hover:scale-[1.02] cursor-pointer group`}
              onMouseEnter={() => setHoveredCase(useCase.id)}
              onMouseLeave={() => setHoveredCase(null)}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-purple-700 dark:group-hover:text-purple-200 transition-colors">
                  {useCase.title}
                </h3>
                <div className={`p-2 rounded-lg transition-all duration-300 ${
                  hoveredCase === useCase.id 
                    ? 'bg-white dark:bg-gray-800 shadow-md' 
                    : 'bg-white/50 dark:bg-gray-800/50'
                }`}>
                  <useCase.icon className={`w-5 h-5 transition-colors ${
                    hoveredCase === useCase.id
                      ? 'text-purple-600 dark:text-purple-400'
                      : 'text-gray-600 dark:text-gray-400'
                  }`} />
                </div>
              </div>
              <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                {useCase.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UseCases;