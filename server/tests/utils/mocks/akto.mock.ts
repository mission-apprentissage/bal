import nock from "nock";
import querystring from "querystring";

import config from "@/config";

import { AKTO_API_BASE_URL, AKTO_AUTH_BASE_URL } from "../../../src/common/apis/akto";
import { aktoMatch, aktoNotMatch, aktoToken, aktoValid } from "../../data/akto";

export const aktoTokenMock = () => {
  return nock(AKTO_AUTH_BASE_URL)
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
    .reply(200, aktoToken);
};

export const aktoVerificationMock = (email: string, siren: string) => {
  let response = aktoNotMatch;

  if (email === aktoValid.email && siren === aktoValid.siren) {
    response = aktoMatch;
  }
  return nock(AKTO_API_BASE_URL).persist().get("/Relations/Validation").query({ email, siren }).reply(200, response);
};
