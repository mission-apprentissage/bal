import { IdccSource, IdccSources } from "shared/constants/idcc";

import { getOpcoData } from "../../../common/apis/cfaDock";
import { getConventionCollective as getConventionCollectiveApiEntreprise } from "../../../common/apis/entreprise";
import { getRechercheEntreprise } from "../../../common/apis/rechercheEntreprise";

interface ConventionCollective {
  idcc: string[];
  status?: string;
  source: IdccSource;
}

export const getConventionCollective = async (siret: string): Promise<ConventionCollective | undefined> => {
  /**
   * Recherche entreprises api
   */
  try {
    const entreprise = await getRechercheEntreprise(siret);

    if (entreprise?.siege?.liste_idcc?.length > 0) {
      const idcc = entreprise.siege.liste_idcc;

      return { idcc, source: IdccSources.RECHERCHE_ENTREPRISE_API };
    }
  } catch (e) {
    console.log(e);
  }

  /**
   * API entreprise
   */
  try {
    const { numero_idcc: idcc, ...rest } = await getConventionCollectiveApiEntreprise(siret);
    if (idcc) {
      return { idcc: [idcc], ...rest, source: IdccSources.API_ENTREPRISE };
    }
  } catch (e) {
    console.log(e);
  }

  /**
   * CFA Dock API
   */

  // SIRET
  try {
    const opcoData = await getOpcoData(siret);

    if (opcoData?.idcc) {
      return { idcc: [opcoData.idcc], source: IdccSources.CFA_DOCK_SIRET };
    }
  } catch (e) {
    console.log(e);
  }

  // SIREN
  try {
    const siren = siret.substring(0, 9);
    const opcoData = await getOpcoData(siren);

    if (opcoData?.idcc) {
      return { idcc: [opcoData.idcc], source: IdccSources.CFA_DOCK_SIREN };
    }
  } catch (e) {
    console.log(e);
  }

  return;
};
