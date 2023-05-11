export const opcoEptoken = {
  access_token: "access_token",
  expires_in: 300,
  refresh_expires_in: 0,
  token_type: "Bearer",
  "not-before-policy": 0,
  scope: "email profile",
};

//   1-	SIRET et courriel connus
export const opcoEpEmailTrouve = {
  codeRetour: 1,
  detailRetour: "Email trouvé",
};

// 2-	SIRET connu et domaine courriel connu
export const opcoEpDomaineIdentique = {
  codeRetour: 2,
  detailRetour: "Domaine identique",
};

// 3-	SIRET connu et domaine courriel inconnu
export const opcoEpEmailOuDomaineInconnu = {
  codeRetour: 3,
  detailRetour: "Email ou domaine inconnu",
};

// 4-	SIRET inconnu
export const opcoEpSiretInconnu = {
  codeRetour: 4,
  detailRetour: "Siret inconnu",
};

export const opcoEpValidEmail = {
  email: "valid-email-opco@test.dev",
  siret: "12341234123412",
};

export const opcoEpValidDomain = {
  email: "valid-domain-opco@test.dev",
  siret: "43214321432121",
};

export const opcoEpInvalid = {
  email: "invalid-opco@test.dev",
  siret: "99999999999999",
};

export const opcoEpInvalidSiret = {
  email: "invalid-siret-opco@test.dev",
  siret: "88888888888888",
};
