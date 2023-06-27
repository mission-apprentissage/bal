const Tabs = {
  parts: ["tablist", "tab", "tabpanel"],
  variants: {
    line: {
      tab: {
        paddingX: "3w",
        paddingY: "3v",
        marginRight: "1w",
        position: "relative",
        bottom: "-1px",
        color: "grey.200",
        fontWeight: "400",
        fontSize: "zeta",
        _hover: {
          background: "grey.975",
        },
        _selected: {
          background: "white",
          color: "blue_france.main",
          borderBottom: "none",
          borderLeft: "1px solid",
          borderRight: "1px solid",
          borderTop: "2px solid",
          borderTopcolor: "blue_france.main",
          borderRightColor: "grey.950",
          borderLeftColor: "grey.950",
        },
        _focus: { boxShadow: "none", outlineColor: "none" },
        _focusVisible: {
          boxShadow: "0 0 0 3px #2A7FFE",
          outlineColor: "#2A7FFE",
        },

        // only difference with search.tab variant
        background: "blue_france.light",
      },
    },
    search: {
      tablist: {
        paddingX: "0 !important",
        background: "transparent",
        border: "none",
        borderBottom: "1px solid",
        borderBottomColor: "grey.950",
      },
      tabpanel: {
        paddingY: "3w",
        paddingX: "0 !important",
        h: "auto",
      },
      tab: {
        paddingX: "3w",
        paddingY: "3v",
        marginRight: "1w",
        position: "relative",
        bottom: "-1px",
        color: "grey.200",
        background: "bluesoft.100",
        fontWeight: "400",
        fontSize: "zeta",
        _hover: {
          background: "grey.975",
        },
        _selected: {
          background: "white",
          color: "blue_france.main",
          borderBottom: "none",
          borderLeft: "1px solid",
          borderRight: "1px solid",
          borderTop: "2px solid",
          borderTopcolor: "blue_france.main",
          borderRightColor: "grey.950",
          borderLeftColor: "grey.950",
        },
        _focus: { boxShadow: "none", outlineColor: "none" },
        _focusVisible: {
          boxShadow: "0 0 0 3px #2A7FFE",
          outlineColor: "#2A7FFE",
        },
      },
    },
  },
};

export { Tabs };
