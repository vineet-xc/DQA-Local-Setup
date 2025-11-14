import { useState, useEffect } from "react"
import { BrowserRouter } from "react-router-dom"
import { AppRoutes } from "@/components/AppRoutes"
import { ThemeProvider } from "@/components/theme-provider"
import { ToastProvider } from "@/components/ToastProvider"

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userEmail, setUserEmail] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  // Check session storage on app initialization
  useEffect(() => {
    const savedEmail = sessionStorage.getItem("userEmail")
    if (savedEmail) {
      setUserEmail(savedEmail)
      setIsLoggedIn(true)
    }
    setIsLoading(false)
  }, [])

  const handleLoginSuccess = (email: string) => {
    // Save email to session storage
    sessionStorage.setItem("userEmail", email)
    setUserEmail(email)
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    // Clear session storage
    sessionStorage.removeItem("userEmail")
    sessionStorage.removeItem("redirectTo") // Clear any stored redirect
    setIsLoggedIn(false)
    setUserEmail("")
  }

  return (
    <ThemeProvider defaultTheme="system" storageKey="dqa-ui-theme">
      <BrowserRouter>
        <ToastProvider />
        <AppRoutes
          isLoggedIn={isLoggedIn}
          userEmail={userEmail}
          isLoading={isLoading}
          onLoginSuccess={handleLoginSuccess}
          onLogout={handleLogout}
        />
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
