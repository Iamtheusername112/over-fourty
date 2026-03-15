import Link from "next/link";
import { redirect } from "next/navigation";
import { getLegacyStoryPlaybackUrl } from "@/app/actions/legacy";

export default async function StoryPlaybackPage({ params }) {
  const { id } = await params;
  const result = await getLegacyStoryPlaybackUrl(id);
  if (!result?.ok || !result.url) redirect("/dashboard/optimizer");

  return (
    <div className="min-h-screen bg-bg-off-white">
      <header className="border-b border-navy/10 bg-navy px-4 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <h1 className="font-serif text-xl font-bold text-white">Listen to Recording</h1>
          <Link
            href="/dashboard/optimizer"
            className="rounded border border-gold bg-transparent px-4 py-2 text-sm font-medium text-gold hover:bg-gold/10"
          >
            Back to Dashboard
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-2xl px-4 py-8">
        <div className="rounded-lg border border-gold/30 bg-white p-6 shadow-md">
          <p className="font-serif text-lg font-semibold text-navy mb-4">Legacy Recording</p>
          <audio controls src={result.url} className="w-full" />
        </div>
      </main>
    </div>
  );
}
