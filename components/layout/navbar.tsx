"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Languages, Leaf, User, Settings } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useLanguage } from "@/components/providers/language-provider";
import { getTranslation } from "@/constants/translations";
import { createClient } from "@/utils/supabase/client";

export function Navbar() {
  const pathname = usePathname();
  const { language, toggleLanguage } = useLanguage();
  const t = getTranslation(language);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    setMounted(true);
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 12);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!mounted) {
    return null;
  }

  const isAdmin = user?.email === "2212390@dlu.edu.vn";

  const navItems = [t.nav.home, t.nav.map, t.nav.survey, t.nav.itinerary];

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-4 py-4 sm:px-8 lg:px-12">
      <motion.nav
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className={`organic-shadow pointer-events-auto mx-auto flex w-full max-w-6xl items-center justify-between rounded-full border px-4 py-3 sm:px-6 ${
          isScrolled
            ? "border-border/80 bg-[#fffefb]/95 backdrop-blur"
            : "border-white/40 bg-white/55 backdrop-blur"
        }`}
      >
        <Link href="/" className="inline-flex items-center gap-2">
          <span className="rounded-full bg-emerald-600 p-2 text-white">
            <Leaf className="h-4 w-4" />
          </span>
          <span className="font-semibold text-emerald-900">DasiLari</span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const isHashLink = item.href.includes("#");
            const itemPath = item.href.split("#")[0];
            const isActive = !isHashLink && pathname === itemPath;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-300 ${
                  isActive
                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-700/30"
                    : "text-emerald-900 hover:scale-105 hover:bg-emerald-600/10"
                }`}
              >
                {item.label}
              </Link>
            );
          })}

          {user ? (
            <>
              <Link
                href="/profile"
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-300 ${
                  pathname === "/profile"
                    ? "bg-emerald-600 text-white"
                    : "text-emerald-900 hover:bg-emerald-600/10"
                }`}
              >
                Hồ sơ
              </Link>
              {isAdmin ? (
                <Link
                  href="/admin"
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-300 ${
                    pathname === "/admin"
                      ? "bg-[#1a2e26] text-white"
                      : "text-emerald-900 hover:bg-[#1a2e26]/10"
                  }`}
                >
                  Admin
                </Link>
              ) : null}
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-full bg-emerald-600 px-4 py-1.5 text-xs font-semibold text-white transition-all hover:bg-emerald-700"
            >
              Đăng nhập
            </Link>
          )}
        </div>

        <button
          type="button"
          onClick={toggleLanguage}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-white/80 px-3 py-1.5 text-xs font-medium text-emerald-900 transition-all duration-300 hover:scale-105 hover:bg-emerald-50"
          aria-label="Toggle language"
        >
          <Languages className="h-4 w-4" />
          {t.nav.languageToggleLabel}
        </button>
      </motion.nav>
    </header>
  );
}
