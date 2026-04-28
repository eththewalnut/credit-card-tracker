"use client";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "./card";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";
import React, { useEffect, useState } from "react";
import LoaderOverlay from "./loader-overlay";
import { signIn, signUp } from "@/lib/actions/auth-actions";
import { formValidator } from "@/lib/helpers/form-validator";
import { Eye, EyeClosed } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

export default function AuthForm() {
  const redirectError = useSearchParams().get("error");
  const router = useRouter();
  const [isSignIn, setIsSignIn] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string[]>([]);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [viewPassword, setViewPassword] = useState(false);
  const [viewConfirmPassword, setViewConfirmPassword] = useState(false);

  useEffect(() => {
    if (redirectError === "invalid_session") {
      setError(["Unauthorized action. Please login to access the dashboard."]);
    }
  }, [redirectError]);

  const emailErrors = [
    "Email is required",
    "Email is invalid",
    "Email is too long",
    "User already exists. Use another email.",
    "Invalid email or password",
    "Unauthorized action. Please login to access the dashboard.",
  ];
  const passwordErrors = [
    "Password is required",
    "Passwords are not matching",
    "Password must be at least 8 characters",
    "Password must include an uppercase letter",
    "Password must contain at least one number",
    "Password is too long",
    "Password must contain at least one special character",
    "Invalid email or password",
    "Unauthorized action. Please login to access the dashboard.",
  ];
  const nameErrors = ["Name is required", "Name is too long"];

  const handleResetForm = () => {
    setName("");
    setPassword("");
    setConfirmPassword("");
    setEmail("");
    setError([]);
    setIsSignIn((prev) => !prev);
    console.log(name, password, confirmPassword, email);
  };

  const handleSignUp = async () => {
    setIsLoading(true);
    const hasErrors = formValidator(
      true,
      email,
      password,
      confirmPassword,
      name,
    );
    if (hasErrors.length > 0) {
      setError(hasErrors);
      setIsLoading(false);
      return;
    }

    try {
      const result = await signUp(email, password, name);
      if (result instanceof Error) {
        throw result;
      }
      if (!result) {
        throw new Error("Something went wrong!");
      }
      router.push("/dashboard");
      return result;
    } catch (error) {
      if (error instanceof Error) setError([error.message]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async () => {
    setIsLoading(true);
    const validationErrors = formValidator(false, email, password);
    if (validationErrors.length > 0) {
      setError(validationErrors);
      setIsLoading(false);
    }

    try {
      const result = await signIn(email, password);
      if (!result) {
        throw new Error("Something went wrong!");
      }
      if (result instanceof Error) {
        throw result;
      }

      router.push("/dashboard");
    } catch (err) {
      if (err instanceof Error) {
        setError([err.message]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignIn) {
      return handleSignIn();
    } else {
      return handleSignUp();
    }
  };
  return (
    <>
      <LoaderOverlay loading={isLoading} loadingText="Please wait..." />
      <Card className="w-full">
        <CardHeader>
          <CardTitle>
            {isSignIn ? "Login to your account" : "Sign up a new account"}
          </CardTitle>
          <CardDescription>
            {isSignIn
              ? "Enter your registered email below to login to your account"
              : "Enter valid details to sign up a new account"}
          </CardDescription>
          {error.length > 0 && (
            <div className="bg-yellow-400 text-sm text-black p-2 my-2">
              {error.map((err, index) => (
                <p key={index}>{err}</p>
              ))}
            </div>
          )}
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  className={
                    error.some((err) => emailErrors.includes(err))
                      ? "border-4 border-double border-red-400"
                      : undefined
                  }
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  value={email}
                  required
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError((prev) =>
                      prev.filter((error) => !emailErrors.includes(error)),
                    );
                  }}
                />
                {error.some((err) => emailErrors.includes(err)) && (
                  <p className="text-red-400 text-xs">Email is invalid</p>
                )}
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  {/* <a
                  href="#"
                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </a> */}
                </div>
                <div className="relative">
                  <Input
                    className={
                      error.some((err) => passwordErrors.includes(err))
                        ? "border-4 border-double border-red-400 pr-10"
                        : "pr-10"
                    }
                    id="password"
                    type={viewPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError((prev) =>
                        prev.filter((error) => !passwordErrors.includes(error)),
                      );
                    }}
                    required
                  />
                  <Button
                    className="absolute right-1 top-1/2 -translate-y-1/2"
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setViewPassword((prev) => !prev)}
                  >
                    {viewPassword ? <EyeClosed /> : <Eye />}
                  </Button>
                </div>
                {!isSignIn && (
                  <div className="grid gap-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <div className="relative">
                      <Input
                        className={
                          error.some((err) => passwordErrors.includes(err))
                            ? "border-4 border-double border-red-400 pr-10"
                            : "pr-10"
                        }
                        id="confirm-password"
                        type={viewConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                          setError((prev) =>
                            prev.filter(
                              (error) => !passwordErrors.includes(error),
                            ),
                          );
                        }}
                        required
                      />
                      <Button
                        className="absolute right-1 top-1/2 -translate-y-1/2"
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => setViewConfirmPassword((prev) => !prev)}
                      >
                        {viewConfirmPassword ? <EyeClosed /> : <Eye />}
                      </Button>
                    </div>
                  </div>
                )}
                {error.some((err) => passwordErrors.includes(err)) && (
                  <p className="text-red-400 text-xs">Password is invalid</p>
                )}
              </div>
              {!isSignIn && (
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    className={
                      error.some((err) => nameErrors.includes(err))
                        ? "border-4 border-double border-red-400"
                        : undefined
                    }
                    id="name"
                    type="text"
                    placeholder="John Doe or Jane Doe"
                    onChange={(e) => {
                      setName(e.target.value);
                      setError((prev) =>
                        prev.filter((error) => !nameErrors.includes(error)),
                      );
                    }}
                    value={name}
                    required
                  />
                  {error.some((err) => nameErrors.includes(err)) && (
                    <p className="text-red-400 text-xs">Name is invalid</p>
                  )}
                </div>
              )}

              <div className="grid gap-2"></div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button
            type="submit"
            className="w-full"
            onClick={handleSubmit}
            disabled={error.length > 0}
          >
            {isSignIn ? "Login" : "Sign-up"}
          </Button>
          <Button
            variant={"ghost"}
            className="hover:cursor-pointer"
            onClick={handleResetForm}
          >
            {isSignIn
              ? "No account yet? Sign up here"
              : "Already have an account? Sign in"}
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}
