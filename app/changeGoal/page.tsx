"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import ManualGoalForm from '@/components/ManualGoalForm';

interface NutritionalGoal {
  calories: number;
  protein: number;
  carbohydrates: number;
  fats: number;
}

const ChangeGoalPage: React.FC = () => {
  const router = useRouter();
  const [calories, setCalories] = useState(0);
  const [protein, setProtein] = useState(0);
  const [fats, setFats] = useState(0);
  const [carbohydrates, setCarbohydrates] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingGoal, setIsLoadingGoal] = useState(true);

  useEffect(() => {
    const fetchCurrentGoal = async () => {
      setIsLoadingGoal(true);
      try {
        const response = await fetch('/api/goal');
        if (response.ok) {
          const goalData: NutritionalGoal = await response.json();
          setCalories(goalData.calories);
          setProtein(goalData.protein);
          setCarbohydrates(goalData.carbohydrates);
          setFats(goalData.fats);
        }
      } catch (error) {
        console.error("Error fetching goal:", error);
      } finally {
        setIsLoadingGoal(false);
      }
    };
    fetchCurrentGoal();
  }, []);

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch("/api/goal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ calories, protein, carbohydrates, fats }),
      });

      if (!response.ok) {
        throw new Error("Failed to save goal");
      }
      
      alert("Your nutritional goals have been updated successfully!");
      router.push("/");
    } catch (error) {
      console.error("Goal submission error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center p-4">
      <h1>Set Goal Manually</h1>
      {isLoadingGoal ? (
        <p>Loading your current goal settings...</p>
      ) : (
        <ManualGoalForm
          calories={calories}
          setCalories={setCalories}
          protein={protein}
          setProtein={setProtein}
          fats={fats}
          setFats={setFats}
          carbohydrates={carbohydrates}
          setCarbohydrates={setCarbohydrates}
          handleSubmit={handleManualSubmit}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};

export default ChangeGoalPage;