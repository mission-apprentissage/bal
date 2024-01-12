import { addDays, format, getMonth, getYear, parse, parseISO, setDay, setMonth, subDays } from "date-fns";
import addYears from "date-fns/addYears";
import { fr } from "date-fns/locale";

const parseDate = (date: string): Date => {
  return parse(date, "P", new Date(), { locale: fr });
};

const LATEST_AVAILABLE_SMIC_YEAR = 2024;

const SMICs = {
  2024: {
    smics: [
      {
        annee: 2024,
        mensuel: 1766.92,
        horaire: 11.65,
        heuresHebdomadaires: 35,
        minimumGaranti: 4.15,
        dateEntreeEnVigueur: "01/01/2024",
        dateEntreeEnVigueurObj: parseDate("01/01/2024"),
        dateParutionJo: "21/12/2023",
        dateParutionJoObj: parseDate("21/12/2023"),
        exceptions: {
          976: {
            departement: 976,
            nomDepartement: "Mayotte",
            mensuel: 1334.67,
            horaire: 8.8,
            heuresHebdomadaires: 35,
          },
        },
      },
    ],
  },
  2023: {
    smics: [
      {
        annee: 2023,
        mensuel: 1747.2,
        horaire: 11.52,
        heuresHebdomadaires: 35,
        minimumGaranti: 4.1,
        dateEntreeEnVigueur: "01/05/2023",
        dateEntreeEnVigueurObj: parseDate("01/05/2023"),
        dateParutionJo: "27/04/2023",
        dateParutionJoObj: parseDate("27/04/2023"),
        exceptions: {
          976: {
            departement: 976,
            nomDepartement: "Mayotte",
            mensuel: 1319.5,
            horaire: 8.7,
            heuresHebdomadaires: 35,
          },
        },
      },
      {
        annee: 2023,
        mensuel: 1709.28,
        horaire: 11.27,
        heuresHebdomadaires: 35,
        minimumGaranti: 4.01,
        dateEntreeEnVigueur: "01/01/2023",
        dateEntreeEnVigueurObj: parseDate("01/01/2023"),
        dateParutionJo: "23/12/2022",
        dateParutionJoObj: parseDate("23/12/2022"),
        exceptions: {
          976: {
            departement: 976,
            nomDepartement: "Mayotte",
            mensuel: 1290.68,
            horaire: 8.51,
            heuresHebdomadaires: 35,
          },
        },
      },
    ],
  },
  2022: {
    smics: [
      {
        annee: 2022,
        mensuel: 1678.95,
        horaire: 11.07,
        heuresHebdomadaires: 35,
        minimumGaranti: 3.94,
        dateEntreeEnVigueur: "01/08/2022",
        dateEntreeEnVigueurObj: parseDate("01/08/2022"),
        dateParutionJo: "29/07/2022",
        dateParutionJoObj: parseDate("29/07/2022"),
        exceptions: {
          976: {
            departement: 976,
            nomDepartement: "Mayotte",
            mensuel: 1266.42,
            horaire: 8.35,
            heuresHebdomadaires: 35,
          },
        },
      },
      {
        annee: 2022,
        mensuel: 1645.58,
        horaire: 10.85,
        heuresHebdomadaires: 35,
        minimumGaranti: 3.86,
        dateEntreeEnVigueur: "01/05/2022",
        dateEntreeEnVigueurObj: parseDate("01/05/2022"),
        dateParutionJo: "20/04/2022",
        dateParutionJoObj: parseDate("20/04/2022"),
        exceptions: {
          976: {
            departement: 976,
            nomDepartement: "Mayotte",
            mensuel: 1242.15,
            horaire: 8.19,
            heuresHebdomadaires: 35,
          },
        },
      },
      {
        annee: 2022,
        mensuel: 1603.12,
        horaire: 10.57,
        heuresHebdomadaires: 35,
        minimumGaranti: 3.76,
        dateEntreeEnVigueur: "01/01/2022",
        dateEntreeEnVigueurObj: parseDate("01/01/2022"),
        dateParutionJo: "22/12/2021",
        dateParutionJoObj: parseDate("22/12/2021"),
        exceptions: {
          976: {
            departement: 976,
            nomDepartement: "Mayotte",
            mensuel: 1210.3,
            horaire: 7.98,
            heuresHebdomadaires: 35,
          },
        },
      },
    ],
  },
  2021: {
    smics: [
      {
        annee: 2021,
        mensuel: 1589.47,
        horaire: 10.48,
        heuresHebdomadaires: 35,
        minimumGaranti: 3.73,
        dateEntreeEnVigueur: "01/10/2021",
        dateEntreeEnVigueurObj: parseDate("01/10/2021"),
        dateParutionJo: "30/09/2021",
        dateParutionJoObj: parseDate("30/09/2021"),
        exceptions: {
          976: {
            departement: 976,
            nomDepartement: "Mayotte",
            mensuel: 1199.08,
            horaire: 7.91,
            heuresHebdomadaires: 35,
          },
        },
      },
      {
        annee: 2021,
        mensuel: 1554.58,
        horaire: 10.25,
        heuresHebdomadaires: 35,
        minimumGaranti: 3.65,
        dateEntreeEnVigueur: "01/01/2021",
        dateEntreeEnVigueurObj: parseDate("01/01/2021"),
        dateParutionJo: "17/12/2020",
        dateParutionJoObj: parseDate("17/12/2020"),
        exceptions: {
          976: {
            departement: 976,
            nomDepartement: "Mayotte",
            mensuel: 1173.27,
            horaire: 7.74,
            heuresHebdomadaires: 35,
          },
        },
      },
    ],
  },
  2020: {
    smics: [
      {
        annee: 2020,
        mensuel: 1539.42,
        horaire: 10.15,
        heuresHebdomadaires: 35,
        minimumGaranti: 3.65,
        dateEntreeEnVigueur: "01/01/2020",
        dateEntreeEnVigueurObj: parseDate("01/01/2020"),
        dateParutionJo: "19/12/2019",
        dateParutionJoObj: parseDate("19/12/2019"),
        exceptions: {
          976: {
            departement: 976,
            nomDepartement: "Mayotte",
            mensuel: 1161.77,
            horaire: 7.66,
            heuresHebdomadaires: 35,
          },
        },
      },
    ],
  },
  2019: {
    smics: [
      {
        annee: 2019,
        mensuel: 1521.22,
        horaire: 10.03,
        heuresHebdomadaires: 35,
        minimumGaranti: 3.62,
        dateEntreeEnVigueur: "01/01/2019",
        dateEntreeEnVigueurObj: parseDate("01/01/2019"),
        dateParutionJo: "20/12/2018",
        dateParutionJoObj: parseDate("20/12/2018"),
        exceptions: {
          976: {
            departement: 976,
            nomDepartement: "Mayotte",
            mensuel: 1148.12,
            horaire: 7.57,
            heuresHebdomadaires: 35,
          },
        },
      },
    ],
  },
  2018: {
    smics: [
      {
        annee: 2018,
        mensuel: 1498.47,
        horaire: 9.88,
        heuresHebdomadaires: 35,
        minimumGaranti: 3.57,
        dateEntreeEnVigueur: "01/01/2018",
        dateEntreeEnVigueurObj: parseDate("01/01/2018"),
        dateParutionJo: "21/12/2017",
        dateParutionJoObj: parseDate("21/12/2017"),
        exceptions: {
          976: {
            departement: 976,
            nomDepartement: "Mayotte",
            mensuel: 1131.43, //  1260.74
            horaire: 7.46,
            heuresHebdomadaires: 35, // 39
          },
        },
      },
    ],
  },
};

