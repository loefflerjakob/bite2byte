"use client"
import React, {useEffect, useState } from "react";
import type { Entry } from '@/app/types/entry'
import type { NutritionalGoal } from '@/app/types/goal'

const Dashboard: React.FC = () => {

  const [entries, setEntries] = useState<Entry[]>([])
  const [goal, setGoal] = useState<NutritionalGoal>()

  useEffect(() => {
    const fetchGoal = async () => {
      try {
        const res = await fetch('/api/goal')
        if (!res.ok) {
          throw new Error('Failed to fetch goal')
        }
        const data = await res.json()
        setGoal(data)
      } catch (error) {
        console.error(error)
      }
    }
    fetchGoal()
  }
  , [])

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
        }
      }
  
      fetchEntries()
    }, [])

    console.log(JSON.stringify(goal, null, 2))
    console.log(JSON.stringify(entries, null, 2))

  return (
    <div>
      <h2>Your Nutritional Goals</h2>
      {goal && (
        <div>
          <p>Calories: {goal.calories}</p>
          <p>Protein: {goal.protein}</p>
          <p>Carbohydrates: {goal.carbohydrates}</p>
          <p>Fats: {goal.fats}</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
