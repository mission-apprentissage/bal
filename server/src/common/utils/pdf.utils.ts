import { format } from "date-fns";
// @ts-expect-error: TODO
import { utcToZonedTime } from "date-fns-tz";
import { PDFDocument, PDFFont, rgb, StandardFonts } from "pdf-lib";
import typeVoie from "shared/constants/typeVoie";

const { DateTime } = require("luxon");

type TranformType = "toLowerCase" | "toUpperCase";

const strTransform = (value: string, transformType: TranformType) => value?.[transformType]?.();

const shortenVoie = (value: string, transformType?: TranformType) => {
  if (!transformType) return value;
  const transformedValue = strTransform(value, transformType);
  const matchIndex = typeVoie.findIndex((item) => transformedValue.includes(strTransform(item.libelle, transformType)));

  let replacer = null;
  if (matchIndex !== -1) replacer = typeVoie[matchIndex];
  if (!replacer) return null;

  return transformedValue.trim().replace(strTransform(replacer.libelle, transformType), replacer.code);
};

const splitMultipleLines = (value: string, maxLength: number) => {
  const reg = new RegExp(`.{1,${maxLength}}(\\s|$)`, "g");
  return value.match(reg) ?? [];
};

const convertDate = (value: Date): string | undefined => {
  if (!value) return undefined;

  const timeZone = "Europe/Paris";
  const zonedDate = utcToZonedTime(value, timeZone);
  return format(zonedDate, "dd/MM/yyyy");
};

interface BuildFieldDrawOptions {
  writtingFont?: PDFFont;
  prenom?: string;
}

const formatCourriel = (value: string, options: BuildFieldDrawOptions) => {
  const [user, domain] = value.split("@");
  return [
    { text: user },
    // @ts-expect-error: TODO
    { text: "@", options: { color: rgb(0, 0, 0), x: 25 + options.writtingFont.widthOfTextAtSize(user, 11) } },
    // @ts-expect-error: TODO
    { text: domain, options: { x: 25 + options.writtingFont.widthOfTextAtSize(user + "@", 11) } },
  ];
};

interface TextOption {
  text: string;
  options: {
    y: number;
  };
}

interface BaseFieldPosition {
  x: number | ((value: any, options?: BuildFieldDrawOptions) => Promise<number>);
  y?: number;
  maxLength?: number;
  title?: (value: any, options?: BuildFieldDrawOptions) => Promise<string | TextOption[]>;
  defaultSize?: number;
}

type NestedField = { [key: string]: NestedField | BaseFieldPosition };

interface Remuneration {
  dateDebut: BaseFieldPosition;
  dateFin: BaseFieldPosition;
  taux: BaseFieldPosition;
  typeSalaire: BaseFieldPosition;
}

