import { motion } from "framer-motion";

const DashboardSwitcher = ({ dashboardConfig, activeDashboard, setActiveDashboard }) => (
  <div className="flex flex-wrap justify-start gap-2 sm:gap-3 mb-3">
    {dashboardConfig.map((dashboard, index) => (
      <motion.button
        key={dashboard.id}
        initial={{ opacity: 0, y: 0 }} // fade + slide up slightly
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.6,
          delay: index * 0.25,
          ease: "easeOut"
        }}
        onClick={() => setActiveDashboard(dashboard.id)}
        className={`
          flex items-center gap-2 p-2 sm:p-3 rounded-lg font-medium transition-transform duration-200
          ${activeDashboard === dashboard.id
            ? 'bg-blue-500 text-white shadow-lg xs:scale-105'
            : 'bg-gray-50 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-zinc-600'
          }
          border border-gray-500 dark:border-neutral-300
        `}
      >
        {dashboard.icon}
        <span className="text-xs sm:text-[17px]">{dashboard.name}</span>
      </motion.button>
    ))}
  </div>
);

export default DashboardSwitcher;
