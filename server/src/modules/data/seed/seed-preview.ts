
import { config } from "../../../../config/config";
import { createUser } from "../../actions/users.actions";

export const seedPreview = async () => {
    await createUser({ email: config.tests.testUserName, password: config.tests.testUserPwd });
    await createUser({
        email: config.tests.testAdminName,
        password: config.tests.testAdminPwd,
        isAdmin: true,
    });
};