type RemunerationsAnnuelles = Record<string, Remuneration>;
// @ts-expect-error: TODO
const fieldsPositions: NestedField = {
  employeur: {
    denomination: {
      x: 25,
      title: (value: string) => {
        const newValue = value.toLowerCase();

        const result = [];
        const maxLine = 2;
        const maxCharacters = 45;
        const lines = splitMultipleLines(newValue, maxCharacters);
        let yFirstLine = 687;
        if (lines.length > 1) yFirstLine = 690;
        for (let index = 0; index < lines.length; index++) {
          if (index === maxLine) break;
          const line = lines[index];
          result.push({ text: line, options: { y: yFirstLine - index * 10 } });
        }

        if (lines.length > maxLine) {
          result[maxLine - 1].text = result[maxLine - 1].text.slice(0, maxCharacters - 1) + "…";
        }

        return result;
      },
    },
    adresse: {
      numero: {
        x: 50,
        y: 649,
        maxLength: 9,
      },
      voie: {
        x: 152,
        maxLength: 30,
        title: (value) => {
          const shorttened =
            shortenVoie(value) || shortenVoie(value, "toLowerCase") || shortenVoie(value, "toUpperCase");

          const newValue = shorttened?.toLowerCase() || value.toLowerCase();

          const result = [];
          const maxLine = 2;
          const maxCharacters = 25;
          const lines = splitMultipleLines(newValue, maxCharacters);
          let yFirstLine = 649;
          if (lines.length > 1) yFirstLine = 657;
          for (let index = 0; index < lines.length; index++) {
            if (index === maxLine) break;
            const line = lines[index];
            result.push({ text: line, options: { y: yFirstLine - index * 12 } });
          }
          if (lines.length > maxLine) {
            result[maxLine - 1].text = result[maxLine - 1].text.slice(0, maxCharacters - 1) + "…";
          }

          return result;
        },
      },
      complement: {
        x: 96,
        y: 631,
        maxLength: 35,
        title: (value) => value?.toLowerCase() || "",
      },
      codePostal: {
        x: 97,
        y: 610,
        maxLength: 5,
        title: (value) => value.toLowerCase(),
      },
      commune: {
        x: 89,
        y: 592,
        maxLength: 35,
        title: (value) => value.toLowerCase(),
      },
    },
    telephone: {
      x: 90,
      y: 574,
      maxLength: 20,
    },
    courriel: {
      x: 27,
      y: 544,
      maxLength: 50,
      title: formatCourriel,
    },
    siret: {
      x: 305,
      y: 685,
      maxLength: 28,
      title: (value) => {
        return value.match(/\d{1}/g)?.join(" ");
      },
    },
    privePublic: {
      x: 391,
      y: 711,
      maxLength: 1,
      title: (value) => (value ? "×" : ""),
      defaultSize: 24,
    },
    typeEmployeur: {
      x: 400,
      y: 669,
      maxLength: 10,
    },
    employeurSpecifique: {
      x: 418,
      y: 649,
      maxLength: 1,
      title: (value) => `${value}`,
    },
    naf: {
      x: 480,
      y: 630,
      maxLength: 6,
      title: (value) => value.toUpperCase(),
    },
    nombreDeSalaries: {
      x: 483,
      y: 612,
      maxLength: 15,
    },
    libelleIdcc: {
      x: 305,
      title: (value) => {
        if (!value) return "";
        const newValue = value.replace("Convention collective ", "").toLowerCase();

        const result = [];
        const maxLine = 3;
        const maxCharacters = 43;
        const lines = splitMultipleLines(newValue, maxCharacters);
        let yFirstLine = 563;
        if (lines.length > 1) yFirstLine = 566;
        for (let index = 0; index < lines.length; index++) {
          if (index === maxLine) break;
          const line = lines[index];
          result.push({ text: line, options: { y: yFirstLine - index * 10 } });
        }
        if (lines.length > maxLine) {
          result[maxLine - 1].text = result[maxLine - 1].text.slice(0, maxCharacters - 1) + "…";
        }

        return result;
      },
    },
    codeIdcc: {
      x: 452,
      y: 530,
      maxLength: 4,
    },
    regimeSpecifique: {
      x: 473,
      y: 513,
      maxLength: 3,
      title: (value) => (value ? "oui" : "non"),
    },
    attestationEligibilite: {
      x: 23,
      y: 23,
      maxLength: 1,
      title: (value) => (value ? "×" : ""),
      defaultSize: 24,
    },
    attestationPieces: {
      x: 478,
      y: 249,
      maxLength: 1,
      title: (value) => (value ? "×" : ""),
      defaultSize: 24,
    },
  },
  apprenti: {
    nom: {
      x: 216,
      y: 483,
      maxLength: 100,
    },
    prenom: {
      x: 160,
      y: 465,
      maxLength: 100,
    },
    nir: {
      x: 135,
      y: 445,
      maxLength: 15,
      title: (value) => {
        return value?.match(/\d{1}/g)?.join(" ") || "";
      },
    },
    adresse: {
      numero: {
        x: 39,
        y: 395,
        maxLength: 6,
      },
      voie: {
        x: 110,
        title: (value) => {
          const shorttened =
            shortenVoie(value) || shortenVoie(value, "toLowerCase") || shortenVoie(value, "toUpperCase");

          const newValue = shorttened?.toLowerCase() || value.toLowerCase();

          const result = [];
          const maxLine = 2;
          const maxCharacters = 32;
          const lines = splitMultipleLines(newValue, maxCharacters);
          let yFirstLine = 395;
          if (lines.length > 1) yFirstLine = 399;
          for (let index = 0; index < lines.length; index++) {
            if (index === maxLine) break;
            const line = lines[index];
            result.push({ text: line, options: { y: yFirstLine - index * 11 } });
          }
          if (lines.length > maxLine) {
            result[maxLine - 1].text = result[maxLine - 1].text.slice(0, maxCharacters - 1) + "…";
          }

          return result;
        },
      },
      complement: {
        x: 97,
        y: 376,
        maxLength: 35,
        title: (value) => value?.toLowerCase() || "",
      },
      codePostal: {
        x: 94,
        y: 360,
        maxLength: 5,
        title: (value) => value.toLowerCase(),
      },
      commune: {
        x: 86,
        y: 343,
        maxLength: 39,
        title: (value) => value.toLowerCase(),
      },
    },
    telephone: {
      x: 88,
      y: 324,
      maxLength: 20,
    },
    courriel: {
      x: 27,
      y: 295,
      maxLength: 50,
      title: formatCourriel,
    },
    responsableLegal: {
      nom: {
        x: 28,
        y: 242,
        maxLength: 47,
        title: async (value, options) => {
          return [
            { text: value || "" },
            {
              text: options?.prenom || "",
              // @ts-expect-error: TODO
              options: { x: 35 + options?.writtingFont?.widthOfTextAtSize(value || "", 11) },
            },
          ];
        },
      },
      adresse: {
        numero: {
          x: 40,
          y: 215,
          maxLength: 30,
        },
        voie: {
          x: 104,
          y: 215,
          title: (value) => {
            if (!value) return [""];
            const shorttened =
              shortenVoie(value) || shortenVoie(value, "toLowerCase") || shortenVoie(value, "toUpperCase");

            const newValue = shorttened?.toLowerCase() || value.toLowerCase();

            const result = [];
            const maxLine = 2;
            const maxCharacters = 32;
            const lines = splitMultipleLines(newValue, maxCharacters);
            let yFirstLine = 215;
            if (lines.length > 1) yFirstLine = 219;
            for (let index = 0; index < lines.length; index++) {
              if (index === maxLine) break;
              const line = lines[index];
              result.push({ text: line, options: { y: yFirstLine - index * 11 } });
            }
            if (lines.length > maxLine) {
              result[maxLine - 1].text = result[maxLine - 1].text.slice(0, maxCharacters - 1) + "…";
            }

            return result;
          },
        },
        complement: {
          x: 98,
          y: 197,
          maxLength: 35,
          title: (value) => value?.toLowerCase() || "",
        },
        codePostal: {
          x: 94,
          y: 179,
          maxLength: 30,
          title: (value) => value?.toLowerCase(),
        },
        commune: {
          x: 87,
          y: 162,
          maxLength: 30,
          title: (value) => value?.toLowerCase(),
        },
      },
    },
    dateNaissance: {
      x: 400,
      y: 442,
      maxLength: 10,
      title: (value) => convertDate(value),
    },
    sexe: {
      x: (value) => {
        return value === "M" ? 338 : 368;
      },
      y: 422,
      title: "×",
      defaultSize: 24,
      maxLength: 1,
    },
    departementNaissance: {
      x: 443,
      y: 408,
      maxLength: 25,
      title: (value) => value.toLowerCase(),
    },
    communeNaissance: {
      x: 430,
      y: 391,
      maxLength: 20,
      title: (value) => value.toLowerCase(),
    },
    nationalite: {
      x: 365,
      y: 356,
      maxLength: 1,
    },
    regimeSocial: {
      x: 472,
      y: 356,
      maxLength: 1,
    },
    inscriptionSportifDeHautNiveau: {
      x: (value) => {
        return value === true ? 303 : 358;
      },
      y: 313,
      maxLength: 1,
      title: "×",
      defaultSize: 24,
    },
    handicap: {
      x: (value) => {
        return value === true ? 362 : 413;
      },
      y: 283,
      maxLength: 1,
      title: "×",
      defaultSize: 24,
    },
    situationAvantContrat: {
      x: 438,
      y: 268,
      maxLength: 2,
    },
    diplomePrepare: {
      x: 468,
      y: 251,
      maxLength: 2,
    },
    derniereClasse: {
      x: 460,
      y: 233,
      maxLength: 2,
    },
    intituleDiplomePrepare: {
      x: 304,
      title: (value) => {
        const newValue = value.toLowerCase();
        const result = [];
        const maxLine = 2;
        const maxCharacters = 45;
        const lines = splitMultipleLines(newValue, maxCharacters);
        let yFirstLine = 203;
        if (lines.length > 1) yFirstLine = 208;
        for (let index = 0; index < lines.length; index++) {
          if (index === maxLine) break;
          const line = lines[index];
          result.push({ text: line, options: { y: yFirstLine - index * 10 } });
        }
        if (lines.length > maxLine) {
          result[maxLine - 1].text = result[maxLine - 1].text.slice(0, maxCharacters - 1) + "…";
        }

        return result;
      },
    },
    diplome: {
      x: 493,
      y: 185,
      maxLength: 2,
    },
  },
  maitre: {
    maitre1: {
      nom: {
        x: 27,
        y: 101,
        maxLength: 46,
        title: (value) => value.toLowerCase(),
      },
      prenom: {
        x: 27,
        y: 68,
        maxLength: 46,
        title: (value) => value.toLowerCase(),
      },
      dateNaissance: {
        x: 127,
        y: 51,
        maxLength: 10,
        title: (value) => convertDate(value),
      },
    },
    maitre2: {
      nom: {
        x: 304,
        y: 98,
        maxLength: 46,
        title: (value) => value?.toLowerCase() || "",
      },
      prenom: {
        x: 304,
        y: 68,
        maxLength: 46,
        title: (value) => value?.toLowerCase() || "",
      },
      dateNaissance: {
        x: 405,
        y: 51,
        maxLength: 10,
        title: (value) => (value ? convertDate(value) : ""),
      },
    },
  },
  contrat: {
    lieuSignatureContrat: {
      x: 65,
      y: 231,
      maxLength: 100,
      title: (value) => value?.toLowerCase(),
    },
    typeContratApp: {
      x: 182,
      y: 805,
      maxLength: 2,
    },
    typeDerogation: {
      x: 406,
      y: 802,
      maxLength: 2,
    },
    numeroContratPrecedent: {
      x: 373,
      y: 775,
      maxLength: 30,
      title: (value) => {
        if (!value) return "";
        return value.match(/.{1}/g).join(" ");
      },
    },
    dateConclusion: {
      x: 127,
      y: 756,
      maxLength: 10,
      title: (value) => convertDate(value),
    },
    dateDebutContrat: {
      x: 237,
      y: 743,
      maxLength: 10,
      title: (value) => convertDate(value),
    },
    dateEffetAvenant: {
      x: 505,
      y: 756,
      maxLength: 10,
      title: (value) => (value ? convertDate(value) : ""),
    },
    dateFinContrat: {
      x: 113,
      y: 692,
      maxLength: 10,
      title: (value) => convertDate(value),
    },
    dureeTravailHebdoHeures: {
      x: 306,
      y: 692,
      maxLength: 2,
    },
    dureeTravailHebdoMinutes: {
      x: 370,
      y: 692,
      maxLength: 2,
    },
    travailRisque: {
      x: (value) => {
        return value === true ? 398 : 453;
      },
      y: 667,
      maxLength: 1,
      title: "×",
      defaultSize: 24,
    },
    salaireEmbauche: {
      x: 29,
      y: 559,
      maxLength: 10,
    },
    caisseRetraiteComplementaire: {
      x: 310,
      y: 559,
      maxLength: 40,
    },
    avantageNourriture: {
      x: 252,
      y: 539,
      maxLength: 10,
    },
    avantageLogement: {
      x: 408,
      y: 539,
      maxLength: 10,
    },
    autreAvantageEnNature: {
      x: 552,
      y: 536,
      maxLength: 1,
      title: (value) => (value ? "×" : ""),
      defaultSize: 24,
    },
    remunerationsAnnuelles: {
      1.1: {
        dateDebut: {
          x: 85,
          y: 632,
          maxLength: 10,
          defaultSize: 9,
          title: (value) => (value ? convertDate(value) : ""),
        },
        dateFin: {
          x: 170,
          y: 632,
          maxLength: 10,
          defaultSize: 9,
          title: (value) => (value ? convertDate(value) : ""),
        },
        taux: {
          x: 231,
          y: 632,
          maxLength: 10,
          defaultSize: 9,
        },
        typeSalaire: {
          x: 285,
          y: 632,
          maxLength: 4,
          defaultSize: 9,
        },
      },
      1.2: {
        dateDebut: {
          x: 85 + 255,
          y: 632,
          maxLength: 10,
          defaultSize: 9,
          title: (value) => (value ? convertDate(value) : ""),
        },
        dateFin: {
          x: 170 + 255,
          y: 632,
          maxLength: 10,
          defaultSize: 9,
          title: (value) => (value ? convertDate(value) : ""),
        },
        taux: {
          x: 231 + 255,
          y: 632,
          maxLength: 10,
          defaultSize: 9,
        },
        typeSalaire: {
          x: 285 + 255,
          y: 632,
          maxLength: 4,
          defaultSize: 9,
        },
      },
      2.1: {
        dateDebut: {
          x: 85,
          y: 632 - 12,
          maxLength: 10,
          defaultSize: 9,
          title: (value) => (value ? convertDate(value) : ""),
        },
        dateFin: {
          x: 170,
          y: 632 - 12,
          maxLength: 10,
          defaultSize: 9,
          title: (value) => (value ? convertDate(value) : ""),
        },
        taux: {
          x: 231,
          y: 632 - 12,
          maxLength: 10,
          defaultSize: 9,
        },
        typeSalaire: {
          x: 285,
          y: 632 - 12,
          maxLength: 4,
          defaultSize: 9,
        },
      },
      2.2: {
        dateDebut: {
          x: 85 + 255,
          y: 632 - 12,
          maxLength: 10,
          defaultSize: 9,
          title: (value) => (value ? convertDate(value) : ""),
        },
        dateFin: {
          x: 170 + 255,
          y: 632 - 12,
          maxLength: 10,
          defaultSize: 9,
          title: (value) => (value ? convertDate(value) : ""),
        },
        taux: {
          x: 231 + 255,
          y: 632 - 12,
          maxLength: 10,
          defaultSize: 9,
        },
        typeSalaire: {
          x: 285 + 255,
          y: 632 - 12,
          maxLength: 4,
          defaultSize: 9,
        },
      },
      3.1: {
        dateDebut: {
          x: 85,
          y: 632 - 25,
          maxLength: 10,
          defaultSize: 9,
          title: (value) => (value ? convertDate(value) : ""),
        },
        dateFin: {
          x: 170,
          y: 632 - 25,
          maxLength: 10,
          defaultSize: 9,
          title: (value) => (value ? convertDate(value) : ""),
        },
        taux: {
          x: 231,
          y: 632 - 25,
          maxLength: 10,
          defaultSize: 9,
        },
        typeSalaire: {
          x: 285,
          y: 632 - 25,
          maxLength: 4,
          defaultSize: 9,
        },
      },
      3.2: {
        dateDebut: {
          x: 85 + 255,
          y: 632 - 25,
          maxLength: 10,
          defaultSize: 9,
          title: (value) => (value ? convertDate(value) : ""),
        },
        dateFin: {
          x: 170 + 255,
          y: 632 - 25,
          maxLength: 10,
          defaultSize: 9,
          title: (value) => (value ? convertDate(value) : ""),
        },
        taux: {
          x: 231 + 255,
          y: 632 - 25,
          maxLength: 10,
          defaultSize: 9,
        },
        typeSalaire: {
          x: 285 + 255,
          y: 632 - 25,
          maxLength: 4,
          defaultSize: 9,
        },
      },
      4.1: {
        dateDebut: {
          x: 85,
          y: 632 - 40,
          maxLength: 10,
          defaultSize: 9,
          title: (value) => (value ? convertDate(value) : ""),
        },
        dateFin: {
          x: 170,
          y: 632 - 40,
          maxLength: 10,
          defaultSize: 9,
          title: (value) => (value ? convertDate(value) : ""),
        },
        taux: {
          x: 231,
          y: 632 - 40,
          maxLength: 10,
          defaultSize: 9,
        },
        typeSalaire: {
          x: 285,
          y: 632 - 40,
          maxLength: 4,
          defaultSize: 9,
        },
      },
      4.2: {
        dateDebut: {
          x: 85 + 255,
          y: 632 - 40,
          maxLength: 10,
          defaultSize: 9,
          title: (value) => (value ? convertDate(value) : ""),
        },
        dateFin: {
          x: 170 + 255,
          y: 632 - 40,
          maxLength: 10,
          defaultSize: 9,
          title: (value) => (value ? convertDate(value) : ""),
        },
        taux: {
          x: 231 + 255,
          y: 632 - 40,
          maxLength: 10,
          defaultSize: 9,
        },
        typeSalaire: {
          x: 285 + 255,
          y: 632 - 40,
          maxLength: 4,
          defaultSize: 9,
        },
      },
    },
  },
  formation: {
    formationInterne: {
      x: (value) => {
        return value === true ? 123 : 177;
      },
      y: 501,
      maxLength: 1,
      title: "×",
      defaultSize: 24,
    },
    denomination: {
      x: 27,
      title: (value) => {
        const newValue = value.toLowerCase();

        const result = [];
        const maxLine = 2;
        const maxCharacters = 45;
        const lines = splitMultipleLines(newValue, maxCharacters);
        let yFirstLine = 478;
        if (lines.length > 1) yFirstLine = 483;
        for (let index = 0; index < lines.length; index++) {
          if (index === maxLine) break;
          const line = lines[index];
          result.push({ text: line, options: { y: yFirstLine - index * 10 } });
        }
        if (lines.length > maxLine) {
          result[maxLine - 1].text = result[maxLine - 1].text.slice(0, maxCharacters - 1) + "…";
        }

        return result;
      },
    },
    intituleQualification: {
      x: 302,
      title: (value) => {
        const newValue = value.toLowerCase();
        const result = [];
        const maxLine = 2;
        const maxCharacters = 42;
        const lines = splitMultipleLines(newValue, maxCharacters);
        let yFirstLine = 480;
        if (lines.length > 1) yFirstLine = 484;
        for (let index = 0; index < lines.length; index++) {
          if (index === maxLine) break;
          const line = lines[index];
          result.push({ text: line, options: { y: yFirstLine - index * 10 } });
        }
        if (lines.length > maxLine) {
          result[maxLine - 1].text = result[maxLine - 1].text.slice(0, maxCharacters - 1) + "…";
        }

        return result;
      },
    },
    typeDiplome: {
      x: 480,
      y: 504,
      maxLength: 2,
    },
    uaiCfa: {
      x: 110,
      y: 463,
      maxLength: 8,
      title: (value) => value?.toUpperCase(),
    },
    codeDiplome: {
      x: 396,
      y: 463,
      maxLength: 8,
      title: (value) => value?.toUpperCase(),
    },
    siret: {
      x: 109,
      y: 448,
      maxLength: 28,
      title: (value) => {
        return value.match(/\d{1}/g).join(" ");
      },
    },
    rncp: {
      x: 376,
      y: 449,
      maxLength: 9,
      title: (value) => value?.toUpperCase(),
    },
    adresse: {
      numero: {
        x: 41,
        y: 416,
        maxLength: 4,
      },
      voie: {
        x: 109,
        // y: 415,
        // maxLength: 25,
        title: (value) => {
          const shorttened =
            shortenVoie(value) || shortenVoie(value, "toLowerCase") || shortenVoie(value, "toUpperCase");

          const newValue = shorttened?.toLowerCase() || value.toLowerCase();

          const result = [];
          const lines = splitMultipleLines(newValue, 37);
          let yFirstLine = 415;
          if (lines.length > 1) yFirstLine = 415;
          for (let index = 0; index < lines.length; index++) {
            const line = lines[index];
            result.push({ text: line, options: { y: yFirstLine - index * 11 } });
          }

          return result;
        },
      },
      complement: {
        x: 99,
        y: 398,
        maxLength: 40,
        title: (value) => value?.toLowerCase() || "",
      },
      codePostal: {
        x: 97,
        y: 381,
        maxLength: 5,
        title: (value) => value.toLowerCase(),
      },
      commune: {
        x: 89,
        y: 363,
        maxLength: 30,
        title: (value) => value.toLowerCase(),
      },
    },
    dateDebutFormation: {
      x: 304,
      y: 403,
      maxLength: 10,
      title: (value) => (value ? convertDate(value) : ""),
    },
    dateFinFormation: {
      x: 304,
      y: 373,
      maxLength: 10,
      title: (value) => (value ? convertDate(value) : ""),
    },
    dureeFormation: {
      x: 419,
      y: 357,
      maxLength: 8,
    },
  },
} as const;

