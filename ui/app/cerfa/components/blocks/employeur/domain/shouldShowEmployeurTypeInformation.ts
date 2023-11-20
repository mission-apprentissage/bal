interface Form {
  values: any;
}

export const shouldShowEmployeurTypeInformation = ({ values }: Form) => {
  return values.employeur.privePublic === "public";
};
