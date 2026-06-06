/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SlideData } from "./types";

export const SLIDES: SlideData[] = [
  {
    id: 1,
    label: "01",
    mode: "INFINITE SILENCE, RECHARGED",
    title: "MULTI-DAY TRIP",
    description: "On a multi-day trip, Sea Cat is able to sail 90% of the time in pure electric mode. Navigation in hybrid mode remains active just long enough to recharge the battery. The ideal solution for exploring larger archipelagos under the crescent moon.",
    percentage: 90,
    percentageLabel: "* ELECTRIC / HYBRID",
    videoUrl: "/power/to-diesel-electric-d.webm",
    accentTextColor: "text-amber-500",
    accentRingColor: "#ff5e00"
  },
  {
    id: 2,
    label: "02",
    mode: "YOUR TRIP, YOUR MODE",
    title: "ONE-DAY TRIP",
    description: "An experience in total harmony with nature. If the trip is one day, the catamaran is able to sail 100% of the time in electric mode. Silence and pristine beauty on 40 meters of premium luxury on open pristine waters.",
    percentage: 100,
    percentageLabel: "* ELECTRIC",
    videoUrl: "/power/to-hybernation-d.webm",
    accentTextColor: "text-blue-400",
    accentRingColor: "#38bdf8"
  },
  {
    id: 3,
    label: "03",
    mode: "ZERO EMISSION CRUISE",
    title: "ENERGY AUTONOMY",
    description: "Equipped with state-of-the-art solar roofs and high-density battery matrices, the power of nature is harvested continuously. Infinite autonomy, completely disconnected from the grid, with silent luxury.",
    percentage: 95,
    percentageLabel: "* SOLAR ECO BOOSTER",
    videoUrl: "power/to-diesel-electric-d.webm",
    accentTextColor: "text-cyan-400",
    accentRingColor: "#22d3ee"
  }
];