const capitalizeFirstLetter = (value: string) => value?.charAt(0).toUpperCase() + value?.slice(1);

interface Field {
  title: string | TextOption[];
  x: number;
  y: number | undefined;
  defaultColor: any;
  defaultSize: number;
}

const buildFieldDraw = async (value: any, fieldDefinition: BaseFieldPosition, options = {}): Promise<Field> => {
  const title = typeof value === "boolean" ? (value ? "×" : " ") : !value ? "" : `${value}`;
  const result = {
    title:
      (typeof fieldDefinition.title === "function"
        ? await fieldDefinition.title?.(value, options)
        : fieldDefinition.title) || title,
    x: typeof fieldDefinition.x === "function" ? await fieldDefinition.x(value, options) : fieldDefinition.x,
    y: fieldDefinition.y,
    defaultColor: rgb(0.0, 0.38824, 0.79608), // rgb(0.13, 0.59, 0.49), //rgb(0.9, 0.4, 0.3),
    defaultSize: fieldDefinition.defaultSize ? fieldDefinition.defaultSize : 10,
  };

  if (fieldDefinition.maxLength && (result.title?.length || 0) > fieldDefinition.maxLength) {
    result.title = result.title.slice(0, fieldDefinition.maxLength - 1) + ".";
  }

  return result;
};

