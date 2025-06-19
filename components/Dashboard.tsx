'use client';
import React, { useEffect, useState, useCallback } from 'react';
import type { Entry } from '@/app/types/entry';
import type { NutritionalGoal } from '@/app/types/goal';
import dynamic from 'next/dynamic';
import EntryList from './EntryList';
import { useCopilotAction, useCopilotChat, useCopilotReadable } from "@copilotkit/react-core";
import { CopilotPopup } from "@copilotkit/react-ui";

const ChartNutrients = dynamic(() => import('./ChartNutrient'), { ssr: false });
const ChartCalories = dynamic(() => import('./ChartCalories'), { ssr: false });

type EntryWithDeleting = Entry & { deleting?: boolean };
const isSameDay = (date1: Date, date2: Date): boolean => (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
  
const formatDateDisplay = (date: Date): string => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    if (isSameDay(date, today)) return 'Today';
    if (isSameDay(date, yesterday)) return 'Yesterday';
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
};
  

const Dashboard: React.FC = () => {
  const [allEntries, setAllEntries] = useState<EntryWithDeleting[]>([]);
  const [dailyEntries, setDailyEntries] = useState<EntryWithDeleting[]>([]);
  const [goal, setGoal] = useState<NutritionalGoal>();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dateTotals, setDateTotals] = useState({ carbohydrates: 0, protein: 0, fats: 0, calories: 0 });
  const [isGoalLoading, setIsGoalLoading] = useState<boolean>(true);
  const [isEntriesLoading, setIsEntriesLoading] = useState<boolean>(true);
  
  const { reset } = useCopilotChat();

  const processGoalUpdate = useCallback(async (goalData: Omit<NutritionalGoal, 'id' | 'identifier' | 'createdAt' | 'updatedAt'>): Promise<boolean> => {
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
      setGoal(updatedGoal);
      alert("Your nutritional goals have been updated successfully!");
      reset();
      return true;
    } catch (error) {
      console.error("Goal submission error:", error);
      alert("Something went wrong while saving your goals. Please try again.");
      return false;
    }
  }, [reset]);

  useCopilotReadable({
    description: "The user's nutritional goal for the day.",
    value: goal,
});

