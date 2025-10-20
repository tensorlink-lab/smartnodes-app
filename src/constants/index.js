import {
  ai,
  job,
  telescope,
  blocks,
  community,
  linkedin,
  twitter,
  discord,
  x,
} from "../assets";
import { MdHome } from "react-icons/md";
import { Cpu, Zap, Lock } from "lucide-react";

export const overview = {
  info: "Smartnodes takes decentralized physical infrastructure (DePIN) to the next level by making it modular and flexible. It transforms globally distributed hardware into a programmable, composable layer for computation and data collection. Developers can securely access these shared resources through APIs and Python libraries, unlocking scalable infrastructure without needing expensive local hardware.",
};

export const portals = [
  {
    title: "Tensorlink Docs",
    link: "tensorlink/docs",
    img: blocks,
  },
  {
    title: "Running a Node",
    link: "tensorlink/docs/mining",
    img: ai,
  },
  // {
  //   title: "Running a Validator",
  //   link: "docs/validator",
  //   img: workflow,
  // },
  {
    title: "Join the Community",
    link: "tensorlink/docs/community",
    img: community,
  },
];

export const sideLinks = [
  {
    title: "Smartnodes",
    links: [
      {
        name: "Home",
        id: "",
        icon: MdHome,
      },
      {
        name: "Dashboard",
        id: "app",
        icon: MdHome,
      },
      {
        name: "Documentation",
        id: "docs",
        icon: MdHome,
        sublinks: [{ id: "overview", name: "Overview" }],
      },
      {
        name: "Whitepaper",
        id: "https://github.com/smartnodes-lab/smartnodes-core/blob/main/whitepaper.md",
      },
    ],
  },
  {
    title: "tensorlink",
    links: [
      {
        name: "Home",
        id: "tensorlink",
        icon: MdHome,
      },
      {
        name: "Documentation",
        id: "tensorlink/docs",
        icon: MdHome,
        sublinks: [
          { id: "overview", name: "Overview" },
          { id: "install", name: "Installation" },
          { id: "model", name: "Distributed Models" },
          { id: "api", name: "Inference APIs" },
          { id: "nodes", name: "Nodes" },
          { id: "mining", name: "Mining" },
          // { id: "wallet", name: "Wallet Config"},
        ],
      },
    ],
  },
  {
    title: "Links",
    links: [
      {
        name: "GitHub",
        id: "https://github.com/smartnodes-lab",
        icon: MdHome,
      },
      {
        name: "X",
        id: "https://x.com/smartnodes_lab",
        icon: MdHome,
      },
      {
        name: "Discord",
        id: "https://discord.gg/aCW2kTNzJ2",
        icon: MdHome,
      },
    ],
  },
];

export const navLinks = [
  {
    id: "",
    title: "Home",
  },
  {
    id: "networks",
    title: "Networks",
    networks: [
      {
        network: "Tensorlink",
        link: "tensorlink",
      },
    ],
  },
  {
    id: "app",
    title: "Dashboard",
  },
  {
    id: "docs",
    title: "Docs",
  },
];

export const features = [
  {
    id: "1",
    title: "Plug-and-Play",
    content:
      "Effortlessly offload heavy computation to distributed nodes with PyTorch-ready model wrappers that integrate behind the scenes.",
    icon: Cpu,
  },
  {
    id: "2",
    title: "On-demand Inference",
    content:
      "Run inference or train models on distributed hardware through simple APIs. Deploy Hugging Face or custom models without managing GPUs.",
    icon: Zap,
  },
  {
    id: "3",
    title: "Scalable & Private",
    content:
      "Securely distribute and execute large models across multiple nodes for fast, efficient, and privacy enhanced workloads.",
    icon: Lock,
  },
];

export const feedback = [
  {
    id: "feedback-1",
    content:
      "Tensorlink optimizes AI workflows in PyTorch by offloading model compute behind the scenes, while also providing API infrastructure for pre-trained HuggingFace models.",
    name: "Distributed AI Infrastructure",
    title: "Tensorlink",
    img: blocks,
    blur: false,
    link: "/tensorlink",
  },
  {
    id: "feedback-2",
    content: "",
    name: "",
    title: "",
    // content:
    //   "Explore the depths of space with Deepfield, a groundbreaking distributed radio telescope array positioned to be the world's largest and highest-resolution radio telescope, capturing unparalleled imaging and even potential transmission capabilities. (In Progress)",
    // name: "The Distributed Radio Telescope",
    // title: "Deepfield",
    img: telescope,
    blur: true,
    link: "",
  },
  {
    id: "feedback-3",
    content: "",
    name: "",
    title: "",
    // content:
    //   "Tailored machine-human APIs for empowering decentralized and automated systems with trust-minimized workflow management and decision-making. (TBD)",
    // name: "for dApps and Automation",
    // title: "Collective Intelligence",
    img: job,
    blur: true,
    link: "",
  },
  // {
  //   id: "feedback-3",
  //   content:
  //     "The Chainspace vision extends to creating a global network where individuals can delegate tasks, form organizations, and collaborate on content creation.",
  //   name: "Shaping an Inclusive Future",
  //   title: "Decentralized Workforce",
  //   img: job,
  // },
];

export const footerLinks = [
  {
    title: "About",
    links: [
      {
        name: "Home",
        link: "/",
      },
      {
        name: "Litepaper",
        link: "https://github.com/smartnodes-lab/smartnodes",
      },
      {
        name: "GitHub",
        icon: linkedin,
        link: "https://github.com/smartnodes-lab",
      },
      // {
      //   name: "Create",
      //   link: "https://www.framework.exchange/create/",
      // },
      // {
      //   name: "Explore",
      //   link: "https://www.framework.exchange/explore/",
      // },
      // {
      //   name: "Terms & Services",
      //   link: "https://www.framework.exchange/terms-and-services/",
      // },
    ],
  },
  {
    title: "Community",
    links: [
      {
        name: "X",
        icon: twitter,
        link: "https://www.x.com/smartnodes_lab",
      },
      {
        name: "Discord",
        icon: discord,
        link: "https://discord.gg/aCW2kTNzJ2",
      },
      {
        name: "LinkedIn",
        icon: linkedin,
        link: "https://www.linkedin.com/company/smartnodes-lab",
      },
    ],
  },
  {
    title: "Donate",
    links: [
      {
        name: "Buy us a Coffee",
        link: "https://buymeacoffee.com/smartnodes",
      },
      {
        name: "Bitcoin",
        link: "bc1qg6klkt3z77wdlgusz5lujulr5ezayvqsw8m4r5",
      },
      {
        name: "Ethereum",
        link: "0x1Bc3a15dfFa205AA24F6386D959334ac1BF27336",
      },
      {
        name: "Solana",
        link: "3urnEem9JcdYB7t5ysVpk62fh2M8cU6RsmM9PoJaDiJV",
      },
    ],
  },
];

export const socialMedia = [
  {
    id: "social-media-2",
    icon: discord,
    link: "https://discord.gg/aCW2kTNzJ2",
  },
  {
    id: "social-media-3",
    icon: x,
    link: "https://www.x.com/smartnodes_lab",
  },
  {
    id: "social-media-4",
    icon: linkedin,
    link: "https://www.linkedin.com/company/smartnodes-lab",
  },
];
