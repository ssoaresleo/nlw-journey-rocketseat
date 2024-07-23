import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { getMailClient } from "../lib/mail";
import { dayjs } from "../lib/dayjs";
import nodemailer from "nodemailer";
import { env } from "../../env";
import { makeCreateTripUseCase } from "../factories/makeCreateTripUseCase";

export async function createTrip(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/trips",
    {
      schema: {
        body: z.object({
          destination: z.string().min(4),
          starts_at: z.coerce.date(),
          ends_at: z.coerce.date(),
          owner_name: z.string(),
          owner_email: z.string().email(),
          emails_to_invite: z.array(z.string().email()),
        }),
      },
    },
    async (req, res) => {
      const {
        destination,
        ends_at,
        starts_at,
        owner_email,
        owner_name,
        emails_to_invite,
      } = req.body;

      const createTripUseCaseFactory = await makeCreateTripUseCase();

      const { tripId } = await createTripUseCaseFactory.execute({
        destination,
        ends_at,
        starts_at,
        owner_name,
        owner_email,
        emails_to_invite,
      });

      const formattedStartDate = dayjs(starts_at).format("LL");
      const formattedEndDate = dayjs(ends_at).format("LL");

      const confirmation = `${env.API_BASE_URL}/trips/${tripId}/confirm`;

      const mail = await getMailClient();

      const message = await mail.sendMail({
        from: {
          name: "Equipe plann.er",
          address: "oi@plann.er",
        },
        to: {
          name: owner_name,
          address: owner_email,
        },
        subject: `Confirme sua viagem para ${destination} em ${formattedStartDate}`,
        html: `
          <div style="font-family: sans-serif; font-size: 16px; line-height: 1.6;">
            <p>Você solicitou a criação de uma viagem para <strong>${destination}</strong> nas datas de <strong>${formattedStartDate} até ${formattedEndDate}</strong> <strong>de agosto de 2024.</strong></p>
            <p></p>
            <p>Para confirmar a viagem, clique no link abaixo:</p>
            <p></p>
            <p>
            <a href="${confirmation}">Confirmar viagem</a>
            </p>
            <p></p>
            <p>Caso você não saiba do que se trata este email, apenas ignore-o. </p>
          </div>
        
        `.trim(),
      });

      console.log(nodemailer.getTestMessageUrl(message));

      return { tripId: tripId };
    }
  );

  app.get("/trips", async (req, res) => {});
}
