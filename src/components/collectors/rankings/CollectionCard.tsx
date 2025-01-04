// src/components/collectors/rankings/CollectionCard.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
// Import the icons we need
import { TbChartBar, TbCalendarEvent, TbTrophy } from "react-icons/tb";
import { EventsList } from "./EventsList";
import { TopCollectors } from "./TopCollectors";
import { StatsCard } from "./StatsCard";
import type { CollectionGroup } from "@/types/rankings";

interface CollectionCardProps {
  collection: CollectionGroup;
  initialExpanded?: boolean;
}

function transformEventForDisplay(event: CollectionGroup["events"][0]) {
  return {
    name: event.name,
    month: event.month,
    year: event.year,
    participantCount: event.poaps.length,
  };
}

export function CollectionCard({
  collection,
  initialExpanded = false,
}: CollectionCardProps) {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);

  const contentAnimationVariants = {
    collapsed: {
      height: 0,
      opacity: 0,
      transition: { duration: 0.3, ease: "easeInOut" },
    },
    expanded: {
      height: "auto",
      opacity: 1,
      transition: { duration: 0.3, ease: "easeOut" },
    },
  };

  // Updated stats cards data to match StatsCard props
  const statsCards = [
    {
      title: "Total POAPs",
      value: collection.stats.totalPoaps,
      icon: TbTrophy,
      color: "blue" as const,
    },
    {
      title: "Unique Events",
      value: collection.stats.uniqueEvents,
      icon: TbCalendarEvent,
      color: "purple" as const,
    },
    {
      title: "Peak Month",
      value: collection.stats.mostActiveMonth,
      icon: TbChartBar,
      color: "green" as const,
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Collection Header - Always visible */}
      <button
        onClick={() => setIsExpanded((prev) => !prev)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
        aria-expanded={isExpanded}
      >
        {/* ... rest of the header code remains the same ... */}
      </button>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            variants={contentAnimationVariants}
            initial="collapsed"
            animate="expanded"
            exit="collapsed"
          >
            {/* Collection Stats Grid */}
            <div className="px-6 py-4 border-t border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {statsCards.map((stat, index) => (
                  <StatsCard
                    key={index}
                    title={stat.title}
                    value={stat.value}
                    icon={stat.icon}
                    color={stat.color}
                    animationDelay={index * 0.1}
                  />
                ))}
              </div>
            </div>

            {/* Events and Top Collectors Grid */}
            <div className="px-6 py-4 border-t border-gray-100">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <EventsList
                    events={collection.events.map((event) => ({
                      name: event.name,
                      month: event.month,
                      year: event.year,
                      participantCount: event.poaps.length,
                    }))}
                  />
                </div>
                <div>
                  <TopCollectors
                    collectors={collection.stats.topCollectors}
                    title={`Top ${collection.name} Collectors`}
                    subtitle="Most active participants in this collection"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

CollectionCard.displayName = "CollectionCard";
