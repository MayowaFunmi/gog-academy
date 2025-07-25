import { CohortService } from "@/backend/service/cohort.service";
import { CohortController } from "./cohort.controller";

export const cohortController = new CohortController(new CohortService());