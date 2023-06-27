const commonButtonStyle = {
  borderRadius: 0,
  textTransform: "none",
  fontWeight: 400,
  _focus: { boxShadow: "none", outlineColor: "none" },
  _focusVisible: { boxShadow: "0 0 0 3px #2A7FFE", outlineColor: "#2A7FFE" },
};

const baseStyle = {
  fontWeight: "400",
  fontFamily: "Marianne",
  borderRadius: "0",
  paddingX: "2w",
  lineHeight: "1.4",
  color: "grey.50",
  _hover: { textDecoration: "underline" },
};

const Button = {
  variants: {
    unstyled: {
      ...commonButtonStyle,
    },
    primary: {
      ...baseStyle,
      background: "blue_france.main",
      color: "white",
      _hover: {
        background: "blue_france.main_hover",
      },
      _disabled: {
        background: "grey.950",
        border: "none",
        color: "grey.425",
      },
    },
    ["primary-dark"]: {
      ...baseStyle,
      background: "#9a9aff",
      color: "blue_france.main",
      _hover: {
        background: "#8585f6",
      },
      _disabled: {
        background: "grey.200",
        color: "grey.850",
      },
    },
    ["select-primary"]: {
      ...baseStyle,
      color: "blue_france.main",
      border: "none",
      fontWeight: "700",
      fontSize: "gamma",
      paddingX: "0",
      _hover: {
        textDecoration: "none",
      },
    },
    ["select-secondary"]: {
      ...baseStyle,
      borderRadius: "40px",
      paddingY: "3v",
      backgroundColor: "grey.950",
      color: "grey.200",
      _hover: {
        background: "grey.950",
      },
      _active: {
        background: "#f2f2f9",
        border: "solid 1px",
        bordercolor: "blue_france.main",
      },
    },
    secondary: {
      ...baseStyle,
      border: "solid 1px",
      background: "transparent",
      bordercolor: "blue_france.main",
      color: "blue_france.main",
      _hover: {
        background: "grey.975",
      },
      _active: {
        background: "white",
      },
      _disabled: {
        color: "grey.425",
        borderColor: "grey.850",
      },
    },
    link: {
      ...baseStyle,
      color: "blue_france.main",
      border: "none",
      borderRadius: "40px",
      padding: "3v",
      _hover: {
        textDecoration: null,
        background: "grey.975",
      },
    },
    badge: {
      ...baseStyle,
      color: "blue_france.main",
      backgroundColor: "blue_france.light",
      height: "30px",
      borderRadius: "40px",
      fontSize: "zeta",
      _hover: {
        background: "blue_france.light_hover",
      },
    },
    badgeSelected: {
      ...baseStyle,
      color: "white",
      backgroundcolor: "blue_france.main",
      height: "30px",
      borderRadius: "40px",
      fontSize: "zeta",
      _hover: {
        background: "blue_france.main_hover",
      },
    },
  },
};

export { Button };
