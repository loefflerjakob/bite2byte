'use client'
import { useEffect, useState } from 'react'
import Button from '@/components/Button'
import type { Entry } from '@/app/types/entry'

export default function EntryList() {
  const [entries, setEntries] = useState<Entry[]>([])
  const [isDeleting, setIsDeleting] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchEntries = async () => {
      setIsLoading(true)
      try {
        const res = await fetch('/api/entry')
        if (!res.ok) {
          throw new Error('Failed to fetch entries')
        }
        const data = await res.json()
        setEntries(data)
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchEntries()
  }, [])

  const handleDelete = async (id: number) => {
    setIsDeleting(id)
    try {
      const res = await fetch('/api/entry', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      })

      if (!res.ok) {
        const errorData = await res.json()
        alert(`Error deleting entry: ${errorData.error || 'Please try again.'}`)
        console.error('Failed to delete entry:', errorData)
        return
      }

      setEntries((prevEntries) => prevEntries.filter((entry) => entry.id !== id))
    } catch (error) {
      console.error('An error occurred while deleting the entry:', error)
      alert('An unexpected error occurred. Please try again.')
    } finally {
      setIsDeleting(null)
    }
  }

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
                <div className="text-sm text-gray-400">
                  {new Date(entry.createdAt).toLocaleString()}
                </div>
                <div className="font-medium">{entry.text}</div>
                <div className="text-sm mt-1">
                  <span className="mr-2">🍽️ {entry.calories} kcal</span>
                  <span className="mr-2">🥩 {entry.protein}g Protein</span>
                  <span className="mr-2">🧈 {entry.fats}g Fat</span>
                  <span>🍞 {entry.carbohydrates}g Carbohydrates</span>
                </div>
                <Button
                  onClick={() => handleDelete(entry.id)}
                  disabled={isDeleting === entry.id}
                >
                  {isDeleting === entry.id ? 'Deleting...' : 'Delete'}
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  )
}