import { internal } from "@hapi/boom";
import { withCause } from "../../../common/services/errors/withCause";
import { anonymisationDECA } from "./anonymisation.deca";

export async function anonymisationService(): Promise<void> {
  try {
    await anonymisationDECA();
  } catch (error) {
    throw withCause(internal("An error occurred while running the anonymisation service"), error, "fatal");
  }
}
