import Image from "next/image";
import Button from "./Button";
import Link from "next/link";

export default function Header() {
  return (
    <header className="flex items-center justify-between sticky top-0 z-1 p-4">
      <Link href="/" className="flex items-center">
        <Image src="/logo.svg" alt="Logo" width={200} height={100} />
      </Link>
      <div className="flex space-x-4 items-center">
        <Link href="/" className="text-black hover:underline">
          Home
        </Link>
        <Link href="/entryList" className="text-black hover:underline">
          Entry List
        </Link>
        <Link href="/changeGoal" className="text-black hover:underline">
          Manual Goal
        </Link>
        <Button href="/addEntry">Manual Entry</Button>
      </div>
    </header>
  );
}