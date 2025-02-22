import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../lib/prisma";
import { ClientError } from "../errors/client-error";
import { env } from "../../env";

export async function confirmParticipants(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/participants/:participantId/confirm",
    {
      schema: {
        body: z.object({
          name: z.string(),
        }),
        params: z.object({
          participantId: z.string().uuid(),
        }),
      },
    },
    async (req, rep) => {
      const { participantId } = req.params;
      const { name } = req.body;

      const participant = await prisma.participant.findUnique({
        where: {
          id: participantId,
        },
      });

      if (!participant) {
        throw new ClientError("Participant not found");
      }

      if (participant.is_confirmed) {
        return rep.redirect(`${env.WEB_BASE_URL}/trips/${participant.trip_id}`);
      }

      await prisma.participant.update({
        where: { id: participantId },
        data: { is_confirmed: true, name: name },
      });

      return rep.redirect(`${env.WEB_BASE_URL}/trips/${participant.trip_id}`);
    }
  );
}
