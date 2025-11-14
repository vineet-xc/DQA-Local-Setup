import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { DataTable } from "@/components/DataTable"

export function DocumentsPage() {
    const [globalFilter, setGlobalFilter] = useState("")

    return (
        <div className="flex flex-col h-full min-h-0">
            {/* Title and Search Bar */}
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 px-4 py-3 border-b border-border bg-background shrink-0">
                <div>
                    <h2 className="text-2xl font-bold text-foreground">Slip Documents</h2>
                    <p className="text-muted-foreground mt-1">Manage and track all your document processing slips</p>
                </div>
                <div className="relative w-full lg:w-80">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search all columns..."
                        value={globalFilter}
                        onChange={(event) => setGlobalFilter(event.target.value)}
                        className="pl-9"
                    />
                </div>
            </div>

            {/* Data Table */}
            <div className="flex-1 min-h-0">
                <DataTable
                    globalFilter={globalFilter}
                    onGlobalFilterChange={setGlobalFilter}
                />
            </div>
        </div>
    )
}