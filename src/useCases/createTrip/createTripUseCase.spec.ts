import { afterEach, beforeAll, describe, expect, test, vi } from "vitest";
import { CreateTripUseCase } from "./createTripUseCase";
import { InMemoryTripRepository } from "../../repositories/in-memory/InMemoryTripRepository";
import { ICreateTripDTO } from "./ICreateTripDTO";
import { InvalidDate } from "../../errors/invalid-date";

let createTripUseCase: CreateTripUseCase;
let inMemoryTripRepository: InMemoryTripRepository;

beforeAll(() => {
  inMemoryTripRepository = new InMemoryTripRepository();
  createTripUseCase = new CreateTripUseCase(inMemoryTripRepository);

  vi.useFakeTimers()

  const date = new Date("2024-07-01 10:00:00");

  vi.setSystemTime(date)
});
afterEach(() => {
  vi.useRealTimers()
})
describe("CreateTrip", () => {
  test("should be able to create a new trip", async () => {
    const trip: ICreateTripDTO = {
      destination: "New York",
      starts_at: new Date("2024-07-10 10:00:00"),
      ends_at: new Date("2024-07-22 18:00:00"),
      owner_name: "John Doe",
      owner_email: "johndoe@example.com",
      emails_to_invite: ["jane@example.com", "bill@example.com"],
    };

    const response = await createTripUseCase.execute(trip);
    expect(response).toEqual({ tripId: expect.any(String) });
  });

  test("should not be able to create a new trip with start date before now", async () => {
    const trip: ICreateTripDTO = {
      destination: "New York",
      starts_at: new Date("2022-08-10 10:00:00"),
      ends_at: new Date("2024-09-22 18:00:00"),
      owner_name: "John Doe",
      owner_email: "johndoe@example.com",
      emails_to_invite: ["jane@example.com", "bill@example.com"],
    };

    expect(() => {
      return createTripUseCase.execute(trip);
    }).rejects.toBeInstanceOf(InvalidDate);
  });

  test("should not be able to create a new trip with end date before start date", async () => {
    const trip: ICreateTripDTO = {
      destination: "New York",
      starts_at: new Date("2022-08-10 10:00:00"),
      ends_at: new Date("2024-09-22 18:00:00"),
      owner_name: "John Doe",
      owner_email: "johndoe@example.com",
      emails_to_invite: ["jane@example.com", "bill@example.com"],
    };

    expect(() => {
      return createTripUseCase.execute(trip);
    }).rejects.toBeInstanceOf(InvalidDate);
  });
});
