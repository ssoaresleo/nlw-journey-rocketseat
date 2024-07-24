import { randomUUID } from "crypto";
import { ICreateTripResponseDTO } from "../../useCases/createTrip/ICreateTripResponseDTO";
import { ITripRepository } from "../interfaces/ITripRepository";
import { Trip as TripProps } from "../dtos/getTripsDTO";
import { Trip } from "../../domain/trip";

export class InMemoryTripRepository implements ITripRepository {
  public items: TripProps[] = [];
  async create(data: Trip): Promise<ICreateTripResponseDTO> {
    const tripId = randomUUID();
    const ownerId = randomUUID();
    const participantId = randomUUID();

    const trip: TripProps = {
      id: tripId,
      destination: data.destination,
      startsAt: data.starts_at,
      endsAt: data.ends_at,
      isConfirmed: false,
      createdAt: new Date(),
      participants: [
        {
          id: ownerId,
          name: data.owner_name,
          email: data.owner_email,
          isConfirmed: true,
          isOwner: true,
          tripId,
        },
        ...data.emails_to_invite.map((email) => ({
          id: participantId,
          email,
          isConfirmed: false,
          isOwner: false,
          tripId,
        })),
      ],
    };

    this.items.push(trip);

    return { tripId };
  }
}
