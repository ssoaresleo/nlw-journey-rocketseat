import { InvalidDate } from "../errors/invalid-date";

interface TripProps {
  id?: string;
  destination: string;
  starts_at: Date;
  ends_at: Date;
  owner_name: string;
  owner_email: string;
  emails_to_invite: string[];
}

export class Trip {
  private props: TripProps;

  get id() {
    return this.props.id;
  }
  get destination() {
    return this.props.destination;
  }
  get starts_at() {
    return this.props.starts_at;
  }
  get ends_at() {
    return this.props.ends_at;
  }
  get owner_name() {
    return this.props.owner_name;
  }
  get owner_email() {
    return this.props.owner_email;
  }
  get emails_to_invite() {
    return this.props.emails_to_invite;
  }

  constructor(props: TripProps) {
    this.props = props;
  }
}
