// Example usage of API interceptor and services
import React, { useState } from 'react'
import apiServices from '@/lib/api-services'
import { useApi, usePagination, useUpload } from '@/hooks/useApi'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

// Example 1: Basic API usage with hooks
export function DocumentsListExample() {
    // Using pagination hook for documents
    const {
        data: documents,
        loading,
        error,
        page,
        totalPages,
        hasNext,
        hasPrev,
        nextPage,
        prevPage,
        setPageSize,
        refresh
    } = usePagination(apiServices.documents.getDocuments, {
        immediate: true,
        initialLimit: 10
    })

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2>Documents</h2>
                <Button onClick={refresh} disabled={loading}>
                    Refresh
                </Button>
            </div>

            {loading && <div>Loading documents...</div>}
            {error && <div className="text-red-500">Error: {error}</div>}

            <div className="grid gap-2">
                {documents.map(doc => (
                    <div key={doc.id} className="border p-4 rounded">
                        <h3>{doc.name}</h3>
                        <p>Status: {doc.status}</p>
                        <p>Size: {doc.size} bytes</p>
                    </div>
                ))}
            </div>

            {/* Pagination controls */}
            <div className="flex items-center gap-2">
                <Button onClick={prevPage} disabled={!hasPrev || loading}>
                    Previous
                </Button>
                <span>Page {page} of {totalPages}</span>
                <Button onClick={nextPage} disabled={!hasNext || loading}>
                    Next
                </Button>
                <select
                    value={10}
                    onChange={(e) => setPageSize(Number(e.target.value))}
                    className="ml-4 border rounded px-2 py-1"
                >
                    <option value={10}>10 per page</option>
                    <option value={20}>20 per page</option>
                    <option value={50}>50 per page</option>
                </select>
            </div>
        </div>
    )
}

// Example 2: Authentication example
export function LoginExample() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const { execute: login, loading, error } = useApi(apiServices.auth.login, {
        onSuccess: (data) => {
            console.log('Login successful:', data)
            // Redirect to dashboard or update app state
        },
        onError: (error) => {
            console.error('Login failed:', error)
        }
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await login({ email, password })
        } catch (err) {
            // Error is already handled by the hook
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>
            <div>
                <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>
            {error && <div className="text-red-500">{error}</div>}
            <Button type="submit" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
            </Button>
        </form>
    )
}

// Example 3: File upload example
export function FileUploadExample() {
    const { upload, uploading, progress, error, uploadedFile, reset } = useUpload(
        apiServices.documents.uploadDocument,
        {
            onSuccess: (data) => {
                console.log('File uploaded successfully:', data)
            }
        }
    )

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            try {
                await upload(file)
            } catch (err) {
                // Error is handled by the hook
            }
        }
    }

    return (
        <div className="space-y-4">
            <div>
                <input
                    type="file"
                    onChange={handleFileSelect}
                    disabled={uploading}
                    accept=".pdf,.doc,.docx,.txt"
                />
            </div>

            {uploading && (
                <div>
                    <div className="text-sm">Uploading... {progress}%</div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            )}

            {error && (
                <div className="text-red-500">
                    Error: {error}
                    <Button onClick={reset} variant="outline" size="sm" className="ml-2">
                        Try Again
                    </Button>
                </div>
            )}

            {uploadedFile && (
                <div className="text-green-500">
                    File uploaded successfully: {uploadedFile.name}
                </div>
            )}
        </div>
    )
}

// Example 4: Prompt management example
export function PromptsManagementExample() {
    const {
        data: prompts,
        loading,
        error,
        execute: fetchPrompts
    } = useApi(apiServices.prompts.getPrompts, {
        immediate: true
    })

    const {
        execute: createPrompt,
        loading: creating
    } = useApi(apiServices.prompts.createPrompt, {
        onSuccess: () => {
            fetchPrompts() // Refresh the list
        }
    })

    const {
        execute: deletePrompt,
        loading: deleting
    } = useApi(apiServices.prompts.deletePrompt, {
        onSuccess: () => {
            fetchPrompts() // Refresh the list
        }
    })

    const handleCreatePrompt = async () => {
        try {
            await createPrompt({
                field: 'New Field',
                prompt: 'New prompt description'
            })
        } catch (err) {
            // Error handled by hook
        }
    }

    const handleDeletePrompt = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this prompt?')) {
            try {
                await deletePrompt(id)
            } catch (err) {
                // Error handled by hook
            }
        }
    }

    if (loading) return <div>Loading prompts...</div>
    if (error) return <div className="text-red-500">Error: {error}</div>

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2>Prompt Management</h2>
                <Button onClick={handleCreatePrompt} disabled={creating}>
                    {creating ? 'Creating...' : 'Add Prompt'}
                </Button>
            </div>

            <div className="grid gap-2">
                {prompts?.map((prompt: any) => (
                    <div key={prompt.id} className="border p-4 rounded flex justify-between items-start">
                        <div>
                            <h3 className="font-semibold">{prompt.field}</h3>
                            <p className="text-sm text-gray-600">{prompt.prompt}</p>
                        </div>
                        <Button
                            onClick={() => handleDeletePrompt(prompt.id)}
                            disabled={deleting}
                            variant="destructive"
                            size="sm"
                        >
                            Delete
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    )
}

// Example 5: Using direct API services (without hooks)
export async function directApiExample() {
    try {
        // Login
        const loginResponse = await apiServices.auth.login({
            email: 'user@example.com',
            password: 'password123'
        })

        console.log('Logged in successfully:', loginResponse.data)

        // Get user profile
        const profileResponse = await apiServices.user.getProfile()
        console.log('User profile:', profileResponse.data)

        // Get documents
        const documentsResponse = await apiServices.documents.getDocuments(1, 10)
        console.log('Documents:', documentsResponse.data)

        // Get dashboard stats
        const statsResponse = await apiServices.analytics.getDashboardStats()
        console.log('Dashboard stats:', statsResponse.data)
    } catch (error) {
        console.error('API error:', error)
        // Error is automatically handled by the interceptor
    }
}

// Example 6: Setting up global error listeners
export function setupGlobalErrorHandlers() {
    // Listen for API errors
    window.addEventListener('api-error', (event: any) => {
        const { message } = event.detail

        // Show toast notification, modal, or update global error state
        console.log('API Error:', message)

        // Example: Show toast notification
        // toast.error(message)

        // Example: Update global error state
        // setGlobalError(message)
    })

    // Listen for API success
    window.addEventListener('api-success', (event: any) => {
        const { message } = event.detail

        // Show success notification
        console.log('API Success:', message)

        // Example: Show toast notification
        // toast.success(message)
    })
}

// Example 7: Environment-specific configuration
export function configureApiForEnvironment() {
    // The base URL is automatically configured from VITE_API_BASE_URL

    // You can also set different configurations based on environment
    if (import.meta.env.PROD) {
        // Production configuration
        console.log('Running in production mode')
    } else {
        // Development configuration
        console.log('Running in development mode with enhanced logging')
    }
}