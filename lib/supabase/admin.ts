// lib/supabase/admin.ts
//
// Service-role Supabase client — bypasses RLS, used only for trusted
// server-side work (Storage uploads, test-user provisioning). The
// service role key must never reach the browser: only import this
// from "use server" files or other server-only modules.
import { createClient } from "@supabase/supabase-js";

export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
