"use client";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/modules/auth/lib/auth-client";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState, type ComponentProps } from "react";
import { toast } from "sonner";
import { useTRPC } from "@/trpc/client";

type ButtonBaseProps = ComponentProps<typeof Button>;

interface SignOutButtonProps extends ButtonBaseProps {
  onSignedOut?: () => void;
  children?: React.ReactNode;
}

export default function SignOutButton({
  children = "Sign out",
  onSignedOut,
  ...props
}: SignOutButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const trpc = useTRPC();

  const queryClient = useQueryClient();

  async function handleSignOut() {
    setLoading(true);

    const { error } = await authClient.signOut();

    setLoading(false);

    if (error) {
      toast.error(error.message || "Something went wrong");
      return;
    }

    queryClient.invalidateQueries(trpc.auth.getMe.queryOptions());
    toast.success("Signed out successfully");
    onSignedOut?.();
    router.push("/auth/sign-in");
  }

  return (
    <Button onClick={handleSignOut} disabled={loading} {...props}>
      {loading ? (
        <>
          <Spinner className="size-4" />
          Signing out...
        </>
      ) : (
        children
      )}
    </Button>
  );
}
