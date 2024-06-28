import { EventEmitter } from "node:events";

import { resolveMx } from "dns";
import { createConnection } from "net";
import { promisify } from "util";

type SMTPConfig = {
  fqdn: string;
  sender: string;
  port: number;
  email: string;
  smtp: string;
};

type SMTP_COMMAND = "CONNECT" | "EHLO" | "MAIL_FROM" | "RCPT_TO" | "VRFY" | "RSET" | "QUIT";

// https://datatracker.ietf.org/doc/html/rfc5321#section-4.2.3
const RESPONSE_CODES = {
  211: "System status, or system help reply",
  214: "Help message",
  220: "Service ready",
  221: "Service closing transmission channel",
  250: "Requested mail action okay, completed",
  251: "User not local; will forward to <forward-path>",
  252: "Cannot VRFY user, but will accept message and attempt delivery",
  354: "Start mail input; end with <CRLF>.<CRLF>",
  421: "Service not available, closing transmission channel",
  450: "Requested mail action not taken: mailbox unavailable",
  451: "Requested action aborted: local error in processing",
  452: "Requested action not taken: insufficient system storage",
  455: "Server unable to accommodate parameters",
  500: "Syntax error, command unrecognised",
  501: "Syntax error in parameters or arguments",
  502: "Command not implemented",
  503: "Bad sequence of commands",
  504: "Command parameter not implemented",
  550: "Requested action not taken: mailbox unavailable",
  551: "User not local; please try <forward-path>",
  552: "Requested mail action aborted: exceeded storage allocation",
  553: "Requested action not taken: mailbox name not allowed",
  554: "Transaction failed",
  555: "MAIL FROM/RCPT TO parameters not recognised or not implemented",
} as const;

type IResponseCode = `${keyof typeof RESPONSE_CODES}`;

const resolveMxPromise = promisify(resolveMx);

function getEmailDomain(email: string) {
  return email.split("@")[1].toLocaleLowerCase();
}

export async function getSmtpServer(email: string): Promise<string | null> {
  const domain: string = getEmailDomain(email);

  try {
    const addresses = await resolveMxPromise(domain);

    if (addresses && addresses.length > 0) {
      let priority = 10000;
      let lowestPriorityIndex = 0;

      addresses.forEach((address, index) => {
        if (address.priority < priority) {
          priority = address.priority;
          lowestPriorityIndex = index;
        }
      });

      const smtp = addresses[lowestPriorityIndex].exchange;

      return smtp;
    } else {
      return null;
    }
  } catch (err) {
    return null;
  }
}

type Response = {
  code: IResponseCode;
  message: string[];
};

type SMTPConnection = AsyncGenerator<Response, Response, SMTP_COMMAND>;

