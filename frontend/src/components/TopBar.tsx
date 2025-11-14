import { useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet"
import {
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { ThemeToggle } from "@/components/theme-toggle"
import { Sidebar } from "@/components/Sidebar"
import { menuItems } from "@/components/Sidebar"

interface TopBarProps {
    email: string
    onLogout: () => void
}

export function TopBar({ email, onLogout }: TopBarProps) {
    const location = useLocation()

    const getCurrentPageLabel = () => {
        const currentItem = menuItems.find(item => item.path === location.pathname)
        return currentItem?.label || "Home"
    }

    return (
        <>
            {/* Desktop Header */}
            <header className="hidden lg:block bg-surface border-b border-border px-6 py-3">
                <div className="flex items-center justify-between">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/dashboard" className="text-muted-foreground">
                                    Home
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage className="text-foreground">
                                    {getCurrentPageLabel()}
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
                            <Sidebar
                                email={email}
                                onLogout={onLogout}
                            />
                        </SheetContent>
                    </Sheet>
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/dashboard" className="text-muted-foreground">
                                    Home
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage className="text-foreground">
                                    {getCurrentPageLabel()}
                                </BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                    <ThemeToggle />
                </div>
            </header>
        </>
    )
}