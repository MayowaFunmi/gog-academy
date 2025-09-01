import { ReportService } from "@/backend/service/report.service";
import { ReportController } from "./report.controller";

export const reportController = new ReportController(new ReportService());