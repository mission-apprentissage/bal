const SIRET_REGEX_PATTERN = "^[0-9]{14}$";
const UAI_REGEX_PATTERN = "^[0-9]{7}[a-zA-Z]$";

export const SIRET_REGEX = new RegExp(SIRET_REGEX_PATTERN);
export const UAI_REGEX = new RegExp(UAI_REGEX_PATTERN);
