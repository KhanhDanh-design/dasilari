"use client";

import L from "leaflet";
import { motion } from "framer-motion";
import { useEffect, useMemo } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import type { Attraction } from "@/constants/attractions";
import type { Language } from "@/components/providers/language-provider";
import { getTranslation } from "@/constants/translations";

const activeIconSvg = encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48">
  <defs>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="6" stdDeviation="4" flood-color="#14532d" flood-opacity="0.22"/>
    </filter>
  </defs>
  <g filter="url(#shadow)">
    <circle cx="24" cy="24" r="17" fill="#15803d"/>
    <circle cx="24" cy="24" r="10" fill="#fdfbf7" opacity="0.95"/>
    <circle cx="24" cy="24" r="6" fill="#15803d"/>
  </g>
</svg>
`);

const markerIcon = new L.DivIcon({
  html: `<div class="dasi-marker-wrap"><div class="dasi-marker-ring"></div><img src="data:image/svg+xml;charset=UTF-8,${activeIconSvg}" alt="marker" /></div>`,
  className: "dasi-div-icon",
  iconSize: [48, 48],
  iconAnchor: [24, 42],
  popupAnchor: [0, -40],
});

function FlyToSelected({
  selectedAttraction,
}: {
  selectedAttraction: Attraction | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (!selectedAttraction) return;
    map.flyTo(
      [selectedAttraction.lat, selectedAttraction.lng],
      Math.max(map.getZoom(), 14),
      {
        duration: 1.2,
        animate: true,
      },
    );
  }, [map, selectedAttraction]);

  return null;
}

type MapComponentProps = {
  attractions: Attraction[];
  selectedAttraction: Attraction | null;
  onSelectAttraction: (attraction: Attraction) => void;
  language: Language;
};

export default function MapComponent({
  attractions,
  selectedAttraction,
  onSelectAttraction,
  language,
}: MapComponentProps) {
  const t = getTranslation(language);
  const center = useMemo(() => [11.9458, 108.438] as [number, number], []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="h-full min-h-[520px] overflow-hidden rounded-3xl border border-border/70 bg-surface p-3 shadow-lg shadow-emerald-900/5"
    >
      <div className="h-full overflow-hidden rounded-[1.45rem]">
        <MapContainer
          center={center}
          zoom={13}
          scrollWheelZoom
          className="h-full min-h-[520px] w-full"
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />
          <FlyToSelected selectedAttraction={selectedAttraction} />

          {attractions.map((attraction) => (
            <Marker
              key={attraction.id}
              position={[attraction.lat, attraction.lng]}
              icon={markerIcon}
              eventHandlers={{
                click: () => onSelectAttraction(attraction),
              }}
            >
              <Popup className="dasi-popup" closeButton={false} autoPan>
                <div className="w-64 space-y-3 rounded-2xl bg-[#FDFBF7] p-1 text-emerald-900">
                  <div className="overflow-hidden rounded-2xl">
                    <img
                      src={attraction.image}
                      alt={attraction.name}
                      className="h-32 w-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                      {t.home.categories[attraction.category]}
                    </p>
                    <h3 className="mt-1 text-lg font-semibold">
                      {attraction.name}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-emerald-800/80">
                      {attraction.description}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onSelectAttraction(attraction)}
                    className="inline-flex w-full items-center justify-center rounded-full bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:bg-emerald-700"
                  >
                    {t.home.mapButtonLabel}
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </motion.div>
  );
}
