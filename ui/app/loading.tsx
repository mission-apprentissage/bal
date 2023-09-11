"use client";
import { Box, CircularProgress } from "@mui/material";

export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <Box my={4} display="flex" justifyContent="center" alignItems="center">
      <CircularProgress />
    </Box>
  );
}
