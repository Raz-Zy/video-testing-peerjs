"use server";

import { registerService } from "@/services/auth";
import { signIn } from "@/app/auth";

export const loginAction = async (userData) => {
  return await signIn("credentials", {
    email: userData.email,
    password: userData.password,
    redirectTo: "/",
  });
};

export const registerAction = async (userData) => {
  const registeredUser = await registerService(userData);
  return registeredUser;
};