import { Routes, Route, Navigate, useNavigate } from "react-router-dom"
import { LoginPage } from "@/pages/LoginPage"
import { Layout } from "@/components/Layout"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import { ReportsPage } from "@/pages/ReportsPage"
import { DocumentsPage } from "@/pages/DocumentsPage"
import { DashboardPage } from "@/pages/DashboardPage"
import { SettingsPage } from "@/pages/SettingsPage"
import { ExtractionPage } from "@/pages/ExtractionPage"
import { ComparisonPage } from "@/pages/ComparisonPage"
import { PromptManagementPage } from "@/pages/PromptManagementPage"
import { UploadCasePage } from "@/pages/UploadCasePage"
import { NotificationsPage } from "@/pages/NotificationsPage"

interface AppRoutesProps {
    isLoggedIn: boolean
    userEmail: string
    isLoading: boolean
    onLoginSuccess: (email: string) => void
    onLogout: () => void
}

export function AppRoutes({ isLoggedIn, userEmail, isLoading, onLoginSuccess, onLogout }: AppRoutesProps) {
    const navigate = useNavigate()

    const handleLoginSuccess = (email: string) => {
        onLoginSuccess(email)

        // Redirect to the route they were trying to access or dashboard
        const redirectTo = sessionStorage.getItem("redirectTo")
        if (redirectTo && redirectTo !== "/login") {
            sessionStorage.removeItem("redirectTo")
            navigate(redirectTo, { replace: true })
        } else {
            navigate("/dashboard", { replace: true })
        }
    }

    const handleLogout = () => {
        onLogout()
        navigate("/login", { replace: true })
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        )
    }

    return (
        <Routes>
            {/* Public login route */}
            <Route path="/login" element={
                isLoggedIn ? <Navigate to="/dashboard" replace /> : <LoginPage onLoginSuccess={handleLoginSuccess} />
            } />

            {/* Protected routes */}
            <Route path="/" element={
                <ProtectedRoute isLoggedIn={isLoggedIn}>
                    <Layout email={userEmail} onLogout={handleLogout} />
                </ProtectedRoute>
            }>
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="upload-case" element={<UploadCasePage />} />
                <Route path="documents" element={<DocumentsPage />} />
                <Route path="extraction" element={<ExtractionPage />} />
                <Route path="comparison" element={<ComparisonPage />} />
                <Route path="prompts" element={<PromptManagementPage />} />
                <Route path="notifications" element={<NotificationsPage />} />
                <Route path="reports" element={<ReportsPage />} />
                <Route path="settings" element={<SettingsPage />} />
            </Route>

            {/* Catch all undefined routes - redirect to login if not logged in, dashboard if logged in */}
            <Route path="*" element={
                isLoggedIn ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
            } />
        </Routes>
    )
}