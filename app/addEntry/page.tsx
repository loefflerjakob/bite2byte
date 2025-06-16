"use client";
import React from "react";
import { useRouter } from "next/navigation";
import ManualForm from "@/components/ManualEntryForm";
import { Entry } from "@/app/types/entry";

const AddEntryPage: React.FC = () => {
  const router = useRouter();
  const [text, setText] = React.useState("");
  const [calories, setCalories] = React.useState(0);
  const [protein, setProtein] = React.useState(0);
  const [fats, setFats] = React.useState(0);
  const [carbohydrates, setCarbohydrates] = React.useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const entryData: Omit<Entry, "id" | "createdAt"> = {
      text: text.trim(),
      calories,
      protein,
      fats,
      carbohydrates,
    };

    if (!entryData.text.trim() || entryData.calories <= 0) {
      alert("Please enter a description and valid calories (>0).");
      return;
    }

    try {
      const response = await fetch("/api/entry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entryData),
      });

      if (!response.ok) {
        throw new Error("Failed to save entry");
      }

      router.push("/");
    } catch (error) {
      console.error("Submission error:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center p-4">
      <h1>Add Entry Manually</h1>
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
    </div>
  );
};

export default AddEntryPage;