export async function* createSmtpConnection(config: SMTPConfig): SMTPConnection {
  const connection = createConnection(config.port, config.smtp);

  let error: Error | null = null;
  let buffer = "";
  let lines: string[] = [];
  let state: "pending" | "ready" | "error" = "pending";

  const event = new EventEmitter();

  const waitResponse = (): Promise<Response> =>
    new Promise((resolve, reject) => {
      if (state === "error") {
        state = "pending";

        reject(error);
        error = null;
        return;
      }

      if (state === "ready") {
        const r = [...lines].filter(Boolean);
        lines = [];
        state = "pending";

        // Connection closed (connection.end)
        const code = r.at(-1)?.substring(0, 3) ?? "421";

        resolve({
          code: code as IResponseCode,
          message: r.length === 0 ? ["No response"] : r,
        });

        return;
      }

      event.once("update", () => {
        waitResponse().then(resolve, reject);
      });
    });

  connection.setEncoding("utf8");

  connection.setTimeout(10_000, () => {
    connection.destroy();
    error = new Error("connection timeout");
    state = "error";
    event.emit("update");
  });

  connection.once("error", (err) => {
    console.error(`Error connecting to SMTP server: ${err}`, config, buffer);
    error = new Error("connection error", { cause: err });
    state = "error";
    event.emit("update");
  });

  connection.once("end", () => {
    state = "ready";
    event.emit("update");
  });

  connection.on("data", (data) => {
    buffer += data.toString();

    if (buffer.endsWith(`\n`)) {
      lines.push(...buffer.split(/\r?\n/));
      buffer = "";

      // Ensure is not multi-line
      if (lines.at(-1)!.charAt(2) !== "-") {
        state = "ready";
        event.emit("update");
      }
    }
  });

  // Welcome banner
  const banner = await waitResponse();

  const write = (str: string) => {
    if (connection.destroyed) {
      throw new Error("Connection closed");
    }
    connection.write(Buffer.from(str + "\r\n", "utf-8"), () => {
      buffer = "";
      lines = [];
    });
  };

  try {
    let cmd = yield banner;

    while (cmd !== "QUIT") {
      switch (cmd) {
        case "EHLO":
          write(`EHLO ${config.fqdn}`);
          break;
        case "MAIL_FROM":
          write("MAIL FROM:<" + config.sender + ">");
          break;
        case "RCPT_TO":
          write(`RCPT TO:<${config.email}>`);
          break;
        case "VRFY":
          write(`VRFY <${config.email}>`);
          break;
        case "RSET":
          write(`RSET`);
          break;
        default:
          throw new Error(`Unknown command: ${cmd}`);
      }
      const response = await waitResponse();

      cmd = yield response;
    }

    write("QUIT\r\n");
    return await waitResponse();
  } catch (err) {
    write("QUIT\r\n");
    throw err;
  }
}

export type ERROR_RESULT = {
  success: false;
  message: string;
  code: IResponseCode;
  cmd: SMTP_COMMAND;
};

export type ELHO_RESULT = {
  success: true;
  extensions: {
    STARTTLS: boolean;
    SMTPUTF8: boolean;
    ENHANCEDSTATUSCODES: boolean;
    DSN: boolean;
    "8BITMIME": boolean;
    PIPELINING: boolean;
    AUTH: Array<"PLAIN" | "LOGIN" | "CRAM-MD5" | "XOAUTH2">;
  };
};

export async function sayEhlo(connection: SMTPConnection): Promise<ELHO_RESULT | ERROR_RESULT> {
  const { value: greetingMessage } = await connection.next(`CONNECT`);

  if (greetingMessage.code !== "220") {
    return {
      success: false,
      message: greetingMessage.message.join("\r\n"),
      code: greetingMessage.code,
      cmd: "CONNECT",
    };
  }

  const { value: elhoResponse } = await connection.next("EHLO");

  if (elhoResponse.code !== "250") {
    return {
      success: false,
      message: elhoResponse.message.join("\r\n"),
      code: elhoResponse.code,
      cmd: "EHLO",
    };
  }

  const result: ELHO_RESULT = {
    success: true,
    extensions: {
      STARTTLS: elhoResponse.message.some((str) => /250[ -]STARTTLS\b/i.test(str)),
      ENHANCEDSTATUSCODES: elhoResponse.message.some((str) => /250[ -]ENHANCEDSTATUSCODES\b/i.test(str)),
      SMTPUTF8: elhoResponse.message.some((str) => /250[ -]SMTPUTF8\b/i.test(str)),
      DSN: elhoResponse.message.some((str) => /250[ -]DSN\b/i.test(str)),
      "8BITMIME": elhoResponse.message.some((str) => /250[ -]8BITMIME\b/i.test(str)),
      PIPELINING: elhoResponse.message.some((str) => /250[ -]PIPELINING\b/i.test(str)),
      AUTH: [],
    },
  };

  if (elhoResponse.message.some((str) => /[ -]AUTH(?:(\s+|=)[^\n]*\s+|\s+|=)PLAIN/i.test(str))) {
    result.extensions.AUTH.push("PLAIN");
  }

  if (elhoResponse.message.some((str) => /[ -]AUTH(?:(\s+|=)[^\n]*\s+|\s+|=)LOGIN/i.test(str))) {
    result.extensions.AUTH.push("LOGIN");
  }

  if (elhoResponse.message.some((str) => /[ -]AUTH(?:(\s+|=)[^\n]*\s+|\s+|=)CRAM-MD5/i.test(str))) {
    result.extensions.AUTH.push("CRAM-MD5");
  }

  if (elhoResponse.message.some((str) => /[ -]AUTH(?:(\s+|=)[^\n]*\s+|\s+|=)XOAUTH2/i.test(str))) {
    result.extensions.AUTH.push("XOAUTH2");
  }

  return result;
}

