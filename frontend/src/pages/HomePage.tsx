import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    LogOut,
    User,
    Search,
    FileText,
    Home,
    BarChart,
    Settings,
    Bell,
    Menu,
    Archive,
    Users,
    Calendar,
    PieChart,
    MoreVertical,
    ChevronRight,
    ChevronLeft
} from "lucide-react"
import { DataTable } from "@/components/DataTable"
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { ThemeToggle } from "@/components/theme-toggle"

interface HomePageProps {
    email: string
    onLogout: () => void
}

export function HomePage({ email, onLogout }: HomePageProps) {
    const [globalFilter, setGlobalFilter] = useState("")
    const [activeMenuItem, setActiveMenuItem] = useState("documents")
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

    const menuItems = [
        { id: "dashboard", label: "Dashboard", icon: Home },
        { id: "documents", label: "Slip Documents", icon: FileText },
        { id: "analytics", label: "Analytics", icon: BarChart },
        { id: "reports", label: "Reports", icon: PieChart },
        { id: "team", label: "Team", icon: Users },
        { id: "calendar", label: "Calendar", icon: Calendar },
        { id: "archive", label: "Archive", icon: Archive },
        { id: "notifications", label: "Notifications", icon: Bell },
        { id: "settings", label: "Settings", icon: Settings },
    ]

    const Sidebar = () => (
        <div className={`flex flex-col h-full bg-background border-r border-border transition-all duration-300 ${sidebarCollapsed ? 'w-16' : 'w-64'}`}>
            {/* Logo/Brand and Collapse Button */}
            <div className={`flex items-center justify-between py-4 border-b border-border ${sidebarCollapsed ? 'px-2' : 'px-4'}`}>
                {!sidebarCollapsed && (
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <FileText className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-lg font-bold text-foreground">DQA System</span>
                    </div>
                )}
                {sidebarCollapsed && (
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mx-auto">
                        <FileText className="h-5 w-5 text-white" />
                    </div>
                )}
            </div>

            {/* Navigation */}
            <nav className={`flex-1 py-4 ${sidebarCollapsed ? 'px-2 space-y-2' : 'px-4 space-y-1'}`}>
                {menuItems.map((item) => {
                    const IconComponent = item.icon
                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveMenuItem(item.id)}
                            className={`w-full flex items-center text-sm font-medium transition-colors ${sidebarCollapsed
                                ? 'h-12 w-12 mx-auto rounded-lg justify-center'
                                : 'px-3 py-2 rounded-md justify-start'
                                } ${activeMenuItem === item.id
                                    ? "bg-primary/10 text-primary border-r-2 border-primary"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                }`}
                            title={sidebarCollapsed ? item.label : undefined}
                        >
                            <IconComponent className={`${sidebarCollapsed ? 'h-7 w-7' : 'h-5 w-5'} ${sidebarCollapsed ? '' : 'mr-3'}`} />
                            {!sidebarCollapsed && item.label}
                        </button>
                    )
                })}
            </nav>

            {/* User Profile with Dropdown */}
            <div className={`py-4 border-t border-border ${sidebarCollapsed ? 'px-2' : 'px-4'}`}>
                {sidebarCollapsed ? (
                    <div className="flex justify-center">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-12 w-12 p-0 rounded-lg mx-auto">
                                    <User className="h-7 w-7 text-primary" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                                <div className="px-2 py-1.5 text-sm">
                                    <p className="font-medium text-foreground truncate">{email}</p>
                                    <p className="text-xs text-muted-foreground">Administrator</p>
                                </div>
                                <DropdownMenuItem onClick={onLogout}>
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Sign out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                ) : (
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 min-w-0 flex-1">
                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                <User className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-foreground truncate">{email}</p>
                                <p className="text-xs text-muted-foreground">Administrator</p>
                            </div>
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuItem onClick={onLogout}>
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Sign out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                )}
            </div>
        </div>
    )

    return (
        <div className="flex h-screen bg-background relative">
            {/* Desktop Sidebar */}
            <div className={`hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 transition-all duration-300 ${sidebarCollapsed ? 'lg:w-16' : 'lg:w-64'}`}>
                <Sidebar />
            </div>

            {/* Sidebar Toggle Button */}
            <Button
                variant="outline"
                size="sm"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className={`hidden lg:flex fixed top-[52px] z-50 h-6 w-6 p-0 rounded-full bg-background border-border shadow-md hover:shadow-lg transition-all duration-300 ${sidebarCollapsed ? 'left-12' : 'left-60'
                    }`}
            >
                {sidebarCollapsed ? (
                    <ChevronRight className="h-4 w-4" />
                ) : (
                    <ChevronLeft className="h-4 w-4" />
                )}
            </Button>

            {/* Main Content */}
            <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'}`}>
                {/* Desktop Header */}
                <header className="hidden lg:block bg-background border-b border-border px-6 py-3">
                    <div className="flex items-center justify-between">
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="#" className="text-muted-foreground">
                                        Home
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbPage className="text-foreground">
                                        {menuItems.find(item => item.id === activeMenuItem)?.label}
                                    </BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                        <ThemeToggle />
                    </div>
                </header>

                {/* Mobile Header */}
                <header className="lg:hidden bg-background border-b border-border px-4 py-3">
                    <div className="flex items-center justify-between">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="sm">
                                    <Menu className="h-6 w-6" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="p-0 w-64">
                                <Sidebar />
                            </SheetContent>
                        </Sheet>
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="#" className="text-muted-foreground">
                                        Home
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbPage className="text-foreground">
                                        {menuItems.find(item => item.id === activeMenuItem)?.label}
                                    </BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                        <ThemeToggle />
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-auto p-6 custom-scrollbar">
                    {activeMenuItem === "documents" && (
                        <div className="space-y-6">
                            {/* Title and Search Bar */}
                            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
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
                            <DataTable
                                globalFilter={globalFilter}
                                onGlobalFilterChange={setGlobalFilter}
                            />
                        </div>
                    )}

                    {activeMenuItem === "dashboard" && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-foreground">Dashboard</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Total Documents</p>
                                            <p className="text-2xl font-bold text-card-foreground">1,234</p>
                                        </div>
                                        <FileText className="h-8 w-8 text-blue-600" />
                                    </div>
                                </div>
                                <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Pending Review</p>
                                            <p className="text-2xl font-bold text-card-foreground">56</p>
                                        </div>
                                        <Bell className="h-8 w-8 text-yellow-600" />
                                    </div>
                                </div>
                                <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Approved</p>
                                            <p className="text-2xl font-bold text-card-foreground">892</p>
                                        </div>
                                        <BarChart className="h-8 w-8 text-green-600" />
                                    </div>
                                </div>
                                <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Rejected</p>
                                            <p className="text-2xl font-bold text-card-foreground">23</p>
                                        </div>
                                        <Archive className="h-8 w-8 text-red-600" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Placeholder for other menu items */}
                    {activeMenuItem !== "documents" && activeMenuItem !== "dashboard" && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-foreground">
                                {menuItems.find(item => item.id === activeMenuItem)?.label}
                            </h2>
                            <div className="bg-card rounded-lg border border-border p-8 text-center">
                                <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
                                    {(() => {
                                        const IconComponent = menuItems.find(item => item.id === activeMenuItem)?.icon || FileText
                                        return <IconComponent className="h-12 w-12 text-muted-foreground" />
                                    })()}
                                </div>
                                <h3 className="text-lg font-medium text-card-foreground mb-2">
                                    {menuItems.find(item => item.id === activeMenuItem)?.label} Page
                                </h3>
                                <p className="text-muted-foreground">
                                    This page is under construction. Content will be added soon.
                                </p>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    )
}