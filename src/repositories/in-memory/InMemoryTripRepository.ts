import { randomUUID } from "crypto";
import { ICreateTripResponseDTO } from "../../useCases/createTrip/ICreateTripResponseDTO";
import { ITripRepository } from "../interfaces/ITripRepository";
import { Trip } from "../../domain/entities/trip";
import { ICreateTripDTO } from "../../useCases/createTrip/ICreateTripDTO";

export class InMemoryTripRepository implements ITripRepository {
  public items: Trip[] = [];
  async create(data: ICreateTripDTO): Promise<ICreateTripResponseDTO> {
    const tripId = randomUUID();
    const ownerId = randomUUID();
    const participantId = randomUUID();

    const trip: Trip = {
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
