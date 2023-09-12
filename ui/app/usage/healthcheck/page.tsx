"use client";
import { Box, Heading } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { IGetRoutes, IResponse } from "shared";

import { apiGet } from "../../../utils/api.utils";

const UsageHealthcheckPage = () => {
  const [responseData, setResponseData] = useState<IResponse<IGetRoutes["/healthcheck"]>>();
  useEffect(() => {
    apiGet("/healthcheck", {}).then((data) => {
      setResponseData(data);
    });
  }, []);

  return (
    <>
      <Heading as="h3" fontSize="lg" mb={[3, 6]}>
        POST api/healthcheck
      </Heading>

      {responseData && (
        <Box mt={4}>
          <Heading size="sm" mb={2}>
            Réponse
          </Heading>
          <Box mt={2} p={2} bgColor="grey.975">
            <pre>
              <p>{JSON.stringify(responseData, null, "\t")}</p>
            </pre>
          </Box>
        </Box>
      )}
    </>
  );
};

export default UsageHealthcheckPage;
