interface Form {
  values: any;
}

export const shouldAskRepresentantLegal = ({ values }: Form) => {
  return values.apprenti.apprentiMineurNonEmancipe === "oui";
};