const buildRemunerations = async (remunerationsAnnuelles: RemunerationsAnnuelles[]) => {
  let result: Field[] = [];
  for (let index = 0; index < remunerationsAnnuelles.length; index++) {
    const remunerationAnnuelle = remunerationsAnnuelles[index];
    result = [
      ...result,
      await buildFieldDraw(
        remunerationAnnuelle.dateDebut,
        // @ts-expect-error: TODO
        fieldsPositions.contrat.remunerationsAnnuelles[remunerationAnnuelle.ordre].dateDebut
      ),
      await buildFieldDraw(
        remunerationAnnuelle.dateFin,
        // @ts-expect-error: TODO
        fieldsPositions.contrat.remunerationsAnnuelles[remunerationAnnuelle.ordre].dateFin
      ),
      await buildFieldDraw(
        remunerationAnnuelle.taux,
        // @ts-expect-error: TODO
        fieldsPositions.contrat.remunerationsAnnuelles[remunerationAnnuelle.ordre].taux
      ),
      await buildFieldDraw(
        remunerationAnnuelle.typeSalaire,
        // @ts-expect-error: TODO
        fieldsPositions.contrat.remunerationsAnnuelles[remunerationAnnuelle.ordre].typeSalaire
      ),
    ];
  }

  return result;
};

