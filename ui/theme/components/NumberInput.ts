const commonFieldStyle = {
  color: "grey.50",
  borderBottomRadius: 0,
  borderTopRadius: "4px",
  borderWidth: 0,
  borderBottom: "2px solid",
  marginBottom: "-2px",
  borderBottomColor: "grey.425",
  bg: "grey.950",
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
    borderBottomColor: "error_main",
    boxShadow: "none",
    outlineColor: "error_main",
    outlineOffset: "2px",
  },
  _hover: {
    borderBottomColor: "grey.425",
  },
};

const NumberInput = {
  parts: ["field"],
  variants: {
    cerfa: {
      field: {
        ...commonFieldStyle,
        _disabled: {
          cursor: "not-allowed",
          opacity: 1,
          color: "grey.425",
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
        _placeholder: {
          color: "grey.625",
        },
      },
    },
    valid: {
      field: {
        ...commonFieldStyle,
        borderBottomColor: "green.500",
      },
    },
    autoFilled: {
      field: {
        ...commonFieldStyle,
        fontStyle: "italic",
        borderBottomColor: "green.400",
        _placeholder: {
          color: "grey.50",
        },
      },
    },
  },
};

export { NumberInput };
