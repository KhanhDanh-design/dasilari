import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, host } = new URL(request.url);
  const isLocalhost =
    host.startsWith("localhost") || host.startsWith("127.0.0.1");
  const baseUrl = isLocalhost ? "http://localhost:3000" : `https://${host}`;
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      let {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        await new Promise((resolve) => setTimeout(resolve, 150));
        ({
          data: { user },
        } = await supabase.auth.getUser());
      }

      const redirectPath =
        user?.email === "2212390@dlu.edu.vn" ? "/admin" : "/";
      return NextResponse.redirect(new URL(redirectPath, baseUrl));
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${baseUrl}/auth/auth-code-error`);
}
