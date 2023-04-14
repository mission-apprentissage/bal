
import { createUser } from "../../actions/users.actions";

export const seedPreview = async () => {
    await createUser({ email: config.tests.testUserName, password: config.tests.testUserPwd });
  await createUser({
    email: "test-admin@bal.apprentissage.beta.gouv.fr",
    password: "test",
    isAdmin: true,
  });
};
