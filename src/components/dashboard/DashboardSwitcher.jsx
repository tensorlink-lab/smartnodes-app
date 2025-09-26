// Dashboard switcher component
const DashboardSwitcher = ({dashboardConfig, activeDashboard, setActiveDashboard}) => (
    <div className="flex flex-wrap justify-start gap-2 sm:gap-3 mb-3">
        {dashboardConfig.map((dashboard) => (
        <button
            key={dashboard.id}
            onClick={() => setActiveDashboard(dashboard.id)}
            className={`
            flex items-center gap-2 p-2 sm:p-3 rounded-lg font-medium transition-all duration-200
            ${activeDashboard === dashboard.id
                ? 'bg-blue-500 text-white shadow-lg xs:scale-105'
                : 'bg-stone-50 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 hover:bg-stone-300 dark:hover:bg-zinc-600'
            }
            border border-gray-500 dark:border-neutral-300
            `}
        >
            {dashboard.icon}
            <span className="text-xs sm:text-[17px]">{dashboard.name}</span>
        </button>
        ))}
    </div>
);

export default DashboardSwitcher;