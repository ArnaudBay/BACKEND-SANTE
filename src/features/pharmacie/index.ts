import { createPharmacieController } from "./inbound/pharmacie.controler";
import { PharmacyService } from "./domain/pharmacy.service";
import { InMemoryPharmacyRepository } from "./outbound/pharmacy.repository";

const repository = new InMemoryPharmacyRepository();
const service = new PharmacyService(repository);
const router = createPharmacieController(service);

export default router;
export { PharmacyService, InMemoryPharmacyRepository };

