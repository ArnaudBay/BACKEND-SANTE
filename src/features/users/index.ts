import { emailSender } from "../messaging";
import { UserService } from "./domain/users.service";
import { createUserController } from "./inbound/users.controler";
import { SimpleUserRepository } from "./outbound/users.repository";

const repository = new SimpleUserRepository();
const service = new UserService(repository, emailSender);
const router = createUserController(service);

export default router;
export { UserService, SimpleUserRepository };