import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }) {
  const supabase = await createClient();
  if (!supabase) {
    redirect("/login");
  }
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }
  const { data: profile } = await supabase.from("profiles").select("role, onboarding_complete").eq("id", user.id).single();
  if (!profile?.onboarding_complete) {
    redirect("/onboarding");
  }
  return <>{children}</>;
}
