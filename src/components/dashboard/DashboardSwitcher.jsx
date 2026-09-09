import { motion } from "framer-motion";

/**
 * DashboardSwitcher
 *
 * Renders as a quiet vertical nav in a left-hand column on large screens,
 * and collapses into an underlined tab strip on small/medium screens.
 * Styled to match the landing page: Space Grotesk / JetBrains Mono type,
 * teal (#4FD8C4) accent, no button chrome on the active/inactive states.
 */
const DashboardSwitcher = ({ dashboardConfig, activeDashboard, setActiveDashboard }) => {
  return (
    <nav className="w-full shrink-0 lg:sticky ">
      {/* Section label (large screens only) */}
      <div className="hidden items-center gap-2 mb-4 px-3">
        <span className="h-px w-4 bg-gradient-to-r from-transparent to-[#4FD8C4]" />
        <span className="font-['JetBrains_Mono'] text-[10px] tracking-[0.25em] uppercase text-gray-400 dark:text-[#8B93A7]">
          Dashboards
        </span>
      </div>

      {/* Tab strip — small/medium screens */}
      <div className="-mx-1 flex items-center gap-1 overflow-x-auto border-b border-gray-200 px-1 dashboard-switcher-scroll dark:border-white/10">
        {dashboardConfig.map((dashboard) => {
          const isActive = activeDashboard === dashboard.id;
          return (
            <button
              key={dashboard.id}
              onClick={() => setActiveDashboard(dashboard.id)}
              className={`
                relative flex shrink-0 items-center gap-2 whitespace-nowrap px-3.5 py-2.5 text-sm font-medium
                transition-colors duration-200
                ${isActive
                  ? "text-gray-900 dark:text-[#EDEFF4]"
                  : "text-gray-500 dark:text-[#8B93A7] hover:text-gray-800 dark:hover:text-[#EDEFF4]"
                }
              `}
            >
              <span className={`text-base ${isActive ? "text-[#4FD8C4]" : "text-gray-400 dark:text-[#5B6272]"}`}>
                {dashboard.icon}
              </span>
              {dashboard.name}
              {isActive && (
                <motion.span
                  layoutId="dashboard-tab-underline"
                  className="absolute -bottom-px left-3 right-3 h-[2px] rounded-full bg-[#4FD8C4]"
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Hide the scrollbar on the mobile tab strip without a Tailwind plugin */}
      <style>{`
        .dashboard-switcher-scroll::-webkit-scrollbar { display: none; }
        .dashboard-switcher-scroll { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </nav>
  );
};

export default DashboardSwitcher;
