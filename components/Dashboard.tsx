"use client"
import React, { useEffect, useState } from "react";
import type { Entry } from '@/app/types/entry'

const Dashboard: React.FC = () => {

  const [entries, setEntries] = useState<Entry[]>([])



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

    console.log(JSON.stringify(entries, null, 2))

  return (


    <div>
      <h1>Dashboard</h1>
      <h2 className="text-xl font-semibold mb-2">Deine Einträge</h2>
    </div>
  );
};

export default Dashboard;