const findSmicAtDate = (lookupDate: Date) => {
  const lookupYear = lookupDate.getFullYear() as keyof typeof SMICs;

  if (!SMICs[lookupYear]) {
    return SMICs[LATEST_AVAILABLE_SMIC_YEAR].smics[0]; // latest smic
  }

  const smicsArray = SMICs[lookupYear].smics;

  return smicsArray.find((smicObj) => lookupDate >= smicObj.dateEntreeEnVigueurObj) ?? smicsArray[0];
};

const ceilUp = (x: number) => Math.ceil(x * 100) / 100;

export const buildRemuneration = (data) => {
  const selectedTaux = data.selectedTaux ?? {};
  const dateDebutContrat = parseISO(data.dateDebutContrat);
  const dateFinContrat = parseISO(data.dateFinContrat);
  const apprentiDateNaissance = parseISO(data.apprentiDateNaissance);
  const isAnniversaireInLastMonth = getMonth(dateFinContrat) === getMonth(apprentiDateNaissance);

  const dateFinA1 = subDays(addYears(dateDebutContrat, 1), 1);
  const dateDebutA2 = addYears(dateDebutContrat, 1);
  const dateFinA2 = subDays(addYears(dateDebutA2, 1), 1);
  const dateDebutA3 = addDays(dateDebutA2, 1);
  const dateFinA3 = subDays(addYears(dateDebutA3, 1), 1);
  const dateDebutA4 = addDays(dateDebutA3, 1);

  const ageA1 = Math.floor(data.apprentiAge);
  const anniversaireA1 = addYears(apprentiDateNaissance, ageA1 + 1);
  const ageA2 = ageA1 + 1;
  const anniversaireA2 = addDays(anniversaireA1, 1);
  const ageA3 = ageA2 + 1;
  const anniversaireA3 = addDays(anniversaireA2, 1);
  const ageA4 = ageA3 + 1;
  const anniversaireA4 = addDays(anniversaireA3, 1);
  const ageA5 = ageA4 + 1;

  // Kept for debug
  // console.log([
  //   { date: apprentiDateNaissance.toFormat("yyyy-MM-dd"), age: ageA1 },
  //   { date: anniversaireA1.toFormat("yyyy-MM-dd"), age: ageA2 },
  //   { date: anniversaireA2.toFormat("yyyy-MM-dd"), age: ageA3 },
  //   { date: anniversaireA3.toFormat("yyyy-MM-dd"), age: ageA4 },
  // ]);

  const smicObj = findSmicAtDate(dateDebutContrat);
  let SMIC = smicObj.mensuel;
  const departementEmployeur: keyof (typeof SMICs)[2020]["smics"][0]["exceptions"] = data.employeurAdresseDepartement;
  let isSmicException = false;
  if (smicObj?.exceptions?.[departementEmployeur]) {
    SMIC = smicObj.exceptions[departementEmployeur].mensuel;
    isSmicException = true;
  }

  const seuils = [17, 18, 21, 26];
  const getSeuils = (age) => {
    if (age <= seuils[0]) return 0;
    if (age >= seuils[1] && age < seuils[2]) return 1;
    if (age >= seuils[2] && age < seuils[3]) return 2;
    if (age >= seuils[3]) return 3;
  };

  const taux = {
    a1: {
      0: 27,
      1: 43,
      2: 53,
      3: 100,
    },
    a2: {
      0: 39,
      1: 51,
      2: 61,
      3: 100,
    },
    a3: {
      0: 55,
      1: 67,
      2: 78,
      3: 100,
    },
    a4: {
      0: 55,
      1: 67,
      2: 78,
      3: 100,
    },
  };

  const isChangingTaux = (currentAge, nextAge) => {
    // @ts-expect-error: todo
    return getSeuils(nextAge) > getSeuils(currentAge);
  };

  const getTaux = (part, tauxValue) => Math.max(selectedTaux?.[part] ?? 0, tauxValue);

  let finRemuneration = false;
  const emptyLineObj = {
    dateDebut: "",
    dateFin: "",
    taux: 0,
    tauxMinimal: 0,
    typeSalaire: "SMIC",
    salaireBrut: 0,
  };

  let result1 = {
    11: emptyLineObj,
    12: emptyLineObj,
  };
  // @ts-expect-error: todo
  const taux11 = taux.a1[getSeuils(ageA1)];
  // @ts-expect-error: todo
  const taux12 = taux.a1[getSeuils(ageA2)];
  const selectedTaux11 = getTaux(1.1, taux11);
  const selectedTaux12 = getTaux(1.2, taux12);
  if (isChangingTaux(ageA1, ageA2) && !(isAnniversaireInLastMonth && getYear(dateFinContrat) === getYear(dateFinA1))) {
    const dateDebut12 = setMonth(setDay(anniversaireA1, 1), getMonth(anniversaireA1) + 1);
    const dateFin11 = subDays(dateDebut12, 1);

    if (dateFin11 >= dateFinContrat) {
      finRemuneration = true;
      result1 = {
        11: {
          dateDebut: format(dateDebutContrat, "yyyy-MM-dd"),
          dateFin: format(dateFinContrat, "yyyy-MM-dd"),
          taux: selectedTaux11,
          tauxMinimal: taux11,
          typeSalaire: "SMIC",
          salaireBrut: ceilUp((SMIC * selectedTaux11) / 100),
        },
        12: emptyLineObj,
      };
    } else if (dateFinA1 >= dateFinContrat) {
      finRemuneration = true;
      result1 = {
        11: {
          dateDebut: format(dateDebutContrat, "yyyy-MM-dd"),
          dateFin: format(dateFin11, "yyyy-MM-dd"),
          taux: selectedTaux11,
          tauxMinimal: taux11,
          typeSalaire: "SMIC",
          salaireBrut: ceilUp((SMIC * selectedTaux11) / 100),
        },
        12: {
          dateDebut: format(dateDebut12, "yyyy-MM-dd"),
          dateFin: format(dateFinContrat, "yyyy-MM-dd"),
          taux: selectedTaux12,
          tauxMinimal: taux12,
          typeSalaire: "SMIC",
          salaireBrut: ceilUp((SMIC * selectedTaux12) / 100),
        },
      };
    } else {
      result1 = {
        11: {
          dateDebut: format(dateDebutContrat, "yyyy-MM-dd"),
          dateFin: format(dateFin11, "yyyy-MM-dd"),
          taux: selectedTaux11,
          tauxMinimal: taux11,
          typeSalaire: "SMIC",
          salaireBrut: ceilUp((SMIC * selectedTaux11) / 100),
        },
        12: {
          dateDebut: format(dateDebut12, "yyyy-MM-dd"),
          dateFin: format(dateFinA1, "yyyy-MM-dd"),
          taux: selectedTaux12,
          tauxMinimal: taux12,
          typeSalaire: "SMIC",
          salaireBrut: ceilUp((SMIC * selectedTaux12) / 100),
        },
      };
    }
  } else {
    if (dateFinA1 >= dateFinContrat) {
      finRemuneration = true;
      result1 = {
        11: {
          dateDebut: format(dateDebutContrat, "yyyy-MM-dd"),
          dateFin: format(dateFinContrat, "yyyy-MM-dd"),
          taux: selectedTaux11,
          tauxMinimal: taux11,
          typeSalaire: "SMIC",
          salaireBrut: ceilUp((SMIC * selectedTaux11) / 100),
        },
        12: emptyLineObj,
      };
    } else {
      result1 = {
        11: {
          dateDebut: format(dateDebutContrat, "yyyy-MM-dd"),
          dateFin: format(dateFinA1, "yyyy-MM-dd"),
          taux: selectedTaux11,
          tauxMinimal: taux11,
          typeSalaire: "SMIC",
          salaireBrut: ceilUp((SMIC * selectedTaux11) / 100),
        },
        12: emptyLineObj,
      };
    }
  }

  let result2 = {
    21: emptyLineObj,
    22: emptyLineObj,
  };

  // @ts-expect-error: todo
  const taux21 = taux.a2[getSeuils(ageA2)];
  // @ts-expect-error: todo
  const taux22 = taux.a2[getSeuils(ageA3)];
  const selectedTaux21 = getTaux(2.1, taux21);
  const selectedTaux22 = getTaux(2.2, taux22);
  if (
    isChangingTaux(ageA2, ageA3) &&
    !finRemuneration &&
    !(isAnniversaireInLastMonth && getYear(dateFinContrat) === getYear(dateFinA2))
  ) {
    const dateDebut22 = setMonth(setDay(anniversaireA2, 1), getMonth(anniversaireA2) + 1);
    const dateFin21 = subDays(dateDebut22, 1);

    if (dateFin21 >= dateFinContrat) {
      finRemuneration = true;
      result2 = {
        21: {
          dateDebut: format(dateDebutA2, "yyyy-MM-dd"),
          dateFin: format(dateFinContrat, "yyyy-MM-dd"),
          taux: selectedTaux21,
          tauxMinimal: taux21,
          typeSalaire: "SMIC",
          salaireBrut: ceilUp((SMIC * selectedTaux21) / 100),
        },
        22: emptyLineObj,
      };
    } else if (dateFinA2 >= dateFinContrat) {
      finRemuneration = true;
      result2 = {
        21: {
          dateDebut: format(dateDebutA2, "yyyy-MM-dd"),
          dateFin: format(dateFin21, "yyyy-MM-dd"),
          taux: selectedTaux21,
          tauxMinimal: taux21,
          typeSalaire: "SMIC",
          salaireBrut: ceilUp((SMIC * selectedTaux21) / 100),
        },
        22: {
          dateDebut: format(dateDebut22, "yyyy-MM-dd"),
          dateFin: format(dateFinContrat, "yyyy-MM-dd"),
          taux: selectedTaux22,
          tauxMinimal: taux22,
          typeSalaire: "SMIC",
          salaireBrut: ceilUp((SMIC * selectedTaux22) / 100),
        },
      };
    } else {
      result2 = {
        21: {
          dateDebut: format(dateDebutA2, "yyyy-MM-dd"),
          dateFin: format(dateFin21, "yyyy-MM-dd"),
          taux: selectedTaux21,
          tauxMinimal: taux21,
          typeSalaire: "SMIC",
          salaireBrut: ceilUp((SMIC * selectedTaux21) / 100),
        },
        22: {
          dateDebut: format(dateDebut22, "yyyy-MM-dd"),
          dateFin: format(dateFinA2, "yyyy-MM-dd"),
          taux: selectedTaux22,
          tauxMinimal: taux22,
          typeSalaire: "SMIC",
          salaireBrut: ceilUp((SMIC * selectedTaux22) / 100),
        },
      };
    }
  } else if (!finRemuneration) {
    if (dateFinA2 >= dateFinContrat) {
      finRemuneration = true;
      result2 = {
        21: {
          dateDebut: format(dateDebutA2, "yyyy-MM-dd"),
          dateFin: format(dateFinContrat, "yyyy-MM-dd"),
          taux: selectedTaux21,
          tauxMinimal: taux21,
          typeSalaire: "SMIC",
          salaireBrut: ceilUp((SMIC * selectedTaux21) / 100),
        },
        22: emptyLineObj,
      };
    } else {
      result2 = {
        21: {
          dateDebut: format(dateDebutA2, "yyyy-MM-dd"),
          dateFin: format(dateFinA2, "yyyy-MM-dd"),
          taux: selectedTaux21,
          tauxMinimal: taux21,
          typeSalaire: "SMIC",
          salaireBrut: ceilUp((SMIC * selectedTaux21) / 100),
        },
        22: emptyLineObj,
      };
    }
  }

  let result3 = {
    31: emptyLineObj,
    32: emptyLineObj,
  };
  // @ts-expect-error: todo
  const taux31 = taux.a3[getSeuils(ageA3)];
  // @ts-expect-error: todo
  const taux32 = taux.a3[getSeuils(ageA4)];
  const selectedTaux31 = getTaux(3.1, taux31);
  const selectedTaux32 = getTaux(3.2, taux32);
  if (
    isChangingTaux(ageA3, ageA4) &&
    !finRemuneration &&
    !(isAnniversaireInLastMonth && getYear(dateFinContrat) === getYear(dateFinA3))
  ) {
    const dateDebut32 = setMonth(setDay(anniversaireA3, 1), getMonth(anniversaireA3) + 1);
    const dateFin31 = subDays(dateDebut32, 1);

    if (dateFin31 >= dateFinContrat) {
      finRemuneration = true;
      result3 = {
        31: {
          dateDebut: format(dateDebutA3, "yyyy-MM-dd"),
          dateFin: format(dateFinContrat, "yyyy-MM-dd"),
          taux: selectedTaux31,
          tauxMinimal: taux31,
          typeSalaire: "SMIC",
          salaireBrut: ceilUp((SMIC * selectedTaux31) / 100),
        },
        32: emptyLineObj,
      };
    } else if (dateFinA3 >= dateFinContrat) {
      finRemuneration = true;
      result3 = {
        31: {
          dateDebut: format(dateDebutA3, "yyyy-MM-dd"),
          dateFin: format(dateFin31, "yyyy-MM-dd"),
          taux: selectedTaux31,
          tauxMinimal: taux31,
          typeSalaire: "SMIC",
          salaireBrut: ceilUp((SMIC * selectedTaux31) / 100),
        },
        32: {
          dateDebut: format(dateDebut32, "yyyy-MM-dd"),
          dateFin: format(dateFinContrat, "yyyy-MM-dd"),
          taux: selectedTaux32,
          tauxMinimal: taux32,
          typeSalaire: "SMIC",
          salaireBrut: ceilUp((SMIC * selectedTaux32) / 100),
        },
      };
    } else {
      result3 = {
        31: {
          dateDebut: format(dateDebutA3, "yyyy-MM-dd"),
          dateFin: format(dateFin31, "yyyy-MM-dd"),
          taux: selectedTaux31,
          tauxMinimal: taux31,
          typeSalaire: "SMIC",
          salaireBrut: ceilUp((SMIC * selectedTaux31) / 100),
        },
        32: {
          dateDebut: format(dateDebut32, "yyyy-MM-dd"),
          dateFin: format(dateFinA3, "yyyy-MM-dd"),
          taux: selectedTaux32,
          tauxMinimal: taux32,
          typeSalaire: "SMIC",
          salaireBrut: ceilUp((SMIC * selectedTaux32) / 100),
        },
      };
    }
  } else if (!finRemuneration) {
    if (dateFinA3 >= dateFinContrat) {
      finRemuneration = true;
      result3 = {
        31: {
          dateDebut: format(dateDebutA3, "yyyy-MM-dd"),
          dateFin: format(dateFinContrat, "yyyy-MM-dd"),
          taux: selectedTaux31,
          tauxMinimal: taux31,
          typeSalaire: "SMIC",
          salaireBrut: ceilUp((SMIC * selectedTaux31) / 100),
        },
        32: emptyLineObj,
      };
    } else {
      result3 = {
        31: {
          dateDebut: format(dateDebutA3, "yyyy-MM-dd"),
          dateFin: format(dateFinA3, "yyyy-MM-dd"),
          taux: selectedTaux31,
          tauxMinimal: taux31,
          typeSalaire: "SMIC",
          salaireBrut: ceilUp((SMIC * selectedTaux31) / 100),
        },
        32: emptyLineObj,
      };
    }
  }

  let result4 = {
    41: emptyLineObj,
    42: emptyLineObj,
  };
  // @ts-expect-error: todo
  const taux41 = taux.a4[getSeuils(ageA4)];
  // @ts-expect-error: todo
  const taux42 = taux.a4[getSeuils(ageA5)];
  const selectedTaux41 = getTaux(4.1, taux41);
  const selectedTaux42 = getTaux(4.2, taux42);

  if (isChangingTaux(ageA4, ageA5) && !finRemuneration && !isAnniversaireInLastMonth) {
    const dateDebut42 = setMonth(setDay(anniversaireA4, 1), getMonth(anniversaireA4) + 1);
    const dateFin41 = subDays(dateDebut42, 1);

    if (dateFin41 >= dateFinContrat) {
      finRemuneration = true;
      result4 = {
        41: {
          dateDebut: format(dateDebutA4, "yyyy-MM-dd"),
          dateFin: format(dateFinContrat, "yyyy-MM-dd"),
          taux: selectedTaux41,
          tauxMinimal: taux41,
          typeSalaire: "SMIC",
          salaireBrut: ceilUp((SMIC * selectedTaux41) / 100),
        },
        42: emptyLineObj,
      };
    } else {
      result4 = {
        41: {
          dateDebut: format(dateDebutA4, "yyyy-MM-dd"),
          dateFin: format(dateFin41, "yyyy-MM-dd"),
          taux: selectedTaux41,
          tauxMinimal: taux41,
          typeSalaire: "SMIC",
          salaireBrut: ceilUp((SMIC * selectedTaux41) / 100),
        },
        42: {
          dateDebut: format(dateDebut42, "yyyy-MM-dd"),
          dateFin: format(dateFinContrat, "yyyy-MM-dd"),
          taux: selectedTaux42,
          tauxMinimal: taux42,
          typeSalaire: "SMIC",
          salaireBrut: ceilUp((SMIC * selectedTaux42) / 100),
        },
      };
    }
  } else if (!finRemuneration) {
    result4 = {
      41: {
        dateDebut: format(dateDebutA4, "yyyy-MM-dd"),
        dateFin: format(dateFinContrat, "yyyy-MM-dd"),
        taux: selectedTaux41,
        tauxMinimal: taux41,
        typeSalaire: "SMIC",
        salaireBrut: ceilUp((SMIC * selectedTaux41) / 100),
      },
      42: emptyLineObj,
    };
  }

  const buildBlock2 = (part: number, result) =>
    result[part].taux
      ? {
          dateDebut: result[part].dateDebut,
          dateFin: result[part].dateFin,
          taux: result[part].taux,
          tauxMinimal: result[part].tauxMinimal,
          typeSalaire: result[part].typeSalaire,
          salaireBrut: ceilUp(result[part].salaireBrut),
          ordre: `${part.toString()[0]}.${part.toString()[1]}`,
        }
      : undefined;

  const remunerationsAnnuelles = [
    buildBlock2(11, result1),
    buildBlock2(12, result1),
    buildBlock2(21, result2),
    buildBlock2(22, result2),
    buildBlock2(31, result3),
    buildBlock2(32, result3),
    buildBlock2(41, result4),
    buildBlock2(42, result4),
  ].filter((item) => item);

  return {
    remunerationsAnnuelles,
    // @ts-expect-error: todo
    salaireEmbauche: remunerationsAnnuelles[0].salaireBrut,
    smicObj: {
      ...smicObj,
      isSmicException,
      selectedSmic: SMIC,
    },
  };
};
