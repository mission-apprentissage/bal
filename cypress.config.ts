import { defineConfig } from "cypress";
import * as dotenv from "dotenv";
dotenv.config();

export default defineConfig({
  viewportHeight: 956,
  viewportWidth: 945,
  env: {
    email_user: process.env.CYPRESS_EMAIL_USER,
    password_user: process.env.CYPRESS_PWD_USER,
    email_admin: process.env.CYPRESS_EMAIL_ADMIN,
    password_admin: process.env.CYPRESS_PWD_ADMIN,
  },
  e2e: {
    video: false,
  },
});
