export type Participant = {
  id: string;
  name?: string | null;
  email: string;
  isConfirmed?: boolean;
  isOwner?: boolean;
  tripId?: string;
};
