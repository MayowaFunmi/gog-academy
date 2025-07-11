import { UserService } from "../service/user.service";
import { UserController } from "./user.controller";

export const userController = new UserController(new UserService());