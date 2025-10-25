import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "./auth";

export async function requireAuth() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return redirect("/sign-in");
  }

  return session;
}

export async function requireNonAuth() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    return redirect("/");
  }
}
