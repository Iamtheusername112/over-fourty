import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import { KycWizard } from "./KycWizard";

export default async function KycPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const supabase = createAdminClient();
  if (!supabase) redirect("/sign-in");

  const { data: profile } = await supabase.from("profiles").select("id, role").eq("clerk_user_id", userId).single();
  if (!profile) redirect("/onboarding");
  if (profile.role !== "OPTIMIZER") redirect("/dashboard/optimizer");

  const { data: kyc } = await supabase.from("kyc_submissions").select("*").eq("profile_id", profile.id).maybeSingle();
  const initialData = kyc ? {
    full_name: kyc.full_name ?? "",
    ssn: kyc.ssn ?? "",
    address_line1: kyc.address_line1 ?? "",
    address_line2: kyc.address_line2 ?? "",
    city: kyc.city ?? "",
    state: kyc.state ?? "",
    postal_code: kyc.postal_code ?? "",
    country: kyc.country ?? "US",
    owns_property: kyc.owns_property ?? null,
    property_types: Array.isArray(kyc.property_types) ? kyc.property_types : [],
    government_id_path: !!kyc.government_id_path,
    drivers_license_path: !!kyc.drivers_license_path,
    utility_doc_path: !!kyc.utility_doc_path,
    status: kyc.status,
  } : null;

  return (
    <div className="min-h-screen bg-bg-off-white">
      <header className="border-b border-navy/10 bg-navy px-4 py-4">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <Link href="/dashboard/optimizer" className="text-sm font-medium text-gold hover:text-gold/80">
            ← Back to Command Center
          </Link>
          <span className="font-serif text-lg font-semibold text-white">KYC — Access funds & loans</span>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-8">
        <div className="mb-8 rounded-xl border border-gold/30 bg-white p-6 shadow-md">
          <h1 className="font-serif text-2xl font-bold text-navy">Get very easy with our help</h1>
          <p className="mt-2 text-navy/80">
            Complete verification so we can connect you with government programs and major financial institutions for loans and funds. Your information is secure and used only for eligibility and applications.
          </p>
        </div>

        <KycWizard initialData={initialData} />
      </main>
    </div>
  );
}
