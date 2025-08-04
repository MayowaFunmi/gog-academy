import { CalendarDay, CalendarMonth } from "@/app/types/calendar";

export function generateMonthlyCalendars(startDate: Date, endDate: Date): CalendarMonth[] {
  const months: CalendarMonth[] = [];

  const current = new Date(startDate.getFullYear(), startDate.getMonth(), 1);

  while (current <= endDate) {
    const year = current.getFullYear();
    const month = current.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    // Determine start of calendar (Sunday of the week containing first day)
    const calendarStart = new Date(firstDay);
    calendarStart.setDate(firstDay.getDate() - firstDay.getDay());

    // Determine end of calendar (Saturday of the week containing last day)
    const calendarEnd = new Date(lastDay);
    calendarEnd.setDate(lastDay.getDate() + (6 - lastDay.getDay()));

    const weeks: CalendarDay[][] = [];
    const days: CalendarDay[] = [];

    const cursor = new Date(calendarStart);
    while (cursor <= calendarEnd) {
      const date = new Date(cursor);
      days.push({
        date,
        isCurrentMonth: date.getMonth() === month,
        inRange: date >= startDate && date <= endDate,
      });
      cursor.setDate(cursor.getDate() + 1);
    }

    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }

    months.push({ month, year, weeks });

    current.setMonth(current.getMonth() + 1);
  }

  return months;
}
