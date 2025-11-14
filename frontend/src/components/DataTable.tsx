import { useState, useMemo } from "react"
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import type {
    ColumnDef,
    SortingState,
    ColumnFiltersState,
    VisibilityState,
} from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import {
    MoreVertical,
    Filter,
    ArrowUp,
    ArrowDown,
    Eye,
    Edit,
    Trash2,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
} from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Sample slip document data
export type SlipDocument = {
    id: string
    documentNumber: string
    customerName: string
    documentType: string
    amount: number
    status: "pending" | "approved" | "rejected" | "processing"
    createdDate: string
    dueDate: string
    assignedTo: string
    priority: "low" | "medium" | "high"
}

const generateSampleData = (): SlipDocument[] => {
    const statuses: SlipDocument["status"][] = ["pending", "approved", "rejected", "processing"]
    const priorities: SlipDocument["priority"][] = ["low", "medium", "high"]
    const documentTypes = ["Invoice", "Receipt", "Purchase Order", "Delivery Note", "Credit Note"]
    const customers = ["Acme Corp", "TechFlow Inc", "Global Solutions", "NextGen Ltd", "Prime Industries", "Future Systems", "Elite Services", "Dynamic Corp"]
    const assignees = ["John Smith", "Sarah Johnson", "Mike Davis", "Lisa Wilson", "Tom Brown", "Emily Chen", "David Lee", "Jennifer Taylor"]

    return Array.from({ length: 50 }, (_, i) => ({
        id: `DOC-${String(i + 1).padStart(4, "0")}`,
        documentNumber: `${["INV", "RCP", "PO", "DN", "CN"][Math.floor(Math.random() * 5)]}-${String(Math.floor(Math.random() * 9999) + 1).padStart(4, "0")}`,
        customerName: customers[Math.floor(Math.random() * customers.length)],
        documentType: documentTypes[Math.floor(Math.random() * documentTypes.length)],
        amount: Math.floor(Math.random() * 10000) + 100,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        createdDate: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
        dueDate: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
        assignedTo: assignees[Math.floor(Math.random() * assignees.length)],
        priority: priorities[Math.floor(Math.random() * priorities.length)],
    }))
}

const getStatusColor = (status: string) => {
    switch (status) {
        case "approved":
            return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
        case "rejected":
            return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
        case "pending":
            return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
        case "processing":
            return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
        default:
            return "bg-muted text-muted-foreground"
    }
}

const getPriorityColor = (priority: string) => {
    switch (priority) {
        case "high":
            return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
        case "medium":
            return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
        case "low":
            return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
        default:
            return "bg-muted text-muted-foreground"
    }
}

interface DataTableProps {
    globalFilter?: string
    onGlobalFilterChange?: (value: string) => void
}

