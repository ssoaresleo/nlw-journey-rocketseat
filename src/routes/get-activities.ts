import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { dayjs } from "../lib/dayjs";

export async function getActivities(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/trips/:tripId/activities",
    {
      schema: {
        params: z.object({
          tripId: z.string().uuid(),
        }),
      },
    },
    async (req, res) => {
      const { tripId } = req.params;

      const trip = await prisma.trip.findUnique({
        where: {
          id: tripId,
        },
        include: {
          activities: {
            orderBy: {
              occurs_at: "asc",
            },
          },
        },
      });

      if (!trip) {
        throw new Error("Trip not found");
      }

      // Busca os dias da viagem
      const differenceInDaysBetweenTripStartAndEnd = dayjs(trip.ends_at).diff(
        trip.starts_at,
        "days"
      );

      const activities = Array.from({
        length: differenceInDaysBetweenTripStartAndEnd + 1,
      }).map((_, i) => {
        const date = dayjs(trip.starts_at).add(i, "days");

        return {
          date: date.toDate(),
          activities: trip.activities.filter((activities) => {
            return dayjs(activities.occurs_at).isSame(date, "day");
          }),
        };
      });

      return {
        activities,
      };
    }
  );
}
