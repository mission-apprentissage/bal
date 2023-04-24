import { config } from "../config/config";
import { createClamav } from "./modules/services/clamav";

export let clamav: ReturnType<typeof createClamav>;

const createGlobalServices = async () => {
  // Hack pour rendre ces services globaux
  // On pourra passer par un singleton global plus tard (pour rester dans la mouvance des actions)
  clamav = createClamav(config.clamav.uri);
};

export default createGlobalServices;
