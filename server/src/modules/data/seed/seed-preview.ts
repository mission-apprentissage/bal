
import { createUser } from "../../actions/users.actions";


export const seedPreview = async () => {
    await createUser({ email: "test@bal.apprentissage.beta.gouv.fr", password: "test" });
};

