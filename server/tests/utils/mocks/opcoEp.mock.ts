import nock from "nock"

import { OPCO_EP_AUTH_BASE_URL, OPCO_EP_BASE_URL } from "../../../src/common/apis/opcoEp"
import {
  opcoEpDomaineIdentique,
  opcoEpEmailOuDomaineInconnu,
  opcoEpEmailTrouve,
  opcoEpInvalid,
  opcoEpSiretInconnu,
  opcoEptoken,
  opcoEpValidDomain,
  opcoEpValidEmail,
} from "../../data/opcoEp"

const opcoEpVerificationScope = (email: string, siret: string) =>
  nock(OPCO_EP_BASE_URL).persist().get("/apis/referentiel-entreprise/v2/entreprises/securisation-echange").query({ email, siret })

export const opcoEpTokenMock = () => {
  return nock(OPCO_EP_AUTH_BASE_URL).persist().post("/auth/realms/partenaires-etatiques/protocol/openid-connect/token").reply(200, opcoEptoken)
}

export const opcoEpVerificationMock = (email: string, siret: string) => {
  let response = opcoEpSiretInconnu

  if (email === opcoEpValidEmail.email && siret === opcoEpValidEmail.siret) {
    response = opcoEpEmailTrouve
  }

  if (email === opcoEpValidDomain.email && siret === opcoEpValidDomain.siret) {
    response = opcoEpDomaineIdentique
  }

  if (email === opcoEpInvalid.email && siret === opcoEpInvalid.siret) {
    response = opcoEpEmailOuDomaineInconnu
  }

  return opcoEpVerificationScope(email, siret).reply(200, response)
}

export const opcoEpVerificationReplyMock = (email: string, siret: string, status: number, body?: nock.Body) => {
  return opcoEpVerificationScope(email, siret).reply(status, body)
}
