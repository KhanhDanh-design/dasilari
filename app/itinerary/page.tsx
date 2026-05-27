"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CloudSun,
  CupSoda,
  MapPin,
  MoonStar,
  Mountain,
  Sunrise,
  UtensilsCrossed,
  Save,
  Loader2,
} from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { getTranslation } from "@/constants/translations";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import type { Attraction } from "@/constants/attractions";

const stageIcons = [Sunrise, CupSoda, Mountain, MoonStar] as const;

type ItineraryStage = {
  id: string;
  time: string;
  title: string;
  description: string;
  badge: string;
  location: string;
  dayIndex: string;
  date: string | null;
};

export default function ItineraryPage() {
  const { language } = useLanguage();
  const t = getTranslation(language);
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [customStages, setCustomStages] = useState<ItineraryStage[]>([]);
  const [suggestions, setSuggestions] = useState<Attraction[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [pendingAttraction, setPendingAttraction] = useState<Attraction | null>(
    null,
  );
  const [pendingPeriod, setPendingPeriod] = useState("morning");
  const [pendingTime, setPendingTime] = useState("07:00");
  const [activeDay, setActiveDay] = useState<string>("1");
  const [activeDate, setActiveDate] = useState("");
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function loadSuggestions() {
      const query = searchQuery.trim();
      if (!query) {
        setSuggestions([]);
        return;
      }

      setIsSearching(true);
      const { data } = await supabase
        .from("attractions")
        .select("*")
        .or(`name.ilike.%${query}%,address.ilike.%${query}%`)
        .limit(5);
      setSuggestions(data ?? []);
      setIsSearching(false);
    }

    void loadSuggestions();
  }, [searchQuery, supabase]);

  const periodOptions = [
    { value: "morning", label: "Sáng (07:00 - 11:00)", defaultTime: "07:00" },
    {
      value: "noon",
      label: "Trưa/Chiều (11:00 - 17:00)",
      defaultTime: "13:00",
    },
    { value: "evening", label: "Tối (17:00 - 22:00)", defaultTime: "19:00" },
  ];

  const toMinutes = (value: string) => {
    const parts = value.split(":");
    const hours = Number(parts[0] ?? 0);
    const minutes = Number(parts[1] ?? 0);
    return hours * 60 + minutes;
  };

  const handleAddAttraction = () => {
    if (!pendingAttraction) return;
    const periodLabel =
      periodOptions.find((option) => option.value === pendingPeriod)?.label ??
      "Tùy chỉnh";

    setCustomStages((prev) => [
      ...prev,
      {
        id:
          globalThis.crypto?.randomUUID?.() ??
          `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        time: pendingTime || "07:00",
        title: pendingAttraction.name,
        description: pendingAttraction.description || "",
        badge: periodLabel,
        location: pendingAttraction.address || "",
        dayIndex: activeDay,
        date: activeDate || null,
      },
    ]);
    setPendingAttraction(null);
    setSearchQuery("");
    setSuggestions([]);
  };

  const handleSelectSuggestion = (attraction: Attraction) => {
    setPendingAttraction(attraction);
    const selected = periodOptions.find(
      (option) => option.value === pendingPeriod,
    );
    setPendingTime(selected?.defaultTime ?? "07:00");
  };

  const handleRemoveStage = (id: string) => {
    setCustomStages((prev) => prev.filter((stage) => stage.id !== id));
  };

  const handleSwapStage = (id: string, direction: "up" | "down") => {
    setCustomStages((prev) => {
      const next = [...prev];
      const index = next.findIndex((stage) => stage.id === id);
      if (index === -1) return next;
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= next.length) return next;
      [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
      return next;
    });
  };

  const handleStageLocationChange = (id: string, value: string) => {
    setCustomStages((prev) =>
      prev.map((stage) =>
        stage.id === id ? { ...stage, location: value } : stage,
      ),
    );
  };

  const visibleStages = customStages.filter((stage) =>
    activeDate ? stage.date === activeDate : stage.dayIndex === activeDay,
  );

  const sortedStages = [...visibleStages].sort(
    (a, b) => toMinutes(a.time) - toMinutes(b.time),
  );

  // --- HÀM LƯU ĐÃ ĐƯỢC FIX LỖI CHÍ MẠNG ---
  const handleSave = async () => {
    if (customStages.length === 0) {
      alert("Vui lòng thêm ít nhất một địa điểm vào hành trình trước khi lưu!");
      return;
    }

    setIsSaving(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        alert("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!");
        router.push("/login");
        return;
      }

      const sortedAllStages = [...customStages].sort((a, b) => {
        const aKey = a.date ?? `day-${a.dayIndex}`;
        const bKey = b.date ?? `day-${b.dayIndex}`;
        if (aKey !== bKey) return aKey.localeCompare(bKey);
        return toMinutes(a.time) - toMinutes(b.time);
      });

      const titleStr = `Chuyến đi Đà Lạt - ${activeDate || `Ngày ${activeDay}`}`;

      // BẢO MẬT & ĐỒNG BỘ: Tạo Object JSON sạch không dùng JSON.stringify bọc ngoài
      const dataPayload = {
        title: titleStr,
        day: activeDay,
        date: activeDate || null,
        stages: sortedAllStages.map((s) => ({
          time: s.time,
          title: s.title,
          description: s.description,
          badge: s.badge,
          location: s.location,
        })),
      };

      // THỰC HIỆN GHI: Đưa trực tiếp Object vào trường data của jsonb
      const { error } = await supabase.from("user_itineraries").insert([
        {
          user_id: user.id,
          title: titleStr,
          data: dataPayload, // KHÔNG dùng JSON.stringify() ở đây nữa!
        },
      ]);

      if (error) throw error;

      alert("Lưu lịch trình thành công vào hồ sơ cá nhân! 🎉");
      router.push("/profile");
    } catch (error: any) {
      console.error("Lỗi Supabase chi tiết:", error);
      alert(
        `Lỗi hệ thống: ${error.message || "Không thể tương tác với cơ sở dữ liệu."}\nChi tiết: ${error.details || "Kiểm tra RLS hoặc cấu hình bảng."}`,
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-4">
      <div className="organic-shadow rounded-3xl border border-border/70 bg-[radial-gradient(circle_at_top,_rgba(246,230,179,0.45),_transparent_60%),linear-gradient(135deg,#fffefb_0%,#f7f2e8_45%,#eef8f2_100%)] p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-600/10 px-4 py-1 text-sm font-semibold text-emerald-700">
            <CloudSun className="h-4 w-4" />
            {t.itinerary.badge}
          </span>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center gap-2 rounded-full bg-[#1a2e26] px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#254136] disabled:opacity-50 shadow-sm cursor-pointer"
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Lưu lịch trình
          </button>
        </div>
        <h1 className="mt-5 text-4xl font-semibold text-emerald-900 sm:text-5xl font-display">
          {t.itinerary.title}
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground sm:text-lg">
          {t.itinerary.description}
        </p>

        <div className="mt-8">
          <div className="w-full rounded-[2rem] border border-border/70 bg-surface p-6 shadow-lg shadow-emerald-900/5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="mt-1 text-2xl font-semibold text-emerald-950">
                  {t.itinerary.timelineSummary}
                </h2>
              </div>
              <span className="rounded-full bg-emerald-600/10 px-3 py-1 text-xs font-semibold text-emerald-800">
                {t.itinerary.timeRangeLabel}
              </span>
            </div>

            <div className="mt-8 space-y-8">
              {/* KHU VỰC THAY ĐỔI: Chọn ngày/Lộ trình */}
              <div className="flex flex-wrap items-center gap-4 bg-emerald-50/50 p-3 rounded-2xl border border-emerald-100/60 max-w-md">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-emerald-800 whitespace-nowrap">
                    Lộ trình: Ngày
                  </span>
                  <input
                    type="text"
                    value={activeDay}
                    onChange={(event) => setActiveDay(event.target.value)}
                    className="w-16 rounded-xl border border-emerald-200 bg-white px-2 py-1 text-center text-sm font-bold text-gray-800 outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="1"
                  />
                </div>
                <div className="h-5 w-px bg-emerald-200 hidden sm:block" />
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-emerald-800 whitespace-nowrap">
                    Hoặc chọn ngày:
                  </span>
                  <input
                    type="date"
                    value={activeDate}
                    onChange={(event) => setActiveDate(event.target.value)}
                    className="rounded-xl border border-emerald-200 bg-white px-2 py-1 text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Tìm kiếm địa điểm */}
              <div className="rounded-3xl border border-emerald-100 bg-white/80 p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                  Tìm kiếm địa điểm du lịch
                </p>
                <input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Nhập địa danh bạn muốn đi (ví dụ: Chợ Đà Lạt, Hồ Xuân Hương...)"
                  className="mt-3 w-full rounded-2xl border border-emerald-100 px-4 py-2.5 text-sm outline-none transition focus:border-emerald-500 bg-white"
                />

                {searchQuery.trim() && (
                  <div className="mt-3 max-h-48 space-y-2 overflow-y-auto rounded-xl border border-emerald-50 bg-white p-2 shadow-inner">
                    {isSearching ? (
                      <p className="p-2 text-sm text-muted-foreground flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />{" "}
                        Đang tra cứu dữ liệu...
                      </p>
                    ) : suggestions.length === 0 ? (
                      <p className="p-2 text-sm text-muted-foreground">
                        Không tìm thấy địa điểm nào khớp ở Đà Lạt.
                      </p>
                    ) : (
                      suggestions.map((attraction) => (
                        <button
                          key={attraction.id}
                          type="button"
                          onClick={() => handleSelectSuggestion(attraction)}
                          className="flex w-full items-center justify-between rounded-xl border border-transparent bg-gray-50/60 px-3 py-2 text-left text-sm text-emerald-900 transition hover:bg-emerald-50 hover:border-emerald-200 cursor-pointer"
                        >
                          <div className="pr-2 truncate">
                            <p className="font-bold truncate">
                              {attraction.name}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {attraction.address}
                            </p>
                          </div>
                          <span className="text-xs font-semibold text-emerald-600 bg-emerald-100/50 px-2.5 py-1 rounded-lg shrink-0">
                            Chọn địa điểm
                          </span>
                        </button>
                      ))
                    )}
                  </div>
                )}

                {pendingAttraction && (
                  <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50/20 p-4 animate-fadeIn">
                    <p className="text-sm font-bold text-amber-900">
                      📍 Điểm đang chọn: {pendingAttraction.name}
                    </p>
                    <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_auto_auto]">
                      <select
                        value={pendingPeriod}
                        onChange={(event) => {
                          const next = event.target.value;
                          setPendingPeriod(next);
                          const selected = periodOptions.find(
                            (option) => option.value === next,
                          );
                          if (selected?.defaultTime)
                            setPendingTime(selected.defaultTime);
                        }}
                        className="w-full rounded-xl border border-emerald-200 bg-white px-3 py-2 text-sm outline-none"
                      >
                        {periodOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <input
                        type="time"
                        value={pendingTime}
                        onChange={(event) => setPendingTime(event.target.value)}
                        className="w-full rounded-xl border border-emerald-200 bg-white px-3 py-2 text-sm font-medium outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleAddAttraction}
                        className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 cursor-pointer"
                      >
                        Thêm vào lộ trình
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Danh sách chặng hành trình */}
              {sortedStages.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-emerald-200 bg-white/60 p-12 text-center text-sm text-muted-foreground">
                  Hiện chưa có địa điểm nào được thêm cho ngày này. Hãy tìm kiếm
                  phía trên để lên lịch trình tâm hồn nhé!
                </div>
              ) : (
                <div className="relative border-l-2 border-emerald-100 ml-4 pl-6 space-y-6">
                  {sortedStages.map((stage, index) => {
                    const Icon =
                      stageIcons[index % stageIcons.length] ?? MapPin;
                    return (
                      <motion.article
                        key={stage.id}
                        initial={{ opacity: 0, y: 14 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-40px" }}
                        transition={{ duration: 0.3 }}
                        className="relative group"
                      >
                        {/* Fix dấu chấm tròn trục thời gian thẳng dòng chuẩn UI */}
                        <div className="absolute -left-[31px] top-1.5 z-10 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-600 text-white ring-4 ring-white shadow-md transition-transform group-hover:scale-110" />

                        <div className="rounded-3xl border border-emerald-100/70 bg-[#fffefb] p-5 shadow-sm hover:shadow-md transition-shadow">
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                              <p className="text-xs font-bold uppercase tracking-wider text-emerald-600 flex items-center gap-1">
                                <Icon className="h-3.5 w-3.5 inline" />{" "}
                                {stage.time}
                              </p>
                              <h3 className="mt-1 text-lg font-bold text-emerald-950">
                                {stage.title}
                              </h3>
                            </div>
                            <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800 border border-emerald-100/60">
                              {stage.badge}
                            </span>
                          </div>

                          {stage.description && (
                            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                              {stage.description}
                            </p>
                          )}

                          <div className="mt-3.5 flex items-center gap-2 text-xs font-medium text-emerald-900">
                            <MapPin className="h-3.5 w-3.5 text-emerald-700 shrink-0" />
                            <input
                              value={stage.location}
                              onChange={(event) =>
                                handleStageLocationChange(
                                  stage.id,
                                  event.target.value,
                                )
                              }
                              className="flex-1 rounded-xl border border-emerald-100 bg-white px-3 py-1.5 text-xs text-emerald-900 outline-none transition focus:border-emerald-500"
                            />
                          </div>

                          <div className="mt-4 flex flex-wrap gap-2 text-[11px]">
                            <button
                              type="button"
                              onClick={() => handleSwapStage(stage.id, "up")}
                              className="rounded-full border border-emerald-100 bg-white px-3 py-1 font-bold text-emerald-800 transition hover:bg-emerald-50 cursor-pointer"
                            >
                              ⬆️ Đổi lên
                            </button>
                            <button
                              type="button"
                              onClick={() => handleSwapStage(stage.id, "down")}
                              className="rounded-full border border-emerald-100 bg-white px-3 py-1 font-bold text-emerald-800 transition hover:bg-emerald-50 cursor-pointer"
                            >
                              ⬇️ Đổi xuống
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveStage(stage.id)}
                              className="rounded-full border border-red-100 bg-white px-3 py-1 font-bold text-red-600 transition hover:bg-red-50/60 cursor-pointer"
                            >
                              🗑️ Xóa
                            </button>
                          </div>
                        </div>
                      </motion.article>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
