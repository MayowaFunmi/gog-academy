import { z } from "zod";

export const createAcademyCohortSchema = z.object({
  cohort: z.string().min(1, { message: "Cohort name is required" }),
  batch: z.string().min(1, { message: "Cohort batch is required" }),
  slug: z.string().optional(),
  startDate: z.string().datetime({ message: "Invalid start date." }),
  endDate: z.string().datetime({ message: "Invalid end date." }),
});

export const createAcademyTaskTypeSchema = z.object({
  cohortId: z.string({ required_error: "cohort id cannot be null" }),
  name: z.string({ required_error: "name is required" }),
  slug: z.string().optional(),
});

export const createAcademyWeekSchema = z.object({
  cohortId: z.string({ required_error: "cohort id cannot be null" }),
  weekNumber: z.number({ required_error: "week number is required" }),
  startDate: z.string().datetime({ message: "Invalid start date." }),
  endDate: z.string().datetime({ message: "Invalid end date." }),
  // currentWeek: z.boolean({ required_error: "currenWeek is required" }),
});

export const createDailyTaskSchema = z.object({
  title: z.string().optional(),
  taskTypeId: z.string({ required_error: "Task type id cannot be null" }),
  description: z.string({ required_error: "description cannot be null" }),
  weekId: z.string({ required_error: "week id cannot be null" }),
  startDay: z.string().datetime({ message: "Invalid start day." }),
  endDay: z.string().datetime({ message: "Invalid end day." }),
  activated: z.boolean({ required_error: "state if daily task is activated" }),
});

export type CreateAcademyCohortDto = z.infer<typeof createAcademyCohortSchema>;
export type CreateAcademyTaskTypeDto = z.infer<
  typeof createAcademyTaskTypeSchema
>;
export type CreateAcademyWeekDto = z.infer<typeof createAcademyWeekSchema>;
export type CreateDailyTaskDto = z.infer<typeof createDailyTaskSchema>;
