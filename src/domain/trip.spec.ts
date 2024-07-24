import { expect, test } from "vitest";
import { Trip } from "./trip";

test("create an trip", () => {
  const startsAt = new Date("2024-08-10 10:00:00");
  const endsAt = new Date("2024-09-22 18:00:00");

  const trip = new Trip({
    destination: "New York",
    starts_at: startsAt,
    ends_at: endsAt,
    owner_name: "John Doe",
    owner_email: "johndoe@example.com",
    emails_to_invite: ["jane@example.com", "bill@example.com"],
  });

  expect(trip).instanceOf(Trip);
  expect(trip.destination).toBe("New York");
  expect(trip.owner_name).toBe("John Doe");
});