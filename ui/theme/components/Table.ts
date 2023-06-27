export const Table = {
  variants: {
    primary: {
      th: {
        fontFamily: "heading",
        fontWeight: "bold",
        fontSize: "zeta",
        color: "grey.425",
        textTransform: "none",
      },
      tbody: {
        tr: {
          fontSize: "zeta",
          color: "grey.50",
          bordercolor: "blue_france.main",
          "&:nth-of-type(odd)": {
            backgroundColor: "grey.975",
          },
          _hover: {
            color: "blue_france.main",
            backgroundColor: "grey.950",
            cursor: "pointer",
          },
        },
      },
    },
    secondary: {
      th: {
        textTransform: "initial",
        textColor: "grey.50",
        fontSize: "zeta",
        fontWeight: "700",
        paddingY: "3w",
        letterSpacing: "0px",
        borderBottom: "2px solid",
        borderBottomcolor: "blue_france.main",
      },
      tbody: {
        tr: {
          fontSize: "zeta",
          color: "grey.50",
          bordercolor: "blue_france.main",
          _hover: {
            color: "blue_france.main",
            backgroundColor: "grey.950",
            cursor: "pointer",
          },
        },
      },
    },
  },
};
