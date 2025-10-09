"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/modules/auth/lib/auth-client";
import { forgotPasswordSchema } from "@/modules/auth/schemas";
import type { ForgotPasswordFormData } from "@/modules/auth/types";
import { toast } from "sonner";

interface ForgotPasswordFormProps {
  onSuccess?: () => void;
  redirectTo?: string;
}

export function ForgotPasswordForm({
  onSuccess,
  redirectTo = "/auth/reset-password",
}: ForgotPasswordFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setFormError(null);
    setIsLoading(true);

    try {
      await authClient.requestPasswordReset(
        {
          email: data.email,
          redirectTo: redirectTo,
        },
        {
          onSuccess: () => {
            setIsLoading(false);
            toast.success(
              "If account exists for this email, we've sent a password reset link."
            );
            reset();
            router.push("/auth/sign-in");
            onSuccess?.();
          },
          onError: (ctx) => {
            setIsLoading(false);
            setFormError(ctx.error.message || "Something went wrong");
          },
        }
      );
    } catch {
      setIsLoading(false);
      setFormError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">Forgot password</h1>
        <p className="text-muted-foreground">
          Enter your email address and we&apos;ll send you a link to reset your
          password.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mb-0">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="your@email.com"
            {...register("email")}
            aria-invalid={!!errors.email}
            className={errors.email ? "border-destructive" : ""}
          />
          {errors.email && (
            <p className="text-sm text-destructive" role="alert">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          {formError && (
            <p className="text-sm text-destructive" role="alert">
              {formError}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full cursor-pointer"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Spinner className="size-4" />
              Sending reset link...
            </>
          ) : (
            "Send reset link"
          )}
        </Button>
      </form>

      <div className="text-center mt-2 space-y-2">
        <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
          <span className="bg-background text-muted-foreground relative z-10 px-2">
            Or
          </span>
        </div>
        <Link href="/auth/sign-in" className="cursor-pointer">
          <Button
            variant="outline"
            className="w-full cursor-pointer"
            disabled={isLoading}
          >
            Sign in
          </Button>
        </Link>
      </div>
    </div>
  );
}
