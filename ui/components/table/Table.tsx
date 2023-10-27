import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import { DataGrid, DataGridProps, frFR, GridValidRowModel } from "@mui/x-data-grid";

const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  "& .MuiTablePagination-selectLabel": {
    margin: theme.spacing(0),
  },
}));

export const Table = <R extends GridValidRowModel>(props: DataGridProps<R>) => {
  return (
    <Box my={2}>
      <StyledDataGrid
        // @ts-expect-error
        getRowId={(row) => row?._id ?? row.id}
        rowHeight={60}
        localeText={frFR.components.MuiDataGrid.defaultProps.localeText}
        {...props}
      />
    </Box>
  );
};

export default Table;
