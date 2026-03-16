"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowRight, Eye, EyeOff } from "lucide-react";

import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const schema = z
  .object({
    password: z
      .string()
      .min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof schema>;

export default function ResetPassword() {

  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: FormValues) => {

    setIsSubmitting(true);

    // API call yaha hogi
    await new Promise((r) => setTimeout(r, 1500));

    console.log("Reset password:", values);

    setIsSubmitting(false);

    router.push("/auth?mode=login");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4">

      <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-8 shadow-lg">

        <h2 className="text-2xl font-bold text-center text-gray-900">
          Reset Password
        </h2>

        <p className="mt-1 text-center text-sm text-gray-500">
          Create a new password for your account
        </p>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-6 space-y-4"
          >

            {/* Password */}

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>

                  <FormControl>
                    <div className="relative">

                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="New password"
                        {...field}
                      />

                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-gray-400"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>

                    </div>
                  </FormControl>

                  <FormMessage />

                </FormItem>
              )}
            />

            {/* Confirm password */}

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>

                  <FormControl>
                    <div className="relative">

                      <Input
                        type={showConfirm ? "text" : "password"}
                        placeholder="Confirm password"
                        {...field}
                      />

                      <button
                        type="button"
                        onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute right-3 top-2.5 text-gray-400"
                      >
                        {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>

                    </div>
                  </FormControl>

                  <FormMessage />

                </FormItem>
              )}
            />

            {/* Button */}

            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex h-11 w-full items-center justify-center bg-blue-800 rounded-[10px]"
            >
              {isSubmitting ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                <>
                  <span>Reset Password</span>
                  <ArrowRight size={15} strokeWidth={2.5} />
                </>
              )}
            </Button>

          </form>
        </Form>

      </div>

    </div>
  );
}