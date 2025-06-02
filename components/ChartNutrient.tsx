import React from "react";
import { PolarAngleAxis, RadialBar, RadialBarChart } from "recharts";

interface ChartNutrientsProps {
  goal: number;
  current: number;
  color: string;
  circleSize?: number;
  metric?: string;
}

const defaultCircleSize = 300;

const ChartNutrients: React.FC<ChartNutrientsProps> = ({
  goal,
  current,
  color,
  circleSize,
  metric,
}) => {
  const data = [{ name: metric, value: (current / goal) * 100 }];
  const remainingValue = goal - current;
  const baseFontSize = (circleSize || defaultCircleSize) * 0.1;

  let currentBarColor = color;
  let currentFontColor = "#000";

  if (current > goal) {
    currentBarColor = "#835A68";
    currentFontColor = "#835A68";
  }

  if (circleSize === undefined) {
    circleSize = defaultCircleSize;
  }

  return (
    <div className="chartNutrient flex flex-col items-center justify-center">
      <h2 className="text-xl font-semibold">{metric}</h2>
      <div className="text-center">
        <span className="text-md">
          {current}g of {goal}g
        </span>
        <br />
        <span className="text-xs text-gray-500 ml-1">
          ({((current / goal) * 100).toFixed(1)}%)
        </span>
      </div>
      <RadialBarChart
        width={circleSize}
        height={circleSize}
        cx={circleSize / 2}
        cy={circleSize / 2}
        innerRadius={circleSize * 0.35}
        outerRadius={circleSize * 0.45}
        barSize={circleSize * 0.1}
        data={data}
        startAngle={90}
        endAngle={-270}
      >
        <PolarAngleAxis
          type="number"
          domain={[0, 100]}
          angleAxisId={0}
          tick={false}
        />
        <RadialBar
          background
          dataKey="value"
          cornerRadius={circleSize / 2}
          fill={currentBarColor}
        />
        <text
          x={circleSize / 2}
          y={circleSize / 2}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={baseFontSize}
          className="font-semibold"
        >
          {current > goal ? (
            <>
              <tspan x={circleSize / 2} dy={-baseFontSize * 0.6}>
                ⚠️
              </tspan>
              <tspan
                x={circleSize / 2}
                dy={baseFontSize * 1.2}
                fill={currentFontColor}
              >
                {remainingValue * -1}g over
              </tspan>
            </>
          ) : (
            <tspan x={circleSize / 2} fill={currentFontColor}>
              {remainingValue}g left
            </tspan>
          )}
        </text>
      </RadialBarChart>
    </div>
  );
};

export default ChartNutrients;
