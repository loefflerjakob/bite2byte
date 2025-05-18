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
  fats: number;
  setFats: (fats: number) => void;
  carbohydrates: number;
  setCarbohydrates: (carbohydrates: number) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}

const ManualForm: React.FC<ManualFormProps> = ({
  text,
  setText,
  calories,
  setCalories,
  protein,
  setProtein,
  fats,
  setFats,
  carbohydrates,
  setCarbohydrates,
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

      <label htmlFor="fats" className="mb-1 font-bold">
        Fats (in grams)
      </label>
      <input
        id="fats"
        type="number"
        value={fats === 0 && calories === 0 ? "" : fats}
        placeholder="e.g., 10"
        className="border p-2 rounded mr-2 mb-4 w-full"
        onChange={(e) => setFats(Number(e.target.value))}
        required
        min={0}
      />

      <label htmlFor="carbohydrates" className="mb-1 font-bold">
        Carbohydrates (in grams)
      </label>
      <input
        id="carbohydrates"
        type="number"
        value={carbohydrates === 0 && calories === 0 ? "" : carbohydrates}
        placeholder="e.g., 25"
        className="border p-2 rounded mr-2 mb-4 w-full"
        onChange={(e) => setCarbohydrates(Number(e.target.value))}
        required
        min={0}
      />

      <Button type="submit">Send</Button>
    </form>
  );
};

export default ManualForm;