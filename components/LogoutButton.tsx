// components/LogoutButton.tsx
"use client";

import { signOutAction } from "@/app/(auth)/actions";

export default function LogoutButton() {
  return (
    <form action={signOutAction}>
      <button
        type="submit"
        className="text-sm text-neutral-600 hover:text-neutral-900 underline"
      >
        Logout
      </button>
    </form>
  );
}