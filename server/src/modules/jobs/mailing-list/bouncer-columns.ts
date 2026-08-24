import type { BouncerPingResult } from "shared/models/bouncer.email.model"

// Les réponses SMTP multi-lignes (jointes en \r\n dans smtpConnection) cassent le parsing
// des CSV en aval (tableurs, imports) : on les aplatit à l'écriture dans les colonnes de sortie
function sanitizeSmtpMessage(value: string | null): string {
  return (value ?? "").replace(/\r?\n/g, " | ")
}

export function toBounceColumns(ping: BouncerPingResult): Record<string, string> {
  return {
    bounce_status: ping.status,
    bounce_message: sanitizeSmtpMessage(ping.message),
    bounce_response_code: ping.responseCode ?? "",
    bounce_response_message: sanitizeSmtpMessage(ping.responseMessage),
  }
}
