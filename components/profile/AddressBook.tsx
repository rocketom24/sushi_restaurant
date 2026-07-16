"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  createAddressAction,
  deleteAddressAction,
  setDefaultAddressAction,
  updateAddressAction,
} from "@/lib/actions/profile.actions";
import { useI18n } from "@/components/i18n/I18nProvider";
import type { AddressFormState } from "@/lib/validations/profile";

export type Address = {
  id: string;
  label: string;
  fullAddress: string;
  city: string | null;
  postalCode: string | null;
  notes: string | null;
  isDefault: boolean;
};

const inputClass =
  "w-full rounded-lg bg-white/3 border border-white/10 px-4 py-3 text-sm text-cream placeholder:text-gray-500 focus:outline-none focus:border-accent transition-colors";
const labelClass =
  "block text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2";

function AddressForm({
  address,
  onDone,
}: {
  address?: Address;
  onDone: () => void;
}) {
  const { dict } = useI18n();
  const t = dict.profile;
  const router = useRouter();

  const action = address
    ? updateAddressAction.bind(null, address.id)
    : createAddressAction;
  const [state, formAction, isPending] = useActionState<AddressFormState, FormData>(
    action,
    {}
  );

  useEffect(() => {
    if (state.success) {
      router.refresh();
      onDone();
    }
  }, [state.success, router, onDone]);

  return (
    <form action={formAction} className="glass rounded-3xl p-6 space-y-5">
      {state.errors?._form && (
        <div className="rounded-lg bg-red-500/10 border border-red-500/40 px-4 py-3 text-sm text-red-300">
          {state.errors._form[0]}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="label" className={labelClass}>{t.label}</label>
          <input
            id="label"
            name="label"
            defaultValue={address?.label ?? ""}
            placeholder={t.labelPlaceholder}
            required
            className={inputClass}
          />
          {state.errors?.label && (
            <p className="mt-2 text-xs text-red-400">{state.errors.label[0]}</p>
          )}
        </div>
        <div>
          <label htmlFor="postalCode" className={labelClass}>{t.postalCode}</label>
          <input
            id="postalCode"
            name="postalCode"
            defaultValue={address?.postalCode ?? ""}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="fullAddress" className={labelClass}>{t.fullAddress}</label>
        <input
          id="fullAddress"
          name="fullAddress"
          defaultValue={address?.fullAddress ?? ""}
          required
          className={inputClass}
        />
        {state.errors?.fullAddress && (
          <p className="mt-2 text-xs text-red-400">{state.errors.fullAddress[0]}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="city" className={labelClass}>{t.city}</label>
          <input
            id="city"
            name="city"
            defaultValue={address?.city ?? ""}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="notes" className={labelClass}>{t.notes}</label>
          <input
            id="notes"
            name="notes"
            defaultValue={address?.notes ?? ""}
            placeholder={t.notesPlaceholder}
            className={inputClass}
          />
        </div>
      </div>

      <label className="flex items-center gap-3 text-sm text-gray-300 font-light cursor-pointer">
        <input
          type="checkbox"
          name="isDefault"
          defaultChecked={address?.isDefault ?? false}
          className="accent-[#E05A47]"
        />
        {t.setDefault}
      </label>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="bg-accent hover:bg-white hover:text-night text-white px-8 py-2.5 rounded-full text-xs font-semibold uppercase tracking-widest disabled:opacity-50 transition-all duration-300"
        >
          {isPending ? t.saving : t.save}
        </button>
        <button
          type="button"
          onClick={onDone}
          className="border border-white/15 text-gray-400 hover:border-white/40 hover:text-cream px-8 py-2.5 rounded-full text-xs font-semibold uppercase tracking-widest transition-all duration-300"
        >
          {t.cancel}
        </button>
      </div>
    </form>
  );
}

export default function AddressBook({ addresses }: { addresses: Address[] }) {
  const { dict } = useI18n();
  const t = dict.profile;
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [mode, setMode] = useState<"list" | "add" | string>("list");

  function handleDelete(id: string) {
    if (!confirm(t.deleteConfirm)) return;
    startTransition(async () => {
      const result = await deleteAddressAction(id);
      if ("error" in result && result.error) alert(result.error);
      else router.refresh();
    });
  }

  function handleSetDefault(id: string) {
    startTransition(async () => {
      const result = await setDefaultAddressAction(id);
      if ("error" in result && result.error) alert(result.error);
      else router.refresh();
    });
  }

  return (
    <div className="space-y-4">
      {addresses.length === 0 && mode === "list" && (
        <p className="text-gray-400 font-light text-center py-10">{t.noAddresses}</p>
      )}

      {addresses.map((address) =>
        mode === address.id ? (
          <AddressForm key={address.id} address={address} onDone={() => setMode("list")} />
        ) : (
          <div key={address.id} className="glass rounded-3xl p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-serif text-lg text-cream flex items-center gap-3">
                  {address.label}
                  {address.isDefault && (
                    <span className="bg-accent/15 text-accent text-[9px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full">
                      {t.isDefault}
                    </span>
                  )}
                </p>
                <p className="text-sm text-gray-400 font-light mt-1">
                  {[address.fullAddress, address.postalCode, address.city]
                    .filter(Boolean)
                    .join(", ")}
                </p>
                {address.notes && (
                  <p className="text-xs text-gray-500 font-light italic mt-1">
                    {address.notes}
                  </p>
                )}
              </div>
              <div className="flex flex-col items-end gap-2 text-xs uppercase tracking-wider whitespace-nowrap">
                <button
                  onClick={() => setMode(address.id)}
                  className="text-gray-400 hover:text-accent transition-colors"
                >
                  {t.editAddress}
                </button>
                {!address.isDefault && (
                  <button
                    onClick={() => handleSetDefault(address.id)}
                    disabled={isPending}
                    className="text-gray-400 hover:text-accent disabled:opacity-50 transition-colors"
                  >
                    {t.setDefault}
                  </button>
                )}
                <button
                  onClick={() => handleDelete(address.id)}
                  disabled={isPending}
                  className="text-red-400 hover:text-red-300 disabled:opacity-50 transition-colors"
                >
                  {t.delete}
                </button>
              </div>
            </div>
          </div>
        )
      )}

      {mode === "add" ? (
        <AddressForm onDone={() => setMode("list")} />
      ) : (
        <button
          onClick={() => setMode("add")}
          className="w-full border border-dashed border-white/15 hover:border-accent text-gray-400 hover:text-accent rounded-3xl py-4 text-xs font-semibold uppercase tracking-widest transition-all duration-300"
        >
          + {t.addAddress}
        </button>
      )}
    </div>
  );
}
