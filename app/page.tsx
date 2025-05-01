import EntryForm from '@/components/EntryForm'
import EntryList from '@/components/EntryList'

export default function Home() {
  return (
    <main className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Bite2Byte</h1>
      <EntryForm />
      <EntryList />
    </main>
  )
}
