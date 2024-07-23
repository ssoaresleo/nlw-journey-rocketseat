import dayjs from "dayjs";

export function validateTripStartDate(startsAt: Date): Boolean {
  if (dayjs(startsAt).isBefore(new Date())) {
    return false;
  }
  return true;
}

export function validateTripEndDate(startsAt: Date, endsAt: Date): Boolean {
  if (dayjs(endsAt).isBefore(startsAt)) {
    return false;
  }
  return true;
}
