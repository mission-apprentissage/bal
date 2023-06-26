const Checkbox = {
  parts: ["container", "control", "label"],
  baseStyle: {
    control: {
      borderColor: "grey.50",
      border: "1px",
      _checked: {
        background: "blue_france.main",
        color: "white",
        borderColor: "grey.50",
        border: "1px",
        _hover: {
          background: "blue_france.main",
          borderColor: "grey.50",
          border: "1px",
        },
      },
    },
  },
};

export { Checkbox };
