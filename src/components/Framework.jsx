import { Layers, ShieldCheck, Coins } from "lucide-react";
import useReveal from "../hooks/useReveal";

const features = [
  {
    icon: Layers,
    accent: "#4FD8C4",
    title: "Modular Architecture",
    description: "Build flexible resource-sharing applications with customizable node types.",
  },
  {
    icon: ShieldCheck,
    accent: "#A78BFA",
    title: "Secure Network",
    description: "Validator staking and identity verification ensure trusted interactions across the peer-to-peer network.",
  },
  {
    icon: Coins,
    accent: "#F2A65A",
    title: "Unified Economy",
    description: "All interactions, rewards, and governance operate under a single smart contract and token system, ensuring transparency, interoperability, and long-term sustainability.",
  },
];

const Framework = () => {
  const [ref, visible] = useReveal(0.15);

  return (
    <section id="framework" className="relative w-full bg-[#0A0D13] py-20 sm:py-24 border-t border-b">
      <div
        ref={ref}
        className={`max-w-6xl mx-auto px-4 sm:px-8 transition-all duration-700 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left column - Header */}
          <div>
            <h2 className="font-bold text-3xl sm:text-4xl lg:text-5xl text-[#EDEFF4] leading-[1.15] mt-3 max-w-2xl">
              A modular, resource-sharing ecosystem for{" "}
              <span className="text-[#4FD8C4]">Python</span>
            </h2>
            <p className="text-[#9AA2B4] text-base lg:text-lg leading-relaxed max-w-md mt-6">
              Create dedicated networks for sharing compute, data, and models across 
              peer-to-peer networks.
            </p>
          </div>

          {/* Right column - Features */}
          <div className="space-y-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl px-5 py-5 border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-300"
                style={{ borderColor: "rgba(255,255,255,0.08)" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = `${feature.accent}55`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="shrink-0 p-2.5 rounded-lg"
                    style={{ backgroundColor: `${feature.accent}22` }}
                  >
                    <feature.icon className="w-5 h-5" style={{ color: feature.accent }} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-[#EDEFF4]">
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-[#9AA2B4]">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Framework;