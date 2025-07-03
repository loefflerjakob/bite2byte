import Image from "next/image";
import Button from "./Button";
import Link from "next/link";

export default function Header() {
  return (
    <header className="flex items-center justify-between sticky top-0 z-1 p-4">
      <Link href="/" className="flex items-center">
        <Image src="/logo.svg" alt="Logo" width={200} height={100} />
      </Link>
      <div className="flex space-x-2 items-center">
        
        <Button variant="soft" href="/entryList">All Entries</Button>
        <Button variant="soft" href="/changeGoal">Manual Goal</Button>
        <Button variant="soft" href="/addEntry">Manual Entry</Button>


      </div>
    </header>
  );
}