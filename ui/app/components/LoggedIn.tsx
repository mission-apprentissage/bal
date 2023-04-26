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

import { IResGetSession } from "../../../shared/routes/auth.routes";
import { useAuth } from "../../context/AuthContext";
import { Settings } from "../../theme/icons/Settings";
import { Settings4Fill } from "../../theme/icons/Settings4Fill";
import UserFill from "../../theme/icons/UserFill";
import { api } from "../../utils/api.utils";
interface Props {
  user: IResGetSession;
}

const LoggedIn: FC<Props> = ({ user }) => {
  const { setUser } = useAuth();
  const { push } = useRouter();

  const handleLogout = async () => {
    await api.get("/auth/logout");
    setUser();
    push("/");
  };

  return (
    <Box>
      <Menu placement="bottom">
        <MenuButton as={Button} variant="pill" px={0} flexGrow={1}>
          <Flex maxWidth="226px">
            <UserFill mt="0.3rem" boxSize={4} />
            <Box display={["none", "block"]} ml={2}>
              <Text
                color="bluefrance.main"
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
            href="/compte/profil"
            as={NavLink}
            icon={<Settings4Fill boxSize={4} color="bluefrance.main" />}
          >
            Mon compte
          </MenuItem>
          {user.is_admin && (
            <MenuGroup title="Administration">
              <MenuItem
                data-id="menuitem:importfile"
                href="/admin/import"
                as={NavLink}
                icon={<Settings boxSize={4} color="bluefrance.main" />}
              >
                Import de fichier
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
