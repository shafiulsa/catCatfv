/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface SlideData {
  id: number;
  label: string;
  mode: string;
  title: string;
  description: string;
  percentage: number;
  percentageLabel: string;
  videoUrl: string;
  accentTextColor: string; // Tailwind class
  accentRingColor: string; // Hex color or Tailwind class
}
