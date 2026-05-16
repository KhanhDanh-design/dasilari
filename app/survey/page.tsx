"use client";

import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Baby,
  CalendarRange,
  CheckCircle2,
  Coins,
  HeartHandshake,
  Mountain,
  Sparkles,
  Users,
} from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { getTranslation } from "@/constants/translations";

type SurveyChoice = {
  id: string;
  label: string;
  description: string;
  icon: ReactNode;
};

type SurveyState = {
  companion: string;
  style: string;
  budget: string;
  duration: string;
};

const companionOptions: SurveyChoice[] = [
  {
    id: "solo",
    label: "",
    description: "",
    icon: <Sparkles className="h-6 w-6" />,
  },
  {
    id: "couple",
    label: "",
    description: "",
    icon: <HeartHandshake className="h-6 w-6" />,
  },
  {
    id: "friends",
    label: "",
    description: "",
    icon: <Users className="h-6 w-6" />,
  },
  {
    id: "family",
    label: "",
    description: "",
    icon: <Baby className="h-6 w-6" />,
  },
];

const styleOptions: SurveyChoice[] = [
  {
    id: "healing",
    label: "",
    description: "",
    icon: <Mountain className="h-6 w-6" />,
  },
  {
    id: "adventure",
    label: "",
    description: "",
    icon: <Sparkles className="h-6 w-6" />,
  },
  {
    id: "checkin",
    label: "",
    description: "",
    icon: <CheckCircle2 className="h-6 w-6" />,
  },
];

const budgetOptions: SurveyChoice[] = [
  {
    id: "budget-low",
    label: "",
    description: "",
    icon: <Coins className="h-6 w-6" />,
  },
  {
    id: "budget-mid",
    label: "",
    description: "",
    icon: <Coins className="h-6 w-6" />,
  },
  {
    id: "budget-high",
    label: "",
    description: "",
    icon: <Coins className="h-6 w-6" />,
  },
];

const durationOptions: SurveyChoice[] = [
  {
    id: "1-day",
    label: "",
    description: "",
    icon: <CalendarRange className="h-6 w-6" />,
  },
  {
    id: "2-day",
    label: "",
    description: "",
    icon: <CalendarRange className="h-6 w-6" />,
  },
  {
    id: "3-day",
    label: "",
    description: "",
    icon: <CalendarRange className="h-6 w-6" />,
  },
];

const initialState: SurveyState = {
  companion: "",
  style: "",
  budget: "",
  duration: "",
};

const pageMotion = {
  initial: { opacity: 0, x: 28 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -28 },
  transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
};

