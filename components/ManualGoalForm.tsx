import React from 'react';
import Button from '@/components/Button'; 

interface ManualGoalFormProps {
  calories: number;
  setCalories: (value: number) => void;
  protein: number;
  setProtein: (value: number) => void;
  fats: number;
  setFats: (value: number) => void;
  carbohydrates: number;
  setCarbohydrates: (value: number) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

const ManualGoalForm: React.FC<ManualGoalFormProps> = ({
  calories,
  setCalories,
  protein,
  setProtein,
  fats,
  setFats,
  carbohydrates,
  setCarbohydrates,
  handleSubmit,
  isLoading,
}) => {
  return (
 <form onSubmit={handleSubmit} className="flex flex-col items-start w-full max-w-md mt-6">
      <label htmlFor="goal-calories" className="mb-1 font-bold">
        Calories (kcal)
      </label>
      <input
        id="goal-calories"
        type="number"
        value={calories === 0 ? "" : calories}
        placeholder="e.g., 2000"
        className="border p-2 rounded mb-4 w-full"
        onChange={(e) => setCalories(Number(e.target.value))}
        required
        min={1}
      />

      <label htmlFor="goal-protein" className="mb-1 font-bold">
        Protein (in grams)
      </label>
      <input
        id="goal-protein"
        type="number"
        value={protein === 0 && calories === 0 ? "" : protein}
        placeholder="e.g., 150"
        className="border p-2 rounded mb-4 w-full"
        onChange={(e) => setProtein(Number(e.target.value))}
        required
        min={0}
      />

      <label htmlFor="goal-fats" className="mb-1 font-bold">
        Fats (in grams)
      </label>
      <input
        id="goal-fats"
        type="number"
        value={fats === 0 && calories === 0 ? "" : fats}
        placeholder="e.g., 70"
        className="border p-2 rounded mb-4 w-full"
        onChange={(e) => setFats(Number(e.target.value))}
        required
        min={0}
      />

      <label htmlFor="goal-carbohydrates" className="mb-1 font-bold">
        Carbohydrates (in grams)
      </label>
      <input
        id="goal-carbohydrates"
        type="number"
        value={carbohydrates === 0 && calories === 0 ? "" : carbohydrates}
        placeholder="e.g., 250"
        className="border p-2 rounded mb-4 w-full"
        onChange={(e) => setCarbohydrates(Number(e.target.value))}
        required
        min={0}
      />

      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Saving...' : 'Save Goal'}
      </Button>
    </form>
  );
};

export default ManualGoalForm;