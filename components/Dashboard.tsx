'use client'
import React, { useEffect, useState } from 'react'
import type { Entry } from '@/app/types/entry'
import type { NutritionalGoal } from '@/app/types/goal'

import dynamic from 'next/dynamic'
import EntryList from './EntryList'

const ChartNutrients = dynamic(() => import('./ChartNutrient'), {
  ssr: false,
})

const ChartCalories = dynamic(() => import('./ChartCalories'), {
  ssr: false,
})

type EntryWithDeleting = Entry & { deleting?: boolean };

const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}

const formatDateDisplay = (date: Date): string => {
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)

  if (isSameDay(date, today)) {
    return 'Today'
  }
  if (isSameDay(date, yesterday)) {
    return 'Yesterday'
  }
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const Dashboard: React.FC = () => {
  const [allEntries, setAllEntries] = useState<EntryWithDeleting[]>([])
  const [dailyEntries, setDailyEntries] = useState<EntryWithDeleting[]>([])
  const [goal, setGoal] = useState<NutritionalGoal>()
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [dateTotals, setDateTotals] = useState({
    carbohydrates: 0,
    protein: 0,
    fats: 0,
    calories: 0,
  })
  const [isGoalLoading, setIsGoalLoading] = useState<boolean>(true)
  const [isEntriesLoading, setIsEntriesLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchGoal = async () => {
      setIsGoalLoading(true)
      try {
        const res = await fetch('/api/goal')
        if (!res.ok) {
          throw new Error('Failed to fetch goal')
        }
        const data = await res.json()
        setGoal(data)
      } catch (error) {
        console.error('Error fetching goal:', error)
      } finally {
        setIsGoalLoading(false)
      }
    }
    fetchGoal()
  }, [])

  useEffect(() => {
    const fetchEntries = async () => {
      setIsEntriesLoading(true)
      try {
        const res = await fetch('/api/entry')
        if (!res.ok) {
          throw new Error('Failed to fetch entries')
        }
        const data: Entry[] = await res.json()
        setAllEntries(data)
      } catch (error) {
        console.error('Error fetching entries:', error)
      } finally {
        setIsEntriesLoading(false)
      }
    }

    fetchEntries()
  }, [])

  useEffect(() => {
    const entriesForSelectedDate = allEntries.filter((entry) =>
      isSameDay(new Date(entry.createdAt), selectedDate)
    )

    const totals = entriesForSelectedDate.reduce(
      (acc, entry) => {
        acc.carbohydrates += entry.carbohydrates
        acc.protein += entry.protein
        acc.fats += entry.fats
        acc.calories += entry.calories
        return acc
      },
      { carbohydrates: 0, protein: 0, fats: 0, calories: 0 }
    )

    setDateTotals(totals);
    setDailyEntries(entriesForSelectedDate);
  }, [selectedDate, allEntries])

  const handlePreviousDay = () => {
    const prevDay = new Date(selectedDate)
    prevDay.setDate(selectedDate.getDate() - 1)
    setSelectedDate(prevDay)
  }

  const handleNextDay = () => {
    const nextDay = new Date(selectedDate)
    nextDay.setDate(selectedDate.getDate() + 1)
    
    const today = new Date();
    today.setHours(0,0,0,0);
    nextDay.setHours(0,0,0,0); 

    if (nextDay > today) {
        return;
    }
    setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() + 1)));
  }

  const handleDeleteEntry = async (id: number) => {
    if (allEntries.find((e) => e.id === id)?.deleting) return;

    setAllEntries((prev) =>
      prev.map((entry) => (entry.id === id ? { ...entry, deleting: true } : entry))
    );

    try {
      const res = await fetch("/api/entry", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) throw new Error("Deletion failed");

      setAllEntries((prev) => prev.filter((entry) => entry.id !== id));
    } catch (error) {
      console.error("Error deleting entry from dashboard:", error);
      alert("Failed to delete entry.");
      setAllEntries((prev) =>
        prev.map((entry) => (entry.id === id ? { ...entry, deleting: false } : entry))
      );
    }
  };


  const isTodaySelected = isSameDay(selectedDate, new Date())

  if (isGoalLoading && isEntriesLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-gray-500 text-xl">Loading dashboard...</p>
      </div>
    )
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center gap-8 md:gap-16">
        <div className="flex items-center justify-center gap-3 sm:gap-4">
          <button
            onClick={handlePreviousDay}
            className="p-2 sm:p-3 bg-gray-200 hover:bg-gray-300 rounded-full text-gray-700 transition-colors duration-150 cursor-pointer"
            aria-label="Previous day"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 sm:w-6 sm:h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <span className="text-lg sm:text-lg font-semibold w-40 sm:w-32 text-center tabular-nums">
            {formatDateDisplay(selectedDate)}
          </span>
          <button
            onClick={handleNextDay}
            disabled={isTodaySelected}
            className={`p-2 sm:p-3 rounded-full text-gray-700 transition-colors duration-150 ${
              isTodaySelected
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 hover:bg-gray-300 cursor-pointer'
            }`}
            aria-label="Next day"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke={`${isTodaySelected
              ? 'lightgray' 
              : 'currentColor'
            }`} className="w-5 h-5 sm:w-6 sm:h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>

        {/* Charts */}
        <div className="flex items-center justify-center">
          <ChartCalories
            goal={goal?.calories ?? 0}
            current={dateTotals.calories}
            color="#79AA94"
            metric="Calories"
            barHeight={50}
          />
        </div>
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 lg:gap-12">
          <ChartNutrients
            goal={goal?.carbohydrates ?? 0}
            current={dateTotals.carbohydrates}
            color="#79AA94"
            circleSize={200}
            metric="Carbohydrates"
          />
          <ChartNutrients
            goal={goal?.protein ?? 0}
            current={dateTotals.protein}
            color="#80A7C7"
            circleSize={200}
            metric="Protein"
          />
          <ChartNutrients
            goal={goal?.fats ?? 0}
            current={dateTotals.fats}
            color="#D3CBA9"
            circleSize={200}
            metric="Fats"
          />
        </div>
      </div>
      
      <div className="mt-16 max-w-3xl mx-auto">
        <EntryList 
          entries={dailyEntries}
          isLoading={isEntriesLoading}
          onDelete={handleDeleteEntry}
          title={`Entries for ${formatDateDisplay(selectedDate)}`}
          emptyStateMessage={{
              title: "No entries for this day",
              description: "You haven't tracked any meals for this day yet."
          }}
        />
      </div>
    </>
  )
}

export default Dashboard