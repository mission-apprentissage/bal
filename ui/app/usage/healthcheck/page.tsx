"use client";

import { Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { IGetRoutes, IResponse } from "shared";

import { apiGet } from "../../../utils/api.utils";
import Breadcrumb, { PAGES } from "../../components/breadcrumb/Breadcrumb";
import ViewData from "../components/ViewData";

const UsageHealthcheckPage = () => {
  const [responseData, setResponseData] = useState<IResponse<IGetRoutes["/healthcheck"]>>();
  useEffect(() => {
    apiGet("/healthcheck", {}).then((data) => {
      setResponseData(data);
    });
  }, []);

  return (
    <>
      <Breadcrumb pages={[PAGES.usageApi(), PAGES.usageApiHealthcheck()]} />
      <Typography variant="h2" gutterBottom>
        Tester l'API
      </Typography>
      <Typography variant="h4" gutterBottom>
        POST api/healthcheck
      </Typography>

      <ViewData title="Réponse" data={responseData} />
    </>
  );
};

export default UsageHealthcheckPage;
