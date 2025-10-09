"use client";

import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { ResetPasswordForm } from "@/modules/auth/components/reset-password-form";
import { AlertTriangleIcon } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  if (!token) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <AlertTriangleIcon className="w-12 h-12" />
          </EmptyMedia>
          <EmptyTitle>Invalid Reset Link</EmptyTitle>
          <EmptyDescription>
            The password reset link is invalid or has expired. Please request a
            new one from the forgot password page.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <div className="flex flex-col gap-3 w-full">
            <Link href="/auth/forgot-password" className="w-full">
              <Button className="w-full">Request New Reset Link</Button>
            </Link>

            <Link href="/auth/sign-in" className="w-full">
              <Button variant="outline" className="w-full">
                Back to Sign In
              </Button>
            </Link>
          </div>
        </EmptyContent>

        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            Common issues with reset links:
          </p>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• The link has expired</li>
            <li>• The link has already been used</li>
          </ul>
        </div>
      </Empty>
    );
  }

  return <ResetPasswordForm token={token} />;
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <AlertTriangleIcon className="w-12 h-12" />
            </EmptyMedia>
            <EmptyTitle>Loading...</EmptyTitle>
            <EmptyDescription>
              Please wait while we verify your reset link.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
