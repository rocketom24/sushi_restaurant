// components/menu/DeleteMenuItemButton.tsx
"use client";

import { useTransition } from "react";
import { deleteMenuItemAction } from "@/lib/actions/menu-item.actions";
import { useRouter } from "next/navigation";

export default function DeleteMenuItemButton({ menuItemId }: { menuItemId: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleDelete() {
    if (!confirm("Delete this menu item? This cannot be undone.")) return;
    startTransition(async () => {
      await deleteMenuItemAction(menuItemId);
      router.refresh();
    });
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="text-sm text-red-600 hover:text-red-800 disabled:opacity-50"
    >
      {isPending ? "Deleting..." : "Delete"}
    </button>
  );
}