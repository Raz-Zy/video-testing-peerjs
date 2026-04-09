"use client";

import { useState } from "react";
import { email, z } from "zod";
import { Button } from "@heroui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { sileo } from "sileo";
import { useCartStore } from "@/utils/cart";

const LoginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required.")
    .email("Enter a valid email."),
  password: z
    .string()
    .min(1, "Password is required.")
    .min(6, "Password must be at least 6 characters."),
});

export default function LoginFormComponent() {
  const [submitError, setSubmitError] = useState("");
  const router = useRouter();
  const cartCount = useCartStore((s) => s.items.length);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    console.log(data);
    setSubmitError("");
    // const result = await loginAction(data);
    // console.log("result: ", result)

    // setSubmitError("Demo only — no login backend is connected yet.");

    const res = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirectTo: "/",
      redirect: false,
    });

    if (!res?.ok) {
      setSubmitError(
        "Login failed. Please check your email/password and try again.",
      );
      return;
    }

    const itemText = cartCount === 1 ? "item" : "items";
    sileo.success({
      position: "top-center",
      title: "Login success",
      description: `Your order products are ready. You have ${cartCount} ${itemText} in your cart.`,
      duration: 2000,
    });

    router.replace(res?.url ?? "/");
  };

  return (
    <form
      className="mt-8 space-y-5"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      {submitError && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {submitError}
        </div>
      )}

      <div>
        <label
          htmlFor="login-email"
          className="block text-sm font-medium text-gray-700"
        >
          Email
        </label>
        <input
          id="login-email"
          type="email"
          autoComplete="email"
          {...register("email")}
          className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none ring-lime-400/20 focus:border-lime-400 focus:ring-2"
          placeholder="you@example.com"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="login-password"
          className="block text-sm font-medium text-gray-700"
        >
          Password
        </label>
        <input
          id="login-password"
          type="password"
          autoComplete="current-password"
          {...register("password")}
          className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none ring-lime-400/20 focus:border-lime-400 focus:ring-2"
          placeholder="••••••••"
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
        )}
      </div>

      <Button
        type="submit"
        variant="solid"
        className="w-full rounded-full bg-lime-400 py-3.5 text-sm font-semibold text-gray-900 shadow-sm transition hover:bg-lime-300"
      >
        Sign in
      </Button>
    </form>
  );
}