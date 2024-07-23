import { Trip } from "../../domain/trip";
import { InvalidDate } from "../../errors/invalid-date";
import { ITripRepository } from "../../repositories/interfaces/ITripRepository";
import {
  validateTripEndDate,
  validateTripStartDate,
} from "../../utils/dateUtils";
import { ICreateTripDTO } from "./ICreateTripDTO";

export class CreateTripUseCase {
  constructor(private tripRepository: ITripRepository) {}

  async execute(data: ICreateTripDTO) {
    if (!validateTripStartDate(data.starts_at)) {
      throw new InvalidDate("Invalid trip start date");
    }
    if (!validateTripEndDate(data.ends_at, data.ends_at)) {
      throw new InvalidDate("Invalid trip end date");
    }
    
    const trip = new Trip(data);

    const tripId = await this.tripRepository.create(trip);

    return tripId;
  }
}
