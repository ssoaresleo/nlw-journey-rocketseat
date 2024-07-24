import { Trip } from "../../domain/entities/trip";
import { ICreateTripDTO } from "../../useCases/createTrip/ICreateTripDTO";
import { ICreateTripResponseDTO } from "../../useCases/createTrip/ICreateTripResponseDTO";

export interface ITripRepository {
  create(trip: ICreateTripDTO): Promise<ICreateTripResponseDTO>;
}
