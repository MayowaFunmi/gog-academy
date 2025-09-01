export interface WeeklyReportResponse {
  status: string;
  message: string;
  data: {
    report: WeeklyReportRow[];
    taskTypes: string[];
  };
}

export interface WeeklyReportRow {
  userId: string;
  name: string;
  matricNumber: string | null;
  Total: number;
  [taskType: string]: string | number | null; 
}
