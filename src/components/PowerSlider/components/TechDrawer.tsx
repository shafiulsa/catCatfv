/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { X, Battery, Award, Compass, Wind, Anchor, Eye } from "lucide-react";

interface TechDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  slideTitle: string;
  percentage: number;
  activeId: number;
}

export const TechDrawer: React.FC<TechDrawerProps> = ({
  isOpen,
  onClose,
  slideTitle,
  percentage,
  activeId,
}) => {
  return (
    <>
      {/* Backdrop overlay */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-md z-45 transition-opacity duration-500 pointer-events-none ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0"
        }`}
        onClick={onClose}
        id="tech-drawer-backdrop"
      />

      {/* Slideout specifications sheet drawer */}
      <div
        className={`fixed right-0 top-0 h-full w-full max-w-md bg-zinc-950/95 border-l border-white/10 z-50 p-8 shadow-2xl transition-transform duration-700 ease-out flex flex-col justify-between ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        id="tech-spec-drawer"
      >
        <div>
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-5 mb-8">
            <div>
              <span className="font-mono text-[10px] tracking-widest text-seacat-orange uppercase block mb-1">
                Specifications Sheet
              </span>
              <h3 className="font-display font-bold text-2xl tracking-tight text-white">
                {slideTitle}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/5 hover:bg-white/15 text-white/70 hover:text-white transition-all cursor-pointer focus:outline-none"
              aria-label="Close specifications panel"
              id="close-drawer-button"
            >
              <X size={20} />
            </button>
          </div>

          {/* Luxury details content */}
          <div className="space-y-6">
            <p className="text-sm font-sans text-gray-400 leading-relaxed">
              Designed by Rossinavi with a futuristic carbon catamaran chassis, SEACAT integrates intelligent energy balancing systems to offer unmatched marine autonomy.
            </p>

            {/* Performance metrics dashboard */}
            <div className="space-y-4 pt-4">
              <h4 className="font-mono text-[11px] font-bold tracking-wider text-gray-400 uppercase">
                Technical Blueprint
              </h4>

              {/* Stat Card 1 */}
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                <div className="flex items-center gap-3">
                  <Battery className="text-amber-500" size={18} />
                  <div>
                    <span className="text-xs text-gray-400 block font-mono">Battery capacity</span>
                    <span className="text-sm font-semibold text-white">1.2 MWh Li-Ion Marine</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-amber-500 block">
                    {percentage}% Active
                  </span>
                </div>
              </div>

              {/* Stat Card 2 */}
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                <div className="flex items-center gap-3">
                  <Award className="text-blue-400" size={18} />
                  <div>
                    <span className="text-xs text-gray-400 block font-mono">Top speed</span>
                    <span className="text-sm font-semibold text-white">22 Knots (Silent Mode)</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-gray-400 block font-mono">Cruising speed</span>
                  <span className="text-sm font-bold text-white">14 Knots</span>
                </div>
              </div>

              {/* Stat Card 3 */}
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                <div className="flex items-center gap-3">
                  <Compass className="text-cyan-400" size={18} />
                  <div>
                    <span className="text-xs text-gray-400 block font-mono">Solar harvesting roof</span>
                    <span className="text-sm font-semibold text-white">145 m² Advanced Monocrystalline</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-cyan-400 block">
                    35 kW Peak
                  </span>
                </div>
              </div>

              {/* Stat Card 4 */}
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                <div className="flex items-center gap-3">
                  <Anchor className="text-gray-400" size={18} />
                  <div>
                    <span className="text-xs text-gray-400 block font-mono">LOA Length Overall</span>
                    <span className="text-sm font-semibold text-white">42.75 Meters (140 ft)</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-gray-400 block font-mono">Beam width</span>
                  <span className="text-sm font-bold text-white">13.75 Meters</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-white/10 pt-6 mt-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-mono tracking-widest text-gray-400 uppercase">
                Systems fully active
              </span>
            </div>
            <div className="text-[10px] font-mono text-gray-500">
              © 2026 SEACAT BLUE EXPERIENCES
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
