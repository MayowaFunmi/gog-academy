import { CalendarDay, WeekRange } from "@/app/types/calendar";


export function generateCalendarRange(startDate: Date, endDate: Date): CalendarDay[][] {
  const weeks: CalendarDay[][] = [];

  const start = new Date(startDate);
  const end = new Date(endDate);

  // Normalize to start of day
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  const startMonthFirstDay = new Date(start.getFullYear(), start.getMonth(), 1);
  const endMonthLastDay = new Date(end.getFullYear(), end.getMonth() + 1, 0);

  const calendarStart = new Date(startMonthFirstDay);
  calendarStart.setDate(calendarStart.getDate() - calendarStart.getDay()); // Go to Sunday

  const calendarEnd = new Date(endMonthLastDay);
  calendarEnd.setDate(calendarEnd.getDate() + (6 - calendarEnd.getDay())); // Go to Saturday

  const days: CalendarDay[] = [];
  const today = new Date(calendarStart);

  while (today <= calendarEnd) {
    const date = new Date(today);

    days.push({
      date,
      isCurrentMonth: date.getMonth() === start.getMonth() || date.getMonth() === end.getMonth() || (date >= start && date <= end),
      inRange: date >= start && date <= end,
    });

    today.setDate(today.getDate() + 1);
  }

  // Chunk into weeks
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  return weeks;
}

export function generateWeekRanges(start: Date, end: Date): WeekRange[] {
  const weeks: WeekRange[] = [];

  const current = new Date(start);
  current.setDate(current.getDate() - current.getDay()); // start on Sunday

  let index = 1;

  while (current <= end) {
    const weekStart = new Date(current);
    const weekEnd = new Date(current);
    weekEnd.setDate(weekEnd.getDate() + 6);

    weeks.push({
      index,
      start: new Date(weekStart),
      end: new Date(weekEnd),
    });

    index++;
    current.setDate(current.getDate() + 7);
  }

  return weeks;
}
