import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, host } = new URL(request.url);

  // Kiểm tra xem có phải đang chạy ở môi trường local không
  const isLocalhost =
    host.startsWith("localhost") ||
    host.startsWith("127.0.0.1") ||
    host.startsWith("157.230.255.181");

  // Nếu là local thì dùng localhost, nếu là production thì ép thẳng về tên miền chính thức của bạn
  const baseUrl = isLocalhost
    ? "http://localhost:3000"
    : "https://dntkhanh.io.vn";

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

      // Điều hướng dựa trên email admin
      const redirectPath =
        user?.email === "2212390@dlu.edu.vn" ? "/admin" : "/";
      return NextResponse.redirect(new URL(redirectPath, baseUrl));
    }
  }

  // Nếu có lỗi, trả user về trang lỗi của hệ thống
  return NextResponse.redirect(`${baseUrl}/auth/auth-code-error`);
}
