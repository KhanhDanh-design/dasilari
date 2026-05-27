"use client";

import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import { createClient } from "@/utils/supabase/client";
import {
  Trash2,
  Plus,
  MapPin,
  Globe,
  Loader2,
  Image as ImageIcon,
  Users,
  Compass,
  Wallet,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";

// Các tùy chọn đồng bộ 100% với form Khảo sát bước 4/4
const PARTNER_OPTIONS = ["Đi một mình", "Cặp đôi", "Gia đình", "Nhóm bạn"];
const STYLE_OPTIONS = ["Chill & Healing", "Khám phá", "Năng động", "Tâm linh"];
const BUDGET_OPTIONS = ["Tiết kiệm", "Thoải mái", "Cao cấp"];

export default function AdminClientPage() {
  const [attractions, setAttractions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    null,
  );
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "Cà phê check-in",
    address: "",
    image_url:
      "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=900&q=80",
    suitable_for: [] as string[], // Lưu mảng đối tượng đi cùng
    travel_styles: [] as string[], // Lưu mảng phong cách du lịch
    budget_level: "Thoải mái", // Lưu mức ngân sách mặc định
  });

  const supabase = createClient();

  const normalizeCoords = (lat: number, lng: number) => {
    if (Math.abs(lat) > 90 && Math.abs(lng) <= 90) {
      return { lat: lng, lng: lat };
    }
    if (Math.abs(lng) > 180 && Math.abs(lat) <= 180) {
      return { lat: lng, lng: lat };
    }
    return { lat, lng };
  };

  useEffect(() => {
    fetchAttractions();
  }, []);

  async function fetchAttractions() {
    const { data } = await supabase
      .from("attractions")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setAttractions(data);
    setLoading(false);
  }

  const MapClickHandler = () => {
    useMapEvents({
      click: (event) => {
        setCoords({ lat: event.latlng.lat, lng: event.latlng.lng });
      },
    });
    return null;
  };

  const MapResizeTrigger = () => {
    const map = useMap();

    useEffect(() => {
      const timer = setTimeout(() => {
        map.invalidateSize();
      }, 200);
      return () => clearTimeout(timer);
    }, [map]);

    return null;
  };

  // Xử lý khi click chọn/bỏ chọn checkbox mảng
  const handleCheckboxChange = (
    field: "suitable_for" | "travel_styles",
    value: string,
  ) => {
    setFormData((prev) => {
      const currentValues = prev[field];
      const nextValues = currentValues.includes(value)
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value];
      return { ...prev, [field]: nextValues };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    if (!coords) {
      alert("Vui lòng chọn vị trí trên bản đồ trước khi lưu!");
      setSubmitting(false);
      return;
    }

    const normalized = normalizeCoords(Number(coords.lat), Number(coords.lng));
    const fullPayload = {
      ...formData,
      lat: normalized.lat,
      lng: normalized.lng,
      latitude: normalized.lat,
      longitude: normalized.lng,
    };

    let { error } = await supabase.from("attractions").insert(fullPayload);

    if (error && error.message?.toLowerCase().includes("schema")) {
      await fetchAttractions();
      ({ error } = await supabase.from("attractions").insert(fullPayload));
    }

    if (error) {
      alert("Lỗi khi thêm địa điểm: " + error.message);
    } else {
      alert("Đã thêm địa điểm khảo sát thành công!");
      setFormData({
        name: "",
        description: "",
        category: "Cà phê check-in",
        address: "",
        image_url:
          "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=900&q=80",
        suitable_for: [],
        travel_styles: [],
        budget_level: "Thoải mái",
      });
      setCoords(null);
      fetchAttractions();
    }
    setSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Xóa địa điểm này?")) return;
    await supabase.from("attractions").delete().eq("id", id);
    fetchAttractions();
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-emerald-950 font-display">
          Quản trị Hệ thống
        </h1>
        <p className="text-muted-foreground">
          Quản lý danh sách địa điểm, đồng bộ dữ liệu khảo sát cá nhân hóa
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.2fr_1.3fr]">
        {/* Form Section */}
        <section className="bg-white p-6 sm:p-8 rounded-3xl border border-emerald-100 shadow-sm h-fit sticky top-24 max-h-[85vh] overflow-y-auto">
          <h2 className="text-2xl font-bold text-emerald-900 mb-6 flex items-center gap-2">
            <Plus className="h-6 w-6" /> Thêm địa điểm mới
          </h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-emerald-800 mb-1">
                Tên địa điểm
              </label>
              <input
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-2xl border border-emerald-100 focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-sm"
                placeholder="Ví dụ: Tiệm Cà Phê Túi Mơ To"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-emerald-800 mb-1">
                Mô tả ngắn
              </label>
              <textarea
                required
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-2xl border border-emerald-100 focus:ring-2 focus:ring-emerald-500 outline-none transition-all h-20 text-sm"
                placeholder="Mô tả trải nghiệm chữa lành tại đây..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-emerald-800 mb-1">
                  Thể loại bản đồ
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-2xl border border-emerald-100 focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-sm bg-white"
                >
                  <option>Cà phê check-in</option>
                  <option>Cà phê đêm</option>
                  <option>Chữa lành</option>
                  <option>Địa điểm Tự nhiên</option>
                  <option>Cắm trại (Camping) / Glamping</option>
                  <option>Nông trại / Vườn hoa</option>
                  <option>Ăn sáng</option>
                  <option>Ăn trưa</option>
                  <option>Ăn tối</option>
                  <option>Quán nướng</option>
                  <option>Quán lẩu</option>
                  <option>Di tích Lịch sử / Kiến trúc</option>
                  <option>Chùa</option>
                  <option>Nhà thờ</option>
                  <option>Chợ</option>
                  <option>Siêu thị</option>
                  <option>Vui chơi / Giải trí</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-emerald-800 mb-1 flex items-center gap-1">
                  <Wallet className="h-4 w-4 text-emerald-600" /> Mức ngân sách
                </label>
                <select
                  value={formData.budget_level}
                  onChange={(e) =>
                    setFormData({ ...formData, budget_level: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-2xl border border-emerald-100 focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-sm bg-white font-medium text-gray-700"
                >
                  {BUDGET_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Cột Khảo sát 1: Đối tượng đi cùng (suitable_for) */}
            <div className="bg-emerald-50/40 p-4 rounded-2xl border border-emerald-100/70">
              <label className="text-sm font-bold text-emerald-900 mb-2 flex items-center gap-1.5">
                <Users className="h-4 w-4 text-emerald-700" /> Đối tượng đi cùng
                tương thích:
              </label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {PARTNER_OPTIONS.map((option) => {
                  const isChecked = formData.suitable_for.includes(option);
                  return (
                    <label
                      key={option}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium cursor-pointer transition-all ${
                        isChecked
                          ? "bg-emerald-600 border-transparent text-white shadow-sm"
                          : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() =>
                          handleCheckboxChange("suitable_for", option)
                        }
                        className="hidden"
                      />
                      {option}
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Cột Khảo sát 2: Phong cách du lịch (travel_styles) */}
            <div className="bg-emerald-50/40 p-4 rounded-2xl border border-emerald-100/70">
              <label className="text-sm font-bold text-emerald-900 mb-2 flex items-center gap-1.5">
                <Compass className="h-4 w-4 text-emerald-700" /> Phong cách
                chuyến đi:
              </label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {STYLE_OPTIONS.map((option) => {
                  const isChecked = formData.travel_styles.includes(option);
                  return (
                    <label
                      key={option}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium cursor-pointer transition-all ${
                        isChecked
                          ? "bg-emerald-600 border-transparent text-white shadow-sm"
                          : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() =>
                          handleCheckboxChange("travel_styles", option)
                        }
                        className="hidden"
                      />
                      {option}
                    </label>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-emerald-800 mb-1">
                Địa chỉ chi tiết tại Đà Lạt
              </label>
              <input
                required
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-2xl border border-emerald-100 focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-sm"
                placeholder="Số bao nhiêu, đường Trần Quốc Toản, Đà Lạt"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-emerald-800 mb-1">
                Đường dẫn ảnh đại diện (Unsplash URL)
              </label>
              <input
                required
                value={formData.image_url}
                onChange={(e) =>
                  setFormData({ ...formData, image_url: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-2xl border border-emerald-100 focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-sm font-mono text-xs"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-emerald-800 mb-1">
                Định vị tọa độ thực trên bản đồ
              </label>
              <div
                className="overflow-hidden rounded-2xl border border-emerald-100 shadow-inner"
                style={{ height: "240px", width: "100%", position: "relative" }}
              >
                <MapContainer
                  center={[11.9458, 108.438]}
                  zoom={12}
                  scrollWheelZoom
                  className="h-full w-full"
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <MapClickHandler />
                  <MapResizeTrigger />
                  {coords ? (
                    <Marker position={[coords.lat, coords.lng]} />
                  ) : null}
                </MapContainer>
              </div>
              <div className="mt-2 flex justify-between text-xs text-muted-foreground font-medium">
                <span>
                  * Click trực tiếp vào bản đồ để ghim điểm kinh/vĩ độ
                </span>
                <span className="text-emerald-700">
                  {coords
                    ? `Tọa độ: ${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}`
                    : "Chưa chọn tọa độ"}
                </span>
              </div>
            </div>

            <button
              disabled={submitting}
              className="w-full py-3.5 bg-emerald-800 text-white font-bold rounded-2xl hover:bg-emerald-900 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-md shadow-emerald-900/10 text-sm"
            >
              {submitting ? (
                <Loader2 className="animate-spin h-5 w-5" />
              ) : (
                <Globe className="h-4 w-4" />
              )}
              Lưu &amp; Đồng bộ dữ liệu Map
            </button>
          </form>
        </section>

        {/* List Section */}
        <section className="space-y-4 max-h-[85vh] overflow-y-auto pr-1">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold text-emerald-900">
              Danh sách hiện có
            </h2>
            <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold">
              {attractions.length} địa điểm
            </span>
          </div>

          <div className="grid gap-4">
            <AnimatePresence>
              {attractions.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex items-start gap-4 p-4 rounded-3xl bg-white border border-emerald-50 shadow-sm hover:shadow-md transition-all group"
                >
                  <img
                    src={item.image_url}
                    className="w-20 h-20 rounded-2xl object-cover shrink-0 mt-0.5"
                    alt=""
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-emerald-950 text-base truncate">
                      {item.name}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                      📍 {item.address}
                    </p>

                    {/* Hiển thị các Badge phân loại khảo sát của địa điểm */}
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-bold">
                        {item.category}
                      </span>
                      <span className="text-[10px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full font-semibold">
                        💰 {item.budget_level || "Thoải mái"}
                      </span>
                      {item.suitable_for?.map((p: string) => (
                        <span
                          key={p}
                          className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full"
                        >
                          {p}
                        </span>
                      ))}
                      {item.travel_styles?.map((s: string) => (
                        <span
                          key={s}
                          className="text-[10px] bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2.5 rounded-xl text-gray-300 hover:text-red-600 hover:bg-red-50 transition-all opacity-100 lg:opacity-0 lg:group-hover:opacity-100 shrink-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </section>
      </div>
    </div>
  );
}