useCopilotReadable({
    description: "The user's food entries for the selected day.",
    value: dailyEntries,
});

  useCopilotAction({
    name: "calculateAndSetNutritionalGoal",
    description: "Calculates and sets the user's daily nutritional goals.",
    parameters: [
        { name: "age", type: "number", description: "User's age in years.", required: true },
        { name: "sex", type: "string", description: "User's biological sex ('male' or 'female').", required: true, enum: ["male", "female"] },
        { name: "height", type: "number", description: "User's height in centimeters.", required: true },
        { name: "weight", type: "number", description: "User's weight in kilograms.", required: true },
        { name: "activityLevel", type: "string", description: "User's activity level.", required: true, enum: ["sedentary", "light", "moderate", "active", "very_active"] },
        { name: "fitnessGoal", type: "string", description: "User's fitness goal.", required: true, enum: ["weight_loss", "maintenance", "muscle_gain"] },
    ],
    handler: async (profile) => {
        const bmr = (profile.sex === "male") 
            ? (10 * profile.weight) + (6.25 * profile.height) - (5 * profile.age) + 5
            : (10 * profile.weight) + (6.25 * profile.height) - (5 * profile.age) - 161;

        const activityMultipliers = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, very_active: 1.9 };
        const tdee = bmr * activityMultipliers[profile.activityLevel];

        let targetCalories = tdee;
        if (profile.fitnessGoal === "weight_loss") targetCalories -= 500;
        else if (profile.fitnessGoal === "muscle_gain") targetCalories += 300;

        const calculatedGoal = {
            calories: Math.round(Math.max(targetCalories, 1200)),
            protein: Math.round(profile.weight * 1.8),
            fats: Math.round((targetCalories * 0.25) / 9),
            carbohydrates: Math.round((targetCalories - (Math.round(profile.weight * 1.8) * 4) - ((targetCalories * 0.25))) / 4),
        };

        const success = await processGoalUpdate(calculatedGoal);
        return success ? "Okay, I've set your new nutritional goals." : "I encountered an issue while saving your goals.";
    },
  });

  const processEntry = async (entryData: Omit<Entry, 'id' | 'createdAt'>) => {
    try {
      const response = await fetch("/api/entry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entryData),
      });

      if (!response.ok) throw new Error("Failed to save entry");

      const newEntry = await response.json();
      setAllEntries(prevEntries => [{ ...newEntry, isNew: true }, ...prevEntries]);
      return true;
    } catch (error) {
      console.error("Submission error:", error);
      alert("Something went wrong while submitting. Please try again.");
      return false;
    }
  };

  useCopilotAction({
    name: "addFoodEntry",
    description: "Add a new food entry with its nutritional values.",
    parameters: [
      { name: "foodText", type: "string", description: "Description of the food eaten.", required: true },
      { name: "caloriesValue", type: "number", description: "Total calories.", required: true },
      { name: "proteinValue", type: "number", description: "Protein in grams.", required: true },
      { name: "fatsValue", type: "number", description: "Fats in grams.", required: true },
      { name: "carbohydratesValue", type: "number", description: "Carbohydrates in grams.", required: true },
    ],
    handler: async (args) => {
      const dataForApi = {
        text: args.foodText.trim(),
        calories: Number(args.caloriesValue),
        protein: Number(args.proteinValue),
        fats: Number(args.fatsValue),
        carbohydrates: Number(args.carbohydratesValue),
      };
      await processEntry(dataForApi);
    },
  });


  useCopilotAction({
    name: "deleteFoodEntry",
    description: "Delete a food entry from the list.",
    parameters: [
      {
        name: "id",
        type: "number",
        description: "The ID of the food entry to delete.",
        required: true,
      },
    ],
    handler: async ({ id }) => {
      await handleDeleteEntry(id);
      return "Entry deleted successfully.";
    },
});

  useEffect(() => {
    const fetchGoal = async () => {
      setIsGoalLoading(true);
      try {
        const res = await fetch('/api/goal');
        if (res.ok) setGoal(await res.json());
      } catch (error) { console.error('Error fetching goal:', error); }
      finally { setIsGoalLoading(false); }
    };
    fetchGoal();
  }, []);

  useEffect(() => {
    const fetchEntries = async () => {
      setIsEntriesLoading(true);
      try {
        const res = await fetch('/api/entry');
        if (res.ok) setAllEntries(await res.json());
      } catch (error) { console.error('Error fetching entries:', error); }
      finally { setIsEntriesLoading(false); }
    };
    fetchEntries();
  }, []);

  useEffect(() => {
    const entriesForSelectedDate = allEntries.filter((entry) =>
      isSameDay(new Date(entry.createdAt), selectedDate)
    );
    const totals = entriesForSelectedDate.reduce(
      (acc, entry) => {
        acc.carbohydrates += entry.carbohydrates;
        acc.protein += entry.protein;
        acc.fats += entry.fats;
        acc.calories += entry.calories;
        return acc;
      }, { carbohydrates: 0, protein: 0, fats: 0, calories: 0 });
    
    setDateTotals(totals);
    setDailyEntries(entriesForSelectedDate);
  }, [selectedDate, allEntries]);

  const handlePreviousDay = () => setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() - 1)));
