import { FaRegCopy } from "react-icons/fa"; // copy icon
import { logo } from "../assets";
import { footerLinks, socialMedia } from "../constants";

const Footer = () => (
  <section className="px-5 md:px-10 flex flex-col border-t dark:border-neutral-400 border-neutral-600 items-center bg-white dark:bg-neutral-950 w-full"
  style={{zIndex: 1000}}>
    {/* Top Section */}
    <div className="flex flex-col md:flex-row justify-between w-full max-w-[900px] py-10 gap-10">
      {/* Logo & Description */}
      <div className="flex flex-col items-start">
        <img
          src={logo}
          alt="Smartnodes logo"
          className="h-[50px] sm:h-[60px] bg-neutral-400 rounded-xl px-2 object-contain max-w-[220px] mb-4"
        />
        <p className="text-base leading-relaxed dark:text-neutral-400 text-neutral-600 max-w-[300px]">
          Empowering innovation with scalable, distributed networks for data processing and computation in Python.
        </p>
      </div>

      {/* Footer Links */}
      <div className="flex flex-wrap gap-10 md:gap-16">
        {footerLinks.map((footerlink) => (
          <div key={footerlink.title} className="flex flex-col min-w-[150px]">
            <h4 className="text-lg font-semibold dark:text-white text-neutral-900 mb-3">
              {footerlink.title}
            </h4>
            <ul className="space-y-2">
              {footerlink.links.map((link) => (
                <li key={link.name}>
                  {footerlink.title === "Donate" && link.link && !link.link.startsWith("http") ? (
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(link.link);
                        alert(`${link.name.split(":")[0]} address copied!`); // ✅ optional feedback
                      }}
                      className="flex items-center gap-2 cursor-pointer text-base dark:text-neutral-400 text-neutral-600 hover:text-blue-500 transition"
                    >
                      <span>{link.name.split(":")[0]}</span>
                      <FaRegCopy className="w-4 h-4 opacity-70 hover:opacity-100" />
                    </button>
                  ) : (
                    <a
                      href={link.link}
                      className="text-base dark:text-neutral-400 text-neutral-600 hover:text-blue-500 transition"
                    >
                      {link.name}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

    </div>

    {/* Bottom Section */}
    <div className="w-full max-w-[900px] flex flex-col md:flex-row items-center justify-between pt-6 border-t dark:border-neutral-800 border-neutral-200">
      <p className="text-sm dark:text-neutral-500 text-neutral-500">
        © 2025 Smartnodes. All Rights Reserved.
      </p>
      <div className="flex flex-row gap-6 mt-4 md:mt-0">
        {socialMedia.map((social) => (
          <img
            key={social.id}
            src={social.icon}
            alt={social.id}
            className="w-5 h-5 object-contain cursor-pointer opacity-80 hover:opacity-100 transition"
            onClick={() => window.open(social.link)}
          />
        ))}
      </div>
    </div>
  </section>
);

export default Footer;
