import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-navy py-12">
      <SignUp
        appearance={{
          variables: { colorPrimary: "#a89160", colorBackground: "#0f172a" },
          elements: {
            rootBox: "mx-auto",
            card: "shadow-xl border-2 border-[#a89160]",
          },
        }}
        afterSignUpUrl="/onboarding"
        signInUrl="/sign-in"
      />
    </div>
  );
}
