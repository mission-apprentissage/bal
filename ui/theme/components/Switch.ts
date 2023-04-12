const Switch = {
  parts: ["container", "track", "label", "thumb"],
  baseStyle: {
    thumb: {
      borderTop: "1px",
      borderRight: "1px",
      borderBottom: "1px",
      borderLeft: "1px",
      bordercolor: "bluefrance.main",
      ml: "-3px",
      mt: "-3px",

      padding: "10px",
    },
    track: {
      background: "white",
      border: "1px",
      bordercolor: "bluefrance.main",
      _checked: {
        background: "bluefrance",
      },
    },
  },
  variants: {
    icon: {
      thumb: {
        _checked: {
          _before: {
            color: "bluefrance.main",
            width: "var(--slider-track-height)",
            height: "var(--slider-track-height)",
            content: '"✓"',
            position: "absolute",
            ml: "-5px",
            fontSize: "0.8em",
          },
        },
      },
    },
  },
};

export { Switch };
