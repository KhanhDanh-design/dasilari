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
  latitude: number;
  longitude: number;
  description: string;
  image_url: string;
  address: string;
};

export async function getAttractions() {
  return [] as Attraction[];
}
