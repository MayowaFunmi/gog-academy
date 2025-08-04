import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import FullCalendar from '@fullcalendar/react';
import multiMonthPlugin from '@fullcalendar/multimonth';
import dayGridPlugin from '@fullcalendar/daygrid';
import { DateClickArg } from '@fullcalendar/core';
import { isWithinInterval, startOfDay, endOfDay } from 'date-fns';

// Types based on Prisma schema
interface Cohort {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
}

interface AcademicWeek {
  id: string;
  weekNumber: number;
  startDate: string;
  endDate: string;
}

export default function TaskDashboard() {
  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [selectedCohort, setSelectedCohort] = useState<string | null>(null);
  const [weeks, setWeeks] = useState<AcademicWeek[]>([]);
  const [selectedWeek, setSelectedWeek] = useState<AcademicWeek | null>(null);
  const [loading, setLoading] = useState(true);
  const calendarRef = useRef<FullCalendar>(null);
  const router = useRouter();

  // Fetch cohorts and weeks
  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch cohorts
        const cohortResponse = await fetch('/api/cohorts');
        const cohortData = await cohortResponse.json();
        setCohorts(cohortData);

        // If a cohort is selected, fetch its weeks
        if (selectedCohort) {
          const weekResponse = await fetch(`/api/cohorts/${selectedCohort}/weeks`);
          const weekData = await weekResponse.json();
          setWeeks(weekData);

          // Set calendar to start at cohort's startDate
          const cohort = cohortData.find((c: Cohort) => c.id === selectedCohort);
          if (cohort && calendarRef.current) {
            const calendarApi = calendarRef.current.getApi();
            calendarApi.gotoDate(new Date(cohort.startDate));
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [selectedCohort]);

  // Handle cohort selection
  const handleCohortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCohort(event.target.value);
    setSelectedWeek(null);
  };

  // Handle week selection
  const handleWeekClick = (week: AcademicWeek) => {
    setSelectedWeek(week);
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.gotoDate(new Date(week.startDate));
    }
  };

  // Handle date click
  const handleDateClick = (arg: DateClickArg) => {
    if (!selectedCohort) return;

    const cohort = cohorts.find(c => c.id === selectedCohort);
    if (!cohort) return;

    const cohortStart = startOfDay(new Date(cohort.startDate));
    const cohortEnd = endOfDay(new Date(cohort.endDate));

    if (isWithinInterval(arg.date, { start: cohortStart, end: cohortEnd })) {
      router.push(`/tasks?date=${arg.date.toISOString()}&cohortId=${selectedCohort}`);
    }
  };

  // Custom date rendering
  const renderDayCellContent = (arg: { date: Date }) => {
    if (!selectedCohort) {
      return <span className="text-gray-300">{arg.date.getDate()}</span>;
    }

    const cohort = cohorts.find(c => c.id === selectedCohort);
    if (!cohort) {
      return <span className="text-gray-300">{arg.date.getDate()}</span>;
    }

    const cohortStart = startOfDay(new Date(cohort.startDate));
    const cohortEnd = endOfDay(new Date(cohort.endDate));

    if (!isWithinInterval(arg.date, { start: cohortStart, end: cohortEnd })) {
      return <span className="text-gray-300">{arg.date.getDate()}</span>;
    }

    if (selectedWeek) {
      const weekStart = startOfDay(new Date(selectedWeek.startDate));
      const weekEnd = endOfDay(new Date(selectedWeek.endDate));
      return (
        <span
          className={
            isWithinInterval(arg.date, { start: weekStart, end: weekEnd })
              ? 'text-blue-800 font-semibold'
              : 'text-gray-400'
          }
        >
          {arg.date.getDate()}
        </span>
      );
    }

    return <span className="text-blue-800 font-semibold">{arg.date.getDate()}</span>;
  };

  // Render week numbers
  const renderWeekNumbers = () => {
    if (!selectedCohort || weeks.length === 0) return null;

    return (
      <div className="flex flex-wrap gap-2 mb-4">
        {weeks.map(week => (
          <button
            key={week.id}
            onClick={() => handleWeekClick(week)}
            className={`px-4 py-2 rounded ${
              selectedWeek?.id === week.id
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-blue-100'
            }`}
          >
            Week {week.weekNumber}
          </button>
        ))}
      </div>
    );
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Task Dashboard</h1>

      {/* Cohort Selector */}
      <div className="mb-6">
        <label htmlFor="cohort" className="block text-sm font-medium text-gray-700">
          Select Cohort
        </label>
        <select
          id="cohort"
          value={selectedCohort || ''}
          onChange={handleCohortChange}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
        >
          <option value="">Select a cohort</option>
          {cohorts.map(cohort => (
            <option key={cohort.id} value={cohort.id}>
              {cohort.name}
            </option>
          ))}
        </select>
      </div>

      {/* Week Numbers */}
      {renderWeekNumbers()}

      {/* Calendar */}
      {selectedCohort && (
        <div className="bg-white p-4 rounded-lg shadow">
          <FullCalendar
            ref={calendarRef}
            plugins={[multiMonthPlugin, dayGridPlugin]}
            initialView="multiMonthYear"
            multiMonthMaxColumns={3} // 3x4 grid for year view
            dayCellContent={renderDayCellContent}
            dateClick={handleDateClick}
            validRange={{
              start: cohorts.find(c => c.id === selectedCohort)?.startDate,
              end: cohorts.find(c => c.id === selectedCohort)?.endDate,
            }}
            headerToolbar={{
              left: 'prev,next',
              center: 'title',
              right: '',
            }}
            height="auto"
            dayMaxEvents={false}
            dayCellClassNames={(arg) => {
              if (!selectedCohort) return 'bg-gray-100';
              const cohort = cohorts.find(c => c.id === selectedCohort);
              if (!cohort) return 'bg-gray-100';
              const cohortStart = startOfDay(new Date(cohort.startDate));
              const cohortEnd = endOfDay(new Date(cohort.endDate));
              if (!isWithinInterval(arg.date, { start: cohortStart, end: cohortEnd })) {
                return 'bg-gray-100';
              }
              if (selectedWeek) {
                const weekStart = startOfDay(new Date(selectedWeek.startDate));
                const weekEnd = endOfDay(new Date(selectedWeek.endDate));
                return isWithinInterval(arg.date, { start: weekStart, end: weekEnd })
                  ? 'bg-blue-100'
                  : 'bg-blue-50 opacity-50';
              }
              return 'bg-blue-50';
            }}
          />
        </div>
      )}
    </div>
  );
}