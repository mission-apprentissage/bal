"use client"

import { Typography } from "@mui/material"
import { captureException } from "@sentry/nextjs"
import { useEffect, useState } from "react"
import type { IGetRoutes, IResponse } from "shared"
import ViewData from "@/app/usage/components/ViewData"
import { apiGet } from "@/utils/api.utils"

const UsageHealthcheckPage = () => {
  const [responseData, setResponseData] = useState<IResponse<IGetRoutes["/healthcheck"]>>()
  useEffect(() => {
    let cancelled = false
    apiGet("/healthcheck", {})
      .then((data) => {
        if (!cancelled) {
          setResponseData(data)
        }
      })
      .catch(captureException)

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <>
      <Typography variant="h4" gutterBottom>
        POST api/healthcheck
      </Typography>

      <ViewData title="Réponse" data={responseData} />
    </>
  )
}

export default UsageHealthcheckPage
