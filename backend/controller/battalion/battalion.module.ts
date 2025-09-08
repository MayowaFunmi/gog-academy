import { BattalionService } from "../../service/battalion.service";
import { BattalionController } from "./battalion.controller";

export const battalionController = new BattalionController(new BattalionService());
