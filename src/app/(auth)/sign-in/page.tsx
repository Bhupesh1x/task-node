import { requireNonAuth } from "@/lib/auth-utils";
import { SignInForm } from "@/features/auth/components/SignInForm";

async function SignInPage() {
  await requireNonAuth();

  return <SignInForm />;
}

export default SignInPage;
