"use client";

import { useState, useEffect } from "react";
import type { LinkedInProfile } from "@/data/mockData";

export function ProfileDisambiguation({
  profiles,
  selectedId,
  onSelect,
}: {
  profiles: LinkedInProfile[];
  selectedId: string | null;
  onSelect: (profile: LinkedInProfile) => void;
}) {
  const [visible, setVisible] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  // Quick fade-in for the cards (parent controls when component mounts)
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  // Collapse cards after selection
  useEffect(() => {
    if (!selectedId) return;
    const timer = setTimeout(() => setCollapsed(true), 800);
    return () => clearTimeout(timer);
  }, [selectedId]);

  const selectedProfile = profiles.find((p) => p.id === selectedId);

  return (
    <div className={`mt-3 transition-all duration-500 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"}`}>
      {/* Collapsed summary */}
      {collapsed && selectedProfile && (
        <button
          onClick={() => setCollapsed(false)}
          className="flex items-center gap-2 text-[12px] text-t3 transition-colors hover:text-t2"
        >
          <svg className="h-3.5 w-3.5 shrink-0 text-g" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Selected: {selectedProfile.name}, {selectedProfile.title} at {selectedProfile.company}
          <svg className="h-3 w-3 shrink-0 text-t4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
      )}

      {/* Full cards */}
      <div className="collapsible" data-open={!collapsed}>
        <div className="p-0.5">
          <div className="flex gap-2.5">
            {profiles.map((profile) => {
              const isSelected = selectedId === profile.id;
              return (
                <button
                  key={profile.id}
                  onClick={() => !selectedId && onSelect(profile)}
                  disabled={!!selectedId && !isSelected}
                  className={`group flex w-[160px] flex-col items-center rounded-xl border px-3 py-4 text-center transition-all ${
                    isSelected
                      ? "border-b2 bg-bg3 shadow-[0_0_0_2px_var(--as)]"
                      : selectedId
                        ? "border-b1 bg-bg3 opacity-40"
                        : "border-b1 bg-bg3 hover:border-b2 hover:bg-bg3h"
                  }`}
                >
                  {/* Circular photo */}
                  <div className="relative mb-2.5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={profile.avatarUrl}
                      alt={profile.name}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                    {isSelected && (
                      <div className="absolute -right-1 -bottom-1 flex h-5 w-5 items-center justify-center rounded-full bg-g">
                        <svg className="h-3 w-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Name */}
                  <div className="text-[13px] font-semibold leading-[1.3] text-t1">
                    {profile.name}
                  </div>

                  {/* Title */}
                  <div className="mt-0.5 text-[11px] leading-[1.4] text-t3">
                    {profile.title}
                  </div>
                  <div className="text-[11px] leading-[1.4] text-t3">
                    {profile.company}
                  </div>

                  {/* Mutual connections */}
                  <div className="mt-1.5 text-[10px] text-t4">
                    {profile.mutualConnections} mutual
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
