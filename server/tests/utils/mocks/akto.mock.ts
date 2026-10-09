import nock from "nock"
import querystring from "querystring"
import config from "@/config"
import { AKTO_API_BASE_URL, AKTO_AUTH_BASE_URL } from "../../../src/common/apis/akto"
import { aktoMatch, aktoNotMatch, aktoToken, aktoValid } from "../../data/akto"

const aktoTokenScope = () =>
  nock(AKTO_AUTH_BASE_URL)
    .persist()
    .post(
      "/0285c9cb-dd17-4c1e-9621-c83e9204ad68/oauth2/v2.0/token",
      querystring.stringify({
        grant_type: config.akto.grantType,
        client_id: config.akto.clientId,
        client_secret: config.akto.clientSecret,
        scope: config.akto.scope,
      })
    )

const aktoVerificationScope = (email: string, siren: string) => nock(AKTO_API_BASE_URL).persist().get("/Relations/Validation").query({ email, siren })

export const aktoTokenMock = (token: nock.Body = aktoToken) => {
  return aktoTokenScope().reply(200, token)
}

export const aktoTokenErrorMock = (status: number) => {
  return aktoTokenScope().reply(status)
}

export const aktoTokenDelayedMock = (delayMs: number) => {
  return aktoTokenScope().delay(delayMs).reply(200, aktoToken)
}

/** Une réponse par appel, dans l'ordre : un appel de trop ne trouve aucun mock. */
export const aktoTokenSequenceMock = (count: number) => {
  const scope = nock(AKTO_AUTH_BASE_URL)
  for (let i = 0; i < count; i++) {
    scope.post("/0285c9cb-dd17-4c1e-9621-c83e9204ad68/oauth2/v2.0/token").reply(200, aktoToken)
  }
  return scope
}

export const aktoVerificationMock = (email: string, siren: string) => {
  let response = aktoNotMatch

  if (email === aktoValid.email && siren === aktoValid.siren) {
    response = aktoMatch
  }
  return aktoVerificationScope(email, siren).reply(200, response)
}

export const aktoVerificationReplyMock = (email: string, siren: string, status: number, body?: nock.Body) => {
  return aktoVerificationScope(email, siren).reply(status, body)
}

export const aktoVerificationDelayedMock = (email: string, siren: string, delayMs: number, body: nock.Body) => {
  return aktoVerificationScope(email, siren).delay(delayMs).reply(200, body)
}

/** Une réponse par appel, dans l'ordre : un appel de trop ne trouve aucun mock. */
export const aktoVerificationSequenceMock = (email: string, siren: string, replies: Array<{ status: number; body?: nock.Body }>) => {
  const scope = nock(AKTO_API_BASE_URL)
  for (const { status, body } of replies) {
    scope.get("/Relations/Validation").query({ email, siren }).reply(status, body)
  }
  return scope
}

export const aktoVerificationNetworkErrorMock = (email: string, siren: string) => {
  return aktoVerificationScope(email, siren).replyWithError(Object.assign(new Error("read ECONNRESET"), { code: "ECONNRESET" }))
}
