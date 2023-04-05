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
      color="bluefrance.113"
      borderBottomWidth={3}
      borderColor={isActive ? "bluefrance.113" : "transparent"}
      _hover={{ textDecoration: "unset", bg: "grey.1000_hover" }}
    >
      {children}
    </Link>
  );
};
