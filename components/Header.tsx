import Image from "next/image";
import Button from "./Button";
import Link from "next/link";

export default function Header() {
  return (
    <header className="m-4 flex items-center justify-between">
      <Link href="/" className="flex items-center">
        <Image src="/logo.svg" alt="Logo" width={200} height={100} />
      </Link>
      <div className="flex space-x-4">
        <Link href="/" className="text-black hover:underline">
          Home
        </Link>
        <Link href="/entryList" className="text-black hover:underline">
          Entry List
        </Link>
      </div>
      <Button href="/addEntry">Add meal manually</Button>
    </header>
  );
}
