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

import {
  MdHome,
  MdCode,
  MdDescription,
  MdDashboard,
  MdRocketLaunch,
  MdInfo,
} from "react-icons/md";

import {
  FaGithub,
  FaDiscord,
  FaXTwitter,
} from "react-icons/fa6";

import { Cpu, Zap, Lock } from "lucide-react";

export const overview = {
  info: "Smartnodes takes decentralized physical infrastructure (DePIN) to the next level by making it modular and flexible. It transforms globally distributed hardware into a programmable, composable layer for computation and data collection. Developers can securely access these shared resources through APIs and Python libraries, unlocking scalable infrastructure without needing expensive local hardware.",
};

const TENSORLINK_URL = "https://tensorlink.io";

export const portals = [
  { title: "Tensorlink Docs", link: `${TENSORLINK_URL}/docs`, img: blocks },
  { title: "Running a Node", link: `${TENSORLINK_URL}/docs/mining`, img: ai },
  { title: "Join the Community", link: `${TENSORLINK_URL}/docs/community`, img: community },
];

export const sideLinks = [
  {
    title: "Smartnodes",
    links: [
      { name: "About", id: "", icon: MdInfo },
      { name: "Dashboard", id: "app", icon: MdDashboard },
      {
        name: "Documentation",
        id: "docs",
        icon: MdDescription,
        sublinks: [
          {
            id: "overview",
            name: "Overview",
            icon: MdInfo,
          },
        ],
      },
      {
        name: "Whitepaper",
        id: "https://github.com/tensorlink-lab/smartnodes-core/blob/main/whitepaper.md",
        icon: MdDescription,
        external: true,
      },
    ],
  },
  {
    title: "Tensorlink",
    links: [
      {
        name: "About",
        id: TENSORLINK_URL,
        icon: MdInfo,
        external: true,
      },
      {
        name: "Launch App",
        id: `${TENSORLINK_URL}/app`,
        icon: MdCode,
      },
      {
        name: "Documentation",
        id: `${TENSORLINK_URL}/docs`,
        icon: MdDescription,
        external: true,
      },
    ],
  },
  {
    title: "Links",
    links: [
      {
        name: "GitHub",
        id: "https://github.com/tensorlink-lab",
        icon: FaGithub,
        external: true,
      },
      {
        name: "X",
        id: "https://x.com/smartnodes_lab",
        icon: FaXTwitter,
        external: true,
      },
      {
        name: "Discord",
        id: "https://discord.gg/aCW2kTNzJ2",
        icon: FaDiscord,
        external: true,
      },
    ],
  },
];

export const navLinks = [
  // { id: "", title: "Home" },
  { id: "docs", title: "Docs" },
  { id: "app", title: "Dashboard" },
  { id: TENSORLINK_URL, title: "Tensorlink", external: true },
];

export const features = [
  {
    id: "1",
    title: "Access Larger Models",
    content:
      "Execute models that exceed your local VRAM by automatically sharding across network nodes. Train 70B+ parameter models on consumer hardware.",
    icon: Cpu,
  },
  {
    id: "2",
    title: "Deploy in Seconds",
    content:
      "Load any Hugging Face model or custom PyTorch architecture with a few lines of code. No Docker, no Kubernetes, no infrastructure setup.",
    icon: Zap,
  },
  {
    id: "3",
    title: "Own Your Compute",
    content:
      "Route workloads exclusively to your own devices for complete privacy, or tap into the public network. Your data, your choice.",
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
    img: telescope,
    blur: true,
    link: "",
  },
  {
    id: "feedback-3",
    content: "",
    name: "",
    title: "",
    img: job,
    blur: true,
    link: "",
  },
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
        link: "https://github.com/tensorlink-lab/smartnodes",
      },
      {
        name: "GitHub",
        icon: linkedin,
        link: "https://github.com/tensorlink-lab",
      },
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
        link: "https://www.linkedin.com/company/tensorlink-lab",
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
    link: "https://www.linkedin.com/company/tensorlink-lab",
  },
];
