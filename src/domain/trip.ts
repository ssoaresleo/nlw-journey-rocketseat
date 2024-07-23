export class Trip {
  private readonly id: string;
  public destination: string;
  public starts_at: Date;
  public ends_at: Date;
  public owner_name: string;
  public owner_email: string;
  public emails_to_invite: string[] = [];

  constructor(props: Omit<Trip, "id">) {
    Object.assign(this, props);
  }
}
