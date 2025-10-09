"use client";

import { MailIcon, RefreshCwIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import SignOutButton from "@/modules/auth/components/sign-out-button";
import { authClient } from "@/modules/auth/lib/auth-client";

export default function EmailVerificationPage() {
  const [isLoading, setIsLoading] = useState(false);

  const { data: session } = authClient.useSession();

  async function handleResendVerificationEmail() {
    if (!session?.user?.email) {
      toast.error("Email address not found. Please sign in again.");
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await authClient.sendVerificationEmail({
        email: session.user.email,
        callbackURL: "/dashboard",
      });

      if (error) {
        toast.error(error.message || "Something went wrong");
      } else {
        toast.success("Verification email sent successfully");
      }
    } catch (error) {
      console.error("Failed to send verification email:", error);
      toast.error("Failed to send verification email");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <MailIcon className="w-12 h-12" />
        </EmptyMedia>
        <EmptyTitle>Check Your Email</EmptyTitle>
        <EmptyDescription>
          We&apos;ve sent a verification link to{" "}
          {session?.user?.email ? (
            <span className="font-bold">{session.user.email}</span>
          ) : (
            "your email address"
          )}
          . Please check your inbox and click the link to verify your account.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <div className="flex flex-col gap-3 w-full">
          <Button
            onClick={handleResendVerificationEmail}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <RefreshCwIcon className="w-4 h-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <RefreshCwIcon className="w-4 h-4 mr-2" />
                Resend Verification Email
              </>
            )}
          </Button>

          <SignOutButton variant="outline" className="w-full">
            Sign Out (Wrong Email?)
          </SignOutButton>
        </div>
      </EmptyContent>

      <div className="text-center space-y-2">
        <p className="text-sm text-muted-foreground">
          Didn&apos;t receive the email?
        </p>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>• Check your spam or junk folder</li>
          <li>• Make sure the email address is correct</li>
          <li>• Try resending the verification email</li>
        </ul>
      </div>

      <div className="text-center">
        <span className="text-sm text-muted-foreground">Need help? </span>
        <a
          href="#"
          className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground transition-colors"
        >
          Contact Support
        </a>
      </div>
    </Empty>
  );
}
