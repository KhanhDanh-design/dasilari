"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  // Định nghĩa cứng domain để tránh lỗi proxy nhận nhầm localhost
  const PRODUCTION_URL = "https://dntkhanh.io.vn";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    loading(true);
    setError(null);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${PRODUCTION_URL}/auth/callback`,
          },
        });
        if (error) throw error;
        alert("Kiểm tra email của bạn để xác nhận đăng ký!");
      }
      router.push("/");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Đã xảy ra lỗi");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          // Ép buộc luồng OAuth luôn trả token phản hồi về domain thật
          redirectTo: `${PRODUCTION_URL}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message || "Không thể kết nối với Google");
    }
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md overflow-hidden bg-white shadow-xl rounded-3xl"
      >
        <div className="bg-[#1a2e26] p-8 text-white">
          <h1 className="font-display text-3xl font-bold">
            {isLogin ? "Chào mừng trở lại" : "Tham gia DasiLari"}
          </h1>
          <p className="mt-2 text-green-100/80">
            {isLogin
              ? "Đăng nhập để xem lịch trình của bạn"
              : "Khám phá Đà Lạt theo cách của riêng bạn"}
          </p>
        </div>

        <div className="p-8 bg-[#fdfcf0]">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#1a2e26] mb-1">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-[#1a2e26] focus:border-transparent outline-none transition-all"
                placeholder="email@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1a2e26] mb-1">
                Mật khẩu
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-[#1a2e26] focus:border-transparent outline-none transition-all"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm bg-red-50 p-3 rounded-xl">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#1a2e26] text-white font-bold rounded-2xl hover:bg-[#254136] transition-colors disabled:opacity-50"
            >
              {loading ? "Đang xử lý..." : isLogin ? "Đăng nhập" : "Đăng ký"}
            </button>
          </form>

          {/* Đường kẻ phân cách */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-[#fdfcf0] px-2 text-gray-500">
                Hoặc tiếp tục với
              </span>
            </div>
          </div>

          {/* Nút bấm Google OAuth */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="flex w-full items-center justify-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-4 font-bold text-[#1a2e26] shadow-sm transition-all hover:bg-gray-50 active:scale-[0.98]"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12.24 10.285V13.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.859-3.578-7.859-8s3.53-8 7.859-8c2.46 0 4.105 1.025 5.047 1.926l2.427-2.334C17.955 2.192 15.34 1 12.24 1 6.033 1 1 6.033 1 12.24s5.033 11.24 11.24 11.24c6.478 0 10.793-4.537 10.793-11 0-.746-.08-1.32-.176-1.895H12.24z"
              />
            </svg>
            Đăng nhập bằng Google
          </button>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-[#1a2e26] font-semibold hover:underline"
            >
              {isLogin
                ? "Chưa có tài khoản? Đăng ký ngay"
                : "Đã có tài khoản? Đăng nhập"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
