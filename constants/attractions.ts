export type AttractionCategory =
  | "Cafe"
  | "Thien nhien"
  | "Di tich"
  | "Check-in"
  | "Am thuc";

export type Attraction = {
  id: string;
  name: string;
  category: AttractionCategory;
  lat: number;
  lng: number;
  description: string;
  image: string;
  address: string;
};

const attractions: Attraction[] = [
  {
    id: "ho-xuan-huong",
    name: "Hồ Xuân Hương",
    category: "Thien nhien",
    lat: 11.9496,
    lng: 108.4383,
    description:
      "Mặt nước trung tâm của Đà Lạt, lý tưởng để tản bộ và ngắm hoàng hôn.",
    image:
      "https://images.unsplash.com/photo-1521487782567-5a5c3c7d7b2c?auto=format&fit=crop&w=900&q=80",
    address: "Phường 1, Đà Lạt, Lâm Đồng",
  },
  {
    id: "cho-da-lat",
    name: "Chợ Đà Lạt",
    category: "Am thuc",
    lat: 11.9416,
    lng: 108.4386,
    description:
      "Nơi tập trung đặc sản, hoa, quà và những trải nghiệm du lịch ban đêm.",
    image:
      "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=900&q=80",
    address: "Phường 1, Đà Lạt, Lâm Đồng",
  },
  {
    id: "thung-lung-tinh-yeu",
    name: "Thung Lũng Tình Yêu",
    category: "Thien nhien",
    lat: 11.9322,
    lng: 108.4447,
    description:
      "Khu sinh thái lãng mạn, phù hợp cho cặp đôi và nhóm bạn thích cảnh đẹp.",
    image:
      "https://images.unsplash.com/photo-1519885277449-12eee5564d68?auto=format&fit=crop&w=900&q=80",
    address: "Mai Anh Đào, Đà Lạt, Lâm Đồng",
  },
  {
    id: "quan-cafe-san-may",
    name: "Quán Cà phê Săn Mây",
    category: "Cafe",
    lat: 12.0203,
    lng: 108.4774,
    description:
      "Nhóm cà phê trên đồi cao, nơi lý tưởng để đón bình minh và biển mây.",
    image:
      "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=900&q=80",
    address: "Vùng ngoại ô Đà Lạt, Lâm Đồng",
  },
  {
    id: "nha-tho-con-ga",
    name: "Nhà thờ Con Gà",
    category: "Di tich",
    lat: 11.9443,
    lng: 108.4414,
    description: "Công trình kiến trúc Pháp nổi bật, gần trung tâm thành phố.",
    image:
      "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=900&q=80",
    address: "01 Trần Phú, Đà Lạt, Lâm Đồng",
  },
  {
    id: "lang-biang",
    name: "Lang Biang",
    category: "Thien nhien",
    lat: 12.0185,
    lng: 108.4438,
    description:
      "Điểm leo núi nổi tiếng với tầm nhìn bao quát cao nguyên Lâm Viên.",
    image:
      "https://images.unsplash.com/photo-1470770903676-69b98201ea1c?auto=format&fit=crop&w=900&q=80",
    address: "Huyện Lạc Dương, Lâm Đồng",
  },
  {
    id: "crazy-house",
    name: "Crazy House",
    category: "Check-in",
    lat: 11.9412,
    lng: 108.4389,
    description:
      "Kiến trúc kỳ lạ và màu sắc, một trong những điểm check-in độc đáo nhất.",
    image:
      "https://images.unsplash.com/photo-1509644851161-2acc08aa25b1?auto=format&fit=crop&w=900&q=80",
    address: "03 Huỳnh Thúc Kháng, Đà Lạt, Lâm Đồng",
  },
  {
    id: "vuon-hoa-thanh-pho",
    name: "Vườn Hoa Thành Phố",
    category: "Thien nhien",
    lat: 11.9434,
    lng: 108.4389,
    description:
      "Không gian hoa rực rỡ, được yêu thích bởi những ai muốn đi dạo nhẹ nhàng.",
    image:
      "https://images.unsplash.com/photo-1468327768560-75b778cbb551?auto=format&fit=crop&w=900&q=80",
    address: "Đường Trần Quốc Toản, Đà Lạt, Lâm Đồng",
  },
  {
    id: "thien-vien-truc-lam",
    name: "Thiền viện Trúc Lâm",
    category: "Di tich",
    lat: 11.9009,
    lng: 108.4347,
    description:
      "Không gian thanh tịnh bên hồ Tuyền Lâm, phù hợp cho phong cách healing.",
    image:
      "https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=900&q=80",
    address: "Phường 3, Đà Lạt, Lâm Đồng",
  },
  {
    id: "thac-datanla",
    name: "Thác Datanla",
    category: "Thien nhien",
    lat: 11.9255,
    lng: 108.4578,
    description:
      "Điểm đến phù hợp cho người thích vận động và trải nghiệm ngoài trời.",
    image:
      "https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=900&q=80",
    address: "QL20, Phường 3, Đà Lạt, Lâm Đồng",
  },
];

export async function getAttractions() {
  return attractions;
}
