import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../lib/prisma";
import { dayjs } from "../lib/dayjs";
import { getMailClient } from "../lib/mail";
import nodemailer from "nodemailer";
import { ClientError } from "../errors/client-error";
import { env } from "../../env";

export async function confirmTrip(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/trips/:tripId/confirm",
    {
      schema: {
        params: z.object({
          tripId: z.string().uuid(),
        }),
      },
    },
    async (req, rep) => {
      const { tripId } = req.params;

      const trip = await prisma.trip.findUnique({
        where: {
          id: tripId,
        },
        include: {
          participants: {
            where: {
              is_owner: false,
            },
          },
        },
      });

      if (!trip) {
        throw new ClientError("Trip not found");
      }

      if (trip.is_confirmed) {
        return rep.redirect(`${env.WEB_BASE_URL}/trips/${tripId}`);
      }

      await prisma.trip.update({
        where: { id: tripId },
        data: { is_confirmed: true },
      });

      const formattedStartDate = dayjs(trip.starts_at).format("LL");
      const formattedEndDate = dayjs(trip.ends_at).format("LL");

      const mail = await getMailClient();

      await Promise.all(
        trip.participants.map(async (participant) => {
          const confirmation = `${env.WEB_BASE_URL}/participants/${participant.id}/confirm`;
          const message = await mail.sendMail({
            from: {
              name: "Equipe plann.er",
              address: "oi@plann.er",
            },
            to: participant.email,
            subject: `Confirme sua presença para ${trip.destination} em ${formattedStartDate}`,
            html: `
              <div style="font-family: sans-serif; font-size: 16px; line-height: 1.6;">
                <p>Você foi convidado para participar de uma viagem para <strong>${trip.destination}</strong> nas datas de <strong>${formattedStartDate} até ${formattedEndDate}</strong> <strong>de agosto de 2024.</strong></p>
                <p></p>
                <p>Para confirmar sua presença na viagem, clique no link abaixo:</p>
                <p></p>
                <p>
                <a href="${confirmation}">Confirmar viagem</a>
                </p>
                <p></p>
                <p>Caso você não saiba do que se trata este email, apenas ignore-o.</p>
              </div>
            
            `.trim(),
          });

          console.log(nodemailer.getTestMessageUrl(message));
        })
      );

      return rep.redirect(`${env.WEB_BASE_URL}/trips/${tripId}`);
    }
  );
}
