import { requireNonAuth } from "@/lib/auth-utils";
import { SignUpForm } from "@/features/auth/components/SignUpForm";

async function SignUpPage() {
  await requireNonAuth();

  return <SignUpForm />;
}

export default SignUpPage;
