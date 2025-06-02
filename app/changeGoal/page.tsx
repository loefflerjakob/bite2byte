"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from "next/navigation";
import { useCopilotAction, useCopilotChat } from "@copilotkit/react-core";
import { CopilotChat } from "@copilotkit/react-ui";
import ManualGoalForm from '@/components/ManualGoalForm';
import Button from "@/components/Button";

interface NutritionalGoal {
  calories: number;
  protein: number;
  carbohydrates: number;
  fats: number;
}


const defaultGoalValues: NutritionalGoal = {
  calories: 2000,
  protein: 150,
  carbohydrates: 250,
  fats: 70,
};

const ChangeGoalPage: React.FC = () => {
  const router = useRouter();
  const { reset } = useCopilotChat();

  const [calories, setCalories] = useState(defaultGoalValues.calories);
  const [protein, setProtein] = useState(defaultGoalValues.protein);
  const [fats, setFats] = useState(defaultGoalValues.fats);
  const [carbohydrates, setCarbohydrates] = useState(defaultGoalValues.carbohydrates);
  const [showManualForm, setShowManualForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingGoal, setIsLoadingGoal] = useState(true);

  const processGoalUpdate = useCallback(async (goalData: NutritionalGoal): Promise<boolean> => {
    if (
      goalData.calories <= 0 ||
      goalData.protein < 0 ||
      goalData.fats < 0 ||
      goalData.carbohydrates < 0
    ) {
      alert(
        "Please enter valid nutrition values (calories must be > 0, others >= 0)."
      );
      return false;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/goal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(goalData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(`Failed to save goal: ${errorData.error || "Unknown error"}`);
        return false;
      }

      const updatedGoal: NutritionalGoal = await response.json();
      setCalories(updatedGoal.calories);
      setProtein(updatedGoal.protein);
      setCarbohydrates(updatedGoal.carbohydrates);
      setFats(updatedGoal.fats);

      alert("Your nutritional goals have been calculated and updated successfully!");
      reset();
      router.push("/"); 
      setShowManualForm(false);
      return true;
    } catch (error) {
      console.error("Goal submission error:", error);
      alert("Something went wrong while saving your goals. Please try again.");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchCurrentGoal = useCallback(async () => {
    setIsLoadingGoal(true);
    try {
      const response = await fetch('/api/goal');
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Failed to fetch goal:", errorData.error || "Unknown error");
        setCalories(defaultGoalValues.calories);
        setProtein(defaultGoalValues.protein);
        setCarbohydrates(defaultGoalValues.carbohydrates);
        setFats(defaultGoalValues.fats);
        return;
      }
      const goalData: NutritionalGoal = await response.json();
      setCalories(goalData.calories);
      setProtein(goalData.protein);
      setCarbohydrates(goalData.carbohydrates);
      setFats(goalData.fats);
    } catch (error) {
      console.error("Error fetching goal:", error);
      setCalories(defaultGoalValues.calories);
      setProtein(defaultGoalValues.protein);
      setCarbohydrates(defaultGoalValues.carbohydrates);
      setFats(defaultGoalValues.fats);
    } finally {
      setIsLoadingGoal(false);
    }
  }, []);

  useEffect(() => {
    fetchCurrentGoal();
  }, [fetchCurrentGoal]);

  const toggleManualForm = () => {
    setShowManualForm((prev) => !prev);
  };

  useCopilotAction({
    name: "calculateAndSetNutritionalGoal",
    description: "Calculates and sets the user's daily nutritional goals based on their profile and fitness ambitions.",
    parameters: [
      { name: "age", type: "number", description: "User's age in years.", required: true },
      { name: "sex", type: "string", description: "User's biological sex ('male' or 'female').", required: true, enum: ["male", "female"] },
      { name: "height", type: "number", description: "User's height in centimeters.", required: true },
      { name: "weight", type: "number", description: "User's weight in kilograms.", required: true },
      {
        name: "activityLevel",
        type: "string",
        description: "User's general activity level.",
        required: true,
        enum: ["sedentary", "light", "moderate", "active", "very_active"],
      },
      {
        name: "fitnessGoal",
        type: "string",
        description: "User's primary fitness goal.",
        required: true,
        enum: ["weight_loss", "maintenance", "muscle_gain"],
      },
    ],
    handler: async (profile) => {
      console.log("Copilot action 'calculateAndSetNutritionalGoal' triggered with profile:", profile);
      setIsLoading(true);

      //BMR calculation with the Mifflin-St Jeor Equation
      let bmr: number;
      if (profile.sex === "male") {
        bmr = (10 * profile.weight) + (6.25 * profile.height) - (5 * profile.age) + 5;
      } else {
        bmr = (10 * profile.weight) + (6.25 * profile.height) - (5 * profile.age) - 161;
      }

      // TDEE calculation
      const activityMultipliers = {
        sedentary: 1.2,
        light: 1.375,
        moderate: 1.55,
        active: 1.725,
        very_active: 1.9,
      };
      const tdee: number = bmr * activityMultipliers[profile.activityLevel];

      let targetCalories: number = tdee;
      if (profile.fitnessGoal === "weight_loss") {
        targetCalories -= 500;
      } else if (profile.fitnessGoal === "muscle_gain") {
        targetCalories += 300;
      }
      targetCalories = Math.max(targetCalories, 1200);


      const targetProteinGrams = Math.round(profile.weight * 1.8);
      const proteinCalories = targetProteinGrams * 4;

      const fatCalories = targetCalories * 0.25;
      const targetFatGrams = Math.round(fatCalories / 9);

      const carbohydrateCalories = targetCalories - proteinCalories - fatCalories;
      const targetCarbohydrateGrams = Math.round(carbohydrateCalories / 4);

      if (targetCarbohydrateGrams < 0) {
          console.warn("Calculated carbohydrates are negative. Re-adjusting macros or calorie target might be needed.");
      }


      const calculatedGoal: NutritionalGoal = {
        calories: Math.round(targetCalories),
        protein: targetProteinGrams,
        carbohydrates: Math.max(0, targetCarbohydrateGrams),
        fats: targetFatGrams,
      };

      console.log("Calculated nutritional goal:", calculatedGoal);

      const success = await processGoalUpdate(calculatedGoal);
      setIsLoading(false);

      if (success) {
        return `Okay, I've calculated and set your new nutritional goals to approximately:
        - Calories: ${calculatedGoal.calories} kcal
        - Protein: ${calculatedGoal.protein} g
        - Carbohydrates: ${calculatedGoal.carbohydrates} g
        - Fats: ${calculatedGoal.fats} g
        Is there anything else I can help you with?`;
      } else {
        return "I encountered an issue while trying to save your calculated goals. Please try again or use the manual form.";
      }
    },
  });

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const goalData = { calories, protein, carbohydrates, fats };
    await processGoalUpdate(goalData);
  };

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold mb-4">Personalize Your Nutritional Goal</h1>
      <CopilotChat
        instructions={
          "You are a friendly and helpful AI assistant for Bite2Bite, designed to help users determine and set their daily nutritional goals. " +
          "Your primary task is to gather specific information from the user to calculate these goals. " +
          "Start by explaining that you need some information to provide personalized recommendations. " +
          "Ask the user for the following details, one or two at a time to keep the conversation natural: " +
          "1. Their age (in years). " +
          "2. Their biological sex (male or female) - briefly explain this helps in accurately estimating metabolic rate. " +
          "3. Their height (in centimeters). " +
          "4. Their weight (in kilograms). " +
          "5. Their general activity level. You can suggest options like: 'sedentary (little to no exercise)', 'light (exercise 1-3 days/week)', 'moderate (exercise 3-5 days/week)', 'active (exercise 6-7 days/week)', or 'very_active (intense exercise daily or a physically demanding job)'. " +
          "6. Their primary fitness goal, for example: 'weight_loss', 'maintenance' (to keep current weight), or 'muscle_gain'. " +
          "Once you have ALL of this information, you can briefly confirm the main points with the user (e.g., 'So, you are X years old, Y cm tall... aiming for Z. Got it!'). " +
          "Then, inform the user that you will now calculate and set their goals based on this profile. " +
          "Use the 'calculateAndSetNutritionalGoal' action to do this, passing all collected parameters. " +
          "Do NOT attempt to perform any calculations yourself or suggest specific numbers before calling the action. Your role is to collect the data accurately. " +
          "If the user asks to set specific target numbers directly (e.g., 'set my calories to 2500'), " +
          "politely explain that your main role here is to help them *calculate* personalized goals, " +
          "but they can always use the 'Or Set Goal Manually' button on the page to input specific numbers themselves if they prefer."
        }
        labels={{
          title: "Bite2Bite Goal Personalizer",
          initial: "Hi! 👋 I'm here to help you figure out and set your ideal daily nutritional goals. To start, could you tell me a bit about yourself?",
        }}
        className="w-full max-w-md mb-4"
      />
      <Button onClick={toggleManualForm}>
        {showManualForm ? "Hide Manual Goal Form" : "Or Set Goal Manually"}
      </Button>
      {isLoadingGoal && <p>Loading your current goal settings...</p>}
      {!isLoadingGoal && showManualForm && (
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
       {isLoading && !showManualForm && <p>Calculating and saving your new goals...</p>}
    </div>
  );
};

export default ChangeGoalPage;