export default function SurveyPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const t = getTranslation(language);
  const [stepIndex, setStepIndex] = useState(0);
  const [formState, setFormState] = useState(initialState);

  const localizedSteps = [
    {
      field: "companion" as const,
      title: t.survey.steps.companion.title,
      subtitle: t.survey.steps.companion.subtitle,
      options: t.survey.options.companion.map((option, index) => ({
        ...companionOptions[index],
        label: option.label,
        description: option.description,
      })),
    },
    {
      field: "style" as const,
      title: t.survey.steps.style.title,
      subtitle: t.survey.steps.style.subtitle,
      options: t.survey.options.style.map((option, index) => ({
        ...styleOptions[index],
        label: option.label,
        description: option.description,
      })),
    },
    {
      field: "budget" as const,
      title: t.survey.steps.budget.title,
      subtitle: t.survey.steps.budget.subtitle,
      options: t.survey.options.budget.map((option, index) => ({
        ...budgetOptions[index],
        label: option.label,
        description: option.description,
      })),
    },
    {
      field: "duration" as const,
      title: t.survey.steps.duration.title,
      subtitle: t.survey.steps.duration.subtitle,
      options: t.survey.options.duration.map((option, index) => ({
        ...durationOptions[index],
        label: option.label,
        description: option.description,
      })),
    },
  ] as const;

  const currentStep = localizedSteps[stepIndex];
  const isLastStep = stepIndex === localizedSteps.length - 1;
  const canContinue = useMemo(
    () => Boolean(formState[currentStep.field]),
    [currentStep.field, formState],
  );

  const handleSelect = (field: keyof SurveyState, value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (isLastStep) return;
    setStepIndex((prev) => Math.min(prev + 1, localizedSteps.length - 1));
  };

  const handleBack = () => {
    setStepIndex((prev) => Math.max(prev - 1, 0));
  };

  const onSubmit = async () => {
    const payload = {
      ...formState,
      submittedAt: new Date().toISOString(),
    };

    console.log("Survey payload:", payload);
    window.localStorage.setItem("dasilari-survey", JSON.stringify(payload));
    router.push("/itinerary");
  };

  const progress = ((stepIndex + 1) / localizedSteps.length) * 100;

  return (
    <section className="mx-auto w-full max-w-6xl">
      <div className="organic-shadow rounded-3xl border border-border/70 bg-[radial-gradient(circle_at_top,_rgba(246,230,179,0.45),_transparent_60%),linear-gradient(135deg,#fffefb_0%,#f7f2e8_45%,#eef8f2_100%)] p-6 sm:p-8">
        <span className="inline-flex items-center gap-2 rounded-full bg-emerald-600/10 px-4 py-1 text-sm font-semibold text-emerald-700">
          <CheckCircle2 className="h-4 w-4" />
          {t.survey.badge}
        </span>
        <h1 className="mt-5 text-4xl font-semibold text-emerald-900 sm:text-5xl">
          {t.survey.title}
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground sm:text-lg">
          {t.survey.description}
        </p>

        <div className="mt-6 h-2 overflow-hidden rounded-full bg-emerald-100/70">
          <div
            className="h-full rounded-full bg-emerald-600 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[2rem] border border-border/70 bg-surface p-4 shadow-lg shadow-emerald-900/5 sm:p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                  {t.survey.stepLabel} {stepIndex + 1}/{localizedSteps.length}
                </p>
                <h2 className="mt-1 text-2xl font-semibold text-emerald-950">
                  {currentStep.title}
                </h2>
              </div>
              <span className="rounded-full bg-emerald-600/10 px-3 py-1 text-xs font-semibold text-emerald-800">
                {t.survey.progressLabel}
              </span>
            </div>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
              {currentStep.subtitle}
            </p>

            <div className="mt-6 min-h-[430px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep.title}
                  initial={pageMotion.initial}
                  animate={pageMotion.animate}
                  exit={pageMotion.exit}
                  transition={pageMotion.transition}
                  className="space-y-4"
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    {currentStep.options.map((option) => {
                      const isActive =
                        formState[currentStep.field] === option.id;
                      return (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() =>
                            handleSelect(currentStep.field, option.id)
                          }
                          className={`group flex min-h-[150px] flex-col justify-between rounded-[1.75rem] border p-5 text-left transition-all duration-300 hover:scale-[1.02] ${
                            isActive
                              ? "border-emerald-500 bg-emerald-50 shadow-lg shadow-emerald-900/10"
                              : "border-border/80 bg-[#fffefb] hover:border-emerald-300"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div
                              className={`rounded-2xl p-3 ${isActive ? "bg-emerald-100 text-emerald-700" : "bg-stone-100 text-emerald-700"}`}
                            >
                              {option.icon}
                            </div>
                            {isActive ? (
                              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                            ) : null}
                          </div>

                          <div className="mt-4">
                            <h3 className="text-xl font-semibold text-emerald-950">
                              {option.label}
                            </h3>
                            <p className="mt-2 text-sm leading-6 text-muted-foreground">
                              {option.description}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={handleBack}
                disabled={stepIndex === 0}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-white px-5 py-3 text-sm font-semibold text-emerald-900 transition-all duration-300 hover:scale-105 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ArrowLeft className="h-4 w-4" />
                {t.survey.backLabel}
              </button>

              {!isLastStep ? (
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!canContinue}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-45"
                >
                  {t.survey.nextLabel}
                  <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onSubmit}
                  disabled={!canContinue}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-45"
                >
                  {t.survey.finishLabel}
                  <CheckCircle2 className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          <aside className="rounded-[2rem] border border-border/70 bg-surface p-6 shadow-lg shadow-emerald-900/5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
              {t.survey.selectedProfileTitle}
            </p>
            <h3 className="mt-2 text-2xl font-semibold text-emerald-950">
              {t.survey.selectedProfileDescription}
            </h3>

            <div className="mt-6 space-y-4">
              {localizedSteps.map((step) => {
                const value = formState[step.field];
                const picked = step.options.find(
                  (option) => option.id === value,
                );

                return (
                  <div
                    key={step.field}
                    className="rounded-2xl border border-border/70 bg-[#fffefb] p-4"
                  >
                    <p className="text-sm font-semibold text-emerald-900">
                      {step.title}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {picked ? picked.label : t.survey.notSelectedLabel}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 rounded-2xl bg-emerald-600/10 p-4 text-sm leading-6 text-emerald-900">
              {t.survey.savedNote}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
