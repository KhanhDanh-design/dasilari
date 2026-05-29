import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  // Ép cứng baseUrl về tên miền chính thức của bạn, không dùng localhost nữa
  const baseUrl = "https://dntkhanh.io.vn";

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

      // Điều hướng dựa trên email đăng nhập của admin hoặc user thường
      const redirectPath =
        user?.email === "2212390@dlu.edu.vn" ? "/admin" : "/";
      return NextResponse.redirect(new URL(redirectPath, baseUrl));
    }
  }

  // Nếu có lỗi, ép trả user về trang lỗi chạy trên domain chính thức
  return NextResponse.redirect(`${baseUrl}/auth/auth-code-error`);
}
