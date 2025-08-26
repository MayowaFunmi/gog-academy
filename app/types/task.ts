import { AcademicWeek } from "./cohort";

export interface TaskType {
  id: string;
  cohortId: string;
  name: string;
  slug: string;
  requiresAttendance: boolean;
  requiresSubmissions: boolean;
  requiresMark: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TaskTypeResponse {
  status: string;
  message: string;
  data: TaskType | null;
}

export interface GetCohortTaskTypesResponse {
  status: string;
  message: string;
  data: TaskType[];
}

export interface TaskTypeFormData {
  cohortId: string;
  name: string;
  requiresAttendance?: boolean;
  requiresSubmissions?: boolean;
  requiresMark?: boolean;
}

export interface DailyTaskFormData {
  title?: string;
  dayOfWeek: number;
  taskTypeId: string;
  description: string;
  taskLink?: string;
  taskScriptures?: string;
  weekId: string;
  startTime: string;
  endTime: string;
  hasExtension?: boolean;
  activated: boolean;
}

export interface DailyTaskSchema {
  title?: string;
  description: string;
  taskLink?: string;
  taskScriptures?: string;
  weekId: string;
  taskTypeId: string;
  dayOfWeek: number;
  hourStart: number;
  hourEnd: number;
  minuteStart?: number;
  minuteEnd?: number;
  activated: boolean;
}

export interface DailyTask {
  id: string;
  title: string;
  taskTypeId: string;
  description: string;
  weekId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  taskLink?: string;
  taskScriptures?: string;
  hasExtension: boolean;
  activated: boolean;
  createdAt: string;
  updatedAt: string;
  academicWeek?: AcademicWeek;
  taskType?: TaskType;
  attendance?: TaskAttendance[];
}

export interface DailyTaskResponse {
  status: string;
  message: string;
  data: DailyTask;
}

export interface WeeklyTasksResponse {
  status: string;
  message: string;
  data: DailyTask[];
}

export interface TaskStatusUpdateResponse {
  status: string;
  message: string;
}

export interface TaskAttendance {
  id: string;
  userId: string;
  taskId: string;
  date: string;
  attendanceAt: string;
  marked: boolean;
  isLate: boolean;
}

export interface CreateTaskSubmissionInput {
  submission?: string;
  screenshots?: { file?: FileList }[];
}
