const Switch = {
  parts: ["container", "track", "label", "thumb"],
  baseStyle: {
    thumb: {
      borderTop: "1px",
      borderRight: "1px",
      borderBottom: "1px",
      borderLeft: "1px",
      bordercolor: "blue_france.main",
      ml: "-3px",
      mt: "-3px",

      padding: "10px",
    },
    track: {
      background: "white",
      border: "1px",
      bordercolor: "blue_france.main",
      _checked: {
        background: "blue_france.main",
      },
    },
  },
  variants: {
    icon: {
      thumb: {
        _checked: {
          _before: {
            color: "blue_france.main",
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
