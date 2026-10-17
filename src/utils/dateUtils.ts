/**
 * Date and calendar utilities for E.A.S.E.
 */

export function formatDateString(dateStr: string): string {
  if (!dateStr) return 'Date not specified';
  try {
    const [year, month, day] = dateStr.split('-').map(Number);
    if (!year || !month || !day) return dateStr;
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

export function formatEventDateRange(
  startDateStr: string,
  endDateStr?: string
): string {
  if (!startDateStr) return 'Date not specified';
  if (!endDateStr || startDateStr === endDateStr) {
    return formatDateString(startDateStr);
  }

  try {
    const [sYear, sMonth, sDay] = startDateStr.split('-').map(Number);
    const [eYear, eMonth, eDay] = endDateStr.split('-').map(Number);

    const sDate = new Date(sYear, sMonth - 1, sDay);
    const eDate = new Date(eYear, eMonth - 1, eDay);

    const sMonthName = sDate.toLocaleDateString('en-US', { month: 'short' });
    const eMonthName = eDate.toLocaleDateString('en-US', { month: 'short' });

    if (sYear === eYear && sMonth === eMonth) {
      return `${sMonthName} ${sDay}–${eDay}, ${sYear}`;
    }
    if (sYear === eYear) {
      return `${sMonthName} ${sDay} – ${eMonthName} ${eDay}, ${sYear}`;
    }
    return `${formatDateString(startDateStr)} – ${formatDateString(endDateStr)}`;
  } catch {
    return `${startDateStr} – ${endDateStr}`;
  }
}

export function getDaysRemaining(targetDateStr: string): number | null {
  if (!targetDateStr) return null;
  try {
    const [y, m, d] = targetDateStr.split('-').map(Number);
    const target = new Date(y, m - 1, d, 23, 59, 59);
    const now = new Date();
    const diffMs = target.getTime() - now.getTime();
    return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  } catch {
    return null;
  }
}

export interface CalendarMonthData {
  year: number;
  month: number; // 0-indexed (0 = Jan, 11 = Dec)
  monthName: string;
  daysInMonth: number;
  firstDayOfWeek: number; // 0 = Sunday, 1 = Monday, etc.
}

export function getMonthCalendarGrid(year: number, month: number): {
  days: { day: number; dateString: string; isCurrentMonth: boolean }[];
  monthName: string;
  year: number;
} {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startDayOfWeek = firstDay.getDay(); // 0 is Sunday

  // Previous month trailing days
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  const days: { day: number; dateString: string; isCurrentMonth: boolean }[] = [];

  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const day = prevMonthLastDay - i;
    const prevMonth = month === 0 ? 12 : month;
    const prevYear = month === 0 ? year - 1 : year;
    const dateString = `${prevYear}-${String(prevMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    days.push({ day, dateString, isCurrentMonth: false });
  }

  // Current month days
  for (let day = 1; day <= daysInMonth; day++) {
    const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    days.push({ day, dateString, isCurrentMonth: true });
  }

  // Next month leading days to complete full weeks (multiples of 7)
  const remaining = (7 - (days.length % 7)) % 7;
  for (let day = 1; day <= remaining; day++) {
    const nextMonth = month === 11 ? 1 : month + 2;
    const nextYear = month === 11 ? year + 1 : year;
    const dateString = `${nextYear}-${String(nextMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    days.push({ day, dateString, isCurrentMonth: false });
  }

  const monthName = firstDay.toLocaleDateString('en-US', { month: 'long' });

  return { days, monthName, year };
}
