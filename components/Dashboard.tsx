"use client";
import React, { useEffect, useState } from "react";
import type { Entry } from "@/app/types/entry";
import type { NutritionalGoal } from "@/app/types/goal";

import dynamic from "next/dynamic";

const ChartNutrients = dynamic(() => import("./ChartNutrient"), {
  ssr: false,
});

const ChartCalories = dynamic(() => import("./ChartCalories"), {
  ssr: false,
});

const Dashboard: React.FC = () => {
  const [, setEntries] = useState<Entry[]>([]);
  const [goal, setGoal] = useState<NutritionalGoal>();
  const [todayTotals, setTodayTotals] = useState({
    carbohydrates: 0,
    protein: 0,
    fats: 0,
    calories: 0, 
  });

  useEffect(() => {
    const fetchGoal = async () => {
      try {
        const res = await fetch("/api/goal");
        if (!res.ok) {
          throw new Error("Failed to fetch goal");
        }
        const data = await res.json();
        setGoal(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchGoal();
  }, []);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const res = await fetch("/api/entry");
        if (!res.ok) {
          throw new Error("Failed to fetch entries");
        }
        const data: Entry[] = await res.json();
        setEntries(data);

        const today = new Date().toISOString().split("T")[0];
        const todayEntries = data.filter((entry) =>
          entry.createdAt.startsWith(today)
        );

        const totals = todayEntries.reduce(
          (acc, entry) => {
            acc.carbohydrates += entry.carbohydrates;
            acc.protein += entry.protein;
            acc.fats += entry.fats;
            acc.calories += entry.calories;
            return acc;
          },
          { carbohydrates: 0, protein: 0, fats: 0, calories: 0 }
        );

        setTodayTotals(totals);
      } catch (error) {
        console.error(error);
      }
    };

    fetchEntries();
  }, []);

  return (
    <>
      <div className="flex md:flex-row flex-col items-center justify-center gap-4">
        <ChartNutrients
          goal={goal?.carbohydrates ?? 0}
          current={todayTotals.carbohydrates}
          color="#79AA94"
          circleSize={200}
          metric="Carbohydrates"
        />
        <ChartNutrients
          goal={goal?.protein ?? 0}
          current={todayTotals.protein}
          color="#80A7C7"
          circleSize={200}
          metric="Protein"
        />
        <ChartNutrients
          goal={goal?.fats ?? 0}
          current={todayTotals.fats}
          color="#D3CBA9"
          circleSize={200}
          metric="Fats"
        />
      </div>
      <div className="flex items-center justify-center mt-6">
        <ChartCalories
          goal={goal?.calories ?? 0}
          current={todayTotals.calories}
          color="#79AA94"
          metric="Calories"
          barHeight={40}
        />
      </div>
    </>
  );
};

export default Dashboard;
