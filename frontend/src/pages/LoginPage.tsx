import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Lock, Mail } from "lucide-react"

interface LoginPageProps {
    onLoginSuccess: (email: string) => void
}

export function LoginPage({ onLoginSuccess }: LoginPageProps) {
    const [showPassword, setShowPassword] = useState(false)
    const [email, setEmail] = useState("admin@example.com")
    const [password, setPassword] = useState("Password123!")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))

        // Check credentials (any email with password "Password123!")
        if (password === "Password123!") {
            console.log("Login successful:", { email, password })
            // The session storage will be handled in the App component
            onLoginSuccess(email)
        } else {
            setError("Invalid password. Please use 'Password123!'")
        }

        setIsLoading(false)
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
                    <CardDescription>
                        Enter your credentials to access your account
                    </CardDescription>
                    <div className="text-xs text-muted-foreground bg-muted p-2 rounded-md">
                        <strong>Demo:</strong> Use any email with password "Password123!"
                    </div>
                    <div className="text-xs text-muted-foreground bg-muted p-2 rounded-md">
                        <strong>Note:</strong> Your session will be saved and persist on page reload
                    </div>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pl-9"
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="pl-9 pr-9"
                                    required
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                                    ) : (
                                        <Eye className="h-4 w-4 text-muted-foreground" />
                                    )}
                                </Button>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="remember"
                                className="h-4 w-4 rounded border border-input"
                            />
                            <Label htmlFor="remember" className="text-sm font-normal">
                                Remember me
                            </Label>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4">
                        {error && (
                            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md border border-red-200">
                                {error}
                            </div>
                        )}
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? "Signing in..." : "Sign in"}
                        </Button>
                        <div className="text-center space-y-2">
                            <a
                                href="#"
                                className="text-sm text-primary hover:underline"
                            >
                                Forgot your password?
                            </a>
                            <p className="text-sm text-muted-foreground">
                                Don't have an account?{" "}
                                <a href="#" className="text-primary hover:underline">
                                    Sign up
                                </a>
                            </p>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}