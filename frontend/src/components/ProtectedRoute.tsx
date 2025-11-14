import { Navigate, useLocation } from "react-router-dom"

interface ProtectedRouteProps {
    children: React.ReactNode
    isLoggedIn: boolean
}

export function ProtectedRoute({ children, isLoggedIn }: ProtectedRouteProps) {
    const location = useLocation()

    if (!isLoggedIn) {
        // Save the attempted location in sessionStorage to redirect back after login
        sessionStorage.setItem("redirectTo", location.pathname + location.search)
        return <Navigate to="/login" state={{ from: location }} replace />
    }

    return <>{children}</>
}