'use client'

import React, { useState } from 'react'
import { CalendarRangeSplit } from '../calendar/CalendarRangeSplit';
import { WeekRange } from '@/app/types/calendar';
import { generateWeekRanges } from '@/app/utils/calendarGenerator/calendarRange';

const AdminTasks = () => {
  const start = new Date("2025-01-01");
  const end = new Date("2025-03-31");
  
  const weeks = generateWeekRanges(start, end);
  const [selectedWeek, setSelectedWeek] = useState<WeekRange | undefined>();

  return (
    <main className="p-4">
      <h1 className="text-xl font-bold mb-4 text-center">Multi-Month Calendar</h1>
      <div className="flex flex-wrap gap-2 justify-center">
        {weeks.map((week) => (
          <button
            key={week.index}
            onClick={() => setSelectedWeek(week)}
            className={`px-3 py-1 text-sm rounded-md border
              ${selectedWeek?.index === week.index ? "bg-blue-600 text-white" : "bg-white hover:bg-blue-50"}
            `}
          >
            Week {week.index}
          </button>
        ))}
      </div>
      <CalendarRangeSplit startDate={start} endDate={end} selectedWeekRange={selectedWeek} />
    </main>
  );
}

export default AdminTasks