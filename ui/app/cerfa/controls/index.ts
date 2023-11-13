import { CerfaForm } from "../components/CerfaForm";
import { ageApprentiControl } from "./ageApprenti.control";
import { apprentiCodePostalControl } from "./apprentiCodePostal.control";
import { avantagesNatureControl } from "./avantagesNature.control";
import { codeDiplomeControl } from "./codeDiplome.control";
import { ContratDatesControl } from "./ContratDates.control";
import { dateFormationControl } from "./dateFormation.control";
import { dureeTravailControl } from "./dureeTravail.control";
import { employeurCodePostalControl } from "./employeurCodePostal.control";
import { employeurNafControl } from "./employeurNaf.control";
import { employeurSiretControl } from "./employeurSiret.control";
import { etablissementFormationControl } from "./etablissementFormation.control";
import { etablissementFormationCodePostalControl } from "./etablissementFormationCodePostal.control";
import { etablissementFormationSiretControl } from "./etablissementFormationSiret.control";
import { idccControl } from "./idcc.control";
import { Maitre2Control } from "./maitre2.control";
import { maitresControl } from "./maitres.control";
import { numeroContratPrecedentControl } from "./numeroContratPrecedent.control";
import { organismeFormationCodePostalControl } from "./organismeFormationCodePostal.control";
import { siretOrganismeFormationLogic } from "./organismeFormationSiret.control";
import { RemunerationsControl } from "./remunerations.control";
import { responsableLegalControl } from "./responsableLegal.control";
import { responsableLegalCodePostalControl } from "./responsableLegalCodePostal.control";
import { rncpControl } from "./rncp.control";
import { typeContratAppControl } from "./typeContratApp.control";
import { typeDerogationControl } from "./typeDerogation.control";

interface ControlResult {
  cascade?: Record<string, { value?: any; reset?: boolean; locked?: boolean; cascade?: boolean }>;
  cache?: string;
  error?: string;
  warning?: string;
  reset?: boolean;
}

export interface CerfaControl {
  target?: string;
  blocCompletion?: string;
  deps: string[];
  process: (cerfaForm: CerfaForm) => Promise<ControlResult | undefined> | ControlResult | undefined;
}

export const controls: CerfaControl[] = [
  ...dureeTravailControl,
  ...numeroContratPrecedentControl,
  ...etablissementFormationSiretControl,
  ...etablissementFormationCodePostalControl,
  ...organismeFormationCodePostalControl,
  ...apprentiCodePostalControl,
  ...employeurNafControl,
  ...employeurCodePostalControl,
  ...typeContratAppControl,
  ...avantagesNatureControl,
  ...etablissementFormationControl,
  responsableLegalCodePostalControl,
  ...responsableLegalControl,
  ...idccControl,
  ...employeurSiretControl,
  ...ContratDatesControl,
  ...dateFormationControl,
  siretOrganismeFormationLogic,
  ...maitresControl,
  Maitre2Control,
  ...ageApprentiControl,
  ...typeDerogationControl,
  ...RemunerationsControl,
  ...rncpControl,
  ...codeDiplomeControl,
];
