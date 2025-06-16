"use client";

import { useEffect, useState } from "react";
import EntryList from "@/components/EntryList";
import type { Entry } from "@/app/types/entry";

type EntryWithDeleting = Entry & { deleting?: boolean };

const EntryListPage: React.FC = () => {
  const [entries, setEntries] = useState<EntryWithDeleting[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchEntries = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/entry");
        if (!res.ok) {
          throw new Error("Failed to fetch entries");
        }
        const data: Entry[] = await res.json();
        setEntries(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEntries();
  }, []);

  const handleDelete = async (id: number) => {
    if (entries.find((e) => e.id === id)?.deleting) return;

    setEntries((prevEntries) =>
      prevEntries.map((entry) =>
        entry.id === id ? { ...entry, deleting: true } : entry
      )
    );

    try {
      const res = await fetch("/api/entry", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) {
        throw new Error("Failed to delete");
      }

      setEntries((prevEntries) =>
        prevEntries.filter((entry) => entry.id !== id)
      );
    } catch (error) {
      console.error("An error occurred while deleting the entry:", error);
      alert("An unexpected error occurred. Please try again.");
      setEntries((prevEntries) =>
        prevEntries.map((entry) =>
          entry.id === id ? { ...entry, deleting: false } : entry
        )
      );
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1>All Entries</h1>
      <EntryList
        entries={entries}
        isLoading={isLoading}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default EntryListPage;