export type VRFY_RESULT = {
  success: true;
  status: "valid" | "invalid" | "not_supported";
  message: string;
  code: IResponseCode;
  cmd: SMTP_COMMAND;
};

function isVrfySupported(
  res: Response,
  cmd: SMTP_COMMAND,
  extensions: ELHO_RESULT["extensions"]
): VRFY_RESULT | ERROR_RESULT {
  const message = res.message.join("\r\n");
  const code = res.code;

  // Not implemented or not supported
  if (res.code === "252" || res.code === "502") {
    return {
      success: true,
      status: "not_supported",
      code,
      message,
      cmd,
    };
  }

  if (extensions.ENHANCEDSTATUSCODES) {
    // https://www.iana.org/assignments/smtp-enhanced-status-codes/smtp-enhanced-status-codes.xhtml
    const matches = res.message.at(-1)?.match(/^\d{3} (?<class>[245])\.(?<subject>\d+)\.(?<detail>\d+)/);
    if (matches) {
      const { class: c, subject, detail } = matches.groups!;

      if (c === "2") {
        return {
          success: true,
          status: "valid",
          code,
          message,
          cmd,
        };
      }

      switch (subject) {
        case "1": {
          // Sender address invalid
          if (["7", "8", "9"].includes(detail)) {
            return {
              success: false,
              code,
              message,
              cmd,
            };
          }

          return {
            success: true,
            status: "invalid",
            code,
            message,
            cmd,
          };
        }
        case "2":
          return {
            success: true,
            status: "invalid",
            code,
            message,
            cmd,
          };
        default:
          return {
            success: false,
            code,
            message,
            cmd,
          };
      }
    }
  }

  if (res.code === "251") {
    return {
      success: true,
      status: "not_supported",
      code,
      message,
      cmd,
    };
  }

  if (res.code === "250") {
    return {
      success: true,
      status: "valid",
      code,
      message,
      cmd,
    };
  }

  if (res.code === "552" || res.code === "553") {
    return {
      success: true,
      status: "invalid",
      code,
      message,
      cmd,
    };
  }

  return {
    success: false,
    code,
    message,
    cmd,
  };
}

export async function vrfy(
  connection: SMTPConnection,
  extensions: ELHO_RESULT["extensions"]
): Promise<VRFY_RESULT | ERROR_RESULT> {
  const { value } = await connection.next("VRFY");
  const result = isVrfySupported(value, "VRFY", extensions);

  return result;
}

export async function vrfyWorkaround(
  connection: SMTPConnection,
  extensions: ELHO_RESULT["extensions"]
): Promise<VRFY_RESULT | ERROR_RESULT> {
  const { value: mailFromRes } = await connection.next("MAIL_FROM");

  const resultMailFrom = isVrfySupported(mailFromRes, "MAIL_FROM", extensions);

  if (!resultMailFrom.success || resultMailFrom.status !== "valid") {
    return resultMailFrom;
  }

  const { value: rcptToRes } = await connection.next("RCPT_TO");
  const result = isVrfySupported(rcptToRes, "RCPT_TO", extensions);

  return result;
}

export async function quit(connection: SMTPConnection): Promise<void> {
  await connection.next("QUIT");
}
