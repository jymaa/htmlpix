import Link from "next/link";
import { Header } from "@/components/Header";

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="container mx-auto p-4">
        <h1 className="text-4xl font-bold">Welcome</h1>
        <p className="mt-4">Next.js + Convex + Better Auth starter</p>
        <Link href="/login" className="mt-4 inline-block text-blue-600 hover:underline">
          Sign in to get started
        </Link>
      </main>
    </>
  );
}
