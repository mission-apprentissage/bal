const Radio = {
  parts: ["container", "control", "label"],
  baseStyle: {
    control: {
      borderColor: "#161616",
      border: "1px",
      _checked: {
        color: "bluefrance.main",
        p: "1px",
        background: "white",
        bordercolor: "bluefrance.main",
        _hover: {
          background: "white",
          bordercolor: "bluefrance.main",
        },
      },
    },
  },
};

export { Radio };
