"use client";
import { Box, Typography } from "@mui/material";
import { ProcessorStatusJobComponent } from "job-processor/dist/react";
import { use } from "react";

import { ProcessorStatusProvider } from "@/app/admin/processeur/components/ProcessorStatusProvider";
import Breadcrumb, { PAGES } from "@/app/components/breadcrumb/Breadcrumb";
import { publicConfig } from "@/config.public";

export default function JobTypePage({ params }: { params: Promise<{ name: string }> }) {
  const { name: rawName } = use(params);
  const name = decodeURIComponent(rawName);

  return (
    <Box>
      <Breadcrumb pages={[PAGES.adminProcessor(), PAGES.adminProcessorJob(name)]} />
      <Typography variant="h2" gutterBottom>
        {PAGES.adminProcessorJob(name).title}
      </Typography>
      <ProcessorStatusProvider>
        {(status) => (
          <ProcessorStatusJobComponent
            name={name}
            status={status}
            baseUrl={new URL(PAGES.adminProcessor().title, publicConfig.baseUrl).href}
          />
        )}
      </ProcessorStatusProvider>
    </Box>
  );
}
