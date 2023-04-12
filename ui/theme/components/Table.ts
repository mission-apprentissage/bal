export const Table = {
  variants: {
    primary: {
      th: {
        fontFamily: "heading",
        fontWeight: "bold",
        fontSize: "zeta",
        color: "grey.600",
        textTransform: "none",
      },
      tbody: {
        tr: {
          fontSize: "zeta",
          color: "grey.800",
          bordercolor: "bluefrance.main",
          "&:nth-of-type(odd)": {
            backgroundColor: "grey.100",
          },
          _hover: {
            color: "bluefrance.main",
            backgroundColor: "grey.200",
            cursor: "pointer",
          },
        },
      },
    },
    secondary: {
      th: {
        textTransform: "initial",
        textColor: "grey.800",
        fontSize: "zeta",
        fontWeight: "700",
        paddingY: "3w",
        letterSpacing: "0px",
        borderBottom: "2px solid",
        borderBottomcolor: "bluefrance.main",
      },
      tbody: {
        tr: {
          fontSize: "zeta",
          color: "grey.800",
          bordercolor: "bluefrance.main",
          _hover: {
            color: "bluefrance.main",
            backgroundColor: "grey.200",
            cursor: "pointer",
          },
        },
      },
    },
  },
};
