import React from "react";
import styles from "../../../style";
import { NavButton } from "../..";

const Community = () => (
  <section className="px-5 md:px-10 flex flex-col border-t dark:border-neutral-800 border-neutral-200 items-center h-full">
    <div className="text-left py-7 max-w-[1200px] w-full mb-44">
      
      {/* Page Title */}
      <div className="pb-4 mb-6 border-b dark:border-neutral-800 border-neutral-200">
        <h1 className="text-2xl font-bold dark:text-white text-neutral-900 mb-2">
          Socials & Contributing
        </h1>
        <p className="text-md dark:text-neutral-400 text-neutral-600">
          Join the Tensorlink community, contribute code, and help shape the future of decentralized AI.
        </p>
      </div>

      {/* Contributing */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold dark:text-white text-neutral-900 mb-3 pb-2">
          Contributing
        </h2>
        <ul className="list-disc pl-6 text-base leading-relaxed dark:text-neutral-300 text-neutral-700">
          <li>
            <strong>Report Issues:</strong> Submit bugs or features on{" "}
            <a href="https://github.com/mattjhawken/tensorlink" className="text-blue-500 underline">
              GitHub
            </a>.
          </li>
          <li>
            <strong>Pull Requests:</strong> Fork, commit, and submit improvements.
          </li>
          <li>
            <strong>Join the Community:</strong> Connect on{" "}
            <a href="https://discord.gg/aCW2kTNzJ2" className="text-blue-500 underline">Discord</a>.
          </li>
        </ul>
      </div>

      {/* Stay Connected */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold dark:text-white text-neutral-900 mb-3 pb-2 border-b dark:border-neutral-800 border-neutral-200">
          Stay Connected
        </h2>
        <ul className="list-disc pl-6 text-base leading-relaxed dark:text-neutral-300 text-neutral-700">
          <li><a href="https://twitter.com/smartnodes_lab" className="text-blue-500 underline">X: @smartnodes_lab</a></li>
          <li><a href="https://github.com/mattjhawken/tensorlink" className="text-blue-500 underline">GitHub: mattjhawken/tensorlink</a></li>
          <li><a href="https://discord.gg/aCW2kTNzJ2" className="text-blue-500 underline">Discord: Join our community</a></li>
        </ul>
      </div>

      {/* Support */}
      <div>
        <h2 className="text-xl font-semibold dark:text-white text-neutral-900 mb-3 pb-2 border-b dark:border-neutral-800 border-neutral-200">
          Support Development
        </h2>
        <p className="text-base leading-relaxed dark:text-neutral-300 text-neutral-700 mb-4">
          Help sustain Tensorlink with a small donation.
        </p>
        <a href="https://www.buymeacoffee.com/smartnodes" target="_blank">
          <img
            src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
            alt="Buy Me a Coffee"
            style={{ width: "150px", height: "auto" }}
          />
        </a>
      </div>
    </div>

    {/* Navigation */}
    <div className="flex mb-10 justify-between max-w-[1200px] w-full">
      <div className="text-left">
        <div className="text-sm dark:text-neutral-500 text-neutral-500 mb-1">Previous</div>
          <a href="/tensorlink/docs/mining" className="text-sm sm:text-sm sm:text-base font-medium dark:text-blue-400 text-blue-600 hover:underline">
            Running a Worker
        </a>
      </div>
    </div>
  </section>
);

export default Community;
