"use client";
import Button from "@/components/Button";
import React from "react";
import { useRouter } from "next/navigation";

const AddEntryPage: React.FC = () => {
  const router = useRouter();
  const [text, setText] = React.useState("");
  const [calories, setCalories] = React.useState(0);
  const [protein, setProtein] = React.useState(0);
  const [fat, setFat] = React.useState(0);
  const [carbs, setCarbs] = React.useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!text.trim()) {
      alert("Please enter what you ate.");
      return;
    }

    if (calories <= 0 || protein < 0 || fat < 0 || carbs < 0) {
      alert("Please enter valid nutrition values (calories must be > 0).");
      return;
    }

    const data = {
      text: text.trim(),
      calories,
      protein,
      fat,
      carbs,
    };


     try {
    const response = await fetch("/api/entry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      alert(`Failed to save entry: ${errorData.message || "Unknown error"}`);
      return;
    }

    router.push("/");
  } catch (error) {
    console.error("Submission error:", error);
    alert("Something went wrong while submitting. Please try again.");
  }
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-2xl font-bold">Add New Entry</h1>
      <h2 className="text-md mb-8">You can also add an entry with the chat</h2>
      <form onSubmit={handleSubmit} className="flex flex-col items-start">
        <label htmlFor="text" className="mb-1 font-bold">
          What did you eat?
        </label>
        <input
          type="text"
          placeholder="e. g. Chilli sin carne"
          className="border p-2 rounded mr-2 mb-4"
          onChange={(e) => setText(e.target.value)}
          required
        />
        <label htmlFor="calories" className="mb-1 font-bold">
          Calories (in grams)
        </label>
        <input
          type="number"
          placeholder="e. g. 300"
          className="border p-2 rounded mr-2 mb-4"
          onChange={(e) => setCalories(Number(e.target.value))}
          required
          min={1}
        />
        <label htmlFor="protein" className="mb-1 font-bold">
          Protein (in grams)
        </label>
        <input
          type="number"
          placeholder="e. g. 20"
          className="border p-2 rounded mr-2 mb-4"
          onChange={(e) => setProtein(Number(e.target.value))}
          required
          min={1}
        />
        <label htmlFor="fat" className="mb-1 font-bold">
          Fat (in grams)
        </label>
        <input
          type="number"
          placeholder="e. g. 10"
          className="border p-2 rounded mr-2 mb-4"
          onChange={(e) => setFat(Number(e.target.value))}
          required
          min={1}
        />
        <label htmlFor="carbs" className="mb-1 font-bold">
          Carbs (in grams)
        </label>
        <input
          type="number"
          placeholder="e. g. 25"
          className="border p-2 rounded mr-2 mb-4"
          onChange={(e) => setCarbs(Number(e.target.value))}
          required
          min={1}
        />
        <Button type="submit">Send</Button>
      </form>
    </div>
  );
};

export default AddEntryPage;
