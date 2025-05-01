'use client'
import { useEffect, useState } from 'react'

type Entry = {
  id: number
  text: string
  calories: number
  protein: number
  fat: number
  carbs: number
  createdAt: string
}

export default function EntryList() {
  const [entries, setEntries] = useState<Entry[]>([])

  useEffect(() => {
    const fetchEntries = async () => {
      const res = await fetch('/api/entry')
      const data = await res.json()
      setEntries(data)
    }

    fetchEntries()
  }, [])

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-2">Deine Einträge</h2>
      {entries.length === 0 && <p className="text-gray-500">Noch keine Einträge vorhanden.</p>}
      <ul className="space-y-4">
        {entries.map((entry) => (
          <li
            key={entry.id}
            className="border rounded p-4 shadow-sm bg-white"
          >
            <div className="text-sm text-gray-400">
              {new Date(entry.createdAt).toLocaleString()}
            </div>
            <div className="font-medium">{entry.text}</div>
            <div className="text-sm mt-1">
              <span className="mr-2">🍽️ {entry.calories} kcal</span>
              <span className="mr-2">🥩 {entry.protein}g Protein</span>
              <span className="mr-2">🧈 {entry.fat}g Fett</span>
              <span>🍞 {entry.carbs}g Kohlenhydrate</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
