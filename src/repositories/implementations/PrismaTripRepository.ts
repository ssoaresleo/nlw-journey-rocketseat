import { Trip } from "../../domain/trip";
import { prisma } from "../../lib/prisma";
import { ICreateTripResponseDTO } from "../../useCases/createTrip/ICreateTripResponseDTO";
import { ITripRepository } from "../interfaces/ITripRepository";

export class PrismaTripRepository implements ITripRepository {
  async create({
    destination,
    starts_at,
    ends_at,
    owner_name,
    owner_email,
    emails_to_invite,
  }: Trip): Promise<ICreateTripResponseDTO> {
    const trip = await prisma.trip.create({
      data: {
        destination,
        starts_at,
        ends_at,
        participants: {
          createMany: {
            data: [
              {
                name: owner_name,
                email: owner_email,
                is_owner: true,
                is_confirmed: true,
              },
              ...emails_to_invite.map((email) => {
                return { email };
              }),
            ],
          },
        },
      },
    });

    return {
      tripId: trip.id,
    };
  }
}
