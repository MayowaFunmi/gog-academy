import { PresentationService } from "@/backend/service/presentation.service";
import { PresentationController } from "./presentation.controller";

export const presentationController = new PresentationController(new PresentationService());