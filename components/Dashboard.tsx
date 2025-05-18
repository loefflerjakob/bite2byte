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
    </div>
  );
};

export default Dashboard;
