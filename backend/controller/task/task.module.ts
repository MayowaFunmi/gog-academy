import { TaskService } from "@/backend/service/task.service";
import { TaskController } from "./task.controller";

export const taskController = new TaskController(new TaskService())