const handleNextDay = () => {
    const nextDay = new Date(selectedDate);
    nextDay.setDate(selectedDate.getDate() + 1);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0); 
    nextDay.setHours(0, 0, 0, 0);

    if (nextDay > today) {
        return;
    }
    setSelectedDate(nextDay);
  };
  
  const handleDeleteEntry = async (id: number) => {
    if (allEntries.find((e) => e.id === id)?.deleting) return;
    setAllEntries((prev) => prev.map((entry) => (entry.id === id ? { ...entry, deleting: true } : entry)));
    try {
      await fetch("/api/entry", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
      setAllEntries((prev) => prev.filter((entry) => entry.id !== id));
    } catch (error) {
      console.error("Failed to delete entry." + error);
      setAllEntries((prev) => prev.map((entry) => (entry.id === id ? { ...entry, deleting: false } : entry)));
    }
  };


  if (isGoalLoading && isEntriesLoading) {
    return <div className="p-6 text-center">Loading dashboard...</div>;
  }

  const isTodaySelected = isSameDay(selectedDate, new Date());

  return (
    <>
<CopilotPopup
        instructions={
          "You are a friendly and helpful AI assistant for Bite2Bite. Your goal is to help users track their nutrition. You have two primary capabilities." +
          "\n\n**1. Logging Food Entries:**" +
          "\nWhen a user describes a meal (e.g., 'I had a chicken salad for lunch'), your task is to estimate its nutritional values (calories, protein, fats, carbohydrates). Use your knowledge of common ingredients and portion sizes to provide reasonable averages. If the food description is vague, make educated assumptions but clearly state them. Always provide values in grams for macronutrients and kcal for calories. Once you have the information, use the `addFoodEntry` action to log it." +
          "\n\n**2. Calculating Nutritional Goals:**" +
          "\nIf a user wants to set or update their nutritional goals (e.g., 'help me find my calorie target' or 'I want to change my goals'), you must guide them through a personalized calculation. To do this, you need to ask for the following details, one or two at a time to keep the conversation natural:" +
          "\n- Age (in years)" +
          "\n- Biological sex ('male' or 'female')" +
          "\n- Height (in centimeters)" +
          "\n- Weight (in kilograms)" +
          "\n- Activity level (suggest options: 'sedentary', 'light', 'moderate', 'active', 'very_active')" +
          "\n- Fitness goal (suggest options: 'weight_loss', 'maintenance', 'muscle_gain')" +
          "\nBriefly explain why each piece of information is useful. Once you have all the details, confirm them with the user, and then call the `calculateAndSetNutritionalGoal` action. **Crucially, do not perform the final calculation yourself.** Your role is to gather the information and trigger the action." +
          "\n\nListen to the user's request to determine which capability to use. Be friendly and conversational."
        }
        labels={{
          title: "Bite2Byte AI Assistant",
          initial: "Hi! How can I help you? You can ask me to log a meal or to calculate your nutritional goals.",
        }}
      />
      <div className="flex items-center justify-center gap-2 sm:gap-4 mb-8">
        <button onClick={handlePreviousDay} aria-label="Previous day" className="p-2 bg-white hover:bg-gray-100 border border-gray-200 rounded-full shadow-sm transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
        </button>
        <span className="text-lg font-semibold w-40 text-center text-gray-700">{formatDateDisplay(selectedDate)}</span>
        <button onClick={handleNextDay} disabled={isTodaySelected} aria-label="Next day" className="p-2 rounded-full transition-colors disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed bg-white hover:bg-gray-100 border border-gray-200 shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
        </button>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
        <div className="flex flex-col gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <ChartCalories goal={goal?.calories ?? 0} current={dateTotals.calories} color="#79AA94" metric="Calories" barHeight={40} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-4 rounded-2xl shadow-md flex flex-col items-center justify-center">
              <ChartNutrients goal={goal?.carbohydrates ?? 0} current={dateTotals.carbohydrates} color="#79AA94" circleSize={160} metric="Carbohydrates" />
            </div>
            <div className="bg-white p-4 rounded-2xl shadow-md flex flex-col items-center justify-center">
              <ChartNutrients goal={goal?.protein ?? 0} current={dateTotals.protein} color="#80A7C7" circleSize={160} metric="Protein" />
            </div>
            <div className="bg-white p-4 rounded-2xl shadow-md flex flex-col items-center justify-center">
              <ChartNutrients goal={goal?.fats ?? 0} current={dateTotals.fats} color="#D3CBA9" circleSize={160} metric="Fats" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md">
          <EntryList 
            entries={dailyEntries}
            isLoading={isEntriesLoading}
            onDelete={handleDeleteEntry}
            title={`Entries for ${formatDateDisplay(selectedDate)}`}
            emptyStateMessage={{ title: "No entries for this day", description: "You haven't tracked any meals for this day yet." }}
          />
        </div>
      </div>
    </>
  )
}

export default Dashboard;