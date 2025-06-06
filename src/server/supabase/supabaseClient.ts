import { createClient } from "@supabase/supabase-js";

import { type Database } from "./supabaseTypes";

import { env } from "~/env.mjs";

export const getServiceSupabase = () =>
  createClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.SUPABASE_SERVICE_KEY,
    {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
      },
    },
  );

export const clientSupabase = createClient<Database>(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

export const supabase = () =>
  typeof window === "undefined" ? getServiceSupabase() : clientSupabase;

export const getUserAsAdmin = async (token: string) => {
  const { data, error } = await getServiceSupabase().auth.getUser(token);

  if (error) {
    console.error(error);
    throw error;
  }

  return data;
};

export const storageBucketsNames = {
  menus: "menus-files",
} as const;
