import { Outlet } from "react-router-dom"
import { Sidebar } from "@/components/Sidebar"
import { TopBar } from "@/components/TopBar"
import { useAppSelector } from "@/store/hooks"

interface LayoutProps {
    email: string
    onLogout: () => void
}

export function Layout({ email, onLogout }: LayoutProps) {
    const sidebarCollapsed = useAppSelector(state => state.sidebar.isCollapsed)

    return (
        <div className="flex h-screen bg-surface relative">
            {/* Desktop Sidebar */}
            <div className={`hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 transition-all duration-300 ${sidebarCollapsed ? 'lg:w-16' : 'lg:w-64'}`}>
                <Sidebar
                    email={email}
                    onLogout={onLogout}
                />
            </div>

            {/* Main Content */}
            <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'}`}>
                <TopBar
                    email={email}
                    onLogout={onLogout}
                />

                {/* Page Content */}
                <main className="flex-1 overflow-auto p-6 custom-scrollbar">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}