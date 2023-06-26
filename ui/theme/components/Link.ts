const Link = {
  baseStyle: {
    _focus: { boxShadow: "none", outlineColor: "none" },
    _focusVisible: { boxShadow: "0 0 0 3px #2A7FFE", outlineColor: "#2A7FFE" },
  },
  variants: {
    card: {
      p: 8,
      bg: "grey_alt_light",
      _hover: { bg: "grey_alt_dark", textDecoration: "none" },
      display: "block",
    },
    pill: {
      borderRadius: 24,
      fontSize: "zeta",
      color: "blue_france.main",
      px: 3,
      py: 1,
      _hover: { bg: "grey.950", textDecoration: "none" },
    },
    summary: {
      fontSize: "zeta",
      _hover: { textDecoration: "none", bg: "grey.950" },
      p: 2,
    },
  },
};

export { Link };
