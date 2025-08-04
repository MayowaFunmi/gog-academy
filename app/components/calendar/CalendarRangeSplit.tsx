import React from "react";
import { format } from "date-fns";
import { generateMonthlyCalendars } from "@/app/utils/calendarGenerator/monthlyCalendar";
import { CalendarDay } from "@/app/types/calendar";

interface CalendarRangeSplitProps {
  startDate: Date;
  endDate: Date;
  selectedWeekRange?: { start: Date; end: Date };
}

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const CalendarRangeSplit: React.FC<CalendarRangeSplitProps> = ({
  startDate,
  endDate,
  selectedWeekRange,
}) => {
  const months = generateMonthlyCalendars(startDate, endDate);

  // Determine max number of weeks across all months
  const maxWeeks = Math.max(...months.map((month) => month.weeks.length));

  return (
    <div className="flex flex-col md:flex-row gap-6 md:gap-4 justify-center items-start flex-wrap">
      {months.map((monthData, idx) => {
        const paddedWeeks = [...monthData.weeks];

        // Pad with empty weeks to equalize height
        while (paddedWeeks.length < maxWeeks) {
          const emptyWeek: CalendarDay[] = Array(7).fill({
            date: new Date(),
            isCurrentMonth: false,
            inRange: false,
            isPlaceholder: true, // mark as fake
          });
          paddedWeeks.push(emptyWeek);
        }

        return (
          <div
            key={idx}
            className="w-full md:w-60 bg-white rounded-lg shadow-sm border p-2"
          >
            <h2 className="text-sm font-semibold text-center mb-1">
              {format(
                new Date(monthData.year, monthData.month, 1),
                "MMMM yyyy"
              )}
            </h2>

            <div className="grid grid-cols-7 text-center text-xs font-medium text-gray-500 mb-1">
              {dayNames.map((day) => (
                <div key={day} className="py-1">
                  {day}
                </div>
              ))}
            </div>

            <div
              className={`grid grid-cols-7 gap-[2px] text-[11px]`}
              style={{
                // Fixed grid height: maxWeeks * 2rem (32px)
                minHeight: `${maxWeeks * 2.25}rem`,
              }}
            >
              {paddedWeeks.flat().map((day: CalendarDay, i: number) => {
                const isToday =
                  format(day.date, "yyyy-MM-dd") ===
                  format(new Date(), "yyyy-MM-dd");
                const normalize = (d: Date) =>
                  new Date(d.getFullYear(), d.getMonth(), d.getDate());

                const isInSelectedWeek =
                  selectedWeekRange &&
                  normalize(day.date) >= normalize(selectedWeekRange.start) &&
                  normalize(day.date) <= normalize(selectedWeekRange.end);

                return (
                  <div
                    key={i}
                    className={`h-8 w-8 flex items-center justify-center rounded-sm text-sm
                      ${
                        day.isPlaceholder
                          ? "invisible"
                          : isInSelectedWeek
                          ? "bg-blue-500 text-white"
                          : day.inRange
                          ? "bg-white text-black"
                          : "bg-gray-100 text-gray-400"
                      }
                      ${!day.isCurrentMonth ? "opacity-50" : ""}
                      ${isToday ? "border border-blue-500" : ""}
                    `}
                  >
                    {!day.isPlaceholder && day.date.getDate()}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};
