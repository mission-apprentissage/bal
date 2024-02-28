import { differenceInYears, parseISO } from "date-fns";

export const caclAgeAtDate = (dateNaissanceString: string, dateString: string) => {
  const dateNaissance = parseISO(dateNaissanceString);
  const dateObj = parseISO(dateString);

  // Note: differenceInYears already gives a whole number
  const years = differenceInYears(dateObj, dateNaissance);
  const age = years > 0 ? years : 0;

  return {
    age,
    exactAge: age, // since differenceInYears already returns a whole number
  };
};
