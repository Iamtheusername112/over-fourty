import OnboardingStartContent from "./OnboardingStartContent";

export const dynamic = "force-dynamic";

export default async function OnboardingStartPage({ searchParams }) {
  const resolved = await searchParams;
  const isPaymentSuccess = resolved?.payment === "success";
  return <OnboardingStartContent isPaymentSuccess={isPaymentSuccess} />;
}
