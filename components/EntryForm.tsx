'use client'
import { useState } from 'react'

export default function EntryForm() {
  const [text, setText] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const dummyData = {
      text,
      calories: 300,
      protein: 20,
      fat: 10,
      carbs: 25,
    }

    await fetch('/api/entry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dummyData),
    })

    setText('')
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={text}
        placeholder="Was hast du gegessen?"
        onChange={(e) => setText(e.target.value)}
        className="border p-2 rounded mr-2"
      />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Speichern
      </button>
    </form>
  )
}
