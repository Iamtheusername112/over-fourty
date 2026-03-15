import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";

export default async function DashboardLayout({ children }) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const supabase = createAdminClient();
  if (!supabase) redirect("/sign-in");
  const { data: profile } = await supabase.from("profiles").select("role, onboarding_complete").eq("clerk_user_id", userId).single();
  if (!profile?.onboarding_complete) redirect("/onboarding");

  return <>{children}</>;
}
