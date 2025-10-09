"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Label } from "@/components/ui/label";
import { authClient } from "@/modules/auth/lib/auth-client";
import { resetPasswordSchema } from "@/modules/auth/schemas";
import type { ResetPasswordFormData } from "@/modules/auth/types";
import { toast } from "sonner";
import { PasswordInput } from "./password-input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

interface ResetPasswordFormProps {
  token: string;
  onSuccess?: () => void;
  redirectTo?: string;
}

export function ResetPasswordForm({
  token,
  onSuccess,
  redirectTo = "/auth/sign-in",
}: ResetPasswordFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onBlur",
    defaultValues: { newPassword: "", newPasswordConfirmation: "" },
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    setFormError(null);
    setIsLoading(true);

    try {
      await authClient.resetPassword(
        {
          token,
          newPassword: data.newPassword,
        },
        {
          onSuccess: () => {
            setIsLoading(false);
            toast.success("Password reset successfully");
            reset();
            router.push(redirectTo);
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
        <h1 className="text-2xl font-bold">Reset password</h1>
        <p className="text-muted-foreground text-sm">
          Enter your new password below.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mb-0">
        <div className="space-y-2">
          <Label htmlFor="newPassword">Password</Label>
          <PasswordInput
            id="newPassword"
            autoComplete="new-password"
            placeholder="Password"
            {...register("newPassword")}
            aria-invalid={!!errors.newPassword}
            className={errors.newPassword ? "border-destructive" : ""}
          />
          {errors.newPassword && (
            <p className="text-sm text-destructive" role="alert">
              {errors.newPassword.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="newPasswordConfirmation">Confirm Password</Label>
          <PasswordInput
            id="newPasswordConfirmation"
            autoComplete="new-password"
            placeholder="Confirm password"
            {...register("newPasswordConfirmation")}
            aria-invalid={!!errors.newPasswordConfirmation}
            className={
              errors.newPasswordConfirmation ? "border-destructive" : ""
            }
          />
          {errors.newPasswordConfirmation && (
            <p className="text-sm text-destructive" role="alert">
              {errors.newPasswordConfirmation.message}
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
              Resetting password...
            </>
          ) : (
            "Reset password"
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
