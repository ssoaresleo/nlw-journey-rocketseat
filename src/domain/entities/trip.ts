import { Participant } from "./participant";

export type Trip = {
  id: string;
  destination: string;
  startsAt: Date;
  endsAt: Date;
  isConfirmed: boolean;
  participants: Participant[];
  createdAt: Date;
};
