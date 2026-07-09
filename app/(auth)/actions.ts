"use server";

import { createClient } from "@/lib/supabase/server";
import { registerSchema, type RegisterFormState } from "@/lib/validations/auth";
import { redirect } from "next/navigation";
import { loginSchema, type LoginFormState } from "@/lib/validations/auth";
import { prisma } from "@/lib/prisma";

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



export async function loginAction(
  _prevState: LoginFormState,
  formData: FormData
): Promise<LoginFormState> {
  const raw = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const validated = loginSchema.safeParse(raw);

  if (!validated.success) {
    return {
      errors: validated.error.flatten().fieldErrors,
    };
  }

  const { email, password } = validated.data;

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    if (error.message.toLowerCase().includes("email not confirmed")) {
      return {
        errors: {
          _form: ["Please verify your email before logging in."],
        },
      };
    }

    // Deliberately vague — never reveal whether the email exists.
    // "Invalid email or password" prevents user enumeration attacks.
    return {
      errors: { _form: ["Invalid email or password."] },
    };
  }

  if (!data.user) {
    return {
      errors: { _form: ["Something went wrong. Please try again."] },
    };
  }

  // Role-based redirect — look up the profile created by the trigger
  const profile = await prisma.user.findUnique({
    where: { id: data.user.id, deletedAt: null },
    select: { role: true },
  });

  if (!profile) {
    // Edge case: auth.users row exists but public.users trigger
    // hasn't caught up yet, or the account was soft-deleted.
    return {
      errors: {
        _form: ["Your account could not be found. Please contact support."],
      },
    };
  }

  if (profile.role === "OWNER") {
    redirect("/dashboard");
  }

  redirect("/");
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}