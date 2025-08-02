export interface Cohort {
  id: string;
  cohort: string;
  batch: string
  slug: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
  userCount: number;
}

export interface Pagination {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface CohortsResponseData {
  cohorts: Cohort[];
  totalUsers: number;
  pagination: Pagination;
}

export interface CohortsResponse {
  status: string;
  message: string;
  data: CohortsResponseData;
}

export interface TaskType {
  id: string;
  cohortId: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

export interface AcademicWeek {
  id: string;
  cohortId: string;
  weekNumber: number;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface CohortDetails {
  id: string;
  cohort: string;
  slug: string;
  startDate: string;
  batch: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
  taskTypes?: TaskType[];
  academicWeek?: AcademicWeek[];
  userCount?: number;
}

export interface SingleCohortResponse {
  status: string;
  message: string;
  data: CohortDetails;
}


export interface CohortFormData {
  cohort: string;
  batch: string;
  startDate: string;
  endDate: string;
}

export interface AddCohortResponse {
  status: string;
  message: string;
  data: CohortDetails;
}