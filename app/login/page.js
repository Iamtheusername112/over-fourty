import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-1 flex items-center justify-center bg-bg-off-white px-4 py-20">
        <div className="text-center">
          <h1 className="font-serif text-2xl font-bold text-navy">Member Login</h1>
          <p className="mt-2 text-navy/80">Client portal coming soon.</p>
          <Link
            href="/"
            className="mt-6 inline-block rounded bg-gold px-6 py-2 font-semibold text-navy hover:bg-gold/90"
          >
            Back to Home
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
