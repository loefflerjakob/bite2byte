import React from "react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";

interface ChartCaloriesProps {
  goal: number;
  current: number;
  color: string;
  barHeight?: number;
  metric?: string;
}

const defaultBarHeight = 30;

const ChartCalories: React.FC<ChartCaloriesProps> = ({
  goal,
  current,
  color,
  barHeight,
  metric,
}) => {
  const safeGoal = goal > 0 ? goal : 1;
  const progress = (current / safeGoal) * 100;

  const remainingValue = goal - current;
  const barSize = barHeight ?? defaultBarHeight;

  let currentBarColor = color;

  if (current > goal) {
    currentBarColor = "#835A68";
  }

  const data = [
    {
      name: metric || "Calories",
      current: current,
    },
  ];

  return (
    <div className="chartCalories flex flex-col items-center justify-center w-full max-w-xl">
      <h2 className="">{metric || "Calories"}</h2>
      <div className="text-center mb-4">
        <span className="text-md">
          {current} kcal of {goal} kcal
        </span>
        <br />
        <span className="text-xs text-gray-500 ml-1">
          ({progress.toFixed(1)}%)
        </span>
      </div>

      <div style={{ width: '100%', height: barSize + 20 }}>
        <ResponsiveContainer>
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 0, right: 20, left: 20, bottom: 0 }}
          >
            <XAxis type="number" domain={[0, safeGoal]} hide />
            <YAxis type="category" dataKey="name" hide />
            <Bar
              dataKey="current"
              fill={currentBarColor}
              barSize={barSize}
              radius={[8, 8, 8, 8]}
              background={(props) => {
                const { x, y, width, height } = props;
                return (
                  <rect
                    x={x}
                    y={y}
                    width={width}
                    height={height}
                    rx={8}
                    ry={8}
                    fill="#eee"
                  />
                );
              }}
            ></Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      {current > goal ? (
        <div className=" mt-0.5">
          <span className="text-lg font-bold">
            {Math.abs(remainingValue)} kcal. over ⚠️
          </span>
        </div>
      ) : (
        <div className=" mt-0.5">
          <span className="text-lg font-bold">
            {Math.abs(remainingValue)} kcal. left
          </span>
        </div>
      )}
    </div>
  );
};

export default ChartCalories;