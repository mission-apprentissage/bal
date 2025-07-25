"use client";

import { Typography } from "@mui/material";
import { useEffect, useState } from "react";
import type { IGetRoutes, IResponse } from "shared";

import { apiGet } from "@/utils/api.utils";
import ViewData from "@/app/usage/components/ViewData";

const UsageHealthcheckPage = () => {
  const [responseData, setResponseData] = useState<IResponse<IGetRoutes["/healthcheck"]>>();
  useEffect(() => {
    apiGet("/healthcheck", {}).then((data) => {
      setResponseData(data);
    });
  }, []);

  return (
    <>
      <Typography variant="h4" gutterBottom>
        POST api/healthcheck
      </Typography>

      <ViewData title="Réponse" data={responseData} />
    </>
  );
};

export default UsageHealthcheckPage;
