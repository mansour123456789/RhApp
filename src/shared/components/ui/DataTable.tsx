import * as React from "react";
import { cn } from "@/shared/lib/utils";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  getFilteredRowModel,
  ColumnFiltersState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/Table";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import { ArrowUpDown, GripVertical, PlusCircle, X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/Popover";
import { Checkbox } from "@/shared/components/ui/Checkbox";
import { Badge } from "@/shared/components/ui/Badge";
import { Separator } from "@/shared/components/ui/Separator";

// DND imports
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface DataTableFilterOption {
  label: string;
  value: string;
}

interface DataTableFilterGroup {
  columnId: string;
  title: string;
  options: DataTableFilterOption[];
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onDataChange?: (newData: TData[]) => void;
  filterColumn?: string;
  filterGroups?: DataTableFilterGroup[];
}

import { Row } from "@tanstack/react-table";

// Draggable Row Component
interface DraggableRowProps<TData> {
  row: Row<TData>;
  reorderable?: boolean;
}

function DraggableRow<TData>({ row, reorderable }: DraggableRowProps<TData>) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: row.id,
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1 : 0,
    position: 'relative',
  };

  return (
    <TableRow
      ref={setNodeRef}
      style={style}
      data-state={row.getIsSelected() && "selected"}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {cell.column.id === 'drag-handle' && reorderable ? (
            <button
              {...attributes}
              {...listeners}
              className="cursor-grab active:cursor-grabbing p-1 hover:bg-muted rounded"
            >
              <GripVertical className="h-4 w-4 text-muted-foreground" />
            </button>
          ) : (
            flexRender(cell.column.columnDef.cell, cell.getContext())
          )}
        </TableCell>
      ))}
    </TableRow>
  );
}

export function DataTable<TData extends { id: string | number }, TValue>({
  columns,
  data: initialData,
  onDataChange,
  filterColumn,
  filterGroups,
}: DataTableProps<TData, TValue>) {
  const [data, setData] = React.useState(initialData);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);

  React.useEffect(() => {
    setData(initialData);
  }, [initialData]);

  // If reorderable, we add a drag handle column
  const tableColumns = React.useMemo(() => {
    if (!onDataChange) return columns;
    return [
      {
        id: 'drag-handle',
        header: '',
        cell: () => null, // Rendered in DraggableRow
      },
      ...columns,
    ];
  }, [columns, onDataChange]);

  const table = useReactTable({
    data,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    filterFns: {
      arrIncludesSome: (row, columnId, value) => {
        const rowValue = row.getValue(columnId) as string;
        return Array.isArray(value) && value.includes(rowValue);
      },
    },
    state: {
      sorting,
      columnFilters,
    },
  });

  // DND Sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (active.id !== over?.id && onDataChange) {
      const oldIndex = data.findIndex((item) => String(item.id) === String(active.id));
      const newIndex = data.findIndex((item) => String(item.id) === String(over?.id));
      const newData = arrayMove(data, oldIndex, newIndex);
      setData(newData);
      onDataChange(newData);
    }
  }

  const dataIds = React.useMemo(() => data.map((item) => String(item.id)), [data]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-1 items-center space-x-2">
          {filterColumn && (
            <Input
              placeholder={`Filter ${filterColumn}...`}
              value={(table.getColumn(filterColumn)?.getFilterValue() as string) ?? ""}
              onChange={(event) =>
                table.getColumn(filterColumn)?.setFilterValue(event.target.value)
              }
              className="h-8 w-[150px] lg:w-[250px] bg-muted border-none"
            />
          )}
          {filterGroups?.map((group) => (
            <Popover key={group.columnId}>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 border-dashed">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  {group.title}
                  {Boolean(table.getColumn(group.columnId)?.getFilterValue()) && (
                    <>
                      <Separator orientation="vertical" className="mx-2 h-4" />
                      <Badge
                        variant="secondary"
                        className="rounded-sm px-1 font-normal lg:hidden"
                      >
                        {Number((table.getColumn(group.columnId)?.getFilterValue() as string[])?.length ?? 0)}
                      </Badge>
                      <div className="hidden space-x-1 lg:flex">
                        {((table.getColumn(group.columnId)?.getFilterValue() as string[])?.length ?? 0) > 2 ? (
                          <Badge
                            variant="secondary"
                            className="rounded-sm px-1 font-normal"
                          >
                            {Number((table.getColumn(group.columnId)?.getFilterValue() as string[])?.length ?? 0)} selected
                          </Badge>
                        ) : (
                          (table.getColumn(group.columnId)?.getFilterValue() as string[])?.map((option) => (
                            <Badge
                              variant="secondary"
                              key={option}
                              className="rounded-sm px-1 font-normal"
                            >
                              {option}
                            </Badge>
                          ))
                        )}
                      </div>
                    </>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0" align="start">
                <div className="p-2 space-y-2">
                  <div className="text-sm font-medium px-2 py-1.5">{group.title}</div>
                  <Separator />
                  <div className="space-y-1">
                    {group.options.map((option) => {
                      const isSelected = (table.getColumn(group.columnId)?.getFilterValue() as string[] | undefined)?.includes(option.value);
                      return (
                        <div
                          key={option.value}
                          className="flex items-center space-x-2 px-2 py-1.5 hover:bg-muted rounded-sm cursor-pointer"
                          onClick={() => {
                            const currentFilters = (table.getColumn(group.columnId)?.getFilterValue() as string[] | undefined) || [];
                            const nextFilters = isSelected
                              ? currentFilters.filter((v) => v !== option.value)
                              : [...currentFilters, option.value];
                            table.getColumn(group.columnId)?.setFilterValue(nextFilters.length ? nextFilters : undefined);
                          }}
                        >
                          <Checkbox checked={isSelected} />
                          <span className="text-sm">{option.label}</span>
                        </div>
                      );
                    })}
                  </div>
                  {Boolean(table.getColumn(group.columnId)?.getFilterValue()) && (
                    <>
                      <Separator />
                      <Button
                        variant="ghost"
                        className="w-full justify-center text-xs h-8"
                        onClick={() => table.getColumn(group.columnId)?.setFilterValue(undefined)}
                      >
                        Clear filters
                      </Button>
                    </>
                  )}
                </div>
              </PopoverContent>
            </Popover>
          ))}
          {table.getState().columnFilters.length > 0 && (
            <Button
              variant="ghost"
              onClick={() => table.resetColumnFilters()}
              className="h-8 px-2 lg:px-3"
            >
              Reset
              <X className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : (
                        <div
                          className={cn(
                            "flex items-center space-x-2",
                            header.column.getCanSort() && "cursor-pointer select-none"
                          )}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {header.column.getCanSort() && (
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          )}
                        </div>
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={dataIds}
                strategy={verticalListSortingStrategy}
              >
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <DraggableRow 
                      key={row.id} 
                      row={row} 
                      reorderable={!!onDataChange} 
                    />
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={tableColumns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </SortableContext>
            </DndContext>
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredRowModel().rows.length} row(s) total.
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

