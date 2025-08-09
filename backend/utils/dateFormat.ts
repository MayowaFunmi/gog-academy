export function setEndOfDay(date: Date): Date {
  const newDate = new Date(date);
  newDate.setHours(23, 59, 59, 0); // 11:59:59 PM, 0 ms
  return newDate;
}
export function setStartOfDay(date: Date): Date {
  const newDate = new Date(date);
  newDate.setHours(0, 0, 0, 0); // 12:00:00 AM, 0 ms
  return newDate;
}

export const addHour = (date: Date): Date => {
  date.setHours(date.getHours() + 1);
  return date;
};
export const removeHour = (date: Date): Date => {
  date.setHours(date.getHours() - 1);
  return date;
};
