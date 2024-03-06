import * as Yup from "yup";

import { controlEmail } from "../utils/api.utils";

export const emailControl = async (email: string) => {
  if (!email) {
    return;
  }

  // check email regex
  if (!/\S+@\S+\.\S+/.test(email)) {
    return {
      error: `Le courriel doit comporter "@" et "." pour être valide`,
    };
  }

  try {
    await Yup.string().email().validate(email);
  } catch (error) {
    return { error: "Le courriel doit être valide." };
  }

  const { is_valid } = await controlEmail(email);

  if (!is_valid) {
    return {
      error: "Le nom de domaine après le @ n’existe pas ou n’est pas valide",
    };
  }
};
