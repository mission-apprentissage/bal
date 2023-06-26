const commonFieldStyle = {
  color: "grey.50",
  borderBottomRadius: 0,
  borderWidth: 0,
  borderBottom: "2px solid",
  marginBottom: "0",
  borderBottomColor: "grey.425",
  bg: "grey.950",
  borderTopRadius: "4px",
  outline: "0px solid",
  _focus: {
    borderBottomColor: "grey.425",
    boxShadow: "none",
    outlineColor: "none",
  },
  _focusVisible: {
    borderBottomColor: "grey.425",
    boxShadow: "none",
    outline: "2px solid",
    outlineColor: "#2A7FFE",
    outlineOffset: "2px",
  },
  _invalid: {
    borderBottomColor: "grey.425",
    boxShadow: "none",
    // outline: "2px solid",
    outlineColor: "error_main",
    outlineOffset: "2px",
  },
  _hover: {
    borderBottomColor: "grey.425",
  },
  _disabled: { opacity: 0.7 },
};

const Select = {
  parts: ["field"],
  variants: {
    cerfa: {
      field: {
        ...commonFieldStyle,
        _disabled: {
          cursor: "not-allowed",
          color: "grey.425",
          opacity: 1,
          borderBottomColor: "grey.925",
        },
      },
    },
    edition: {
      field: {
        ...commonFieldStyle,
        fontWeight: 700,
      },
    },
    outline: {
      field: {
        ...commonFieldStyle,
      },
    },
    valid: {
      field: {
        ...commonFieldStyle,
        borderBottomColor: "green.500",
      },
    },
  },
};

export { Select };
