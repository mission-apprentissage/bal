import { Command } from "commander";

import { createUser } from "../services/userService";

const program = new Command();

program
  .command("users:create")
  .description("Créer un utilisateur")
  .option("-e, --email <string>", "Email de l'utilisateur")
  .action(async ({ email }) => {
    const user = await createUser({ email });

    console.log(user);
  });

program.parse(process.argv);
