"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/modules/auth/lib/auth-client";
import { signInSchema } from "@/modules/auth/schemas";
import type { SignInFormData } from "@/modules/auth/types";
import { toast } from "sonner";
import { PasswordInput } from "./password-input";

interface SignInFormProps {
  onSuccess?: () => void;
  callbackURL?: string;
}

export function SignInForm({
  onSuccess,
  callbackURL = "/dashboard",
}: SignInFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data: SignInFormData) => {
    setFormError(null);
    setIsLoading(true);

    try {
      await authClient.signIn.email(
        {
          email: data.email,
          password: data.password,
          callbackURL,
        },
        {
          onSuccess: () => {
            setIsLoading(false);
            toast.success("Sign in successful! Welcome back!");
            reset();
            router.push(callbackURL);
            onSuccess?.();
          },
          onError: (ctx) => {
            setIsLoading(false);
            setFormError(
              ctx.error.message || "An error occurred during sign in"
            );
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
        <h1 className="text-2xl font-bold">Sign In</h1>
        <p className="text-muted-foreground">
          Enter your credentials to access your account
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mb-0">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
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
          <Label htmlFor="password">Password</Label>
          <PasswordInput
            id="password"
            placeholder="Enter your password"
            {...register("password")}
            aria-invalid={!!errors.password}
            className={errors.password ? "border-destructive" : ""}
          />
          {errors.password && (
            <p className="text-sm text-destructive" role="alert">
              {errors.password.message}
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
              Signing in...
            </>
          ) : (
            "Sign In"
          )}
        </Button>
      </form>

      <div className="text-center mt-2 space-y-2">
        <Link href="/auth/forgot-password" className="cursor-pointer">
          <Button variant="link" className="p-0 h-auto text-sm cursor-pointer">
            Forgot your password?
          </Button>
        </Link>
        <p className="text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/auth/sign-up" className="cursor-pointer">
            <Button
              variant="link"
              className="p-0 h-auto text-sm cursor-pointer"
            >
              Sign up
            </Button>
          </Link>
        </p>
      </div>
    </div>
  );
}
