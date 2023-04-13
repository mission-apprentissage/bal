import {
  Box,
  ContainerProps,
  SystemStyleObject,
  Text,
  TypographyProps,
} from "@chakra-ui/react";
import React, { FC } from "react";

interface Props {
  size: ContainerProps["size"];
}

const FooterLogo: FC<Props> = ({ size = "sm" }) => {
  let fontSize: TypographyProps["fontSize"] = "0.7875rem";
  let beforeWidth: SystemStyleObject["width"] = "2.0625rem";
  let beforeHeight: SystemStyleObject["height"] = "0.75rem";
  let beforeMarginBottom: SystemStyleObject["marginBottom"] = "0.25rem";
  let beforeBackgroundSize: SystemStyleObject["backgroundSize"] =
    "2.0625rem 0.84375rem, 2.0625rem 0.75rem, 0";
  let beforeBackgroundPosition: SystemStyleObject["backgroundPosition"] =
    "0 -0.04688rem, 0 0, 0 0";

  if (size === "xl") {
    fontSize = ["1.05rem", "1.05rem", "1.3125rem"];
    beforeWidth = ["25rem", "25rem", "31.25rem"];
    beforeHeight = ["13.906rem", "13.906rem", "15.625rem"];
    beforeMarginBottom = ["0.33333rem", "0.33333rem", "0.41667rem"];
    beforeBackgroundSize = [
      "25rem 13.906rem, 25rem 13.906rem, 0",
      "25rem 13.906rem, 25rem 13.906rem, 0",
      "31.25rem 15.625rem, 31.25rem 15.625rem, 0",
    ];
    beforeBackgroundPosition = [
      "0 -0.0625rem, 0 0, 0 0",
      "0 -0.0625rem, 0 0, 0 0",
      "0 -0.07812rem, 0 0, 0 0",
    ];
  }

  return (
    <Box p={[0, 0, 4]}>
      <Text
        display="inline-block"
        fontSize={fontSize}
        fontWeight="700"
        textTransform={"uppercase"}
        lineHeight={"1.03175em"}
        letterSpacing={"-0.01em"}
        verticalAlign={"middle"}
        _before={{
          width: beforeWidth,
          height: beforeHeight,
          marginBottom: beforeMarginBottom,
          backgroundSize: beforeBackgroundSize,
          backgroundPosition: beforeBackgroundPosition,
          display: "block",
          content: "''",
          backgroundRepeat: "no-repeat, no-repeat, no-repeat",
          backgroundImage: "url(/images/footer_logo.png)",
        }}
      />
    </Box>
  );
};

export default FooterLogo;
