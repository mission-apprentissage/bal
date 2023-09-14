import { Box } from "@mui/material";
import { DataGrid, DataGridProps, frFR, GridValidRowModel } from "@mui/x-data-grid";

export const Table = <R extends GridValidRowModel = any>(props: DataGridProps<R>) => {
  return (
    <Box my={2}>
      <DataGrid
        getRowId={(row) => row?._id ?? row.id}
        rowHeight={60}
        localeText={frFR.components.MuiDataGrid.defaultProps.localeText}
        {...props}
      />
    </Box>
  );
};

export default Table;
