import { CalendarDay } from "@/app/types/calendar";

export const generateSingleCalendar = (
  month: number,
  year: number
): CalendarDay[][] => {
  const weeks: CalendarDay[][] = [];

  // Get first day of the month
  const firstDayOfMonth = new Date(year, month, 1);
  const startDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sunday, 1 = Monday, etc.

  //get total days in month
  const daysInMonth = new Date(year, month + 1, 0).getDate(); // Last day of the month

  // calculate previous month's last few days to show in calendar
  const prevMonth = month === 0 ? 11 : month - 1; // Handle December wrap-around
  const prevYear = month === 0 ? year - 1 : year;
  const daysInPrevMonth = new Date(prevYear, prevMonth + 1, 0).getDate();

  const calendarDays: CalendarDay[] = [];

  // fill in days from previous month
  for (let i = startDayOfWeek; i > 0; i--) {
    calendarDays.push({
      date: new Date(prevYear, prevMonth, daysInPrevMonth - i + 1),
      isCurrentMonth: false,
    });
  }

  // fill in days from current month
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push({
      date: new Date(year, month, i),
      isCurrentMonth: true,
    });
  }

  // fill in days from next month
  const remainingCells = 7 - (calendarDays.length % 7);
  if (remainingCells < 7) {
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextYear = month === 11 ? year + 1 : year;
    for (let i = 1; i <= remainingCells; i++) {
      calendarDays.push({
        date: new Date(nextYear, nextMonth, i),
        isCurrentMonth: false,
      });
    }
  }

  // chunk calendarDays into weeks
  for (let i = 0; i < calendarDays.length; i += 7) {
    weeks.push(calendarDays.slice(i, i + 7));
  }

  return weeks;
};
