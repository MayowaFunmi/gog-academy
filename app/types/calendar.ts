export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  inRange?: boolean;
  isPlaceholder?: boolean;
}

export interface CalendarMonth {
  month: number;
  year: number;
  weeks: CalendarDay[][];
}

export interface WeekRange {
  index: number; // week number
  start: Date;
  end: Date;
}