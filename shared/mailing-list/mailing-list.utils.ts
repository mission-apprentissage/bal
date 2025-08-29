import type { IMailingListV2, IMailingListV2Json } from "../models/mailingListV2.model";
import { assertUnreachable } from "../utils/assertUnreachable";

export function getStepCompletion(mailingList: IMailingListV2 | IMailingListV2Json): {
  upload: boolean;
  parse: boolean;
  configure: boolean;
  generate: boolean;
  export: boolean;
} {
  switch (mailingList.status) {
    case "initial":
      return { upload: false, parse: false, configure: false, generate: false, export: false };
    case "parse:scheduled":
    case "parse:in_progress":
    case "parse:failure":
      return { upload: true, parse: false, configure: false, generate: false, export: false };

    case "parse:success":
      return { upload: true, parse: true, configure: false, generate: false, export: false };

    case "generate:scheduled":
    case "generate:in_progress":
    case "generate:failure":
      return { upload: true, parse: true, configure: true, generate: false, export: false };

    case "generate:success":
    case "export:scheduled":
    case "export:in_progress":
    case "export:failure":
      return { upload: true, parse: true, configure: true, generate: false, export: false };

    case "export:success":
      return { upload: true, parse: true, configure: true, generate: true, export: true };

    default:
      assertUnreachable(mailingList.status);
  }
}

export function canScheduleParse(mailingList: IMailingListV2 | IMailingListV2Json): boolean {
  if (mailingList.job_id !== null) {
    return false;
  }

  switch (mailingList.status) {
    case "initial":
    case "parse:failure":
    case "parse:success":
    case "generate:failure":
    case "export:failure":
    case "export:success":
      return true;

    case "generate:success":
    case "parse:scheduled":
    case "parse:in_progress":
    case "generate:scheduled":
    case "generate:in_progress":
    case "export:scheduled":
    case "export:in_progress":
      return false;
    default:
      assertUnreachable(mailingList.status);
  }
}

export function canResetMailingList(mailingList: IMailingListV2 | IMailingListV2Json): boolean {
  if (mailingList.job_id !== null) {
    return false;
  }

  switch (mailingList.status) {
    case "initial":
      return false;

    case "parse:success":
    case "parse:failure":
    case "generate:failure":
    case "generate:success":
    case "export:failure":
    case "export:success":
      return true;

    case "parse:scheduled":
    case "parse:in_progress":
    case "generate:scheduled":
    case "generate:in_progress":
    case "export:scheduled":
    case "export:in_progress":
      return false;
    default:
      assertUnreachable(mailingList.status);
  }
}

export function canScheduleGenerate(mailingList: IMailingListV2 | IMailingListV2Json): boolean {
  if (mailingList.job_id !== null) {
    return false;
  }

  switch (mailingList.status) {
    case "parse:success":
    case "generate:failure":
    case "export:failure":
    case "export:success":
      return true;

    case "initial":
    case "parse:failure":
    case "generate:success":
    case "parse:scheduled":
    case "parse:in_progress":
    case "generate:scheduled":
    case "generate:in_progress":
    case "export:scheduled":
    case "export:in_progress":
      return false;
    default:
      assertUnreachable(mailingList.status);
  }
}

export function canResetConfiguration(mailingList: IMailingListV2 | IMailingListV2Json): boolean {
  if (mailingList.job_id !== null) {
    return false;
  }

  switch (mailingList.status) {
    case "initial":
    case "parse:success":
    case "parse:failure":
      return false;

    case "generate:failure":
    case "generate:success":
    case "export:failure":
    case "export:success":
      return true;

    case "parse:scheduled":
    case "parse:in_progress":
    case "generate:scheduled":
    case "generate:in_progress":
    case "export:scheduled":
    case "export:in_progress":
      return false;
    default:
      assertUnreachable(mailingList.status);
  }
}

export function canScheduleExport(mailingList: IMailingListV2 | IMailingListV2Json): boolean {
  if (mailingList.job_id !== null) {
    return false;
  }

  switch (mailingList.status) {
    case "generate:success":
    case "export:failure":
    case "export:success":
      return true;

    case "initial":
    case "parse:scheduled":
    case "parse:in_progress":
    case "generate:scheduled":
    case "generate:in_progress":
    case "export:scheduled":
    case "export:in_progress":
    case "parse:failure":
    case "parse:success":
    case "generate:failure":
      return false;
    default:
      assertUnreachable(mailingList.status);
  }
}
