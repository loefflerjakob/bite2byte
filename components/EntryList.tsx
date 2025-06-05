"use client";
import { useEffect, useState } from "react";
import type { Entry } from "@/app/types/entry";

export default function EntryList() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchEntries = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/entry");
        if (!res.ok) {
          throw new Error("Failed to fetch entries");
        }
        const data = await res.json();
        setEntries(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEntries();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch("/api/entry", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert(
          `Error deleting entry: ${errorData.error || "Please try again."}`
        );
        console.error("Failed to delete entry:", errorData);
        return;
      }

      setEntries((prevEntries) =>
        prevEntries.filter((entry) => entry.id !== id)
      );
    } catch (error) {
      console.error("An error occurred while deleting the entry:", error);
      alert("An unexpected error occurred. Please try again.");
    } finally {
    }
  };

  return (
    <>
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Your Entries</h2>
        {isLoading ? (
          <p className="text-gray-500">Loading entries...</p>
        ) : entries.length === 0 ? (
          <p className="text-gray-500">No entries so far.</p>
        ) : (
          <ul className="space-y-4">
            {entries.map((entry) => (
              <li
                key={entry.id}
                className="border rounded p-4 shadow-sm bg-white"
              >
                <h3>{entry.text}</h3>
                <div className="text-sm text-gray-400">
                  {new Date(entry.createdAt).toLocaleString()}
                </div>
                <div className=" flex flex-col text-sm mt-1">
                  <span className="mr-2 font-semibold">
                    🍽️ {entry.calories} kcal
                  </span>
                  <span className="mr-2 font-semibold text-green">
                    🍞 {entry.carbohydrates}g Carbohydrates
                  </span>

                  <span className="mr-2 font-semibold text-blue">
                    🥩 {entry.protein}g Protein
                  </span>
                  <span className="mr-2 font-semibold text-yellow">
                    🧈 {entry.fats}g Fat
                  </span>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="icon icon-tabler icons-tabler-outline icon-tabler-trash cursor-pointer"
                  onClick={() => handleDelete(entry.id)}
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M4 7l16 0" />
                  <path d="M10 11l0 6" />
                  <path d="M14 11l0 6" />
                  <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
                  <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
                </svg>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
