import Dashboard from "@/components/Dashboard";

export default function Home() {
  return (
    <main className="p-6 mx-auto">
      <div className="flex items-center justify-center mb-6">
        <h1 className="text-2xl font-bold mb-4">Your daily overview</h1>
      </div>

      <Dashboard />
    </main>
  );
}
