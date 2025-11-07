import { UserService } from "./domain/users.service";
import { SimpleUserRepository } from "./outbound/users.repository";
import { createUserController } from "./inbound/users.rest";

const userRepository = new SimpleUserRepository();
const userService = new UserService(userRepository);
const usersRouter = createUserController(userService);



export default usersRouter;