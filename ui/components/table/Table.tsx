import { Box, BoxProps, Button, Divider, HStack, Text } from "@chakra-ui/react";
import {
  AccessorFn,
  CellContext,
  ColumnDefTemplate,
  createColumnHelper,
  DeepKeys,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  OnChangeFn,
  PaginationState,
  Row,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import React, { Fragment, useEffect, useRef, useState } from "react";

import { StyledTable } from "./table.styled";

interface Props<TData> extends BoxProps {
  data: TData[];
  onRowClick?: (rowId: string) => void;
  columns: {
    [key: string]: {
      id: string;
      header?: () => React.ReactNode;
      cell?: ColumnDefTemplate<CellContext<TData, unknown>>;
      size?: number;
    };
  };
  renderSubComponent?: (row: { row: Row<TData> }) => React.ReactNode;
  getRowCanExpand?: (row: Row<TData>) => boolean;
  searchValue?: string;
  onCountItemsChange?: (count: number) => void;
  // pagination
  manualPagination?: boolean;
  onPaginationChange?: OnChangeFn<PaginationState>;
  pagination?: PaginationState;
  // sorting
  manualSorting?: boolean;
  enableSorting?: boolean;
  onSortingChange?: OnChangeFn<SortingState>;
  sorting?: SortingState;
  pageSizes?: number[];
  pageCount?: number;
}

const Table = <TData extends object>({
  data,
  onRowClick,
  columns: columnsDef,
  renderSubComponent,
  getRowCanExpand,
  searchValue,
  onCountItemsChange,
  // pagination
  manualPagination = false,
  onPaginationChange,
  pagination,
  // sorting
  manualSorting = false,
  enableSorting,
  onSortingChange,
  sorting,
  pageSizes = [5, 10, 20, 30, 40, 50],
  pageCount,
  ...props
}: Props<TData>) => {
  const [globalFilter, setGlobalFilter] = useState(searchValue);
  const countItems = useRef(data.length);

  useEffect(() => {
    setGlobalFilter(searchValue);
    if (searchValue === "") {
      onCountItemsChange?.(data.length);
    }
  }, [data.length, onCountItemsChange, searchValue]);

  const columnHelper = createColumnHelper<TData>();

  const columns = Object.keys(columnsDef).map((key) => {
    const dataKey = key as AccessorFn<TData, unknown> | DeepKeys<TData>;
    return columnHelper.accessor(dataKey, columnsDef[key]);
  });

  const table = useReactTable({
    data,
    columns,
    getRowCanExpand,
    // pagination
    manualPagination,
    pageCount: pageCount ?? -1,
    onPaginationChange,
    // sorting
    enableSorting,
    manualSorting,
    onSortingChange,
    // general
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    ...(manualPagination ? {} : { getFilteredRowModel: getFilteredRowModel() }),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    state: {
      globalFilter,
      pagination,
      sorting,
    },
  });

  useEffect(() => {
    if (countItems.current !== table.getPrePaginationRowModel().rows.length) {
      countItems.current = table.getPrePaginationRowModel().rows.length;
      onCountItemsChange?.(countItems.current);
    }
  }, [onCountItemsChange, table]);

  if (pagination && table.getPrePaginationRowModel().rows.length === 0) {
    return null;
  }

  return (
    <StyledTable className="flex flex-col">
      <Box as="table" flex={1} fontSize="delta" w="100%" {...props}>
        <Box as="thead">
          {table.getHeaderGroups().map((headerGroup, key) => (
            <Box
              as="tr"
              key={key}
              borderBottom="3px solid"
              borderColor="bluefrance.main"
            >
              {headerGroup.headers.map((header) => {
                return (
                  <Box
                    as="th"
                    key={header.id}
                    fontWeight="bold"
                    fontSize="0.9rem"
                    overflow="hidden"
                    borderColor="grey.800"
                    color="grey.800"
                    textAlign="left"
                    {...{
                      colSpan: header.colSpan,
                      style: {
                        width: header.getSize(),
                      },
                    }}
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        {...{
                          className: header.column.getCanSort()
                            ? "cursor-pointer select-none"
                            : "",
                          onClick: header.column.getToggleSortingHandler(),
                        }}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: " 🔼",
                          desc: " 🔽",
                        }[header.column.getIsSorted() as never] ?? null}
                      </div>
                    )}
                  </Box>
                );
              })}
            </Box>
          ))}
        </Box>
        <Box as="tbody">
          {table.getCoreRowModel().rows.map((row, j) => {
            return (
              <Fragment key={row.id}>
                <Box
                  as="tr"
                  bg={j % 2 === 0 ? "galt" : "white"}
                  py="3"
                  data-rowindex={row.id}
                  onClick={() => onRowClick?.(row.id)}
                >
                  {/* first row is a normal row */}
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <Box as="td" key={cell.id} overflow="hidden">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </Box>
                    );
                  })}
                </Box>
                {row.getIsExpanded() && renderSubComponent && (
                  <Box as="tr">
                    {/* 2nd row is a custom 1 cell row */}
                    <Box as="td" colSpan={row.getVisibleCells().length}>
                      {renderSubComponent({ row })}
                    </Box>
                  </Box>
                )}
              </Fragment>
            );
          })}
        </Box>
      </Box>
      {pagination && data.length > 5 && (
        <>
          <Divider my={2} />
          <HStack spacing={3} justifyContent="space-between">
            <HStack spacing={3}>
              <Button
                variant="unstyled"
                onClick={() => table.setPageIndex(0)}
                isDisabled={!table.getCanPreviousPage()}
              >
                <Box className="ri-skip-back-fill" mt="0.250rem !important" />
              </Button>
              <Button
                variant="unstyled"
                onClick={() => table.previousPage()}
                isDisabled={!table.getCanPreviousPage()}
              >
                <HStack>
                  <Box
                    as="i"
                    className="ri-arrow-left-s-line"
                    mt="0.250rem !important"
                  />
                  <Text>Page précédente </Text>
                </HStack>
              </Button>

              <Box px={5}>
                <Button
                  {...{
                    bg: "bluefrance",
                    color: "white",
                    pointerEvents: "none",
                  }}
                >
                  {table.getState().pagination.pageIndex + 1}
                </Button>
              </Box>

              <Button
                variant="unstyled"
                onClick={() => table.nextPage()}
                isDisabled={!table.getCanNextPage()}
              >
                <HStack>
                  <Text>Page suivante </Text>
                  <Box
                    as="i"
                    className="ri-arrow-right-s-line"
                    mt="0.250rem !important"
                  />
                </HStack>
              </Button>
              <Button
                variant="unstyled"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                isDisabled={!table.getCanNextPage()}
              >
                <Box
                  className="ri-skip-forward-fill"
                  mt="0.250rem !important"
                />
              </Button>
            </HStack>

            <HStack spacing={3} justifyContent="flex-end">
              <Box pt={2}>
                <select
                  value={table.getState().pagination.pageSize}
                  onChange={(e) => {
                    table.setPageSize(Number(e.target.value));
                  }}
                >
                  {pageSizes.map((pageSize) => (
                    <option key={pageSize} value={pageSize}>
                      Voir par {pageSize}
                    </option>
                  ))}
                </select>
              </Box>
            </HStack>
          </HStack>
        </>
      )}
    </StyledTable>
  );
};

export default Table;
