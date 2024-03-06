import { CerfaForm } from "shared/helpers/cerfa/types/cerfa.types";

import { CerfaControl } from "..";

interface CreateCopyRuleParams {
  mapping: Record<string, string>;
  copyIf: ({ values }: CerfaForm) => boolean;
}

type ControlGenerator = (params: CreateCopyRuleParams) => CerfaControl[];

export const createCopyRules: ControlGenerator = ({ mapping, copyIf }) => {
  return Object.entries(mapping).map(([from, target]) => ({
    deps: [from, target],
    process: ({ values, fields }) => {
      if (copyIf({ values })) {
        return {
          cascade: {
            [target]: {
              value: fields[from].value,
              cascade: false,
            },
          },
        };
      }
    },
  }));
};
