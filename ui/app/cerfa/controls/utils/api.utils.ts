import { apiPost } from "../../../../utils/api.utils";

type ErrorReturn = {
  error: string;
};

interface APIServiceCommonParams {
  dossierId: string;
  signal: AbortSignal;
}

type APIServiceAction<T> = (params: T & APIServiceCommonParams) => Promise<any> | ErrorReturn;

interface FetchSiretParams {
  siret: string;
  organismeFormation?: boolean;
}

export const fetchSiret: APIServiceAction<FetchSiretParams> = async ({
  siret,
  organismeFormation = false,
  dossierId: _dossierId,
  signal: _signal,
}) => {
  try {
    return apiPost("/v1/siret", {
      body: {
        siret,
        organismeFormation,
      },
    });
  } catch (e) {
    if (e.name === "AbortError") throw e;
    return { error: e.prettyMessage ?? "Une erreur technique est survenue" };
  }
};

interface FetchCodePostalParams {
  codePostal: string;
}

export const fetchCodePostal: APIServiceAction<FetchCodePostalParams> = async ({
  codePostal,
  dossierId: _dossierId,
  signal: _signal,
}) => {
  try {
    return apiPost("/v1/geo/cp", {
      body: {
        codePostal,
      },
    });
  } catch (e) {
    if (e.name === "AbortError") throw e;
    return { error: e.prettyMessage ?? "Une erreur technique est survenue" };
  }
};

interface FetchNafParams {
  naf: string;
}

export const fetchNaf: APIServiceAction<FetchNafParams> = async ({ naf, dossierId: _dossierId, signal: _signal }) => {
  try {
    return apiPost("/v1/naf", {
      body: {
        naf,
      },
    });
  } catch (e) {
    if (e.name === "AbortError") throw e;
    return { error: e.prettyMessage ?? "Une erreur technique est survenue" };
  }
};

interface FetchCfdrncpParams {
  rncp: string;
  cfd: string;
}

export const fetchCfdrncp: APIServiceAction<FetchCfdrncpParams> = async ({
  rncp,
  cfd,
  dossierId: _dossierId,
  signal: _signal,
}) => {
  try {
    return apiPost("/v1/cfdrncp", {
      body: {
        rncp,
        cfd,
      },
    });
  } catch (e) {
    if (e.name === "AbortError") throw e;
    return { error: e.prettyMessage ?? "Une erreur technique est survenue" };
  }
};

export const apiService = {
  fetchSiret,
  fetchCodePostal,
  fetchNaf,
  fetchCfdrncp,
};
