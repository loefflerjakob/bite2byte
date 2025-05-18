// components/ManualForm.tsx
import React from "react";
import Button from "@/components/Button"; // Assuming Button is in this path

interface ManualFormProps {
  text: string;
  setText: (text: string) => void;
  calories: number;
  setCalories: (calories: number) => void;
  protein: number;
  setProtein: (protein: number) => void;
  fat: number;
  setFat: (fat: number) => void;
  carbs: number;
  setCarbs: (carbs: number) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}

const ManualForm: React.FC<ManualFormProps> = ({
  text,
  setText,
  calories,
  setCalories,
  protein,
  setProtein,
  fat,
  setFat,
  carbs,
  setCarbs,
  handleSubmit,
}) => {
  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-start w-full max-w-md mt-6">
      <label htmlFor="text" className="mb-1 font-bold">
        What did you eat?
      </label>
      <input
        id="text"
        type="text"
        value={text}
        placeholder="e.g., Chilli sin carne"
        className="border p-2 rounded mr-2 mb-4 w-full"
        onChange={(e) => setText(e.target.value)}
        required
      />

      <label htmlFor="calories" className="mb-1 font-bold">
        Calories
      </label>
      <input
        id="calories"
        type="number"
        value={calories === 0 ? "" : calories}
        placeholder="e.g., 300"
        className="border p-2 rounded mr-2 mb-4 w-full"
        onChange={(e) => setCalories(Number(e.target.value))}
        required
        min={1}
      />

      <label htmlFor="protein" className="mb-1 font-bold">
        Protein (in grams)
      </label>
      <input
        id="protein"
        type="number"
        value={protein === 0 && calories === 0 ? "" : protein}
        placeholder="e.g., 20"
        className="border p-2 rounded mr-2 mb-4 w-full"
        onChange={(e) => setProtein(Number(e.target.value))}
        required
        min={0}
      />

      <label htmlFor="fat" className="mb-1 font-bold">
        Fat (in grams)
      </label>
      <input
        id="fat"
        type="number"
        value={fat === 0 && calories === 0 ? "" : fat}
        placeholder="e.g., 10"
        className="border p-2 rounded mr-2 mb-4 w-full"
        onChange={(e) => setFat(Number(e.target.value))}
        required
        min={0}
      />

      <label htmlFor="carbs" className="mb-1 font-bold">
        Carbs (in grams)
      </label>
      <input
        id="carbs"
        type="number"
        value={carbs === 0 && calories === 0 ? "" : carbs}
        placeholder="e.g., 25"
        className="border p-2 rounded mr-2 mb-4 w-full"
        onChange={(e) => setCarbs(Number(e.target.value))}
        required
        min={0}
      />

      <Button type="submit">Send</Button>
    </form>
  );
};

export default ManualForm;