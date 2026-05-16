import type { Language } from "@/components/providers/language-provider";
import type { AttractionCategory } from "@/constants/attractions";

type TranslationSet = {
  nav: {
    home: { label: string; href: string };
    map: { label: string; href: string };
    survey: { label: string; href: string };
    itinerary: { label: string; href: string };
    languageToggleLabel: string;
  };
  home: {
    heroBadge: string;
    heroTitle: string;
    heroDescription: string;
    heroPrimaryCta: string;
    heroSecondaryCta: string;
    selectedLabel: string;
    defaultFeaturedLabel: string;
    aboutTitle: string;
    aboutSectionBadge: string;
    aboutPassionTitle: string;
    aboutPassionDescription: string;
    aboutImageAlt: string;
    aboutCards: Array<{ title: string; description: string }>;
    mapTitle: string;
    mapSubtitle: string;
    mapCountLabel: string;
    mapFeaturedLabel: string;
    mapSectionLabel: string;
    mapButtonLabel: string;
    categories: Record<AttractionCategory, string>;
  };
  footer: {
    slogan: string;
    studentInfo: string;
    contactTitle: string;
    emailLabel: string;
    phoneLabel: string;
    quickLinksTitle: string;
    copyright: string;
  };
  survey: {
    badge: string;
    title: string;
    description: string;
    stepLabel: string;
    progressLabel: string;
    backLabel: string;
    nextLabel: string;
    finishLabel: string;
    selectedProfileTitle: string;
    selectedProfileDescription: string;
    notSelectedLabel: string;
    savedNote: string;
    steps: {
      companion: { title: string; subtitle: string };
      style: { title: string; subtitle: string };
      budget: { title: string; subtitle: string };
      duration: { title: string; subtitle: string };
    };
    options: {
      companion: Array<{ id: string; label: string; description: string }>;
      style: Array<{ id: string; label: string; description: string }>;
      budget: Array<{ id: string; label: string; description: string }>;
      duration: Array<{ id: string; label: string; description: string }>;
    };
  };
  itinerary: {
    badge: string;
    title: string;
    description: string;
    dayLabel: string;
    notesLabel: string;
    notesTitle: string;
    notesDescription: string;
    backLabel: string;
    timelineSummary: string;
    timeRangeLabel: string;
    highlightsLabel: string;
    dayNotes: string[];
    stages: Array<{
      time: string;
      title: string;
      description: string;
      location: string;
      badge: string;
    }>;
  };
};

