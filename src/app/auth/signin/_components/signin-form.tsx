"use client";

import { useForm } from "react-hook-form";
import { valibotResolver } from "@hookform/resolvers/valibot";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { type SigninInput, SigninSchema } from "@/validators/signin-validator";
import { signinUserAction } from "@/actions/signin-user-action";
import { useState } from "react";

export const SigninForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<SigninInput>({
    resolver: valibotResolver(SigninSchema),
    defaultValues: { email: "", password: "" },
  });

  const { handleSubmit, control, formState, setError } = form;

  const submit = async (values: SigninInput) => {
    setIsLoading(true);
    try {
      const res = await signinUserAction(values);

      if (res.success) {
        // Check if the user is a freelancer
        const userResponse = await fetch('/api/auth/session');
        const userData = await userResponse.json();
        
        if ((userData?.user as any)?.isFreelancer) {
          window.location.href = "/freelancer/orders";
        } else {
          window.location.href = "/profile";
        }
      } else {
        switch (res.statusCode) {
          case 401:
            setError("password", { message: res.error });
            break;
          case 500:
          default:
            const error = res.error || "Internal Server Error";
            setError("password", { message: error });
        }
      }
    } catch (error) {
      setError("password", { message: "An unexpected error occurred" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(submit)}
        className="max-w-[400px] space-y-8"
        autoComplete="false"
      >
        <FormField
          control={control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="e.g. john.smith@example.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="e.g. ********" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={formState.isSubmitting || isLoading}
          className="w-full"
        >
          {isLoading ? "Signing in..." : "Sign in"}
        </Button>
      </form>
    </Form>
  );
};
