import { PrismaTripRepository } from "../repositories/implementations/PrismaTripRepository";
import { CreateTripUseCase } from "../useCases/createTrip/createTripUseCase";

export async function makeCreateTripUseCase() {
  const prismaTripRepository = new PrismaTripRepository();
  const createTripUseCase = new CreateTripUseCase(prismaTripRepository);

  return createTripUseCase;
}
