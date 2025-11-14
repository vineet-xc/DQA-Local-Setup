import {
    FileText,
    Bell,
    BarChart,
    Archive,
} from "lucide-react"

export function DashboardPage() {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Total Documents</p>
                            <p className="text-2xl font-bold text-card-foreground">1,234</p>
                        </div>
                        <FileText className="h-8 w-8 text-primary" />
                    </div>
                </div>
                <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Pending Review</p>
                            <p className="text-2xl font-bold text-card-foreground">56</p>
                        </div>
                        <Bell className="h-8 w-8 text-warning" />
                    </div>
                </div>
                <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Approved</p>
                            <p className="text-2xl font-bold text-card-foreground">892</p>
                        </div>
                        <BarChart className="h-8 w-8 text-success" />
                    </div>
                </div>
                <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Rejected</p>
                            <p className="text-2xl font-bold text-card-foreground">23</p>
                        </div>
                        <Archive className="h-8 w-8 text-danger" />
                    </div>
                </div>
            </div>
        </div>
    )
}