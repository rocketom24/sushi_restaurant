"use server";

import { createClient } from "@/lib/supabase/server";
import { registerSchema, type RegisterFormState } from "@/lib/validations/auth";
import { redirect } from "next/navigation";

export async function registerAction(
  _prevState: RegisterFormState,
  formData: FormData
): Promise<RegisterFormState> {
  const raw = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    confirmPassword: formData.get("confirmPassword") as string,
  };

  const validated = registerSchema.safeParse(raw);

  if (!validated.success) {
    return {
      errors: validated.error.flatten().fieldErrors,
    };
  }

  const { name, email, password } = validated.data;

  const supabase = await createClient();

const { error } = await supabase.auth.signUp({
  email,
  password,
  options: {
    data: { name },
  },
});

  if (error) {
    if (
      error.message.toLowerCase().includes("already registered") ||
      error.message.toLowerCase().includes("already exists") ||
      error.code === "user_already_exists"
    ) {
      return {
  errors: {
    email: ["This email is already registered."],
  },

  values: {
    name,
    email,
  },
};
    }

    if (
      error.message.toLowerCase().includes("password") &&
      error.message.toLowerCase().includes("weak")
    ) {
      return {
        errors: { password: ["Password is too weak. Try a stronger one."] },
      };
    }

    console.error("Supabase signup error:", error);

    return {
      errors: {
        _form: [error.message],
      },
    };
  }

  redirect("/login?message=Account created successfully.");
}