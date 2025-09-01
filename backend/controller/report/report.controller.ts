import { ReportService } from "@/backend/service/report.service";
import { ApiResponse } from "@/backend/types/apiResponse";

export class ReportController {
  constructor(private reportService: ReportService) {}

  async generateWeeklyTask(weekId: string): Promise<ApiResponse> {
    return await this.reportService.generateWeeklyReport(weekId)
  }
}