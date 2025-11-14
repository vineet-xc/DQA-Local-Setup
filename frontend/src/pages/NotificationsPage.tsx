import { useState } from "react"
import { Bell, Check, X, Info, AlertTriangle, AlertCircle, Trash2, CheckCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Types for notifications
export interface NotificationItem {
    id: string
    type: 'info' | 'success' | 'warning' | 'error'
    title: string
    message: string
    timestamp: Date
    read: boolean
    action?: {
        label: string
        onClick: () => void
    }
}

// Sample notification data
const initialNotifications: NotificationItem[] = [
    {
        id: '1',
        type: 'success',
        title: 'Document Processed',
        message: 'Invoice_2024_001.pdf has been successfully processed and data extracted.',
        timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
        read: false
    },
    {
        id: '2',
        type: 'warning',
        title: 'Processing Delayed',
        message: 'Document processing is taking longer than usual due to high queue volume.',
        timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
        read: false
    },
    {
        id: '3',
        type: 'error',
        title: 'Processing Failed',
        message: 'Contract_2024_005.pdf could not be processed. Please check the file format.',
        timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        read: true
    },
    {
        id: '4',
        type: 'info',
        title: 'System Update',
        message: 'New extraction templates have been added to improve accuracy.',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        read: true
    },
    {
        id: '5',
        type: 'success',
        title: 'Backup Complete',
        message: 'Daily backup has been completed successfully.',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
        read: true
    },
    {
        id: '6',
        type: 'warning',
        title: 'Storage Warning',
        message: 'Storage usage is at 85%. Consider archiving old documents.',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        read: false
    }
]

export function NotificationsPage() {
    const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications)
    const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all')

    const getNotificationIcon = (type: NotificationItem['type']) => {
        switch (type) {
            case 'success':
                return <Check className="h-4 w-4 text-green-600" />
            case 'warning':
                return <AlertTriangle className="h-4 w-4 text-yellow-600" />
            case 'error':
                return <AlertCircle className="h-4 w-4 text-red-600" />
            case 'info':
            default:
                return <Info className="h-4 w-4 text-blue-600" />
        }
    }

    const getNotificationBorderColor = (type: NotificationItem['type']) => {
        switch (type) {
            case 'success':
                return 'border-l-green-500'
            case 'warning':
                return 'border-l-yellow-500'
            case 'error':
                return 'border-l-red-500'
            case 'info':
            default:
                return 'border-l-blue-500'
        }
    }

    const formatTimestamp = (timestamp: Date) => {
        const now = new Date()
        const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60))

        if (diffInMinutes < 1) return 'Just now'
        if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`

        const diffInHours = Math.floor(diffInMinutes / 60)
        if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`

        const diffInDays = Math.floor(diffInHours / 24)
        if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`

        return timestamp.toLocaleDateString()
    }

    const markAsRead = (id: string) => {
        setNotifications(prev =>
            prev.map(notification =>
                notification.id === id
                    ? { ...notification, read: true }
                    : notification
            )
        )
    }

    const markAllAsRead = () => {
        setNotifications(prev =>
            prev.map(notification => ({ ...notification, read: true }))
        )
    }

    const deleteNotification = (id: string) => {
        setNotifications(prev => prev.filter(notification => notification.id !== id))
    }

    const clearAll = () => {
        setNotifications([])
    }

    // Trigger test notifications
    const triggerTestNotification = (type: NotificationItem['type']) => {
        const testMessages = {
            success: {
                title: 'Test Success',
                message: 'This is a test success notification!'
            },
            warning: {
                title: 'Test Warning',
                message: 'This is a test warning notification!'
            },
            error: {
                title: 'Test Error',
                message: 'This is a test error notification!'
            },
            info: {
                title: 'Test Info',
                message: 'This is a test info notification!'
            }
        }

        const newNotification: NotificationItem = {
            id: Date.now().toString(),
            type,
            title: testMessages[type].title,
            message: testMessages[type].message,
            timestamp: new Date(),
            read: false
        }

        setNotifications(prev => [newNotification, ...prev])

        // Also trigger toast notification
        showToast(type, testMessages[type].title, testMessages[type].message)
    }

    const filteredNotifications = notifications.filter(notification => {
        if (filter === 'unread') return !notification.read
        if (filter === 'read') return notification.read
        return true
    })

    const unreadCount = notifications.filter(n => !n.read).length

    return (
        <div className="p-6 space-y-6 max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <Bell className="h-6 w-6 text-foreground" />
                    <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
                    {unreadCount > 0 && (
                        <Badge variant="destructive" className="ml-2">
                            {unreadCount} unread
                        </Badge>
                    )}
                </div>
                <div className="flex items-center space-x-2">
                    <Button onClick={markAllAsRead} variant="outline" size="sm" disabled={unreadCount === 0}>
                        <CheckCheck className="h-4 w-4 mr-1" />
                        Mark All Read
                    </Button>
                    <Button onClick={clearAll} variant="outline" size="sm" disabled={notifications.length === 0}>
                        <Trash2 className="h-4 w-4 mr-1" />
                        Clear All
                    </Button>
                </div>
            </div>

            {/* Test Notification Triggers */}
            <Card>
                <CardHeader>
                    <CardTitle>Test Notifications</CardTitle>
                    <CardDescription>Click the buttons below to test different types of notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <Button
                            onClick={() => triggerTestNotification('success')}
                            variant="outline"
                            className="border-green-200 hover:bg-green-50 dark:border-green-800 dark:hover:bg-green-950"
                        >
                            <Check className="h-4 w-4 mr-2 text-green-600" />
                            Success
                        </Button>
                        <Button
                            onClick={() => triggerTestNotification('warning')}
                            variant="outline"
                            className="border-yellow-200 hover:bg-yellow-50 dark:border-yellow-800 dark:hover:bg-yellow-950"
                        >
                            <AlertTriangle className="h-4 w-4 mr-2 text-yellow-600" />
                            Warning
                        </Button>
                        <Button
                            onClick={() => triggerTestNotification('error')}
                            variant="outline"
                            className="border-red-200 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-950"
                        >
                            <AlertCircle className="h-4 w-4 mr-2 text-red-600" />
                            Error
                        </Button>
                        <Button
                            onClick={() => triggerTestNotification('info')}
                            variant="outline"
                            className="border-blue-200 hover:bg-blue-50 dark:border-blue-800 dark:hover:bg-blue-950"
                        >
                            <Info className="h-4 w-4 mr-2 text-blue-600" />
                            Info
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Filter Tabs */}
            <div className="flex space-x-1 bg-muted p-1 rounded-md w-fit">
                <button
                    onClick={() => setFilter('all')}
                    className={`px-3 py-1.5 text-sm rounded ${filter === 'all'
                        ? 'bg-background text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                        }`}
                >
                    All ({notifications.length})
                </button>
                <button
                    onClick={() => setFilter('unread')}
                    className={`px-3 py-1.5 text-sm rounded ${filter === 'unread'
                        ? 'bg-background text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                        }`}
                >
                    Unread ({unreadCount})
                </button>
                <button
                    onClick={() => setFilter('read')}
                    className={`px-3 py-1.5 text-sm rounded ${filter === 'read'
                        ? 'bg-background text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                        }`}
                >
                    Read ({notifications.length - unreadCount})
                </button>
            </div>

            {/* Notifications List */}
            <div className="space-y-3">
                {filteredNotifications.length === 0 ? (
                    <Card className="p-12 text-center">
                        <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                            {filter === 'all' ? 'No notifications' : `No ${filter} notifications`}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            {filter === 'all'
                                ? 'You\'re all caught up!'
                                : `You have no ${filter} notifications.`
                            }
                        </p>
                    </Card>
                ) : (
                    filteredNotifications.map((notification) => (
                        <Card
                            key={notification.id}
                            className={`border-l-4 ${getNotificationBorderColor(notification.type)} ${!notification.read ? 'bg-accent/30' : ''
                                } hover:shadow-md transition-shadow`}
                        >
                            <CardContent className="p-4">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start space-x-3 flex-1">
                                        <div className="mt-0.5">
                                            {getNotificationIcon(notification.type)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center space-x-2 mb-1">
                                                <h3 className="text-sm font-semibold text-foreground">
                                                    {notification.title}
                                                </h3>
                                                {!notification.read && (
                                                    <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                                                )}
                                            </div>
                                            <p className="text-sm text-muted-foreground mb-2">
                                                {notification.message}
                                            </p>
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs text-muted-foreground">
                                                    {formatTimestamp(notification.timestamp)}
                                                </span>
                                                <div className="flex items-center space-x-2">
                                                    {!notification.read && (
                                                        <Button
                                                            onClick={() => markAsRead(notification.id)}
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-7 px-2 text-xs"
                                                        >
                                                            Mark as read
                                                        </Button>
                                                    )}
                                                    <Button
                                                        onClick={() => deleteNotification(notification.id)}
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {notification.action && (
                                    <div className="mt-3 flex justify-end">
                                        <Button
                                            onClick={notification.action.onClick}
                                            size="sm"
                                            variant="outline"
                                        >
                                            {notification.action.label}
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    )
}

// Toast notification system
interface ToastNotification {
    id: string
    type: 'info' | 'success' | 'warning' | 'error'
    title: string
    message: string
    duration?: number
}

let toastContainer: HTMLDivElement | null = null
const activeToasts: Map<string, HTMLDivElement> = new Map()

const createToastContainer = () => {
    if (!toastContainer) {
        toastContainer = document.createElement('div')
        toastContainer.className = 'fixed top-4 right-4 z-50 space-y-2 pointer-events-none'
        document.body.appendChild(toastContainer)
    }
    return toastContainer
}

const getToastStyles = (type: ToastNotification['type']) => {
    const baseStyles = 'pointer-events-auto max-w-sm w-full bg-background border rounded-lg shadow-lg p-4 transition-all duration-300 transform'

    switch (type) {
        case 'success':
            return `${baseStyles} border-green-500 bg-green-50 dark:bg-green-950`
        case 'warning':
            return `${baseStyles} border-yellow-500 bg-yellow-50 dark:bg-yellow-950`
        case 'error':
            return `${baseStyles} border-red-500 bg-red-50 dark:bg-red-950`
        case 'info':
        default:
            return `${baseStyles} border-blue-500 bg-blue-50 dark:bg-blue-950`
    }
}

const getToastIcon = (type: ToastNotification['type']) => {
    const iconStyles = 'h-4 w-4 flex-shrink-0 mt-0.5'
    switch (type) {
        case 'success':
            return `<svg class="${iconStyles} text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>`
        case 'warning':
            return `<svg class="${iconStyles} text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path></svg>`
        case 'error':
            return `<svg class="${iconStyles} text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`
        case 'info':
        default:
            return `<svg class="${iconStyles} text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`
    }
}

export const showToast = (
    type: ToastNotification['type'],
    title: string,
    message: string,
    duration: number = 5000
) => {
    const container = createToastContainer()
    const toastId = Date.now().toString()

    const toastElement = document.createElement('div')
    toastElement.className = getToastStyles(type)
    toastElement.style.opacity = '0'
    toastElement.style.transform = 'translateX(100%)'

    toastElement.innerHTML = `
        <div class="flex items-start space-x-3">
            ${getToastIcon(type)}
            <div class="flex-1 min-w-0">
                <h4 class="text-sm font-semibold text-foreground">${title}</h4>
                <p class="text-sm text-muted-foreground mt-1">${message}</p>
            </div>
            <button class="ml-2 text-muted-foreground hover:text-foreground transition-colors" onclick="this.parentElement.parentElement.remove()">
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
        </div>
    `

    container.appendChild(toastElement)
    activeToasts.set(toastId, toastElement)

    // Animate in
    requestAnimationFrame(() => {
        toastElement.style.opacity = '1'
        toastElement.style.transform = 'translateX(0)'
    })

    // Auto remove after duration
    setTimeout(() => {
        if (activeToasts.has(toastId)) {
            toastElement.style.opacity = '0'
            toastElement.style.transform = 'translateX(100%)'
            setTimeout(() => {
                if (toastElement.parentElement) {
                    toastElement.remove()
                }
                activeToasts.delete(toastId)
            }, 300)
        }
    }, duration)

    return toastId
}

// Global toast methods for easy access
export const toast = {
    success: (title: string, message: string, duration?: number) => showToast('success', title, message, duration),
    warning: (title: string, message: string, duration?: number) => showToast('warning', title, message, duration),
    error: (title: string, message: string, duration?: number) => showToast('error', title, message, duration),
    info: (title: string, message: string, duration?: number) => showToast('info', title, message, duration),
}