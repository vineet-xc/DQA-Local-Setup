import { useNavigate, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { useAppSelector, useAppDispatch } from "@/store/hooks"
import { toggleSidebar } from "@/store/slices/sidebarSlice"
import {
    LogOut,
    User,
    FileText,
    Home,
    Settings,
    PieChart,
    MoreVertical,
    ChevronRight,
    ChevronLeft,
    FileSearch,
    Menu,
    UploadCloud,
    GitCompare,
    Bell
} from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface SidebarProps {
    email: string
    onLogout: () => void
}

export const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home, path: "/dashboard" },
    { id: "upload-case", label: "Upload Case", icon: UploadCloud, path: "/upload-case" },
    { id: "documents", label: "Slip Documents", icon: FileText, path: "/documents" },
    { id: "extraction", label: "Extraction", icon: FileSearch, path: "/extraction" },
    { id: "comparison", label: "Comparison", icon: GitCompare, path: "/comparison" },
    { id: "prompts", label: "Prompt Management", icon: Menu, path: "/prompts" },
    { id: "notifications", label: "Notifications", icon: Bell, path: "/notifications" },
    { id: "reports", label: "Reports", icon: PieChart, path: "/reports" },
    { id: "settings", label: "Settings", icon: Settings, path: "/settings" },
]

export function Sidebar({ email, onLogout }: SidebarProps) {
    const navigate = useNavigate()
    const location = useLocation()
    const dispatch = useAppDispatch()
    const sidebarCollapsed = useAppSelector(state => state.sidebar.isCollapsed)

    const handleToggleSidebar = () => {
        dispatch(toggleSidebar())
    }

    return (
        <>
            <div className={`flex flex-col h-full bg-surface border-r border-border transition-all duration-300 ${sidebarCollapsed ? 'w-16' : 'w-64'}`}>
                {/* Logo/Brand */}
                <div className={`flex items-center justify-between py-4 border-b border-border ${sidebarCollapsed ? 'px-2' : 'px-4'}`}>
                    {!sidebarCollapsed && (
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                                <FileText className="h-5 w-5 text-primary-foreground" />
                            </div>
                            <span className="text-lg font-bold text-card-foreground">DQA System</span>
                        </div>
                    )}
                    {sidebarCollapsed && (
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mx-auto">
                            <FileText className="h-5 w-5 text-primary-foreground" />
                        </div>
                    )}
                </div>

                {/* Navigation */}
                <nav className={`flex-1 py-4 ${sidebarCollapsed ? 'px-2 space-y-2' : 'px-4 space-y-1'}`}>
                    {menuItems.map((item) => {
                        const IconComponent = item.icon
                        const isActive = location.pathname === item.path
                        return (
                            <button
                                key={item.id}
                                onClick={() => navigate(item.path)}
                                className={`w-full flex items-center text-sm font-medium transition-colors ${sidebarCollapsed
                                    ? 'h-12 w-12 mx-auto rounded-lg justify-center'
                                    : 'px-3 py-2 rounded-md justify-start'
                                    } ${isActive
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

            {/* Sidebar Toggle Button */}
            <Button
                variant="outline"
                size="sm"
                onClick={handleToggleSidebar}
                className={`hidden lg:flex fixed top-[52px] z-50 h-6 w-6 p-0 rounded-full bg-background border-border shadow-md hover:shadow-lg transition-all duration-300 ${sidebarCollapsed ? 'left-12' : 'left-60'
                    }`}
            >
                {sidebarCollapsed ? (
                    <ChevronRight className="h-4 w-4" />
                ) : (
                    <ChevronLeft className="h-4 w-4" />
                )}
            </Button>
        </>
    )
}