import {
  addYears,
  format,
  formatISO,
  getMonth,
  getYear,
  isBefore,
  parseISO,
  setDate,
  setMonth,
  subDays,
} from "date-fns";

const LATEST_SMIC_YEAR = 2022;

const SMICs = {
  2022: {
    smics: [
      {
        annee: 2022,
        mensuel: 1645.58,
        horaire: 10.85,
        heuresHebdomadaires: 35,
        minimumGaranti: 3.86,
        dateEntreeEnVigueur: "01/05/2022",
        dateEntreeEnVigueurObj: parseISO("01/05/2022"),
        dateParutionJo: "20/04/2022",
        dateParutionJoObj: parseISO("20/04/2022"),
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
        dateEntreeEnVigueurObj: parseISO("01/01/2022"),
        dateParutionJo: "22/12/2021",
        dateParutionJoObj: parseISO("22/12/2021"),
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
        dateEntreeEnVigueurObj: parseISO("01/10/2021"),
        dateParutionJo: "30/09/2021",
        dateParutionJoObj: parseISO("30/09/2021"),
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
        dateEntreeEnVigueurObj: parseISO("01/01/2021"),
        dateParutionJo: "17/12/2020",
        dateParutionJoObj: parseISO("17/12/2020"),
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
        dateEntreeEnVigueurObj: parseISO("01/01/2020"),
        dateParutionJo: "19/12/2019",
        dateParutionJoObj: parseISO("19/12/2019"),
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
        dateEntreeEnVigueurObj: parseISO("01/01/2019"),
        dateParutionJo: "20/12/2018",
        dateParutionJoObj: parseISO("20/12/2018"),
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
        dateEntreeEnVigueurObj: parseISO("01/01/2018"),
        dateParutionJo: "21/12/2017",
        dateParutionJoObj: parseISO("21/12/2017"),
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
    return SMICs[LATEST_SMIC_YEAR].smics[0]; // latest smic
  }

  const smicsArray = SMICs[lookupYear].smics;

  return smicsArray.find((smicObj) => isBefore(lookupDate, smicObj.dateEntreeEnVigueurObj)) ?? smicsArray[0];
};

const ceilUp = (x: number) => Math.ceil(x * 100) / 100;

export const buildRemuneration = (data: any) => {
  const selectedTaux = data.selectedTaux ?? {};
  const dateDebutContrat = parseISO(data.dateDebutContrat);
  const dateFinContrat = parseISO(data.dateFinContrat);
  const apprentiDateNaissance = parseISO(data.apprentiDateNaissance);
  const isAnniversaireInLastMonth = getMonth(dateFinContrat) === getMonth(apprentiDateNaissance);

  const dateFinA1 = subDays(addYears(dateDebutContrat, 1), 1);
  const dateDebutA2 = addYears(dateDebutContrat, 1);
  const dateFinA2 = subDays(addYears(dateDebutA2, 1), 1);
  const dateDebutA3 = addYears(dateDebutA2, 1);
  const dateFinA3 = subDays(addYears(dateDebutA3, 1), 1);
  const dateDebutA4 = addYears(dateDebutA3, 1);

  const ageA1 = Math.floor(data.apprentiAge);
  const anniversaireA1 = addYears(apprentiDateNaissance, ageA1 + 1);
  const ageA2 = ageA1 + 1;
  const anniversaireA2 = addYears(anniversaireA1, 1);
  const ageA3 = ageA2 + 1;
  const anniversaireA3 = addYears(anniversaireA2, 1);
  const ageA4 = ageA3 + 1;
  const anniversaireA4 = addYears(anniversaireA3, 1);
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
  const departementEmployeur = data.employeurAdresseDepartement;
  let isSmicException = false;
  // @ts-ignore
  if (smicObj.exceptions && smicObj.exceptions[departementEmployeur]) {
    // @ts-ignore
    SMIC = smicObj.exceptions[departementEmployeur].mensuel;
    isSmicException = true;
  }

  const seuils = [17, 18, 21, 26];
  const getSeuils = (age: number) => {
    if (age <= seuils[0]) return 0;
    if (age >= seuils[1] && age < seuils[2]) return 1;
    if (age >= seuils[2] && age < seuils[3]) return 2;
    if (age >= seuils[3]) return 3;
    return 0;
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

  const isChangingTaux = (currentAge: number, nextAge: number) => {
    return getSeuils(nextAge) > getSeuils(currentAge);
  };

  const getTaux = (part: number, tauxValue: number) => Math.max(selectedTaux?.[part] ?? 0, tauxValue);

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
  const taux11 = taux.a1[getSeuils(ageA1)];
  const taux12 = taux.a1[getSeuils(ageA2)];
  const selectedTaux11 = getTaux(1.1, taux11);
  const selectedTaux12 = getTaux(1.2, taux12);
  if (isChangingTaux(ageA1, ageA2) && !(isAnniversaireInLastMonth && getYear(dateFinContrat) === getYear(dateFinA1))) {
    const anniversaireMonth = getMonth(anniversaireA1);
    const dateDebut12 = setMonth(setDate(anniversaireA1, 1), anniversaireMonth + 1);

    const dateFin11 = subDays(dateDebut12, 1);

    if (dateFin11 >= dateFinContrat) {
      finRemuneration = true;
      result1 = {
        11: {
          dateDebut: formatISO(dateDebutContrat),
          dateFin: formatISO(dateFinContrat),
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
          dateDebut: formatISO(dateDebutContrat),
          dateFin: formatISO(dateFin11),
          taux: selectedTaux11,
          tauxMinimal: taux11,
          typeSalaire: "SMIC",
          salaireBrut: ceilUp((SMIC * selectedTaux11) / 100),
        },
        12: {
          dateDebut: formatISO(dateDebut12),
          dateFin: formatISO(dateFinContrat),
          taux: selectedTaux12,
          tauxMinimal: taux12,
          typeSalaire: "SMIC",
          salaireBrut: ceilUp((SMIC * selectedTaux12) / 100),
        },
      };
    } else {
      result1 = {
        11: {
          dateDebut: formatISO(dateDebutContrat),
          dateFin: formatISO(dateFin11),
          taux: selectedTaux11,
          tauxMinimal: taux11,
          typeSalaire: "SMIC",
          salaireBrut: ceilUp((SMIC * selectedTaux11) / 100),
        },
        12: {
          dateDebut: formatISO(dateDebut12),
          dateFin: formatISO(dateFinA1),
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
          dateDebut: formatISO(dateDebutContrat),
          dateFin: formatISO(dateFinContrat),
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

  const taux21 = taux.a2[getSeuils(ageA2)];
  const taux22 = taux.a2[getSeuils(ageA3)];
  const selectedTaux21 = getTaux(2.1, taux21);
  const selectedTaux22 = getTaux(2.2, taux22);
  if (
    isChangingTaux(ageA2, ageA3) &&
    !finRemuneration &&
    !(isAnniversaireInLastMonth && getYear(dateFinContrat) === getYear(dateFinA2))
  ) {
    const anniversaireA2Month = getMonth(anniversaireA2);
    const dateDebut22 = setMonth(setDate(anniversaireA2, 1), anniversaireA2Month + 1);
    const dateFin21 = subDays(dateDebut22, 1);

    if (dateFin21 >= dateFinContrat) {
      finRemuneration = true;
      result2 = {
        21: {
          dateDebut: formatISO(dateDebutA2),
          dateFin: formatISO(dateFinContrat),
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
          dateDebut: formatISO(dateDebutA2),
          dateFin: formatISO(dateFin21),
          taux: selectedTaux21,
          tauxMinimal: taux21,
          typeSalaire: "SMIC",
          salaireBrut: ceilUp((SMIC * selectedTaux21) / 100),
        },
        22: {
          dateDebut: formatISO(dateDebut22),
          dateFin: formatISO(dateFinContrat),
          taux: selectedTaux22,
          tauxMinimal: taux22,
          typeSalaire: "SMIC",
          salaireBrut: ceilUp((SMIC * selectedTaux22) / 100),
        },
      };
    } else {
      result2 = {
        21: {
          dateDebut: formatISO(dateDebutA2),
          dateFin: formatISO(dateFin21),
          taux: selectedTaux21,
          tauxMinimal: taux21,
          typeSalaire: "SMIC",
          salaireBrut: ceilUp((SMIC * selectedTaux21) / 100),
        },
        22: {
          dateDebut: formatISO(dateDebut22),
          dateFin: formatISO(dateFinA2),
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
          dateDebut: formatISO(dateDebutA2),
          dateFin: formatISO(dateFinContrat),
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
          dateDebut: formatISO(dateDebutA2),
          dateFin: formatISO(dateFinA2),
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
  const taux31 = taux.a3[getSeuils(ageA3)];
  const taux32 = taux.a3[getSeuils(ageA4)];
  const selectedTaux31 = getTaux(3.1, taux31);
  const selectedTaux32 = getTaux(3.2, taux32);
  if (
    isChangingTaux(ageA3, ageA4) &&
    !finRemuneration &&
    !(isAnniversaireInLastMonth && getYear(dateFinContrat) === getYear(dateFinA3))
  ) {
    const anniversaireA3Month = getMonth(anniversaireA3);
    const dateDebut32 = setMonth(setDate(anniversaireA3, 1), anniversaireA3Month + 1);
    const dateFin31 = subDays(dateDebut32, 1);

    if (dateFin31 >= dateFinContrat) {
      finRemuneration = true;
      result3 = {
        31: {
          dateDebut: formatISO(dateDebutA3),
          dateFin: formatISO(dateFinContrat),
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
          dateDebut: formatISO(dateDebutA3),
          dateFin: formatISO(dateFin31),
          taux: selectedTaux31,
          tauxMinimal: taux31,
          typeSalaire: "SMIC",
          salaireBrut: ceilUp((SMIC * selectedTaux31) / 100),
        },
        32: {
          dateDebut: formatISO(dateDebut32),
          dateFin: formatISO(dateFinContrat),
          taux: selectedTaux32,
          tauxMinimal: taux32,
          typeSalaire: "SMIC",
          salaireBrut: ceilUp((SMIC * selectedTaux32) / 100),
        },
      };
    } else {
      result3 = {
        31: {
          dateDebut: formatISO(dateDebutA3),
          dateFin: formatISO(dateFin31),
          taux: selectedTaux31,
          tauxMinimal: taux31,
          typeSalaire: "SMIC",
          salaireBrut: ceilUp((SMIC * selectedTaux31) / 100),
        },
        32: {
          dateDebut: formatISO(dateDebut32),
          dateFin: formatISO(dateFinA3),
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
          dateDebut: formatISO(dateDebutA3),
          dateFin: formatISO(dateFinContrat),
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
          dateDebut: formatISO(dateDebutA3),
          dateFin: formatISO(dateFinA3),
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
  const taux41 = taux.a4[getSeuils(ageA4)];
  const taux42 = taux.a4[getSeuils(ageA5)];
  const selectedTaux41 = getTaux(4.1, taux41);
  const selectedTaux42 = getTaux(4.2, taux42);

  if (isChangingTaux(ageA4, ageA5) && !finRemuneration && !isAnniversaireInLastMonth) {
    const anniversaireA4Month = getMonth(anniversaireA4);
    const dateDebut42 = setMonth(setDate(anniversaireA4, 1), anniversaireA4Month + 1);
    const dateFin41 = subDays(dateDebut42, 1);

    if (dateFin41 >= dateFinContrat) {
      finRemuneration = true;
      result4 = {
        41: {
          dateDebut: formatISO(dateDebutA4),
          dateFin: formatISO(dateFinContrat),
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
          dateDebut: formatISO(dateDebutA4),
          dateFin: formatISO(dateFin41),
          taux: selectedTaux41,
          tauxMinimal: taux41,
          typeSalaire: "SMIC",
          salaireBrut: ceilUp((SMIC * selectedTaux41) / 100),
        },
        42: {
          dateDebut: formatISO(dateDebut42),
          dateFin: formatISO(dateFinContrat),
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
        dateDebut: formatISO(dateDebutA4),
        dateFin: formatISO(dateFinContrat),
        taux: selectedTaux41,
        tauxMinimal: taux41,
        typeSalaire: "SMIC",
        salaireBrut: ceilUp((SMIC * selectedTaux41) / 100),
      },
      42: emptyLineObj,
    };
  }

  const buildBlock2 = (part: any, result: any) =>
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
    // @ts-ignore
    salaireEmbauche: remunerationsAnnuelles?.[0].salaireBrut,
    smicObj: {
      ...smicObj,
      isSmicException,
      selectedSmic: SMIC,
    },
  };
};
