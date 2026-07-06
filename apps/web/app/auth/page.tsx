import { redirect } from "next/navigation";
import { AuthErrorToast } from "@/components/auth-error-toast";
import { AuthPage as AuthPageContent } from "@/components/auth-page";
import { getRequestSession } from "@/lib/auth/session";

type AuthPageProps = {
  searchParams: Promise<{
    next?: string;
    error?: string;
  }>;
};

function getSafeNextPath(nextPath?: string) {
  if (!nextPath || !nextPath.startsWith("/") || nextPath.startsWith("//")) {
    return "/app";
  }

  return nextPath;
}

export default async function AuthPage({ searchParams }: AuthPageProps) {
  const params = await searchParams;
  const nextPath = getSafeNextPath(params.next);
  const authError = params.error;

  const session = await getRequestSession();
  if (session) {
    redirect(nextPath);
  }

  return (
    <>
      <AuthErrorToast error={authError} />
      <AuthPageContent nextPath={nextPath} />
    </>
  );
}
