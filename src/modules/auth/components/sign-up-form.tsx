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
import { signUpSchema } from "@/modules/auth/schemas";
import type { SignUpFormData } from "@/modules/auth/types";
import { toast } from "sonner";
import { PasswordInput } from "./password-input";

interface SignUpFormProps {
  onSuccess?: () => void;
  callbackURL?: string;
}

export function SignUpForm({
  onSuccess,
  callbackURL = "/dashboard",
}: SignUpFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    mode: "onBlur",
  });

  const password = watch("password");

  const onSubmit = async (data: SignUpFormData) => {
    setFormError(null);
    setIsLoading(true);

    try {
      await authClient.signUp.email(
        {
          email: data.email,
          password: data.password,
          name: data.name,
          callbackURL,
        },
        {
          onSuccess: () => {
            setIsLoading(false);
            toast.success(
              "Account created successfully! Please check your email to verify your account."
            );
            reset();
            router.push("/auth/email-verification");
            onSuccess?.();
          },
          onError: (ctx) => {
            setIsLoading(false);
            setFormError(
              ctx.error.message || "An error occurred during sign up"
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
        <h1 className="text-2xl font-bold">Create Account</h1>
        <p className="text-muted-foreground">
          Enter your information to create a new account
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mb-0">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            type="text"
            placeholder="Enter your full name"
            {...register("name")}
            aria-invalid={!!errors.name}
            className={errors.name ? "border-destructive" : ""}
          />
          {errors.name && (
            <p className="text-sm text-destructive" role="alert">
              {errors.name.message}
            </p>
          )}
        </div>

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
            placeholder="Create a password"
            {...register("password")}
            aria-invalid={!!errors.password}
            className={errors.password ? "border-destructive" : ""}
          />
          {errors.password && (
            <p className="text-sm text-destructive" role="alert">
              {errors.password.message}
            </p>
          )}
          {password && password.length > 0 && (
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">
                Password requirements:
              </div>
              <div className="grid grid-cols-2 gap-1 text-xs">
                <div
                  className={`flex items-center gap-1 ${password.length >= 8 ? "text-green-600" : "text-muted-foreground"}`}
                >
                  <div
                    className={`w-2 h-2 rounded-full ${password.length >= 8 ? "bg-green-600" : "bg-muted"}`}
                  />
                  8+ characters
                </div>
                <div
                  className={`flex items-center gap-1 ${/[A-Z]/.test(password) ? "text-green-600" : "text-muted-foreground"}`}
                >
                  <div
                    className={`w-2 h-2 rounded-full ${/[A-Z]/.test(password) ? "bg-green-600" : "bg-muted"}`}
                  />
                  Uppercase
                </div>
                <div
                  className={`flex items-center gap-1 ${/[a-z]/.test(password) ? "text-green-600" : "text-muted-foreground"}`}
                >
                  <div
                    className={`w-2 h-2 rounded-full ${/[a-z]/.test(password) ? "bg-green-600" : "bg-muted"}`}
                  />
                  Lowercase
                </div>
                <div
                  className={`flex items-center gap-1 ${/\d/.test(password) ? "text-green-600" : "text-muted-foreground"}`}
                >
                  <div
                    className={`w-2 h-2 rounded-full ${/\d/.test(password) ? "bg-green-600" : "bg-muted"}`}
                  />
                  Number
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <PasswordInput
            id="confirmPassword"
            placeholder="Confirm your password"
            {...register("confirmPassword")}
            aria-invalid={!!errors.confirmPassword}
            className={errors.confirmPassword ? "border-destructive" : ""}
          />
          {errors.confirmPassword && (
            <p className="text-sm text-destructive" role="alert">
              {errors.confirmPassword.message}
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
              Creating account...
            </>
          ) : (
            "Create Account"
          )}
        </Button>
      </form>

      <div className="text-center mt-2 space-y-2">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/auth/sign-in" className="cursor-pointer">
            <Button
              variant="link"
              className="p-0 h-auto text-sm cursor-pointer"
            >
              Sign in
            </Button>
          </Link>
        </p>
        <p className="text-xs text-muted-foreground">
          By creating an account, you agree to our{" "}
          <Link
            href="/legal/terms"
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer"
          >
            <Button
              variant="link"
              className="p-0 h-auto text-xs underline cursor-pointer"
            >
              Terms of Service
            </Button>
          </Link>{" "}
          and{" "}
          <Link
            href="/legal/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer"
          >
            <Button
              variant="link"
              className="p-0 h-auto text-xs underline cursor-pointer"
            >
              Privacy Policy
            </Button>
          </Link>
        </p>
      </div>
    </div>
  );
}
