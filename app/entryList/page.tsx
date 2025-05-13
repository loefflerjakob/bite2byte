import EntryList from "@/components/EntryList";
import React from "react";

const entryListPage: React.FC = () => {
  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">All Entries</h1>
      <EntryList />
    </div>
  );
};

export default entryListPage;
