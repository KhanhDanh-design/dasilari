"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trash2,
  Calendar,
  MapPin,
  ChevronRight,
  LogOut,
  Clock,
  Bookmark,
} from "lucide-react";
import { useRouter } from "next/navigation";

type ItineraryStage = {
  time?: string;
  title?: string;
  description?: string;
  badge?: string;
  location?: string;
};

type ItineraryData = {
  title?: string;
  description?: string;
  badge?: string;
  stages?: ItineraryStage[];
};

type SavedItinerary = {
  id: string;
  user_id: string;
  created_at: string;
  data: ItineraryData;
};

export default function ProfilePage() {
  const [itineraries, setItineraries] = useState<SavedItinerary[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }
      setUser(user);

      // BẢO MẬT: Thêm .eq("user_id", user.id) để chỉ lấy lịch trình của CHÍNH HỌ
      const { data, error } = await supabase
        .from("user_itineraries")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Lỗi lấy lịch trình:", error.message);
      }

      if (data) setItineraries(data);
      setLoading(false);
    }
    fetchData();
  }, [supabase, router]);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    // Chặn hành vi click lan ra ngoài làm đóng/mở Card ngớ ngẩn
    e.stopPropagation();

    if (!confirm("Bạn có chắc chắn muốn xóa lịch trình chữa lành này?")) return;

    const { error } = await supabase
      .from("user_itineraries")
      .delete()
      .eq("id", id);

    if (error) {
      alert("Lỗi khi xóa lịch trình: " + error.message);
    } else {
      setItineraries(itineraries.filter((item) => item.id !== id));
      if (expandedId === id) setExpandedId(null);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    const redirectUrl =
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000/login"
        : "/login";
    window.location.href = redirectUrl;
  };

  const toggleExpand = (id: string) => {
    setExpandedId((current) => (current === id ? null : id));
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
        <p className="text-sm font-medium text-emerald-800">
          Đang tải hồ sơ của bạn...
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Header Profile */}
      <div className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-emerald-50/50 p-6 rounded-3xl border border-emerald-100/60">
        <div>
          <h1 className="text-3xl font-bold text-emerald-950 font-display">
            Hồ sơ cá nhân
          </h1>
          <p className="text-emerald-800 font-medium text-sm mt-1">
            📧 {user?.email}
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl border border-red-200 text-red-600 hover:bg-red-50 font-semibold text-sm transition-colors shadow-sm bg-white"
        >
          <LogOut className="h-4 w-4" />
          Đăng xuất tài khoản
        </button>
      </div>

      {/* List Itineraries */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Bookmark className="h-5 w-5 text-emerald-700" />
          <h2 className="text-2xl font-bold text-emerald-900">
            Lịch trình tâm hồn đã lưu
          </h2>
        </div>

        {itineraries.length === 0 ? (
          <div className="p-16 text-center rounded-3xl border-2 border-dashed border-emerald-100 bg-emerald-50/10">
            <Calendar className="mx-auto h-12 w-12 text-emerald-200 mb-4" />
            <p className="text-emerald-900 font-medium">
              Bạn chưa thực hiện khảo sát và lưu lịch trình nào.
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Hãy ra trang chủ làm khảo sát ngay để nhận gợi ý cá nhân hóa!
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            <AnimatePresence mode="popLayout">
              {itineraries.map((itinerary) => {
                const isExpanded = expandedId === itinerary.id;
                const stages = Array.isArray(itinerary.data?.stages)
                  ? itinerary.data.stages
                  : [];

                return (
                  <motion.div
                    key={itinerary.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => toggleExpand(itinerary.id)}
                    className="group relative rounded-3xl bg-white border border-emerald-100 shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden"
                  >
                    {/* Card Header Info */}
                    <div className="flex items-center justify-between p-6">
                      <div className="flex-1 min-w-0 pr-4">
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider">
                            ✨ {itinerary.data?.badge || "Lịch trình"}
                          </span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(itinerary.created_at).toLocaleDateString(
                              "vi-VN",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              },
                            )}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-emerald-950 mb-1 truncate">
                          {itinerary.data?.title || "Lịch trình du lịch Đà Lạt"}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {itinerary.data?.description ||
                            "Không có mô tả đi kèm."}
                        </p>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <ChevronRight
                          className={`h-5 w-5 text-emerald-700 transition-transform duration-300 ${
                            isExpanded ? "rotate-90" : ""
                          }`}
                        />
                        <button
                          onClick={(e) => handleDelete(itinerary.id, e)}
                          className="p-2.5 rounded-xl text-gray-300 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Xóa lịch trình"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* Card Details (Stages) */}
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        className="border-t border-emerald-100 bg-gray-50/50 px-6 pb-6 pt-4"
                      >
                        {stages.length === 0 ? (
                          <p className="text-sm text-muted-foreground italic">
                            Lịch trình này hiện chưa có danh sách địa điểm chi
                            tiết.
                          </p>
                        ) : (
                          <div className="relative border-l-2 border-emerald-100 ml-2 pl-4 space-y-5">
                            {stages.map((stage, index) => (
                              <div
                                key={`${stage.time ?? "stage"}-${index}`}
                                className="relative group/item"
                              >
                                {/* Dấu tròn Timeline định vị xinh xắn */}
                                <div className="absolute -left-[23px] top-1 h-2.5 w-2.5 rounded-full bg-emerald-600 ring-4 ring-white transition-transform group-hover/item:scale-125" />

                                <div className="rounded-2xl border border-emerald-50 bg-white p-4 shadow-sm hover:border-emerald-200 transition-all">
                                  <div className="flex flex-wrap items-center justify-between gap-2">
                                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                                      ⏱️ {stage.time ?? "Tự do"}
                                    </span>
                                    {stage.badge && (
                                      <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-800 border border-amber-100">
                                        {stage.badge}
                                      </span>
                                    )}
                                  </div>
                                  <h4 className="mt-2 text-base font-bold text-emerald-950">
                                    {stage.title ?? "Địa điểm trải nghiệm"}
                                  </h4>
                                  {stage.description && (
                                    <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                                      {stage.description}
                                    </p>
                                  )}
                                  {stage.location && (
                                    <div className="mt-2.5 flex items-center gap-1.5 text-xs text-emerald-900 font-medium">
                                      <MapPin className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                                      <span className="truncate">
                                        {stage.location}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
