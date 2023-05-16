import { format, parseISO } from "date-fns";
import fr from "date-fns/locale/fr";

export const prettyPrintDate = (date: string) => {
  const event = new Date(date);
  const options = {
    hour: "2-digit" as const,
    minute: "2-digit" as const,
    year: "numeric" as const,
    month: "short" as const,
    day: "numeric" as const,
  };

  return event.toLocaleDateString("fr-FR", options);
};

export const formatDate = (date: string, dateFormat = "dd/MM/yyyy") => {
  return format(parseISO(date), dateFormat, {
    locale: fr,
  });
};
