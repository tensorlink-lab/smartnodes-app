import React from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import CircularProgress from '@mui/material/CircularProgress';
import { useMediaQuery } from "react-responsive"; // Install react-responsive if needed
import { LineChart } from '@mui/x-charts/LineChart';
import Button from '@mui/material/IconButton';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz'; // swap icon
import { useState } from 'react';

const SupplyStatsCard = ({ supplyStats }) => {
  const emissionsData = [
    { date: new Date("2025-09-01"), validator: 0, worker: 0, dao: 0 },
    { date: new Date("2026-09-01"), validator: 4917375, worker: 41797687.5, dao: 2458687.5 },
    { date: new Date("2027-09-01"), validator: 7867800, worker: 66876300, dao: 3933900 },
    { date: new Date("2028-09-01"), validator: 9638055, worker: 81923467.5, dao: 4819027.5 },
    { date: new Date("2029-09-01"), validator: 10700208, worker: 90951768, dao: 5350104},
    { date: new Date("2030-09-01"), validator: 11337499.8, worker: 96368748.3, dao: 5668749.9},
    { date: new Date("2031-09-01"), validator: 11719525.2, worker: 99615964.2, dao: 5859762.6},
    { date: new Date("2032-09-01"), validator: 12101550.6, worker: 102863180.1, dao: 6050775.3},
  ];
  const dates = emissionsData.map(d => d.date);
  const validatorData = emissionsData.map(d => d.validator);
  const workerData = emissionsData.map(d => d.worker);
  const daoData = emissionsData.map(d => d.dao);

  const isSmallScreen = useMediaQuery({ maxWidth: 640 }); // Tailwind's 'sm' breakpoint
  const [showEmissionsChart, setShowEmissionsChart] = useState(false);
  
  // Check if data is still loading
  const isLoading = !supplyStats || supplyStats.length < 3 || 
                    supplyStats.some(item => item.amount === "-" || isNaN(Number(item.amount)));

  // Extract necessary amounts
  const totalSupply = !isLoading ? (supplyStats.find(item => item.title === "Total Supply")?.amount || 0) : 0;
  const locked = !isLoading ? (supplyStats.find(item => item.title === "Locked")?.amount || 0) : 0;
  const unclaimed = !isLoading ? (supplyStats.find(item => item.title === "Unclaimed Rewards")?.amount || 0) : 0;

  // Compute circulating supply
  const circulatingSupply = totalSupply - locked - unclaimed;

  // Format percentage for tooltip
  const formatPercentage = (value) => {
    const percentage = (value / totalSupply) * 100;
    return percentage.toFixed(2) + '%';
  };

  // Format number for display
  const formatNumber = (number) => {
    return number.toLocaleString(undefined, { 
      minimumFractionDigits: 0, 
      maximumFractionDigits: 1 
    });
  };

  // Prepare pie chart data with subcategories for tooltips
  const pieData = !isLoading ? [
    { 
      id: 0, 
      value: locked, 
      label: "Locked", 
      color: "#85deca",
      subcategories: [
        { name: "Amount", value: formatNumber(locked) + " SNO" },
        { name: "Percentage", value: formatPercentage(locked) },
        { name: "Category", value: "Locked in contracts" }
      ]
    },
    { 
      id: 1, 
      value: unclaimed, 
      label: "Unclaimed", 
      color: "#f7a6a0",
      subcategories: [
        { name: "Amount", value: formatNumber(unclaimed) + " SNO" },
        { name: "Percentage", value: formatPercentage(unclaimed) },
        { name: "Category", value: "Pending rewards" }
      ]
    },
    { 
      id: 2, 
      value: circulatingSupply, 
      label: "Circulating", 
      color: "#aaf7b6",
      subcategories: [
        { name: "Amount", value: formatNumber(circulatingSupply) + " SNO" },
        { name: "Percentage", value: formatPercentage(circulatingSupply) },
        { name: "Category", value: "Actively traded" }
      ]
    }
  ] : [];

  // Loading spinner component
  const LoadingSpinner = () => (
    <CircularProgress className="mt-5"/>  
  );

  return (
    <div className="flex md:flex-row flex-col">
      <div className="bg-neutral-200 dark:bg-slate-700 rounded-xl mr-3 dark:text-gray-200 dark:bg-secondary-dark-bg w-full p-8 pt-10 ss:pt-14 border dark:border-gray-400 border-black">
        {/* Display "Current Supply" on top */}
        {supplyStats.map((item, index) => (
          item.title === "Total Supply" && (
            <div className="mb-4 mt-1" key={index}>
              <p className="font-bold text-xl md:text-2xl text-gray-400">{item.title}</p>
              <div className="flex items-baseline">
                <p className="xs:text-3xl text-2xl md:text-4xl font-semibold break-words max-w-full overflow-hidden">
                  {(isNaN(Number(item.amount)) ? '-' : Number(item.amount).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 1 }))}
                </p>
                <p className="xs:text-2xl text-lg ml-2">SNO</p>
              </div>
            </div>
          )
        ))}

        {/* Display the rest of the values in the row beneath */}
        <div className="flex flex-wrap justify-start mb-3 items-center">
          {supplyStats.map((item, index) => (
            item.title !== "Total Supply" && (
              <div key={index} className="mr-5">
                <div key={index}>
                  <p className="font-bold md:text-xl text-gray-400 mt-2">{item.title}</p>
                  <p className="text-2xl break-words max-w-full overflow-hidden">
                    {(isNaN(Number(item.amount)) ? '-' : Number(item.amount).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 1 }))}
                  </p>
                </div>
              </div>
            )
          ))}
        </div>
      </div>

      {/* Right: Pie Chart (only show on md+ screens) */}
      <div className="flex flex-col items-center justify-center md:mt-0 mt-3 bg-slate-300 dark:bg-neutral-400 min-w-[220px] sm:min-w-[500px] rounded-xl border dark:border-gray-300 border-black">
        <div className="w-full flex justify-between items-center px-4">
          <p className="text-xl font-semibold text-gray-900 mt-4">
            {showEmissionsChart ? "Projected Emissions" : "Supply Distribution"}
          </p>
          <button
            aria-label="Toggle chart"
            onClick={() => setShowEmissionsChart(!showEmissionsChart)}
            className="mt-4"
          >
            <SwapHorizIcon className="text-gray-600 dark:text-gray-200" />
          </button>
        </div>

        {isLoading ? (
          <LoadingSpinner />
        ) : showEmissionsChart ? (
          <LineChart
            className="my-2"
            xAxis={[{
              scaleType: 'time',
              data: dates,
              valueFormatter: (date) =>
                date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' }),
              min: dates[0],
              max: dates[dates.length - 1],
              tickMinStep: 1000 * 60 * 60 * 24 * 365, // 1 year in milliseconds
            }]}
            margin={{ top: isSmallScreen ? -10 : 40, bottom: 40, left: isSmallScreen ? 0 : 100, right: 10 }}
            slotProps={{
              legend: {
                direction: 'row',
                position: { vertical: 'top', horizontal: 'middle' },
                itemMarkWidth: isSmallScreen ? 4 : 6,
                itemMarkHeight: isSmallScreen ? 4 : 6,
                markGap: isSmallScreen ? 2 : 4,
                itemGap: isSmallScreen ? 6 : 10,
                labelStyle: {
                  fontSize: isSmallScreen ? 12 : 14,
                  fill: 'black',
                  maxWidth: isSmallScreen ? 60 : 80,
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                },
              },
            }}
            series={[
              {
                id: 'dao',
                label: 'DAO',
                data: daoData,
                color: '#f7a6a0',
                stack: 'emissions',
                area: true,
              },
              {
                id: 'worker',
                label: 'Workers',
                data: workerData,
                color: '#85deca',
                stack: 'emissions',
                area: true,
              },
              {
                id: 'validator',
                label: 'Validators',
                data: validatorData,
                color: '#aaf7b6',
                stack: 'emissions',
                area: true,
              },
            ]}
            width={isSmallScreen ? 350 : 500}
            height={isSmallScreen ? 220 : 300}
          />

        ) : (
          <PieChart
            series={[{
              data: pieData,
              innerRadius: isSmallScreen ? 15 : 25,
              outerRadius: isSmallScreen ? 80 : 125,
              paddingAngle: 1,
              cornerRadius: 5,
              highlightScope: { faded: 'global', highlighted: 'item' },
              faded: { innerRadius: 30, additionalRadius: -30, color: 'black' },
            }]}
            width={isSmallScreen ? 300 : 400}
            height={isSmallScreen ? 220 : 300}
            margin={{ top: isSmallScreen ? -10 : 10, bottom: 10, left: isSmallScreen ? 0 : 120, right: 10 }}
            slotProps={{
              legend: {
                direction: isSmallScreen ? 'row' : 'column',
                position: { vertical: isSmallScreen ? 'bottom' : 'middle', horizontal: isSmallScreen ? 'middle' : 'left' },
                itemMarkWidth: isSmallScreen ? 4 : 6,
                itemMarkHeight: isSmallScreen ? 4 : 6,
                markGap: isSmallScreen ? 2 : 4,
                itemGap: isSmallScreen ? 6 : 10,
                labelStyle: {
                  fontSize: isSmallScreen ? 12 : 15,
                  fill: 'black',
                  maxWidth: isSmallScreen ? 60 : 80,
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                },
              },
            }}
          />

        //   <PieChart
        //     series={[{
        //       data: pieData,
        //       innerRadius: 25,
        //       outerRadius: 125,
        //       paddingAngle: 1,
        //       cornerRadius: 5,
        //       highlightScope: { faded: 'global', highlighted: 'item' },
        //       faded: { innerRadius: 30, additionalRadius: -30, color: 'black' },
        //     }]}
        //     width={400}
        //     height={300}
        //     margin={{ top: 10, bottom: 10, left: 120, right: 10 }}
        //     slotProps={{
        //       legend: {
        //         direction: 'column',
        //         position: { vertical: 'middle', horizontal: 'left' },
        //         itemMarkWidth: 6,
        //         itemMarkHeight: 6,
        //         markGap: 4,
        //         itemGap: 10,
        //         labelStyle: {
        //           fontSize: 15,
        //           fill: 'grey',
        //           maxWidth: 80,
        //           overflow: 'hidden',
        //           whiteSpace: 'nowrap',
        //           textOverflow: 'ellipsis',
        //         },
        //       },
        //     }}
        //   />
        )}
      </div>
    </div>
  );
};

export default SupplyStatsCard;
