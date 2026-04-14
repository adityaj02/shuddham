import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { adminEmails } from "@/lib/env";

export const getSession = async () => {
  const supabase = createSupabaseServerClient();
  if (!supabase) return { userId: null, user: null };

  const { data: { user } } = await supabase.auth.getUser();
  return { userId: user?.id ?? null, user };
};

export const requireUser = async () => {
  const session = await getSession();

  if (!session.userId || !session.user) {
    redirect("/auth/login");
  }

  return session;
};

export const isAdminSession = async () => {
  const session = await getSession();
  const email = session.user?.email?.toLowerCase();

  return Boolean(
    session.userId && email && adminEmails.includes(email)
  );
};
