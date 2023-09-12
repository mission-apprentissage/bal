import { Box } from "@mui/material";
import { DataGrid, DataGridProps, GridValidRowModel } from "@mui/x-data-grid";

export const Table = <R extends GridValidRowModel = any>(props: DataGridProps<R>) => {
  return (
    <Box my={2}>
      <DataGrid getRowId={(row) => row?._id ?? row.id} rowHeight={60} {...props} />
    </Box>
  );
};

export default Table;
