import React, { useState } from "react";
import batteryData from "./data/batteryData.json";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

function App() {
  const [filterCount, setFilterCount] = useState("all");

  const latestData = batteryData[batteryData.length - 1];

  const formattedTime = new Date(latestData.time).toLocaleString();

  const filteredData =
    filterCount === "all"
      ? batteryData
      : batteryData.slice(-Number(filterCount));

  const chartData = filteredData.map((item) => ({
    ...item,
    formattedTime: new Date(item.time).toLocaleTimeString(),
  }));

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-center mb-2">
        Battery Telemetry Dashboard
      </h1>

      <p className="text-center text-gray-600 mb-8">
        Last Updated: {formattedTime}
      </p>

      {/* Status Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card title="State of Charge" value={`${latestData.soc}%`}>
          {latestData.soc < 20 && (
            <p className="text-red-500 font-semibold mt-2">
              ⚠ Low Battery
            </p>
          )}
        </Card>

        <Card title="State of Health" value={`${latestData.soh}%`} />
        <Card title="Voltage" value={`${latestData.battery_voltage} V`} />
        <Card title="Current" value={`${latestData.current} A`} />
        <Card title="Charge Cycles" value={latestData.charge_cycle} />
        <Card
          title="Temperature"
          value={`${latestData.battery_temp ?? "N/A"} °C`}
        />
      </div>

      {/* Filter Buttons */}
      <div className="flex justify-center gap-4 mt-10">
  {[
    { label: "All Data", value: "all" },
    { label: "Last 2 Records", value: "2" },
    { label: "Last 1 Record", value: "1" },
  ].map((btn) => (
    <button
      key={btn.value}
      onClick={() => setFilterCount(btn.value)}
      className={`px-5 py-2 rounded-lg font-medium transition 
        ${
          filterCount === btn.value
            ? "bg-blue-600 text-white shadow-md"
            : "bg-white text-gray-700 border hover:bg-gray-100"
        }`}
    >
      {btn.label}
    </button>
  ))}
</div>
      {/* Charts Section */}
      <div className="grid gap-8 mt-10">

        {/* SoC Chart */}
        <ChartCard title="SoC Trend Over Time">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="formattedTime" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="soc"
              stroke="#3b82f6"
              strokeWidth={3}
            />
          </LineChart>
        </ChartCard>

        {/* Voltage Chart */}
        <ChartCard title="Voltage Trend Over Time">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="formattedTime" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="battery_voltage"
              stroke="#10b981"
              strokeWidth={3}
            />
          </LineChart>
        </ChartCard>

        {/* Temperature Chart */}
        <ChartCard title="Temperature Trend Over Time">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="formattedTime" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="battery_temp"
              stroke="#ef4444"
              strokeWidth={3}
            />
          </LineChart>
        </ChartCard>

      </div>
    </div>
  );
}

/* ---------------- Card Component ---------------- */

function Card({ title, value, children }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 text-center">
      <h3 className="text-gray-500 text-sm mb-2">{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
      {children}
    </div>
  );
}

/* ---------------- Chart Card Component ---------------- */

function ChartCard({ title, children }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 text-center">
        {title}
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        {children}
      </ResponsiveContainer>
    </div>
  );
}

export default App;