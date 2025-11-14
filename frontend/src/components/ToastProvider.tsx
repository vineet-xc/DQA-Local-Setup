import { useEffect } from 'react'
import { showToast } from '@/pages/NotificationsPage'

// Global toast integration component
export function ToastProvider() {
    useEffect(() => {
        // Make toast function globally available
        ; (window as any).showToast = showToast

        // Listen for API error events
        const handleApiError = (event: CustomEvent) => {
            const { message } = event.detail
            showToast('error', 'API Error', message)
        }

        // Listen for API success events
        const handleApiSuccess = (event: CustomEvent) => {
            const { message } = event.detail
            showToast('success', 'Success', message)
        }

        window.addEventListener('api-error', handleApiError as EventListener)
        window.addEventListener('api-success', handleApiSuccess as EventListener)

        // Cleanup
        return () => {
            window.removeEventListener('api-error', handleApiError as EventListener)
            window.removeEventListener('api-success', handleApiSuccess as EventListener)
            delete (window as any).showToast
        }
    }, [])

    return null // This component doesn't render anything
}

// Export toast methods for easy import
export { showToast, toast } from '@/pages/NotificationsPage'