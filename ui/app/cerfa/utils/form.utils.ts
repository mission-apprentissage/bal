import { differenceInYears, parseISO } from "date-fns";

// luxon
// export const caclAgeAtDate = (dateNaissanceString: string, dateString: string) => {
//   const dateNaissance = DateTime.fromISO(dateNaissanceString).setLocale("fr-FR");
//   const dateObj = DateTime.fromISO(dateString).setLocale("fr-FR");
//   const diffInYears = dateObj.diff(dateNaissance, "years");
//   const { years } = diffInYears.toObject();
//   const age = years ? Math.floor(years) : 0;
//   return {
//     age,
//     exactAge: years,
//   };
// };

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
