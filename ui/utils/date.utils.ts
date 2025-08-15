import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";

export const formatDate = (date: string, dateFormat = "dd/MM/yyyy") => {
  return format(parseISO(date), dateFormat, {
    locale: fr,
  });
};
