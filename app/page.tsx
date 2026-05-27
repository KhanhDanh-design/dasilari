"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Compass,
  Flame,
  MapPinned,
  MessageCircleMore,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import type { Attraction } from "@/constants/attractions";
import { useLanguage } from "@/components/providers/language-provider";
import { getTranslation } from "@/constants/translations";

import { createClient } from "@/utils/supabase/client";

const MapComponent = dynamic(() => import("@/components/map/MapComponent"), {
  ssr: false,
});

const categoryStyles: Record<string, string> = {
  Cafe: "bg-amber-100 text-amber-900",
  "Thien nhien": "bg-emerald-100 text-emerald-900",
  "Di tich": "bg-stone-200 text-stone-900",
  "Check-in": "bg-rose-100 text-rose-900",
  "Am thuc": "bg-yellow-100 text-yellow-900",
};

const aboutIcons = [Compass, MessageCircleMore, MapPinned] as const;

export default function Home() {
  const { language } = useLanguage();
  const t = getTranslation(language);
  const supabase = createClient();

  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [selectedAttraction, setSelectedAttraction] =
    useState<Attraction | null>(null);

  useEffect(() => {
    async function loadAttractions() {
      const { data } = await supabase
        .from("attractions")
        .select("*")
        .order("created_at", { ascending: false });

      setAttractions(data ?? []);
      setSelectedAttraction(data?.[0] ?? null);
    }

    void loadAttractions();
  }, [supabase]);

  const featuredLabel = useMemo(() => {
    if (!selectedAttraction) {
      return t.home.defaultFeaturedLabel;
    }

    return t.home.categories[selectedAttraction.category];
  }, [selectedAttraction, t.home.categories, t.home.defaultFeaturedLabel]);

  return (
    <section className="mx-auto flex w-full max-w-7xl flex-col gap-8">
      <div id="about" className="h-0 scroll-mt-28" />

      <section className="organic-shadow rounded-3xl border border-border/70 bg-[radial-gradient(circle_at_top,_rgba(246,230,179,0.45),_transparent_60%),linear-gradient(135deg,#fffefb_0%,#f7f2e8_45%,#eef8f2_100%)] p-8 sm:p-10">
        <span className="inline-flex items-center gap-2 rounded-full bg-emerald-600/10 px-4 py-1 text-sm font-semibold text-emerald-700">
          <Sparkles className="h-4 w-4" />
          {t.home.heroBadge}
        </span>

        <h1 className="mt-5 max-w-4xl text-balance text-4xl font-semibold leading-tight text-emerald-900 sm:text-5xl">
          {t.home.heroTitle}
        </h1>

        <p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground sm:text-lg">
          {t.home.heroDescription}
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/#map"
            className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-emerald-700"
          >
            {t.home.heroPrimaryCta}
            <ArrowRight className="h-4 w-4" />
          </Link>

          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-700/20 bg-white/70 px-6 py-3 text-sm font-semibold text-emerald-900">
            <Flame className="h-4 w-4 text-amber-600" />
            {t.home.selectedLabel}: {featuredLabel}
          </span>

          <Link
            href="/survey"
            className="inline-flex items-center gap-2 rounded-full border border-emerald-700/20 bg-white/70 px-6 py-3 text-sm font-semibold text-emerald-900 transition-all duration-300 hover:scale-105 hover:bg-emerald-50"
          >
            {t.home.heroSecondaryCta}
          </Link>
        </div>
      </section>

      <section className="rounded-3xl border border-amber-100 bg-[#fbf3df] p-5 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">
          {t.home.aboutSectionBadge}
        </p>
        <div className="mt-3 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="overflow-hidden rounded-3xl border border-emerald-900/10">
            <img
              src="https://vietnam-tourist.com.vn/wp-content/uploads/2023/03/da-lat.jpg"
              alt={t.home.aboutImageAlt}
              className="h-full min-h-[260px] w-full object-cover"
            />
          </div>
          <div className="rounded-3xl bg-white/75 p-6">
            <h2 className="text-3xl font-semibold text-emerald-950">
              {t.home.aboutTitle}
            </h2>
            <h3 className="mt-3 text-xl font-semibold text-emerald-900">
              {t.home.aboutPassionTitle}
            </h3>
            <p className="mt-4 text-sm leading-7 text-emerald-950/80">
              {t.home.aboutPassionDescription}
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {t.home.aboutCards.map((card, index) => {
          const Icon = aboutIcons[index];
          return (
            <article
              key={card.title}
              className="soft-ring rounded-3xl border border-border/70 bg-surface p-6 transition-all duration-300 hover:scale-[1.02]"
            >
              <Icon className="h-6 w-6 text-emerald-700" />
              <h2 className="mt-4 text-xl font-semibold text-emerald-900">
                {card.title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {card.description}
              </p>
            </article>
          );
        })}
      </section>

      <div id="map" className="h-0 scroll-mt-28" />
      <section className="rounded-3xl border border-border/70 bg-surface p-4 shadow-lg shadow-emerald-900/5 sm:p-6">
        <div className="mb-4">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">
            {t.home.mapSectionLabel}
          </p>
          <h2 className="mt-1 text-3xl font-semibold text-emerald-950">
            {t.home.mapTitle}
          </h2>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-muted-foreground">
            {t.home.mapSubtitle}
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.42fr_0.58fr] xl:grid-cols-[0.4fr_0.6fr]">
          <motion.aside
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="order-2 rounded-3xl border border-border/70 bg-[#fffefb] p-4 shadow-lg shadow-emerald-900/5 lg:order-1"
          >
            <div className="mb-4 flex items-center justify-between px-2 pt-1">
              <div>
                <h2 className="mt-1 text-2xl font-semibold text-emerald-900">
                  {t.home.mapFeaturedLabel}
                </h2>
              </div>
              <span className="rounded-full bg-emerald-600/10 px-3 py-1 text-xs font-semibold text-emerald-800">
                {attractions.length} {t.home.mapCountLabel}
              </span>
            </div>

            <div className="max-h-[760px] space-y-4 overflow-y-auto pr-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {attractions.map((attraction, index) => {
                const isActive = selectedAttraction?.id === attraction.id;

                return (
                  <button
                    key={attraction.id}
                    type="button"
                    onClick={() => setSelectedAttraction(attraction)}
                    className={`group flex w-full gap-4 rounded-[1.5rem] border p-3 text-left transition-all duration-300 hover:scale-[1.01] hover:shadow-lg ${
                      isActive
                        ? "border-emerald-600 bg-emerald-50 shadow-lg shadow-emerald-900/10"
                        : "border-border/70 bg-[#fffefb]"
                    }`}
                  >
                    <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl">
                      <img
                        src={attraction.image_url}
                        alt={attraction.name}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>

                    <div className="min-w-0 flex-1 py-1">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                            {String(index + 1).padStart(2, "0")}
                          </p>
                          <h3 className="mt-1 text-lg font-semibold text-emerald-950">
                            {attraction.name}
                          </h3>
                        </div>

                        <span
                          className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                            categoryStyles[attraction.category] ??
                            "bg-emerald-100 text-emerald-900"
                          }`}
                        >
                          {t.home.categories[attraction.category]}
                        </span>
                      </div>

                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
                        {attraction.description}
                      </p>
                      <p className="mt-3 text-xs font-medium text-emerald-700/80">
                        {attraction.address}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.aside>

          <div className="order-1 h-[540px] min-h-[540px] lg:order-2 lg:h-[calc(100vh-220px)] lg:min-h-[720px]">
            <MapComponent
              attractions={attractions}
              selectedAttraction={selectedAttraction}
              onSelectAttraction={setSelectedAttraction}
              language={language}
            />
          </div>
        </div>
      </section>
    </section>
  );
}
