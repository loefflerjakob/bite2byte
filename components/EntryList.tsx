"use client";

import type { Entry } from "@/app/types/entry";

type EntryWithDeleting = Entry & { deleting?: boolean };

interface EntryListProps {
  entries: EntryWithDeleting[];
  isLoading: boolean;
  onDelete: (id: number) => void; 
  title?: string;
  emptyStateMessage?: {
    title: string;
    description: string;
  };
}

export default function EntryList({
  entries,
  isLoading,
  onDelete,
  title,
  emptyStateMessage = {
    title: "No entries yet",
    description: 'Click on "Add meal" to start tracking your nutrition.',
  },
}: EntryListProps) {

  return (
    <div className="mt-6">
      {title && <h2 className="text-xl font-semibold mb-4">{title}</h2>}
      {isLoading ? (
        <p className="text-gray-500">Loading entries...</p>
      ) : entries.length === 0 ? (
        <div className="text-center py-10 px-6 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900">
            {emptyStateMessage.title}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {emptyStateMessage.description}
          </p>
        </div>
      ) : (
        <ul className="space-y-6">
          {entries.map((entry) => (
            <li
              key={entry.id}
              className={`bg-white rounded-xl p-6 shadow-lg transition-opacity duration-300 ${
                entry.deleting ? "opacity-50" : "opacity-100"
              } relative`}
            >
              <div className="flex justify-between items-start">
                <div className="w-full pr-10">
                  <h3 className="text-xl font-bold text-gray-800 break-words">
                    {entry.text}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(entry.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-100">
                <div className="flex flex-col items-start">
                  <span className="text-2xl font-bold text-primary">
                    {entry.calories}
                  </span>
                  <span className="text-sm text-gray-600">kcal</span>
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-2xl font-bold text-green">
                    {entry.carbohydrates}g
                  </span>
                  <span className="text-sm text-gray-600">Carbs</span>
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-2xl font-bold text-blue">
                    {entry.protein}g
                  </span>
                  <span className="text-sm text-gray-600">Protein</span>
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-2xl font-bold text-yellow">
                    {entry.fats}g
                  </span>
                  <span className="text-sm text-gray-600">Fat</span>
                </div>
              </div>

              <button
                onClick={() => onDelete(entry.id)}
                disabled={entry.deleting}
                className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:bg-red-100 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-colors"
                aria-label="Delete entry"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={20}
                  height={20}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M4 7l16 0" />
                  <path d="M10 11l0 6" />
                  <path d="M14 11l0 6" />
                  <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
                  <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}