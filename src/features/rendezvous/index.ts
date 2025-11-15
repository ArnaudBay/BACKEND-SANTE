import { InMemoryRendezVousRepository } from "./outbound/rendezvous.repository";
import { RendezVousService } from "./domain/rendezvous.service";
import { createRendezVousController } from "./inbound/rendezvous.controler";

const repository = new InMemoryRendezVousRepository();
const service = new RendezVousService(repository);
const router = createRendezVousController(service);

export default router;
export { RendezVousService, InMemoryRendezVousRepository };

