'use client'
import React, { useEffect, useState } from 'react'
import type { Entry } from '@/app/types/entry'
import type { NutritionalGoal } from '@/app/types/goal'

import dynamic from 'next/dynamic'

const ChartNutrients = dynamic(() => import('./ChartNutrient'), {
  ssr: false,
})

const ChartCalories = dynamic(() => import('./ChartCalories'), {
  ssr: false,
})

// Helper function to check if two dates are the same day
const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}

// Helper function to format the date for display
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
  return date.toLocaleDateString(undefined, { // Using undefined for locale defaults, more options available
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const Dashboard: React.FC = () => {
  const [allEntries, setAllEntries] = useState<Entry[]>([])
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
    if (allEntries.length === 0 && !isEntriesLoading) { // Added !isEntriesLoading to avoid resetting during initial load
        setDateTotals({ carbohydrates: 0, protein: 0, fats: 0, calories: 0 });
        return;
    }
    if (allEntries.length === 0) return;


    const dateString = selectedDate.toISOString().split('T')[0]
    const entriesForSelectedDate = allEntries.filter((entry) =>
      entry.createdAt.startsWith(dateString)
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

    setDateTotals(totals)
  }, [selectedDate, allEntries, isEntriesLoading]) // Added isEntriesLoading to dependency array

  const handlePreviousDay = () => {
    const prevDay = new Date(selectedDate)
    prevDay.setDate(selectedDate.getDate() - 1)
    setSelectedDate(prevDay)
  }

  const handleNextDay = () => {
    const nextDay = new Date(selectedDate)
    nextDay.setDate(selectedDate.getDate() + 1)
    
    const today = new Date();
    today.setHours(0,0,0,0); // Normalize today to start of day for comparison
    nextDay.setHours(0,0,0,0); // Normalize nextDay to start of day

    if (nextDay > today) { // Prevent going to a future date
        return;
    }
    setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() + 1))); // Re-create date to ensure state update
  }

  const isTodaySelected = isSameDay(selectedDate, new Date())

  if (isGoalLoading || isEntriesLoading) {
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
    </>
  )
}

export default Dashboard