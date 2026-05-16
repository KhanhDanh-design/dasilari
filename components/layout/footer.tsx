"use client";

import Link from "next/link";
import { Mail, Mountain, Phone, Trees } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { getTranslation } from "@/constants/translations";

export function Footer() {
  const { language } = useLanguage();
  const t = getTranslation(language);
  const year = new Date().getFullYear();

  return (
    <footer className="px-4 pb-8 pt-6 sm:px-8 lg:px-12">
      <div className="organic-shadow mx-auto w-full max-w-6xl rounded-3xl border border-emerald-900/10 bg-[#f3ead3] px-6 py-7 text-sm text-emerald-950 sm:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2 text-emerald-900">
              <Mountain className="h-4 w-4" />
              <span className="font-semibold text-emerald-950">DasiLari</span>
              <Trees className="h-4 w-4 text-emerald-700" />
            </div>
            <p className="mt-3 max-w-sm font-medium leading-6 text-emerald-900/90">
              {t.footer.slogan}
            </p>
            <p className="mt-3 max-w-sm text-xs leading-6 text-emerald-900/80">
              {t.footer.studentInfo}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-800">
              {t.footer.contactTitle}
            </h3>
            <div className="mt-3 space-y-2 text-emerald-900/90">
              <p className="inline-flex items-center gap-2">
                <Mail className="h-4 w-4 text-emerald-700" />
                {t.footer.emailLabel}
              </p>
              <p className="inline-flex items-center gap-2">
                <Phone className="h-4 w-4 text-emerald-700" />
                {t.footer.phoneLabel}
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-800">
              {t.footer.quickLinksTitle}
            </h3>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link
                href="/#about"
                className="rounded-full bg-white/90 px-4 py-2 text-emerald-900 transition-all duration-300 hover:scale-105 hover:bg-white"
              >
                {t.nav.home.label}
              </Link>
              <Link
                href="/#map"
                className="rounded-full bg-white/90 px-4 py-2 text-emerald-900 transition-all duration-300 hover:scale-105 hover:bg-white"
              >
                {t.nav.map.label}
              </Link>
              <Link
                href="/survey"
                className="rounded-full bg-white/90 px-4 py-2 text-emerald-900 transition-all duration-300 hover:scale-105 hover:bg-white"
              >
                {t.nav.survey.label}
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-7 flex flex-col gap-3 border-t border-emerald-900/10 pt-5 text-emerald-900/85 sm:flex-row sm:items-center sm:justify-between">
          <p>{t.footer.copyright}</p>
          <p>{year}</p>
        </div>
      </div>
    </footer>
  );
}
