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

    <div>
      {title && <h2 className="text-xl font-semibold mb-4">{title}</h2>}
      
      <div className="entry-list-container">
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
          <ul className="space-y-4">
            {entries.map((entry) => (
                  <li
                    key={entry.id}
                    className={`entry-card bg-slate-50 rounded-xl p-4 shadow-sm transition-all duration-300 ${
                      entry.deleting ? "opacity-40" : "opacity-100"
                    } ${entry.isNew ? "animate-new-entry" : ""}`}
                  >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-grow pr-4">
                    <h3 className="text-lg font-bold text-gray-800 break-words">
                      {entry.text}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(entry.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => onDelete(entry.id)}
                    disabled={entry.deleting}
                    className="p-2 rounded-full text-gray-400 hover:bg-red-100 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-colors"
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
                </div>

                <div className="grid grid-cols-4 gap-2 text-center">
                  <div>
                    <p className="text-xl font-bold text-primary">{entry.calories}</p>
                    <p className="text-xs text-gray-600">kcal</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-green">{entry.carbohydrates}g</p>
                    <p className="text-xs text-gray-600">Carbs</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-blue">{entry.protein}g</p>
                    <p className="text-xs text-gray-600">Protein</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-yellow">{entry.fats}g</p>
                    <p className="text-xs text-gray-600">Fat</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}