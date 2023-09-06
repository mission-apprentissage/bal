import { Table as DSFRTable } from "@codegouvfr/react-dsfr/Table";
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
import React, { useEffect, useRef, useState } from "react";

interface Props<TData> {
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
  columns: columnsDef,
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

  pageCount,
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

  const headers = table
    .getHeaderGroups()
    .map((headerGroup) =>
      headerGroup.headers.map((header) => flexRender(header.column.columnDef.header, header.getContext()))
    )
    .flat();

  const rows = table
    .getCoreRowModel()
    .rows.map((row) => row.getVisibleCells().map((cell) => flexRender(cell.column.columnDef.cell, cell.getContext())));

  return <DSFRTable fixed data={rows} headers={headers} />;
};

export default Table;
