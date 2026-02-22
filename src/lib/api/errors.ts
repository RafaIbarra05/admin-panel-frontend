import { ApiError } from "./client";

export function getErrorMessage(e: unknown, fallback = "Ocurrió un error") {
  if (!e) return fallback;

  if (e instanceof ApiError) return e.message;

  if (e instanceof Error) return e.message;

  // Por si algún throw viene como string/obj
  if (typeof e === "string") return e;

  try {
    return JSON.stringify(e);
  } catch {
    return fallback;
  }
}
