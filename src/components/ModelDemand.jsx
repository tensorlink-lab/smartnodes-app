import { MdCircle, MdAccessTime, MdTrendingUp, MdBarChart, MdSmartToy, MdSort, MdFilterList } from "react-icons/md";
import { motion } from "framer-motion";
import React, { useState, useEffect } from "react";

const ModelDemand = ({ modelDemandData, loading, error }) => {
  const [isDarkMode, setIsDarkMode] = useState(
    document.documentElement.classList.contains('dark')
  );
  const [sortBy, setSortBy] = useState('total_requests');
  const [sortOrder, setSortOrder] = useState('desc');

  const getPopularityColor = (requests) => {
    if (requests >= 10) return 'bg-green-500';
    if (requests >= 5) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const isDark = document.documentElement.classList.contains('dark');
      setIsDarkMode(isDark);
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  const formatTimeAgo = (timestamp) => {
    const now = Date.now() / 1000;
    const diff = now - timestamp;
    
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const formatModelName = (fullName) => {
    const parts = fullName.split('/');
    return parts.length > 1 ? parts[1] : fullName;
  };

  const getPopularityLevel = (requests) => {
    if (requests >= 10) return 'High';
    if (requests >= 5) return 'Medium';
    return 'Low';
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  const getSortedData = (models) => {
    if (!models) return [];
    
    return [...models].sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (sortBy === 'model_name') {
        aValue = formatModelName(aValue).toLowerCase();
        bValue = formatModelName(bValue).toLowerCase();
      }
      
      if (typeof aValue === 'string') {
        return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }
      
      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    });
  };

  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }} 
        className="mb-6 xs:-mx-0 -mx-1"
      >
        <div className="border border-gray-400 dark:border-gray-100 rounded-xl p-2 xs:p-4 bg-gray-100 dark:bg-stone-900 shadow-sm min-h-[400px]">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }} 
        className="mb-6 xs:-mx-0 mx-5"
      >
        <div className="border border-gray-400 dark:border-gray-100 rounded-xl p-2 xs:p-4 bg-gray-100 dark:bg-stone-900 shadow-sm min-h-[200px]">
          <div className="flex items-center justify-center h-32">
            <div className="text-red-500 text-center">
              <p className="text-lg font-semibold">Error loading model demand data</p>
              <p className="text-sm mt-2">{error}</p>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  const data = modelDemandData?.data;
  const sortedModels = getSortedData(data?.popular_models);

  return (
    <motion.div 
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }} 
      className="xs:-mx-0 -mx-1 mt-5 px-1"
    >
      <div className="rounded-xl p-2">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <h1 className="font-extrabold text-xl sm:text-2xl text-neutral-800 dark:text-white">
              Model Demand
            </h1>
            {/* <MdFilterList className="text-neutral-600 dark:text-neutral-400 text-lg" /> */}
          </div>
          
          {/* Summary Stats */}
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center bg-blue-100 dark:bg-blue-800/30 rounded-md p-1 xs:px-3 xs:py-2 border border-gray-300 dark:border-neutral-400">
              <MdSmartToy className="text-blue-500 text-xs mr-1.5" />
              <span className="text-blue-700 dark:text-blue-300 font-medium text-xs">
                {data?.total_models_tracked || 0} Models
              </span>
            </div>
            <div className="flex items-center bg-green-100 dark:bg-green-800/30 rounded-md p-1 xs:px-3 xs:py-2 border border-gray-300 dark:border-neutral-400">
              <MdCircle className="text-green-500 text-xs mr-1.5" />
              <span className="text-green-700 dark:text-green-300 font-medium text-xs">
                {data?.models_with_recent_activity || 0} Active
              </span>
            </div>
          </div>
        </div>

        {/* Table/List View */}
        <div className="hidden sm:block overflow-x-auto">
          {data?.popular_models && data.popular_models.length > 0 ? (
            <div className="bg-neutral-50 dark:bg-neutral-800 rounded-xl border border-neutral-300 dark:border-neutral-600 overflow-hidden">
              {/* Table Header */}
              <div className="bg-neutral-100 dark:bg-neutral-700 border-b border-neutral-300 dark:border-neutral-600">
                <div className="grid grid-cols-12 gap-2 p-3 text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wide">
                  <div 
                    className="col-span-4 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 flex items-center"
                    onClick={() => handleSort('model_name')}
                  >
                    Model Name
                    <MdSort className="ml-1 text-xs" />
                  </div>
                  <div 
                    className="col-span-2 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 flex items-center justify-center"
                    onClick={() => handleSort('total_requests')}
                  >
                    Total
                    <MdSort className="ml-1 text-xs" />
                  </div>
                  <div 
                    className="col-span-2 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 flex items-center justify-center"
                    onClick={() => handleSort('recent_requests')}
                  >
                    Recent
                    <MdSort className="ml-1 text-xs" />
                  </div>
                  <div className="col-span-2 text-center">Popularity</div>
                  <div className="col-span-2 text-center">Last Access</div>
                </div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-neutral-200 dark:divide-neutral-600">
                {sortedModels.map((model, index) => (
                  <motion.div
                    key={model.model_name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.03 }}
                    className="p-3 sm:grid sm:grid-cols-12 gap-2 dark:hover:bg-neutral-600 hover:bg-neutral-100 transition-colors duration-200 border-b border-neutral-200 dark:border-neutral-600"
                  >
                    {/* Mobile Card View */}
                    <div className="block sm:hidden">
                      <div className="mb-2 font-semibold text-sm text-neutral-800 dark:text-white">
                        {formatModelName(model.model_name)}
                      </div>
                      <div className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">
                        {model.model_name}
                      </div>
                      <div className="flex flex-wrap gap-2 text-sm text-neutral-700 dark:text-neutral-300">
                        <div className="flex items-center">
                          <MdBarChart className="text-blue-500 text-sm mr-1" />
                          {model.total_requests} total
                        </div>
                        <div className="flex items-center">
                          <MdTrendingUp className="text-green-500 text-sm mr-1" />
                          {model.recent_requests} recent
                        </div>
                        <div className="flex items-center">
                          <MdAccessTime className="text-neutral-500 text-sm mr-1" />
                          {formatTimeAgo(model.last_accessed)}
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          getPopularityLevel(model.total_requests) === 'High' ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200' :
                          getPopularityLevel(model.total_requests) === 'Medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200' :
                          'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-200'
                        }`}>
                          {getPopularityLevel(model.total_requests)}
                        </span>
                      </div>
                    </div>

                    {/* Desktop Grid View */}
                    <div className="hidden sm:flex col-span-4 items-center">
                      <div className="flex items-center">
                        {model.has_distribution && (
                          <MdCircle className="text-green-500 text-xs mr-2 flex-shrink-0" />
                        )}
                        <div className="min-w-0">
                          <p className="font-semibold text-sm text-neutral-800 dark:text-white truncate">
                            {formatModelName(model.model_name)}
                          </p>
                          <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                            {model.model_name}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="hidden sm:flex col-span-2 items-center justify-center">
                      <MdBarChart className="text-blue-500 text-sm mr-1" />
                      <span className="font-semibold text-sm text-neutral-800 dark:text-white">
                        {model.total_requests}
                      </span>
                    </div>

                    <div className="hidden sm:flex col-span-2 items-center justify-center">
                      <MdTrendingUp className="text-green-500 text-sm mr-1" />
                      <span className="font-semibold text-sm text-neutral-800 dark:text-white">
                        {model.recent_requests}
                      </span>
                    </div>

                    <div className="hidden sm:flex col-span-2 items-center justify-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        getPopularityLevel(model.total_requests) === 'High' ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200' :
                        getPopularityLevel(model.total_requests) === 'Medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200' :
                        'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-200'
                      }`}>
                        {getPopularityLevel(model.total_requests)}
                      </span>
                    </div>

                    <div className="hidden sm:flex col-span-2 items-center justify-center">
                      <MdAccessTime className="text-neutral-500 text-sm mr-1" />
                      <span className="text-xs text-neutral-600 dark:text-neutral-400">
                        {formatTimeAgo(model.last_accessed)}
                      </span>
                    </div>
                  </motion.div>
                ))}

              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-32 bg-neutral-50 dark:bg-neutral-800 rounded-xl border border-neutral-300 dark:border-neutral-600">
              <div className="text-center text-neutral-600 dark:text-neutral-400">
                <MdSmartToy className="text-4xl mx-auto mb-2 opacity-50" />
                <p>No model demand data available</p>
              </div>
            </div>
        )}
        </div>

        <div className="sm:hidden">
        { /* Popular Models Grid */}
        {data?.popular_models && data.popular_models.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {data.popular_models.map((model, index) => (
              <motion.div
                key={model.model_name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-neutral-100 dark:bg-neutral-800 rounded-2xl p-4 shadow-lg border-2 border-neutral-400 dark:border-neutral-300 hover:shadow-xl transition-shadow duration-300"
              >
                {/* Model Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-neutral-800 dark:text-white mb-1">
                      {formatModelName(model.model_name)}
                    </h3>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 truncate">
                      {model.model_name}
                    </p>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${getPopularityColor(model.total_requests)} animate-pulse`}></div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="bg-neutral-50 dark:bg-neutral-700 rounded-lg p-2 px-3 border border-gray-300 dark:border-gray-600">
                    <div className="flex items-center mb-1">
                      <MdBarChart className="text-blue-500 text-sm mr-1" />
                      <span className="text-xs text-neutral-600 dark:text-neutral-400">Total Requests</span>
                    </div>
                    <p className="font-bold text-lg text-neutral-800 dark:text-white">
                      {model.total_requests}
                    </p>
                  </div>
                  
                  <div className="bg-neutral-50 dark:bg-neutral-700 rounded-lg p-2 px-3 border border-gray-300 dark:border-gray-600">
                    <div className="flex items-center mb-1">
                      <MdTrendingUp className="text-green-500 text-sm mr-1" />
                      <span className="text-xs text-neutral-600 dark:text-neutral-400">Recent Requests</span>
                    </div>
                    <p className="font-bold text-lg text-neutral-800 dark:text-white">
                      {model.recent_requests}
                    </p>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <MdAccessTime className="text-neutral-500 text-sm mr-1" />
                      <span className="text-xs text-neutral-600 dark:text-neutral-400">Last accessed</span>
                    </div>
                    <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                      {model.last_accessed_human || formatTimeAgo(model.last_accessed)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-neutral-600 dark:text-neutral-400">Popularity</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      getPopularityLevel(model.total_requests) === 'High' ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200' :
                      getPopularityLevel(model.total_requests) === 'Medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200' :
                      'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-200'
                    }`}>
                      {getPopularityLevel(model.total_requests)}
                    </span>
                  </div>
                  
                  {model.has_distribution && (
                    <div className="flex items-center">
                      <MdCircle className="text-green-500 text-xs mr-1" />
                      <span className="text-xs text-neutral-600 dark:text-neutral-400">Available on network</span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-32">
            <div className="text-center text-neutral-600 dark:text-neutral-400">
              <MdSmartToy className="text-4xl mx-auto mb-2 opacity-50" />
              <p>No model demand data available</p>
            </div>
          </div>
        )}
        </div>

        {/* Footer Info */}
        {data && (
          <div className="mt-4 pt-3 border-t border-gray-300 dark:border-gray-600">
            <div className="flex flex-wrap justify-center gap-4 text-xs text-neutral-600 dark:text-neutral-400">
              <span>Time period: {data.time_period_days} days</span>
              <span>•</span>
              <span>Generated: {new Date(data.generated_at * 1000).toLocaleString()}</span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ModelDemand;