const drawDraftWatermark = async (pdfDoc: PDFDocument) => {
  for (const page of pdfDoc.getPages()) {
    page.drawText("Brouillon", {
      x: 120,
      y: 200,
      size: 100,
      opacity: 0.1,
      font: await pdfDoc.embedFont(StandardFonts.Courier),
      // @ts-expect-error: TODO
      rotate: { type: "degrees", angle: 45 },
    });
  }
};
interface GeneratePdfOptions {
  draft?: boolean;
  firstname?: string;
  lastname?: string;
  date?: Date;
}
const drawFooter = async (pdfDoc: PDFDocument, { date, firstname, lastname }: GeneratePdfOptions) => {
  for (const page of pdfDoc.getPages()) {
    page.drawText(
      `Contrat généré par la plateforme contrat.apprentissage.beta.gouv.fr
par ${firstname} ${lastname}, le ${date}, avec le statut Brouillon`,
      {
        x: 20,
        y: 15,
        size: 8,
        lineHeight: 9,
        opacity: 1,
        font: await pdfDoc.embedFont(StandardFonts.Courier),
      }
    );
  }
};

const generatePdf = async (
  pdfCerfaEmpty: string,
  cerfa: any,
  { draft = false, firstname, lastname }: GeneratePdfOptions = {}
) => {
  const pdfDoc = await PDFDocument.load(pdfCerfaEmpty);
  const writtingFont = await pdfDoc.embedFont(StandardFonts.Courier); // TimesRoman // Courier // Helvetica
  const pages = pdfDoc.getPages();

  const pdfPagesContent: Field[][] = [
    [
      // TODO EMPLOYEUR
      // @ts-expect-error: TODO
      await buildFieldDraw(cerfa.employeur.privePublic, fieldsPositions.employeur.privePublic),
      // @ts-expect-error: TODO
      await buildFieldDraw(cerfa.employeur.denomination, fieldsPositions.employeur.denomination),
      await buildFieldDraw(
        (cerfa.employeur.adresse.numero ?? "") + (cerfa.employeur.adresse.repetitionVoie ?? ""),
        // @ts-expect-error: TODO
        fieldsPositions.employeur.adresse.numero
      ),
      // @ts-expect-error: TODO
      await buildFieldDraw(cerfa.employeur.adresse.voie, fieldsPositions.employeur.adresse.voie),
      // @ts-expect-error: TODO
      await buildFieldDraw(cerfa.employeur.adresse.complement, fieldsPositions.employeur.adresse.complement),
      // @ts-expect-error: TODO
      await buildFieldDraw(cerfa.employeur.adresse.codePostal, fieldsPositions.employeur.adresse.codePostal),
      // @ts-expect-error: TODO
      await buildFieldDraw(cerfa.employeur.adresse.commune, fieldsPositions.employeur.adresse.commune),
      // @ts-expect-error: TODO
      await buildFieldDraw(cerfa.employeur.telephone, fieldsPositions.employeur.telephone),
      // @ts-expect-error: TODO
      await buildFieldDraw(cerfa.employeur.courriel, fieldsPositions.employeur.courriel, { writtingFont }),
      // @ts-expect-error: TODO
      await buildFieldDraw(cerfa.employeur.siret, fieldsPositions.employeur.siret),
      // @ts-expect-error: TODO
      await buildFieldDraw(cerfa.employeur.typeEmployeur, fieldsPositions.employeur.typeEmployeur),
      // @ts-expect-error: TODO
      await buildFieldDraw(cerfa.employeur.employeurSpecifique, fieldsPositions.employeur.employeurSpecifique),
      // @ts-expect-error: TODO
      await buildFieldDraw(cerfa.employeur.naf, fieldsPositions.employeur.naf),
      // @ts-expect-error: TODO
      await buildFieldDraw(cerfa.employeur.nombreDeSalaries, fieldsPositions.employeur.nombreDeSalaries),
      // @ts-expect-error: TODO
      await buildFieldDraw(cerfa.employeur.libelleIdcc, fieldsPositions.employeur.libelleIdcc),
      // @ts-expect-error: TODO
      await buildFieldDraw(cerfa.employeur.codeIdcc, fieldsPositions.employeur.codeIdcc),
      // @ts-expect-error: TODO
      await buildFieldDraw(cerfa.employeur.regimeSpecifique, fieldsPositions.employeur.regimeSpecifique),

      //TODO APPRENTI(E)
      // @ts-expect-error: TODO
      await buildFieldDraw(cerfa.apprenti.nom, fieldsPositions.apprenti.nom),
      // @ts-expect-error: TODO
      await buildFieldDraw(cerfa.apprenti.prenom, fieldsPositions.apprenti.prenom),
      // @ts-expect-error: TODO
      await buildFieldDraw(cerfa.apprenti.nir, fieldsPositions.apprenti.nir),
      await buildFieldDraw(
        (cerfa.apprenti.adresse.numero ?? "") + (cerfa.apprenti.adresse.repetitionVoie ?? ""),
        // @ts-expect-error: TODO
        fieldsPositions.apprenti.adresse.numero
      ),
      // @ts-expect-error: TODO
      await buildFieldDraw(cerfa.apprenti.adresse.voie, fieldsPositions.apprenti.adresse.voie),
      // @ts-expect-error: TODO
      await buildFieldDraw(cerfa.apprenti.adresse.complement, fieldsPositions.apprenti.adresse.complement),
      // @ts-expect-error: TODO
      await buildFieldDraw(cerfa.apprenti.adresse.codePostal, fieldsPositions.apprenti.adresse.codePostal),
      // @ts-expect-error: TODO
      await buildFieldDraw(cerfa.apprenti.adresse.commune, fieldsPositions.apprenti.adresse.commune),
      // @ts-expect-error: TODO
      await buildFieldDraw(cerfa.apprenti.telephone, fieldsPositions.apprenti.telephone),
      // @ts-expect-error: TODO
      await buildFieldDraw(cerfa.apprenti.courriel, fieldsPositions.apprenti.courriel, { writtingFont }),
      // @ts-expect-error: TODO
      await buildFieldDraw(cerfa.apprenti.responsableLegal.nom, fieldsPositions.apprenti.responsableLegal.nom, {
        prenom: cerfa.apprenti.responsableLegal.prenom,
        writtingFont,
      }),
      await buildFieldDraw(
        (cerfa.apprenti.responsableLegal.adresse.numero ?? "") +
          (cerfa.apprenti.responsableLegal.adresse.repetitionVoie ?? ""),
        // @ts-expect-error: TODO
        fieldsPositions.apprenti.responsableLegal.adresse.numero
      ),
      await buildFieldDraw(
        cerfa.apprenti.responsableLegal.adresse.voie,
        // @ts-expect-error: TODO
        fieldsPositions.apprenti.responsableLegal.adresse.voie
      ),
      await buildFieldDraw(
        cerfa.apprenti.responsableLegal.adresse.complement,
        // @ts-expect-error: TODO
        fieldsPositions.apprenti.responsableLegal.adresse.complement
      ),
      await buildFieldDraw(
        cerfa.apprenti.responsableLegal.adresse.codePostal,
        // @ts-expect-error: TODO
        fieldsPositions.apprenti.responsableLegal.adresse.codePostal
      ),
      await buildFieldDraw(
        cerfa.apprenti.responsableLegal.adresse.commune,
        // @ts-expect-error: TODO
        fieldsPositions.apprenti.responsableLegal.adresse.commune
      ),
      // @ts-expect-error: TODO
      await buildFieldDraw(cerfa.apprenti.dateNaissance, fieldsPositions.apprenti.dateNaissance),
      // @ts-expect-error: TODO
      await buildFieldDraw(cerfa.apprenti.sexe, fieldsPositions.apprenti.sexe),
      // @ts-expect-error: TODO
      await buildFieldDraw(cerfa.apprenti.departementNaissance, fieldsPositions.apprenti.departementNaissance),
      // @ts-expect-error: TODO
      await buildFieldDraw(cerfa.apprenti.communeNaissance, fieldsPositions.apprenti.communeNaissance),
      // @ts-expect-error: TODO
      await buildFieldDraw(cerfa.apprenti.nationalite, fieldsPositions.apprenti.nationalite),
      // @ts-expect-error: TODO
      await buildFieldDraw(cerfa.apprenti.regimeSocial, fieldsPositions.apprenti.regimeSocial),
      await buildFieldDraw(
        cerfa.apprenti.inscriptionSportifDeHautNiveau,
        // @ts-expect-error: TODO
        fieldsPositions.apprenti.inscriptionSportifDeHautNiveau
      ),
      // @ts-expect-error: TODO
      await buildFieldDraw(cerfa.apprenti.handicap, fieldsPositions.apprenti.handicap),
      // @ts-expect-error: TODO
      await buildFieldDraw(cerfa.apprenti.situationAvantContrat, fieldsPositions.apprenti.situationAvantContrat),
      // @ts-expect-error: TODO
      await buildFieldDraw(cerfa.apprenti.diplomePrepare, fieldsPositions.apprenti.diplomePrepare),
      // @ts-expect-error: TODO
      await buildFieldDraw(cerfa.apprenti.intituleDiplomePrepare, fieldsPositions.apprenti.intituleDiplomePrepare),
      // @ts-expect-error: TODO
      await buildFieldDraw(cerfa.apprenti.derniereClasse, fieldsPositions.apprenti.derniereClasse),
      // @ts-expect-error: TODO
      await buildFieldDraw(cerfa.apprenti.diplome, fieldsPositions.apprenti.diplome),

      //TODO Maitre d'aprentissage
      // @ts-expect-error: TODO
      await buildFieldDraw(cerfa.maitre1.nom, fieldsPositions.maitre.maitre1.nom),
      // @ts-expect-error: TODO
      await buildFieldDraw(cerfa.maitre1.prenom, fieldsPositions.maitre.maitre1.prenom),
      // @ts-expect-error: TODO
      await buildFieldDraw(cerfa.maitre1.dateNaissance, fieldsPositions.maitre.maitre1.dateNaissance),
      // @ts-expect-error: TODO
      await buildFieldDraw(cerfa.maitre2.nom, fieldsPositions.maitre.maitre2.nom),
      // @ts-expect-error: TODO
      await buildFieldDraw(cerfa.maitre2.prenom, fieldsPositions.maitre.maitre2.prenom),
      // @ts-expect-error: TODO
      await buildFieldDraw(cerfa.maitre2.dateNaissance, fieldsPositions.maitre.maitre2.dateNaissance),
      // @ts-expect-error: TODO
      await buildFieldDraw(cerfa.employeur.attestationEligibilite, fieldsPositions.employeur.attestationEligibilite),
    ],
    [
      //TODO Le Contrat
      // @ts-expect-error: TODO
      await buildFieldDraw(cerfa.contrat.typeContratApp, fieldsPositions.contrat.typeContratApp),
      // @ts-expect-error: TODO
      await buildFieldDraw(cerfa.contrat.typeDerogation, fieldsPositions.contrat.typeDerogation),
      // @ts-expect-error: TODO
      await buildFieldDraw(cerfa.contrat.numeroContratPrecedent, fieldsPositions.contrat.numeroContratPrecedent),
      // @ts-expect-error: TODO
      await buildFieldDraw(cerfa.contrat.dateConclusion, fieldsPositions.contrat.dateConclusion),
      // @ts-expect-error: TODO
      await buildFieldDraw(cerfa.contrat.dateDebutContrat, fieldsPositions.contrat.dateDebutContrat),
      // @ts-expect-error: TODO
      await buildFieldDraw(cerfa.contrat.dateEffetAvenant, fieldsPositions.contrat.dateEffetAvenant),
      // @ts-expect-error: TODO
      await buildFieldDraw(cerfa.contrat.dateFinContrat, fieldsPositions.contrat.dateFinContrat),
      // @ts-expect-error: TODO
      await buildFieldDraw(cerfa.contrat.dureeTravailHebdoHeures, fieldsPositions.contrat.dureeTravailHebdoHeures),
      // @ts-expect-error: TODO
      await buildFieldDraw(cerfa.contrat.dureeTravailHebdoMinutes, fieldsPositions.contrat.dureeTravailHebdoMinutes),
      // @ts-expect-error: TODO
      await buildFieldDraw(cerfa.contrat.travailRisque, fieldsPositions.contrat.travailRisque),
      ...(await buildRemunerations(cerfa.contrat.remunerationsAnnuelles)),
      // @ts-expect-error: TODO
      await buildFieldDraw(cerfa.contrat.salaireEmbauche, fieldsPositions.contrat.salaireEmbauche),
      await buildFieldDraw(
        cerfa.contrat.caisseRetraiteComplementaire,
        // @ts-expect-error: TODO
        fieldsPositions.contrat.caisseRetraiteComplementaire
      ),
      // @ts-expect-error: TODO
      await buildFieldDraw(cerfa.contrat.avantageNourriture, fieldsPositions.contrat.avantageNourriture),
      // @ts-expect-error: TODO
      await buildFieldDraw(cerfa.contrat.avantageLogement, fieldsPositions.contrat.avantageLogement),
      // @ts-expect-error: TODO
      await buildFieldDraw(cerfa.contrat.autreAvantageEnNature, fieldsPositions.contrat.autreAvantageEnNature),

      //TODO La Formation
      // @ts-expect-error: TODO
      await buildFieldDraw(cerfa.organismeFormation.formationInterne, fieldsPositions.formation.formationInterne),
      // @ts-expect-error: TODO
      await buildFieldDraw(cerfa.organismeFormation.uaiCfa, fieldsPositions.formation.uaiCfa),
      // @ts-expect-error: TODO
      await buildFieldDraw(cerfa.organismeFormation.siret, fieldsPositions.formation.siret),
      // @ts-expect-error: TODO
      await buildFieldDraw(cerfa.organismeFormation.denomination, fieldsPositions.formation.denomination),
      // @ts-expect-error: TODO
      await buildFieldDraw(cerfa.formation.rncp, fieldsPositions.formation.rncp),
      // @ts-expect-error: TODO
      await buildFieldDraw(cerfa.formation.codeDiplome, fieldsPositions.formation.codeDiplome),
      // @ts-expect-error: TODO
      await buildFieldDraw(cerfa.formation.intituleQualification, fieldsPositions.formation.intituleQualification),
      // @ts-expect-error: TODO
      await buildFieldDraw(cerfa.formation.typeDiplome, fieldsPositions.formation.typeDiplome),
      // @ts-expect-error: TODO
      await buildFieldDraw(cerfa.formation.dateDebutFormation, fieldsPositions.formation.dateDebutFormation),
      // @ts-expect-error: TODO
      await buildFieldDraw(cerfa.formation.dateFinFormation, fieldsPositions.formation.dateFinFormation),
      // @ts-expect-error: TODO
      await buildFieldDraw(cerfa.formation.dureeFormation, fieldsPositions.formation.dureeFormation),

      await buildFieldDraw(
        (cerfa.organismeFormation.adresse.numero ?? "") + (cerfa.organismeFormation.adresse.repetitionVoie ?? ""),
        // @ts-expect-error: TODO
        fieldsPositions.formation.adresse.numero
      ),
      // @ts-expect-error: TODO
      await buildFieldDraw(cerfa.organismeFormation.adresse.voie, fieldsPositions.formation.adresse.voie),
      // @ts-expect-error: TODO
      await buildFieldDraw(cerfa.organismeFormation.adresse.complement, fieldsPositions.formation.adresse.complement),
      // @ts-expect-error: TODO
      await buildFieldDraw(cerfa.organismeFormation.adresse.codePostal, fieldsPositions.formation.adresse.codePostal),
      // @ts-expect-error: TODO
      await buildFieldDraw(cerfa.organismeFormation.adresse.commune, fieldsPositions.formation.adresse.commune),
      // @ts-expect-error: TODO
      await buildFieldDraw(cerfa.employeur.attestationPieces, fieldsPositions.employeur.attestationPieces),
      // @ts-expect-error: TODO
      await buildFieldDraw(cerfa.contrat.lieuSignatureContrat, fieldsPositions.contrat.lieuSignatureContrat),
    ],
  ];

  for (let index = 0; index < pdfPagesContent.length; index++) {
    const pdfPageContent = pdfPagesContent[index];
    const page = pages[index];
    for (let jndex = 0; jndex < pdfPageContent.length; jndex++) {
      const { title, x, y, defaultColor, defaultSize } = pdfPageContent[jndex];
      const arrTitles = Array.isArray(title) ? title : [title];
      arrTitles.forEach((t, ite) => {
        const text = typeof t === "object" ? t.text : t;
        const titles = ite === 0 ? capitalizeFirstLetter(text) : text;
        for (let kndex = 0; kndex < titles.length; kndex++) {
          const options = typeof t === "object" ? t.options : {};
          // @ts-expect-error: TODO
          page.drawText(titles, {
            x: x,
            y: y,
            size: defaultSize,
            color: defaultColor,
            font: writtingFont,
            ...options,
          });
        }
      });
    }
  }

  if (draft) {
    await drawDraftWatermark(pdfDoc);
    // @ts-expect-error: TODO
    await drawFooter(pdfDoc, {
      date: DateTime.now().toFormat("dd/MM/yyyy"),
      firstname,
      lastname,
    });
  }

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
};

export default generatePdf;
