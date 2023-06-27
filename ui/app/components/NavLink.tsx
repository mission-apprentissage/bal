import { Link } from "@chakra-ui/react";
import NextLink from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import { FC, ReactNode } from "react";

interface Props {
  children: ReactNode;
  segment: string | null;
  href: string;
}

export const NavLink: FC<Props> = ({ children, segment, href }) => {
  const activeSegment = useSelectedLayoutSegment();
  const isActive = activeSegment === segment;
  return (
    <Link
      variant={"unstyled"}
      as={NextLink}
      href={href}
      fontSize={14}
      p={4}
      color="blue_france.main"
      borderBottomWidth={3}
      borderColor={isActive ? "blue_france.main" : "transparent"}
      _hover={{ textDecoration: "unset", bg: "grey.9750_hover" }}
    >
      {children}
    </Link>
  );
};
