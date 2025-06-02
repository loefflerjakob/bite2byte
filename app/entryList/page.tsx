import EntryList from "@/components/EntryList";
import React from "react";

const entryListPage: React.FC = () => {
  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1>All Entries</h1>
      <EntryList />
    </div>
  );
};

export default entryListPage;
