const Textarea = {
  variants: {
    outline: {
      borderBottomRadius: 0,
      borderWidth: 0,
      borderBottom: "2px solid",
      marginBottom: "-2px",
      borderBottomColor: "grey.425",
      bg: "grey.950",
      borderTopRadius: "4px",
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
        outline: "2px solid",
        outlineColor: "error_main",
        outlineOffset: "2px",
      },
      _hover: {
        borderBottomColor: "grey.425",
      },
    },
  },
};

export { Textarea };
