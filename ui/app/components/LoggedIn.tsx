import {
  Box,
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import NavLink from "next/link";
import { useRouter } from "next/navigation";
import { FC } from "react";
import { IUserPublic } from "shared/models/user.model";

import { useAuth } from "../../context/AuthContext";
import { Settings } from "../../theme/icons/Settings";
import { Settings4Fill } from "../../theme/icons/Settings4Fill";
import UserFill from "../../theme/icons/UserFill";
import { apiGet } from "../../utils/api.utils";
import { PAGES } from "./breadcrumb/Breadcrumb";
interface Props {
  user: IUserPublic;
}

const LoggedIn: FC<Props> = ({ user }) => {
  const { setUser } = useAuth();
  const { push } = useRouter();

  const handleLogout = async () => {
    await apiGet("/auth/logout", {});
    setUser();
    push("/");
  };

  return (
    <Box>
      <Menu placement="bottom">
        <MenuButton
          as={Button}
          variant="pill"
          px={0}
          flexGrow={1}
          data-id="menu:user"
        >
          <Flex maxWidth="226px">
            <UserFill mt="0.3rem" boxSize={4} />
            <Box display={["none", "block"]} ml={2}>
              <Text
                color="blue_france.main"
                textStyle="sm"
                textOverflow="ellipsis"
                maxWidth="200px"
                overflow="hidden"
              >
                {user.email}
              </Text>
            </Box>
          </Flex>
        </MenuButton>
        <MenuList>
          <MenuItem
            href={PAGES.compteProfil().path}
            as={NavLink}
            icon={<Settings4Fill boxSize={4} color="blue_france.main" />}
          >
            Mon compte
          </MenuItem>
          {user.is_admin && (
            <MenuGroup title="Administration">
              <MenuItem
                data-id="menuitem:admin:users"
                href={PAGES.adminUsers().path}
                as={NavLink}
                icon={<Settings boxSize={4} color="blue_france.main" />}
              >
                Gestion des utilisateurs
              </MenuItem>
              <MenuItem
                data-id="menuitem:admin:persons"
                href={PAGES.adminPersons().path}
                as={NavLink}
                icon={<Settings boxSize={4} color="blue_france.main" />}
              >
                Gestion des personnes
              </MenuItem>
              <MenuItem
                data-id="menuitem:admin:organisations"
                href={PAGES.adminOrganisations().path}
                as={NavLink}
                icon={<Settings boxSize={4} color="blue_france.main" />}
              >
                Gestion des organisations
              </MenuItem>
              <MenuItem
                data-id="menuitem:admin:manage-files"
                href={PAGES.adminFichier().path}
                as={NavLink}
                icon={<Settings boxSize={4} color="blue_france.main" />}
              >
                Gestion des fichiers
              </MenuItem>
            </MenuGroup>
          )}
          <MenuDivider />
          <MenuItem onClick={handleLogout}>Déconnexion</MenuItem>
        </MenuList>
      </Menu>
    </Box>
  );
};

export default LoggedIn;
