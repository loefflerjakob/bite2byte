'use client'
import { useEffect, useState } from 'react'
import Button from './Button' // Assuming you have this Button component

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
  // Optional: Add a loading state for delete operations
  const [isDeleting, setIsDeleting] = useState<number | null>(null) // Store ID of item being deleted

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const res = await fetch('/api/entry')
        if (!res.ok) {
          throw new Error('Failed to fetch entries')
        }
        const data = await res.json()
        setEntries(data)
      } catch (error) {
        console.error(error)
        // Handle error fetching entries, e.g., show a message to the user
      }
    }

    fetchEntries()
  }, [])

  const handleDelete = async (id: number) => {
    setIsDeleting(id); // Optional: Set loading state for this specific item
    try {
      const res = await fetch('/api/entry', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }), // Your backend expects the id in the body
      })

      if (!res.ok) {
        const errorData = await res.json()
        // It's good practice to show an error message to the user
        alert(`Error deleting entry: ${errorData.error || 'Please try again.'}`)
        console.error('Failed to delete entry:', errorData)
        return
      }

      // Update the state to remove the deleted entry
      setEntries((prevEntries) => prevEntries.filter((entry) => entry.id !== id))
    } catch (error) {
      console.error('An error occurred while deleting the entry:', error)
      // Show a generic error message to the user
      alert('An unexpected error occurred. Please try again.')
    } finally {
      setIsDeleting(null); // Optional: Clear loading state
    }
  }

  return (
    <>
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Deine Einträge</h2>
        {entries.length === 0 && (
          <p className="text-gray-500">Noch keine Einträge vorhanden.</p>
        )}
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
              <Button
                onClick={() => handleDelete(entry.id)}
                // Optional: Disable button while this specific item is being deleted
                disabled={isDeleting === entry.id}
                // Add some styling for the delete button if needed, e.g., make it red
                // className="mt-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-gray-400"
              >
                {isDeleting === entry.id ? 'Deleting...' : 'Delete'}
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}