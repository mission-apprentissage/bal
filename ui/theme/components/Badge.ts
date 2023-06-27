const commonStatusBadgeStyle = {
  fontSize: "omega",
  fontWeight: 500,
  borderRadius: 20,
  px: 3,
  py: 1,
  textTransform: "none",
};

const Badge = {
  variants: {
    draft: {
      ...commonStatusBadgeStyle,
      bg: "#DEE5FD",
      color: "grey.50",
      border: "none",
    },
    waitingSignature: {
      ...commonStatusBadgeStyle,
      bg: "#FCEEAC",
      color: "grey.50",
      border: "none",
    },
    sign: {
      ...commonStatusBadgeStyle,
      bg: "greensoft.200",
      color: "success_main",
      pl: "15px",
      fontWeight: "500",
      pr: "15px",
    },
    refus: {
      ...commonStatusBadgeStyle,
      bg: "red_marianne",
      color: "white",
    },
    signaturesRefused: {
      ...commonStatusBadgeStyle,
      bg: "red_marianne",
      color: "white",
    },
    aTeletransmettre: {
      ...commonStatusBadgeStyle,
      bg: "#FBE769",
      color: "grey.50",
      border: "none",
    },
    nonConforme: {
      ...commonStatusBadgeStyle,
      bg: "#FBDFDB",
      color: "grey.50",
      border: "none",
    },
    published: {
      ...commonStatusBadgeStyle,
      bg: "#A9FB68",
      color: "grey.50",
      border: "none",
    },
    termine: {
      ...commonStatusBadgeStyle,
      bg: "grey.925",
      color: "grey.50",
      border: "none",
    },
    notRelevant: {
      ...commonStatusBadgeStyle,
      bg: "#e3e8ea",
      color: "grey.50",
      border: "1px solid",
      borderColor: "#e3e8ea",
    },

    conforme: {
      ...commonStatusBadgeStyle,
      bg: "success_main",
      color: "grey.50",
      border: "1px solid",
      borderColor: "success_light",
    },

    notPublished: {
      ...commonStatusBadgeStyle,
      bg: "grey.950",
      color: "grey.50",
      border: "1px solid",
      borderColor: "grey.950",
    },
    toBePublished: {
      ...commonStatusBadgeStyle,
      bg: "orangemedium.300",
      color: "grey.50",
      border: "1px solid",
      borderColor: "orangemedium.300",
    },

    pending: {
      ...commonStatusBadgeStyle,
      bg: "success_light",
      color: "#a3b3b7",
      border: "1px solid",
      borderColor: "success_light",
    },
    reject: {
      ...commonStatusBadgeStyle,
      bg: "red_marianne",
      color: "white",
    },
    unknown: {
      ...commonStatusBadgeStyle,
      bg: "#D5DBEF",
      color: "grey.50",
      border: "1px solid",
      borderColor: "#D5DBEF",
    },
    year: {
      ...commonStatusBadgeStyle,
      bg: "success_main",
      color: "grey.50",
      pl: "15px",
      pr: "15px",
    },
    signed: {
      ...commonStatusBadgeStyle,
      bg: "blue_france.light",
      color: "blue_france.main",
    },
    save: {
      ...commonStatusBadgeStyle,
      bg: "grey.950",
      color: "grey.50",
      pl: "15px",
      pr: "15px",
      fontWeight: "500",
    },
    purple: {
      ...commonStatusBadgeStyle,
      bg: "blue_france.light",
      color: "blue_france.main",
    },
    grey: {
      ...commonStatusBadgeStyle,
      bg: "grey.950",
      color: "grey.50",
      pl: "15px",
      pr: "15px",
      fontWeight: "500",
    },
  },
};

export { Badge };
