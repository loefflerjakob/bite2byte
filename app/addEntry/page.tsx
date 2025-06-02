"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useCopilotAction } from "@copilotkit/react-core";
import { CopilotChat } from "@copilotkit/react-ui";
import ManualForm from "@/components/ManualEntryForm";
import Button from "@/components/Button";
import { Entry } from "@/app/types/entry";

const AddEntryPage: React.FC = () => {
  const router = useRouter();
  const [text, setText] = React.useState("");
  const [calories, setCalories] = React.useState(0);
  const [protein, setProtein] = React.useState(0);
  const [fats, setFats] = React.useState(0);
  const [carbohydrates, setCarbohydrates] = React.useState(0);
  const [showManualForm, setShowManualForm] = React.useState(false);

  const toggleManualForm = () => {
    setShowManualForm((prev) => !prev);
  };

const processEntry = async (entryData: Omit<Entry, "id" | "createdAt">) => {
    if (!entryData.text.trim()) {
      alert("Please enter what you ate.");
      return false;
    }

    if (
      entryData.calories <= 0 ||
      entryData.protein < 0 ||
      entryData.fats < 0 ||
      entryData.carbohydrates < 0
    ) {
      alert(
        "Please enter valid nutrition values (calories must be > 0, others >= 0)."
      );
      return false;
    }

    try {
      const response = await fetch("/api/entry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entryData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(`Failed to save entry: ${errorData.message || "Unknown error"}`);
        return false;
      }

      router.push("/entryList");
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
      {
        name: "foodText",
        type: "string",
        description:
          "The name or description of the food eaten (e.g., 'Chicken breast with rice and broccoli').",
        required: true,
      },
      {
        name: "caloriesValue",
        type: "number",
        description:
          "The total number of calories for the food item (e.g., 550). Must be greater than 0.",
        required: true,
      },
      {
        name: "proteinValue",
        type: "number",
        description:
          "The amount of protein in grams (e.g., 45). Must be 0 or greater.",
        required: true,
      },
      {
        name: "fatsValue",
        type: "number",
        description:
          "The amount of fats in grams (e.g., 15). Must be 0 or greater.",
        required: true,
      },
      {
        name: "carbohydratesValue",
        type: "number",
        description:
          "The amount of carbohydrates in grams (e.g., 60). Must be 0 or greater.",
        required: true,
      },
    ],
    handler: async ({
      foodText,
      caloriesValue,
      proteinValue,
      fatsValue,
      carbohydratesValue,
    }) => {
      console.log("Copilot action 'addFoodEntry' triggered with data:", {
        foodText,
        caloriesValue,
        proteinValue,
        fatsValue,
        carbohydratesValue,
      });

      const dataForApi = {
        text: foodText.trim(),
        calories: Number(caloriesValue),
        protein: Number(proteinValue),
        fats: Number(fatsValue),
        carbohydrates: Number(carbohydratesValue),
      };

    

      const success = await processEntry(dataForApi);

      if (success) {
        console.log("Food entry added successfully via Copilot.");
      } else {
        console.error("Failed to add food entry via Copilot.");
      }
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      text: text.trim(),
      calories,
      protein,
      fats,
      carbohydrates,
    };
    const success = await processEntry(data);
    if (success) {
      setText("");
      setCalories(0);
      setProtein(0);
      setFats(0);
      setCarbohydrates(0);
    }
  };

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold mb-4">Add New Entry</h1>
      <CopilotChat
        instructions={
          "You are a nutrition estimation assistant. Given a food item or meal, estimate the approximate calories, fats, protein, and carbohydrate content. Use your knowledge of common ingredients and portion sizes to provide reasonable averages. If the food is vague or ambiguous, make educated assumptions and clearly indicate any uncertainties. Always provide values in grams for macronutrients and kcal for calories."
        }
        labels={{
          title: "Bite2Bite AI",
          initial: "Hi! 👋 What meal do you want to track?",
        }}
        className="w-full max-w-md mb-4"
      />
      <Button onClick={toggleManualForm}>{showManualForm ? "Hide manual form" : "Or add entry manually"}</Button>
      {showManualForm && (
        <ManualForm
          text={text}
          setText={setText}
          calories={calories}
          setCalories={setCalories}
          protein={protein}
          setProtein={setProtein}
          fats={fats}
          setFats={setFats}
          carbohydrates={carbohydrates}
          setCarbohydrates={setCarbohydrates}
          handleSubmit={handleSubmit}
        />
      )}
    </div>
  );
};

export default AddEntryPage;
