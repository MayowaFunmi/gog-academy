import React from "react";
import { format } from "date-fns";
import { generateCalendarRange } from "@/app/utils/calendarGenerator/calendarRange";
import { CalendarDay } from "@/app/types/calendar";

interface CalendarRangeProps {
  startDate: Date;
  endDate: Date;
}

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const CalendarRange: React.FC<CalendarRangeProps> = ({ startDate, endDate }) => {
  const weeks = generateCalendarRange(startDate, endDate);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="grid grid-cols-7 text-center font-semibold mb-2">
        {dayNames.map((day) => (
          <div key={day} className="text-sm text-gray-600">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {weeks.flat().map((day: CalendarDay, i: number) => {
          const isToday = format(day.date, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");

          return (
            <div
              key={i}
              className={`aspect-square p-1 flex items-center justify-center text-sm rounded-md
                ${day.inRange ? "bg-white text-black" : "bg-gray-100 text-gray-400"}
                ${!day.isCurrentMonth ? "opacity-50" : ""}
                ${isToday ? "border border-blue-500" : ""}
              `}
            >
              {day.date.getDate()}
            </div>
          );
        })}
      </div>
    </div>
  );
};
