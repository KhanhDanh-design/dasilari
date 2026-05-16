"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CloudSun,
  CupSoda,
  MoonStar,
  Mountain,
  Sunrise,
  UtensilsCrossed,
} from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { getTranslation } from "@/constants/translations";

const stageIcons = [Sunrise, CupSoda, Mountain, MoonStar] as const;

export default function ItineraryPage() {
  const { language } = useLanguage();
  const t = getTranslation(language);

  return (
    <section className="mx-auto w-full max-w-6xl">
      <div className="organic-shadow rounded-3xl border border-border/70 bg-[radial-gradient(circle_at_top,_rgba(246,230,179,0.45),_transparent_60%),linear-gradient(135deg,#fffefb_0%,#f7f2e8_45%,#eef8f2_100%)] p-6 sm:p-8">
        <span className="inline-flex items-center gap-2 rounded-full bg-emerald-600/10 px-4 py-1 text-sm font-semibold text-emerald-700">
          <CloudSun className="h-4 w-4" />
          {t.itinerary.badge}
        </span>
        <h1 className="mt-5 text-4xl font-semibold text-emerald-900 sm:text-5xl">
          {t.itinerary.title}
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground sm:text-lg">
          {t.itinerary.description}
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.42fr]">
          <div className="rounded-[2rem] border border-border/70 bg-surface p-6 shadow-lg shadow-emerald-900/5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                  {t.itinerary.dayLabel}
                </p>
                <h2 className="mt-1 text-2xl font-semibold text-emerald-950">
                  {t.itinerary.timelineSummary}
                </h2>
              </div>
              <span className="rounded-full bg-emerald-600/10 px-3 py-1 text-xs font-semibold text-emerald-800">
                {t.itinerary.timeRangeLabel}
              </span>
            </div>

            <div className="mt-8 space-y-8">
              {t.itinerary.stages.map((stage, index) => {
                const Icon = stageIcons[index];
                return (
                  <motion.article
                    key={stage.time}
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.35, delay: index * 0.05 }}
                    className="grid gap-5 md:grid-cols-[auto_1fr]"
                  >
                    <div className="relative flex items-start justify-center md:justify-start">
                      <div className="absolute left-1/2 top-0 h-full w-px bg-emerald-200 md:left-6" />
                      <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg shadow-emerald-900/10 md:ml-0">
                        <Icon className="h-5 w-5" />
                      </div>
                    </div>

                    <div className="rounded-[1.75rem] border border-border/70 bg-[#fffefb] p-5">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
                            {stage.time}
                          </p>
                          <h3 className="mt-1 text-xl font-semibold text-emerald-950">
                            {stage.title}
                          </h3>
                        </div>
                        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                          {stage.badge}
                        </span>
                      </div>
                      <p className="mt-3 text-sm leading-6 text-muted-foreground">
                        {stage.description}
                      </p>
                      <div className="mt-4 flex flex-wrap items-center gap-2 text-sm font-medium text-emerald-900">
                        <UtensilsCrossed className="h-4 w-4 text-emerald-700" />
                        <span>{stage.location}</span>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          </div>

          <aside className="rounded-[2rem] border border-border/70 bg-surface p-6 shadow-lg shadow-emerald-900/5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
              {t.itinerary.notesLabel}
            </p>
            <h3 className="mt-2 text-2xl font-semibold text-emerald-950">
              {t.itinerary.notesTitle}
            </h3>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              {t.itinerary.notesDescription}
            </p>

            <div className="mt-6 space-y-4 rounded-[1.5rem] bg-emerald-600/10 p-4 text-sm leading-6 text-emerald-900">
              {t.itinerary.dayNotes.map((note) => (
                <p key={note}>{note}</p>
              ))}
            </div>

            <div className="mt-6 rounded-[1.5rem] border border-border/70 bg-[#fffefb] p-4">
              <p className="text-sm font-semibold text-emerald-900">
                {t.itinerary.highlightsLabel}
              </p>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-muted-foreground">
                {t.itinerary.stages.map((stage) => (
                  <li key={stage.time} className="flex items-start gap-2">
                    <span className="mt-2 h-2 w-2 rounded-full bg-emerald-600" />
                    <span>
                      {stage.badge} - {stage.location}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <Link
              href="/survey"
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-emerald-700"
            >
              <ArrowLeft className="h-4 w-4" />
              {t.itinerary.backLabel}
            </Link>
          </aside>
        </div>
      </div>
    </section>
  );
}
