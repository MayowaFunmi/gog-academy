import { z } from "zod";
// import type { File } from "formidable";

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
  // slug: z.string().optional(),
  requiresAttendance: z.boolean({ invalid_type_error: "Set as either true or false" }).optional(),
  requiresSubmissions: z.boolean({ invalid_type_error: "Set as either true or false" }).optional(),
  requiresMark: z.boolean({ invalid_type_error: "Set as either true or false" }).optional(),
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
  taskLink: z.string().optional(),
  taskScriptures: z.string().optional(),
  weekId: z.string({ required_error: "week id cannot be null" }),
  dayOfWeek: z.number({ required_error: "day of week is required" }),
  startTime: z.string().datetime({ message: "Invalid start Time." }),
  endTime: z.string().datetime({ message: "Invalid end Time." }),
  hasExtension: z.boolean().optional(),
  activated: z.boolean().optional(),
});

export const taskSubmissionSchema = z.object({
  userId: z.string({ required_error: "User ID is required"}),
  taskId: z.string({ required_error: "Task ID is required"}),
  weekId: z.string({ required_error: "Week ID is required"}),
  submission: z.string().max(1000).nullable().optional()
})

export interface CreateTaskSubmissionInput {
  userId: string;
  taskId: string;
  weekId: string;
  submission?: string | null;
  screenshots?: File[];
}

export type CreateAcademyCohortDto = z.infer<typeof createAcademyCohortSchema>;
export type CreateAcademyTaskTypeDto = z.infer<
  typeof createAcademyTaskTypeSchema
>;
export type CreateAcademyWeekDto = z.infer<typeof createAcademyWeekSchema>;
export type CreateDailyTaskDto = z.infer<typeof createDailyTaskSchema>;
