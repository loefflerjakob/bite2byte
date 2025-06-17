import Dashboard from "@/components/Dashboard";

export default function Home() {
  return (
    <main className="p-4 sm:p-6 mx-auto max-w-7xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
          Your Daily <span className="text-primary">Overview</span>
        </h1>
        <p className="text-gray-500 mt-1">
          Track your nutrition, one byte at a time.
        </p>
      </div>

      <Dashboard />
    </main>
  );
}