const vi: TranslationSet = {
  nav: {
    home: { label: "Giới thiệu", href: "/#about" },
    map: { label: "Bản đồ", href: "/#map" },
    survey: { label: "Khảo sát", href: "/survey" },
    itinerary: { label: "Lịch trình", href: "/itinerary" },
    languageToggleLabel: "VI",
  },
  home: {
    heroBadge: "DasiLari - Nền tảng du lịch chữa lành",
    heroTitle: "DasiLari - Chữa lành tại Đà Lạt",
    heroDescription:
      "Từ hồ nước tĩnh lặng đến quán cà phê trên đồi, DasiLari giúp bạn đi chậm hơn, sâu hơn và đúng với nhịp của riêng mình.",
    heroPrimaryCta: "Mở bản đồ ngay",
    heroSecondaryCta: "Làm khảo sát cá nhân hóa",
    selectedLabel: "Danh mục đang chọn",
    defaultFeaturedLabel: "Đà Lạt",
    aboutTitle: "Giới thiệu về DasiLari",
    aboutSectionBadge: "Khối giới thiệu",
    aboutPassionTitle: "Một dự án tâm huyết dành cho hành trình an yên",
    aboutPassionDescription:
      "DasiLari được xây dựng với mong muốn biến trải nghiệm du lịch Đà Lạt thành một hành trình nhẹ nhàng và có chiều sâu. Bản đồ số, khảo sát cá nhân hóa và AI được kết hợp để mỗi lựa chọn đều gần với cảm xúc thật của bạn.",
    aboutImageAlt: "Khung cảnh Đà Lạt buổi sớm với đồi thông và màn sương mỏng",
    aboutCards: [
      {
        title: "Gợi ý đúng gu",
        description:
          "Lọc điểm đến theo phong cách, ngân sách và thời lượng chuyến đi.",
      },
      {
        title: "Thiết kế êm dịu",
        description:
          "Bố cục bo góc lớn, màu kem - xanh lá và chuyển động mượt.",
      },
      {
        title: "Sẵn sàng mở rộng",
        description:
          "Kiến trúc đã chuẩn bị cho Supabase và trợ lý AI ở bước sau.",
      },
    ],
    mapTitle: "Bản đồ tương tác",
    mapSubtitle:
      "Chạm vào từng điểm đến để xem nhanh thông tin và định hình lịch trình.",
    mapCountLabel: "địa điểm",
    mapFeaturedLabel: "Danh sách điểm đến",
    mapSectionLabel: "Khối bản đồ",
    mapButtonLabel: "Xem chi tiết",
    categories: {
      Cafe: "Cà phê",
      "Thien nhien": "Thiên nhiên",
      "Di tich": "Di tích",
      "Check-in": "Check-in",
      "Am thuc": "Ẩm thực",
    },
  },
  footer: {
    slogan: "Chữa lành từng bước chân",
    studentInfo: "Sinh viên thực hiện: Danh Nguyễn Tuấn Khanh - 2212390",
    contactTitle: "Liên hệ",
    emailLabel: "Email: hello@dasilari.vn",
    phoneLabel: "Điện thoại: +84 901 234 567",
    quickLinksTitle: "Lối tắt",
    copyright: "© 2026 DasiLari",
  },
  survey: {
    badge: "Khảo sát & Khám phá",
    title: "Khảo sát cá nhân hóa",
    description:
      "Trả lời vài câu hỏi ngắn để DasiLari hiểu nhịp đi, ngân sách và sở thích của bạn.",
    stepLabel: "Bước",
    progressLabel: "Trạng thái",
    backLabel: "Quay lại",
    nextLabel: "Tiếp theo",
    finishLabel: "Hoàn thành & xem lịch trình",
    selectedProfileTitle: "Hồ sơ đã chọn",
    selectedProfileDescription: "Bạn đang mô tả chuyến đi như sau",
    notSelectedLabel: "Chưa chọn",
    savedNote:
      "Sau khi hoàn thành, dữ liệu được lưu tạm vào localStorage và chuyển sang trang lịch trình để mô phỏng luồng Survey -> Itinerary.",
    steps: {
      companion: {
        title: "Bạn đi cùng ai?",
        subtitle:
          "Giúp hệ thống điều chỉnh tốc độ và độ linh hoạt của lịch trình.",
      },
      style: {
        title: "Bạn thích phong cách nào?",
        subtitle: "Chọn gu trải nghiệm để nhóm điểm đến chính xác hơn.",
      },
      budget: {
        title: "Ngân sách dự kiến?",
        subtitle: "Từ đó ưu tiên các lựa chọn phù hợp khả năng chi tiêu.",
      },
      duration: {
        title: "Bạn có bao nhiêu thời gian?",
        subtitle: "Số ngày quyết định mật độ điểm đến trong ngày.",
      },
    },
    options: {
      companion: [
        {
          id: "solo",
          label: "Đi một mình",
          description: "Tự do thay đổi kế hoạch theo cảm xúc.",
        },
        {
          id: "couple",
          label: "Cặp đôi",
          description: "Ưu tiên khung cảnh lãng mạn và nhịp đi thư thái.",
        },
        {
          id: "friends",
          label: "Nhóm bạn",
          description: "Nhiều hoạt động, check-in và ăn uống đa dạng.",
        },
        {
          id: "family",
          label: "Gia đình",
          description: "Tuyến đi mềm, an toàn cho nhiều độ tuổi.",
        },
      ],
      style: [
        {
          id: "healing",
          label: "Chill & Healing",
          description: "Ưu tiên cảnh đẹp, cà phê yên tĩnh và thiên nhiên.",
        },
        {
          id: "adventure",
          label: "Khám phá mạo hiểm",
          description: "Điểm cao, hoạt động ngoài trời và trải nghiệm mạnh.",
        },
        {
          id: "checkin",
          label: "Sống ảo",
          description: "Tập trung điểm đẹp, góc chụp nổi bật, dễ lên hình.",
        },
      ],
      budget: [
        {
          id: "budget-low",
          label: "Tiết kiệm",
          description: "Ưu tiên các điểm miễn phí hoặc chi phí thấp.",
        },
        {
          id: "budget-mid",
          label: "Trung bình",
          description: "Cân bằng giữa trải nghiệm và chi phí.",
        },
        {
          id: "budget-high",
          label: "Thoải mái",
          description: "Ưu tiên chất lượng trải nghiệm và dịch vụ tốt.",
        },
      ],
      duration: [
        {
          id: "1-day",
          label: "1 ngày",
          description: "Lịch trình gọn, tập trung điểm nổi bật.",
        },
        {
          id: "2-day",
          label: "2 ngày 1 đêm",
          description: "Đủ nhịp để tham quan, ăn uống và nghỉ ngơi.",
        },
        {
          id: "3-day",
          label: "3 ngày trở lên",
          description: "Tối ưu tuyến đi sâu và nhiều trải nghiệm hơn.",
        },
      ],
    },
  },
  itinerary: {
    badge: "Quản lý lịch trình",
    title: "Lịch trình 1 ngày chữa lành tại Đà Lạt",
    description:
      "Timeline dọc giúp bạn theo dõi hành trình rõ ràng theo từng khung giờ trong ngày.",
    dayLabel: "Demo lịch trình",
    notesLabel: "Ghi chú",
    notesTitle: "Giải thích giao diện",
    notesDescription:
      "Trục dọc bên trái thể hiện dòng thời gian, còn các thẻ nội dung có thể mở rộng thành CRUD ở bước sau.",
    backLabel: "Quay lại khảo sát",
    timelineSummary: "Một ngày nhẹ nhàng, đúng nhịp",
    timeRangeLabel: "04:00 - 22:00",
    highlightsLabel: "Điểm nhấn",
    dayNotes: [
      "Buổi sáng ưu tiên không khí mát và điểm đi bộ nhẹ.",
      "Buổi chiều tập trung vào không gian tĩnh và góc ngắm cảnh.",
      "Buổi tối chậm lại với ăn uống địa phương và dạo phố.",
    ],
    stages: [
      {
        time: "07:00",
        title: "Sáng - Hồ Xuân Hương và cà phê săn mây",
        description:
          "Mở đầu bằng một vòng dạo hồ nhẹ nhàng, sau đó ghé quán cà phê nhỏ để nạp năng lượng.",
        location: "Hồ Xuân Hương -> Cà phê săn mây",
        badge: "Bắt đầu ngày",
      },
      {
        time: "10:30",
        title: "Trưa - Vườn hoa và bữa trưa ấm",
        description:
          "Di chuyển thong thả tới vườn hoa thành phố, rồi dùng bữa nóng để giữ ấm cơ thể.",
        location: "Vườn hoa thành phố -> Quán ăn trung tâm",
        badge: "Ăn trưa",
      },
      {
        time: "15:00",
        title: "Chiều - Thiền viện Trúc Lâm và hồ Tuyền Lâm",
        description:
          "Tiếp tục tới không gian thanh tịnh để ngắm hồ, đi nhẹ và chụp ảnh.",
        location: "Thiền viện Trúc Lâm -> Hồ Tuyền Lâm",
        badge: "Giữa ngày",
      },
      {
        time: "19:00",
        title: "Tối - Chợ Đà Lạt và dạo phố",
        description:
          "Khép lại bằng bữa tối nhẹ, sau đó đi bộ chợ đêm để cảm nhận nhịp sống thành phố.",
        location: "Chợ Đà Lạt -> Trung tâm thành phố",
        badge: "Kết thúc ngày",
      },
    ],
  },
};

