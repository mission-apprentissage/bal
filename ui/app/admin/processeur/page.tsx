"use client";
import { Box, Typography } from "@mui/material";
import { ProcessorStatusIndexComponent } from "job-processor/dist/react";

import { ProcessorStatusProvider } from "./components/ProcessorStatusProvider";
import { publicConfig } from "@/config.public";
import Breadcrumb, { PAGES } from "@/app/components/breadcrumb/Breadcrumb";

export default function AdminProcessorPage() {
  return (
    <Box>
      <Breadcrumb pages={[PAGES.adminProcessor()]} />
      <Typography variant="h2" gutterBottom>
        {PAGES.adminProcessor().title}
      </Typography>
      <ProcessorStatusProvider>
        {(status) => (
          <ProcessorStatusIndexComponent
            status={status}
            baseUrl={new URL(PAGES.adminProcessor().path, publicConfig.baseUrl).href}
          />
        )}
      </ProcessorStatusProvider>
    </Box>
  );
}
