export const aktoToken = {
  token_type: "Bearer",
  expires_in: 3599,
  ext_expires_in: 3599,
  access_token: "access_token",
};

export const aktoMatch = {
  data: { match: true },
};

export const aktoNotMatch = {
  data: { match: false },
};

export const aktoValid = {
  email: "valid-akto@test.dev",
  siren: "123412341",
};

export const aktoInvalid = {
  email: "invalid-akto@test.dev",
  siren: "432143214",
};