const en: TranslationSet = {
  nav: {
    home: { label: "About", href: "/#about" },
    map: { label: "Map", href: "/#map" },
    survey: { label: "Survey", href: "/survey" },
    itinerary: { label: "Itinerary", href: "/itinerary" },
    languageToggleLabel: "EN",
  },
  home: {
    heroBadge: "DasiLari - A healing travel platform",
    heroTitle: "DasiLari - Healing in Da Lat",
    heroDescription:
      "From calm lakes to hilltop cafes, DasiLari helps you travel slower, deeper, and closer to your own rhythm.",
    heroPrimaryCta: "Open the map",
    heroSecondaryCta: "Start personalized survey",
    selectedLabel: "Selected category",
    defaultFeaturedLabel: "Da Lat",
    aboutTitle: "About DasiLari",
    aboutSectionBadge: "About section",
    aboutPassionTitle: "A heartfelt project for calm journeys",
    aboutPassionDescription:
      "DasiLari is built to transform Da Lat travel into a gentle and meaningful journey. A digital map, personalized survey, and AI are combined so each choice aligns with your emotions.",
    aboutImageAlt: "Early Da Lat landscape with pine hills and soft mist",
    aboutCards: [
      {
        title: "Taste-aware suggestions",
        description: "Filter destinations by style, budget, and trip duration.",
      },
      {
        title: "Soft interface",
        description:
          "Large rounded corners, cream-green palette, smooth motion.",
      },
      {
        title: "Ready to scale",
        description:
          "Architecture prepared for Supabase and AI in later steps.",
      },
    ],
    mapTitle: "Interactive map",
    mapSubtitle: "Tap each destination to preview details and shape your plan.",
    mapCountLabel: "places",
    mapFeaturedLabel: "Destination list",
    mapSectionLabel: "Map section",
    mapButtonLabel: "View details",
    categories: {
      Cafe: "Cafe",
      "Thien nhien": "Nature",
      "Di tich": "Heritage",
      "Check-in": "Check-in",
      "Am thuc": "Food",
    },
  },
  footer: {
    slogan: "Healing through every step",
    studentInfo: "Implemented by: Danh Nguyễn Tuấn Khanh - 2212390",
    contactTitle: "Contact",
    emailLabel: "Email: hello@dasilari.vn",
    phoneLabel: "Phone: +84 901 234 567",
    quickLinksTitle: "Quick links",
    copyright: "© 2026 DasiLari",
  },
  survey: {
    badge: "Survey & Discovery",
    title: "Personalized survey",
    description:
      "Answer a few short questions so DasiLari can understand your travel rhythm, budget, and preferences.",
    stepLabel: "Step",
    progressLabel: "Status",
    backLabel: "Back",
    nextLabel: "Next",
    finishLabel: "Finish & view itinerary",
    selectedProfileTitle: "Selected profile",
    selectedProfileDescription: "Your trip is currently described as",
    notSelectedLabel: "Not selected",
    savedNote:
      "After completion, data is temporarily stored in localStorage and redirected to the itinerary page to simulate the Survey -> Itinerary flow.",
    steps: {
      companion: {
        title: "Who are you traveling with?",
        subtitle: "Helps adjust pace and schedule flexibility.",
      },
      style: {
        title: "What style do you prefer?",
        subtitle: "Choose a travel vibe to group destinations better.",
      },
      budget: {
        title: "Expected budget?",
        subtitle: "Prioritizes options that match spending capacity.",
      },
      duration: {
        title: "How much time do you have?",
        subtitle: "Trip length determines itinerary density.",
      },
    },
    options: {
      companion: [
        {
          id: "solo",
          label: "Solo",
          description: "Freely change plans based on mood.",
        },
        {
          id: "couple",
          label: "Couple",
          description: "Romantic views and a calm pace.",
        },
        {
          id: "friends",
          label: "Friends",
          description: "More activities, check-ins, and food spots.",
        },
        {
          id: "family",
          label: "Family",
          description: "Soft routes, safer for mixed ages.",
        },
      ],
      style: [
        {
          id: "healing",
          label: "Chill & Healing",
          description: "Scenery, quiet cafes, and nature.",
        },
        {
          id: "adventure",
          label: "Adventure",
          description: "Viewpoints, outdoor activities, stronger experiences.",
        },
        {
          id: "checkin",
          label: "Photo-first",
          description: "Beautiful spots and camera-ready angles.",
        },
      ],
      budget: [
        {
          id: "budget-low",
          label: "Budget",
          description: "Focus on free or low-cost places.",
        },
        {
          id: "budget-mid",
          label: "Mid-range",
          description: "Balance between value and experience.",
        },
        {
          id: "budget-high",
          label: "Comfort",
          description: "Prioritize quality experiences and services.",
        },
      ],
      duration: [
        {
          id: "1-day",
          label: "1 day",
          description: "Compact route with highlights.",
        },
        {
          id: "2-day",
          label: "2 days 1 night",
          description: "Enough pace for visits, food, and rest.",
        },
        {
          id: "3-day",
          label: "3+ days",
          description: "Deeper planning with more experiences.",
        },
      ],
    },
  },
  itinerary: {
    badge: "Itinerary management",
    title: "A one-day healing itinerary in Da Lat",
    description:
      "A vertical timeline helps you track your plan clearly across time slots.",
    dayLabel: "Itinerary demo",
    notesLabel: "Notes",
    notesTitle: "UI explanation",
    notesDescription:
      "The left vertical rail represents timeline flow, and content cards can be expanded into full CRUD in later phases.",
    backLabel: "Back to survey",
    timelineSummary: "A calm day at your own pace",
    timeRangeLabel: "04:00 - 22:00",
    highlightsLabel: "Highlights",
    dayNotes: [
      "Morning focuses on cool air and gentle walking spots.",
      "Afternoon prioritizes tranquil spaces and scenic pauses.",
      "Evening slows down with local food and a city walk.",
    ],
    stages: [
      {
        time: "07:00",
        title: "Morning - Xuan Huong Lake and cloud-hunting cafe",
        description:
          "Start with a light lakeside walk, then stop at a small cafe to recharge.",
        location: "Xuan Huong Lake -> cloud-hunting cafe",
        badge: "Start of day",
      },
      {
        time: "10:30",
        title: "Noon - Flower garden and warm lunch",
        description:
          "Move gently to the city flower garden, then enjoy a warm lunch.",
        location: "City flower garden -> central lunch spot",
        badge: "Lunch",
      },
      {
        time: "15:00",
        title: "Afternoon - Truc Lam Monastery and Tuyen Lam Lake",
        description:
          "Continue to a tranquil setting for lake views and photos.",
        location: "Truc Lam Monastery -> Tuyen Lam Lake",
        badge: "Mid-day",
      },
      {
        time: "19:00",
        title: "Evening - Da Lat Market and city stroll",
        description:
          "Close the day with a light dinner and a walk through the night market.",
        location: "Da Lat Market -> city center",
        badge: "End of day",
      },
    ],
  },
};

export const translations = { vi, en } as const;

export function getTranslation(language: Language) {
  return translations[language];
}
