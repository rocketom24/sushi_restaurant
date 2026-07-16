// components/LogoutButton.tsx
"use client";

import { signOutAction } from "@/app/(auth)/actions";

export default function LogoutButton({
  label = "Logout",
  className = "text-sm text-neutral-600 hover:text-neutral-900 underline",
}: {
  label?: string;
  className?: string;
}) {
  return (
    <form action={signOutAction}>
      <button type="submit" className={className}>
        {label}
      </button>
    </form>
  );
}
