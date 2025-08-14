"use client";
import { Box, Typography } from "@mui/material";
import { ProcessorStatusCronComponent } from "job-processor/dist/react";
import { use } from "react";
import { ProcessorStatusProvider } from "@/app/admin/processeur/components/ProcessorStatusProvider";
import Breadcrumb, { PAGES } from "@/app/components/breadcrumb/Breadcrumb";

import { publicConfig } from "@/config.public";

export default function JobTypePage({ params }: { params: Promise<{ name: string }> }) {
  const { name: rawName } = use(params);
  const name = decodeURIComponent(rawName);
  return (
    <Box>
      <Breadcrumb pages={[PAGES.adminProcessor(), PAGES.adminProcessorCron(name)]} />
      <Typography variant="h2" gutterBottom>
        {PAGES.adminProcessorCron(name).title}
      </Typography>
      <ProcessorStatusProvider>
        {(status) => (
          <ProcessorStatusCronComponent
            name={name}
            status={status}
            baseUrl={new URL(PAGES.adminProcessor().path, publicConfig.baseUrl).href}
          />
        )}
      </ProcessorStatusProvider>
    </Box>
  );
}
