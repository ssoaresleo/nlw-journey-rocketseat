import { Trip } from "../../domain/trip";
import { ICreateTripResponseDTO } from "../../useCases/createTrip/ICreateTripResponseDTO";

export interface ITripRepository {
  create(trip: Trip): Promise<ICreateTripResponseDTO>;
}
