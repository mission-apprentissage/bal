const Radio = {
  parts: ["container", "control", "label"],
  baseStyle: {
    control: {
      borderColor: "grey.50",
      border: "1px",
      _checked: {
        color: "blue_france.main",
        p: "1px",
        background: "white",
        bordercolor: "blue_france.main",
        _hover: {
          background: "white",
          bordercolor: "blue_france.main",
        },
      },
    },
  },
};

export { Radio };