export function DataTable({ globalFilter = "", onGlobalFilterChange }: DataTableProps) {
    const [data] = useState<SlipDocument[]>(generateSampleData)
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

    const columns: ColumnDef<SlipDocument>[] = useMemo(
        () => [
            {
                accessorKey: "documentNumber",
                header: ({ column }) => {
                    return (
                        <div className="flex items-center justify-between">
                            <span>Document #</span>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
                                        <ArrowUp className="mr-2 h-4 w-4" />
                                        Sort Ascending
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
                                        <ArrowDown className="mr-2 h-4 w-4" />
                                        Sort Descending
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => column.setFilterValue("")}>
                                        <Filter className="mr-2 h-4 w-4" />
                                        Clear Filter
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    )
                },
                cell: ({ row }) => (
                    <div className="font-medium">{row.getValue("documentNumber")}</div>
                ),
            },
            {
                accessorKey: "customerName",
                header: ({ column }) => {
                    return (
                        <div className="flex items-center justify-between">
                            <span>Customer</span>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
                                        <ArrowUp className="mr-2 h-4 w-4" />
                                        Sort Ascending
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
                                        <ArrowDown className="mr-2 h-4 w-4" />
                                        Sort Descending
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => column.setFilterValue("")}>
                                        <Filter className="mr-2 h-4 w-4" />
                                        Clear Filter
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    )
                },
            },
            {
                accessorKey: "documentType",
                header: ({ column }) => {
                    return (
                        <div className="flex items-center justify-between">
                            <span>Type</span>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
                                        <ArrowUp className="mr-2 h-4 w-4" />
                                        Sort Ascending
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
                                        <ArrowDown className="mr-2 h-4 w-4" />
                                        Sort Descending
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => column.setFilterValue("")}>
                                        <Filter className="mr-2 h-4 w-4" />
                                        Clear Filter
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    )
                },
            },
            {
                accessorKey: "amount",
                header: ({ column }) => {
                    return (
                        <div className="flex items-center justify-between">
                            <span>Amount</span>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
                                        <ArrowUp className="mr-2 h-4 w-4" />
                                        Sort Ascending
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
                                        <ArrowDown className="mr-2 h-4 w-4" />
                                        Sort Descending
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => column.setFilterValue("")}>
                                        <Filter className="mr-2 h-4 w-4" />
                                        Clear Filter
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    )
                },
                cell: ({ row }) => {
                    const amount = parseFloat(row.getValue("amount"))
                    const formatted = new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                    }).format(amount)
                    return <div className="font-medium">{formatted}</div>
                },
            },
            {
                accessorKey: "status",
                header: ({ column }) => {
                    return (
                        <div className="flex items-center justify-between">
                            <span>Status</span>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
                                        <ArrowUp className="mr-2 h-4 w-4" />
                                        Sort Ascending
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
                                        <ArrowDown className="mr-2 h-4 w-4" />
                                        Sort Descending
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => column.setFilterValue("")}>
                                        <Filter className="mr-2 h-4 w-4" />
                                        Clear Filter
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    )
                },
                cell: ({ row }) => {
                    const status = row.getValue("status") as string
                    return (
                        <span
                            className={`inline-flex px-1.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                                status
                            )}`}
                        >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                        </span>
                    )
                },
            },
            {
                accessorKey: "priority",
                header: ({ column }) => {
                    return (
                        <div className="flex items-center justify-between">
                            <span>Priority</span>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
                                        <ArrowUp className="mr-2 h-4 w-4" />
                                        Sort Ascending
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
                                        <ArrowDown className="mr-2 h-4 w-4" />
                                        Sort Descending
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => column.setFilterValue("")}>
                                        <Filter className="mr-2 h-4 w-4" />
                                        Clear Filter
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    )
                },
                cell: ({ row }) => {
                    const priority = row.getValue("priority") as string
                    return (
                        <span
                            className={`inline-flex px-1.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(
                                priority
                            )}`}
                        >
                            {priority.charAt(0).toUpperCase() + priority.slice(1)}
                        </span>
                    )
                },
            },
            {
                accessorKey: "createdDate",
                header: ({ column }) => {
                    return (
                        <div className="flex items-center justify-between">
                            <span>Created</span>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
                                        <ArrowUp className="mr-2 h-4 w-4" />
                                        Sort Ascending
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
                                        <ArrowDown className="mr-2 h-4 w-4" />
                                        Sort Descending
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => column.setFilterValue("")}>
                                        <Filter className="mr-2 h-4 w-4" />
                                        Clear Filter
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    )
                },
                cell: ({ row }) => {
                    const date = new Date(row.getValue("createdDate"))
                    return <div>{date.toLocaleDateString()}</div>
                },
            },
            {
                accessorKey: "assignedTo",
                header: ({ column }) => {
                    return (
                        <div className="flex items-center justify-between">
                            <span>Assigned To</span>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
                                        <ArrowUp className="mr-2 h-4 w-4" />
                                        Sort Ascending
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
                                        <ArrowDown className="mr-2 h-4 w-4" />
                                        Sort Descending
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => column.setFilterValue("")}>
                                        <Filter className="mr-2 h-4 w-4" />
                                        Clear Filter
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    )
                },
            },
            {
                id: "actions",
                header: "",
                cell: () => {
                    return (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                    <Eye className="mr-2 h-4 w-4" />
                                    View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10 hover:bg-destructive/10">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )
                },
            },
        ],
        []
    )

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onGlobalFilterChange: onGlobalFilterChange,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            globalFilter,
        },
    })

    return (
        <div className="flex flex-col h-full min-h-0">
            {/* Data Table */}
            <div className="flex-1 min-h-0 rounded-md border border-border bg-surface overflow-hidden">
                <div className="h-full overflow-auto thin-scrollbar">
                    <table className="w-full min-w-full table-fixed">
                        <thead className="sticky top-0 bg-surface-secondary z-10">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <tr key={headerGroup.id} className="border-b border-border">
                                    {headerGroup.headers.map((header) => (
                                        <th
                                            key={header.id}
                                            className={`px-2 py-1.5 text-left font-medium text-foreground bg-surface-secondary text-sm ${header.id === 'actions' ? 'w-10 min-w-[40px] max-w-[40px]' : 'min-w-[120px]'
                                                }`}
                                        >
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(header.column.columnDef.header, header.getContext())}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <tr
                                        key={row.id}
                                        className="border-b border-border hover:bg-surface-secondary/50 transition-colors"
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <td
                                                key={cell.id}
                                                className={`py-1.5 text-card-foreground text-sm ${cell.column.id === 'actions' ? 'w-10 min-w-[40px] max-w-[40px] px-2' : 'px-3'
                                                    }`}
                                            >
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                                        No results.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-4 shrink-0">
                <div className="flex items-center space-x-2">
                    <p className="text-sm text-muted-foreground">
                        Showing{" "}
                        <span className="font-medium text-foreground">
                            {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}
                        </span>{" "}
                        to{" "}
                        <span className="font-medium text-foreground">
                            {Math.min(
                                (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                                table.getFilteredRowModel().rows.length
                            )}
                        </span>{" "}
                        of{" "}
                        <span className="font-medium text-foreground">{table.getFilteredRowModel().rows.length}</span> results
                    </p>
                </div>

                {/* Page Size Selector */}
                <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">Rows per page:</span>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="h-8 px-3">
                                {table.getState().pagination.pageSize}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="center">
                            {[10, 20, 50, 100].map((pageSize) => (
                                <DropdownMenuItem
                                    key={pageSize}
                                    onClick={() => {
                                        table.setPageSize(pageSize)
                                    }}
                                    className={table.getState().pagination.pageSize === pageSize ? "bg-accent" : ""}
                                >
                                    {pageSize}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.setPageIndex(0)}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <ChevronsLeft className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                        disabled={!table.getCanNextPage()}
                    >
                        <ChevronsRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    )
}