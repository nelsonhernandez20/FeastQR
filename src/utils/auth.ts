import { cookies } from "next/headers";
import { supabase } from "~/server/supabase/supabaseClient";

export const getServerUser = async () => {
  try {
    const ckies = cookies();
    const mappedCookies = new Map(ckies);
    const accessToken = mappedCookies.get("access-token")?.value;
    const refreshToken = mappedCookies.get("refresh-token")?.value;

    console.log("Auth tokens found:", {
      accessToken: accessToken ? "exists" : "missing",
      refreshToken: refreshToken ? "exists" : "missing",
    });

    if (!accessToken || !refreshToken) {
      console.log("No auth tokens found in cookies");
      return {
        user: null,
        session: null,
      };
    }

    const { error, data } = await supabase().auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    if (error) {
      console.error("Error setting session:", error);
      return {
        user: null,
        session: null,
      };
    }

    console.log("Session set successfully:", {
      user: data.user ? "exists" : "null",
      session: data.session ? "exists" : "null",
    });

    return data;
  } catch (error) {
    console.error("Unexpected error in getServerUser:", error);
    return {
      user: null,
      session: null,
    };
  }
};
