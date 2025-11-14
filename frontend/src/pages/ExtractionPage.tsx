import React, { useState } from "react"
import { Download, ArrowLeftRight } from "lucide-react"

interface ExtractionPageProps { }

export function ExtractionPage({ }: ExtractionPageProps) {
    const [leftWidth, setLeftWidth] = useState(60) // Initial width percentage for left panel (4/5)
    const [isDragging, setIsDragging] = useState(false)
    const [isSwapped, setIsSwapped] = useState(false) // Track if columns are swapped

    // Sample data with initial state
    const initialData = [
        { id: 0, label: "Company Name", value: "TechCorp Solutions Inc.", originalValue: "TechCorp Solutions Inc." },
        { id: 1, label: "Invoice Number", value: "INV-2024-001234", originalValue: "INV-2024-001234" },
        { id: 2, label: "Invoice Date", value: "2024-03-15", originalValue: "2024-03-15" },
        { id: 3, label: "Due Date", value: "2024-04-14", originalValue: "2024-04-14" },
        { id: 4, label: "Customer Name", value: "Global Industries Ltd.", originalValue: "Global Industries Ltd." },
        { id: 5, label: "Customer Address", value: "123 Business Street, New York, NY 10001", originalValue: "123 Business Street, New York, NY 10001" },
        { id: 6, label: "Total Amount", value: "$15,847.50", originalValue: "$15,847.50" },
        { id: 7, label: "Tax Amount", value: "$1,584.75", originalValue: "$1,584.75" },
        { id: 8, label: "Subtotal", value: "$14,262.75", originalValue: "$14,262.75" },
        { id: 9, label: "Payment Terms", value: "Net 30 Days", originalValue: "Net 30 Days" },
        { id: 10, label: "Purchase Order", value: "PO-2024-5678", originalValue: "PO-2024-5678" },
        { id: 11, label: "Vendor ID", value: "VEN-789123", originalValue: "VEN-789123" },
        { id: 12, label: "Account Number", value: "ACC-456789012", originalValue: "ACC-456789012" },
        { id: 13, label: "Currency", value: "USD", originalValue: "USD" },
        { id: 14, label: "Description", value: "Software Development Services Q1 2024", originalValue: "Software Development Services Q1 2024" }
    ]

    const [extractedData, setExtractedData] = useState(initialData)
    const [fieldStatuses, setFieldStatuses] = useState<{ [key: number]: 'approved' | 'rejected' | 'pending' | 'modified' }>({})
    const [hasChanges, setHasChanges] = useState(false)

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true)
        e.preventDefault()
    }

    const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging) return

        const container = document.getElementById('extraction-container')
        if (!container) return

        const containerRect = container.getBoundingClientRect()
        const newWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100

        // Constrain width between 20% and 80%
        const constrainedWidth = Math.max(20, Math.min(80, newWidth))
        setLeftWidth(constrainedWidth)
    }

    const handleMouseUp = () => {
        setIsDragging(false)
    }

    // Add event listeners for mouse move and mouse up
    React.useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove)
            document.addEventListener('mouseup', handleMouseUp)
            document.body.style.cursor = 'col-resize'
            document.body.style.userSelect = 'none'
        } else {
            document.removeEventListener('mousemove', handleMouseMove)
            document.removeEventListener('mouseup', handleMouseUp)
            document.body.style.cursor = ''
            document.body.style.userSelect = ''
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove)
            document.removeEventListener('mouseup', handleMouseUp)
            document.body.style.cursor = ''
            document.body.style.userSelect = ''
        }
    }, [isDragging])

    const swapColumns = () => {
        setIsSwapped(!isSwapped)
    }

    const handleFieldChange = (id: number, newValue: string) => {
        const originalValue = initialData.find(item => item.id === id)?.originalValue
        const isModified = originalValue !== newValue

        setExtractedData(prev => prev.map(item =>
            item.id === id ? { ...item, value: newValue } : item
        ))

        setFieldStatuses(prev => ({
            ...prev,
            [id]: isModified ? 'modified' : 'pending'
        }))

        setHasChanges(true)
    }

    const handleApprove = (id: number) => {
        setFieldStatuses(prev => ({ ...prev, [id]: 'approved' }))
        setHasChanges(true)
    }

    const handleReject = (id: number) => {
        setFieldStatuses(prev => ({ ...prev, [id]: 'rejected' }))
        setHasChanges(true)
    }

    const handleSaveDraft = () => {
        console.log('Saving as draft:', { extractedData, fieldStatuses })
        // Here you would typically send data to your backend
        alert('Saved as draft!')
    }

    const handleSubmit = () => {
        console.log('Submitting:', { extractedData, fieldStatuses })
        // Here you would typically send data to your backend
        alert('Submitted successfully!')
        setHasChanges(false)
    }

    const handleDownloadExcel = () => {
        console.log('Downloading Excel with extracted data:', extractedData)
        // In a real implementation, this would generate and download an Excel file
        alert('Excel download started!')
    }

    // Check if a field has been modified
    const isFieldModified = (id: number) => {
        const originalValue = initialData.find(item => item.id === id)?.originalValue
        const currentValue = extractedData.find(item => item.id === id)?.value
        return originalValue !== currentValue
    }

    // Get all modified field IDs
    const getModifiedFields = () => {
        return extractedData.filter(item => isFieldModified(item.id)).map(item => item.id)
    }

    // Approve all modified fields
    const handleApproveAll = () => {
        const modifiedFields = getModifiedFields()
        const newStatuses = { ...fieldStatuses }
        modifiedFields.forEach(id => {
            newStatuses[id] = 'approved'
        })
        setFieldStatuses(newStatuses)
        setHasChanges(true)
    }

    // Reject all modified fields
    const handleRejectAll = () => {
        const modifiedFields = getModifiedFields()
        const newStatuses = { ...fieldStatuses }
        modifiedFields.forEach(id => {
            newStatuses[id] = 'rejected'
        })
        setFieldStatuses(newStatuses)
        setHasChanges(true)
    }

    const getCardBorderClass = (id: number) => {
        const status = fieldStatuses[id]
        switch (status) {
            case 'approved':
                return 'border-green-500 bg-green-50 dark:bg-green-950 dark:border-green-400'
            case 'rejected':
                return 'border-red-500 bg-red-50 dark:bg-red-950 dark:border-red-400'
            case 'modified':
                return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950 dark:border-yellow-400'
            default:
                return 'border-border bg-card'
        }
    }

    return (
        <div className="flex flex-col h-full">
            {/* Title Bar */}
            <div className="flex items-center justify-between p-4 border-b border-border bg-background">
                <h1 className="text-2xl font-bold text-foreground">Document Extraction</h1>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleDownloadExcel}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground bg-muted hover:bg-muted/80 rounded-md transition-colors"
                    >
                        <Download className="h-4 w-4" />
                        Download Excel
                    </button>
                    {getModifiedFields().length > 0 && (
                        <>
                            <button
                                onClick={handleApproveAll}
                                className="px-4 py-2 text-sm font-medium text-green-700 hover:text-green-800 bg-green-100 hover:bg-green-200 dark:bg-green-900 dark:text-green-300 dark:hover:bg-green-800 rounded-md transition-colors"
                            >
                                Approve All
                            </button>
                            <button
                                onClick={handleRejectAll}
                                className="px-4 py-2 text-sm font-medium text-red-700 hover:text-red-800 bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800 rounded-md transition-colors"
                            >
                                Reject All
                            </button>
                        </>
                    )}
                    {hasChanges && (
                        <button
                            onClick={handleSaveDraft}
                            className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground bg-muted hover:bg-muted/80 rounded-md transition-colors"
                        >
                            Save as Draft
                        </button>
                    )}
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 rounded-md transition-colors"
                    >
                        Submit
                    </button>
                </div>
            </div>

            {/* Resizable Content Area */}
            <div
                id="extraction-container"
                className="flex flex-1 overflow-hidden relative"
            >
                {/* Dragging Overlay - prevents iframe from capturing mouse events */}
                {isDragging && (
                    <div className="absolute inset-0 z-50 cursor-col-resize" />
                )}
                {/* First Panel (Left when not swapped, Right when swapped) */}
                <div
                    className="bg-background border-r border-border flex flex-col"
                    style={{ width: `${leftWidth}%` }}
                >
                    <div className="flex-1 overflow-hidden">
                        {isSwapped ? (
                            // When swapped: Left panel shows extracted values
                            <div className="p-4 h-full overflow-auto">
                                <div className="space-y-3">
                                    <h3 className="text-lg font-semibold text-foreground mb-4">Extracted Values</h3>

                                    {/* Sample extracted values */}
                                    {extractedData.map((item) => (
                                        <div key={item.id} className={`p-4 border-2 rounded-lg transition-all duration-200 ${getCardBorderClass(item.id)}`}>
                                            <div className="flex items-center justify-between mb-2">
                                                <label className="text-sm font-medium text-muted-foreground">
                                                    {item.label}
                                                </label>
                                                {isFieldModified(item.id) && (
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleApprove(item.id)}
                                                            className={`px-3 py-1 text-xs rounded-md transition-colors ${fieldStatuses[item.id] === 'approved'
                                                                ? 'bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-200'
                                                                : 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900 dark:text-green-300 dark:hover:bg-green-800'
                                                                }`}
                                                        >
                                                            Approve
                                                        </button>
                                                        <button
                                                            onClick={() => handleReject(item.id)}
                                                            className={`px-3 py-1 text-xs rounded-md transition-colors ${fieldStatuses[item.id] === 'rejected'
                                                                ? 'bg-red-200 text-red-800 dark:bg-red-800 dark:text-red-200'
                                                                : 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800'
                                                                }`}
                                                        >
                                                            Reject
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="space-y-2">
                                                {fieldStatuses[item.id] === 'modified' && (
                                                    <div>
                                                        <label className="block text-xs font-medium text-muted-foreground mb-1">
                                                            Original Extracted Value:
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={item.originalValue}
                                                            disabled
                                                            className="w-full px-3 py-2 text-sm border border-input bg-muted text-muted-foreground rounded-md cursor-not-allowed"
                                                        />
                                                    </div>
                                                )}
                                                <div>
                                                    {fieldStatuses[item.id] === 'modified' && (
                                                        <label className="block text-xs font-medium text-muted-foreground mb-1">
                                                            Modified Value:
                                                        </label>
                                                    )}
                                                    <input
                                                        type="text"
                                                        value={item.value}
                                                        onChange={(e) => handleFieldChange(item.id, e.target.value)}
                                                        className="w-full px-3 py-2 text-sm border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            // Default: Left panel shows PDF viewer
                            <div className="h-full relative">
                                <iframe
                                    src="https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf"
                                    className="w-full h-full border-0"
                                    title="Sample PDF Document"
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Resizer with Swap Button */}
                <div className="relative flex items-center justify-center">
                    {/* Thin Resizer Line */}
                    <div
                        className={`w-1 h-full bg-border hover:bg-primary/50 cursor-col-resize transition-colors ${isDragging ? 'bg-primary/50' : ''}`}
                        onMouseDown={handleMouseDown}
                    />

                    {/* Swap Button Overlay */}
                    <button
                        onClick={swapColumns}
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-1.5 text-white hover:text-gray-100 bg-gray-800 hover:bg-gray-700 dark:text-gray-900 dark:hover:text-gray-800 dark:bg-gray-100 dark:hover:bg-gray-200 border border-gray-600 dark:border-gray-300 rounded-md transition-colors shadow-sm z-10"
                        title="Swap Columns"
                    >
                        <ArrowLeftRight className="h-3 w-3" />
                    </button>
                </div>

                {/* Second Panel (Right when not swapped, Left when swapped) */}
                <div
                    className="bg-background flex flex-col"
                    style={{ width: `${100 - leftWidth}%` }}
                >
                    <div className="flex-1 overflow-hidden">
                        {isSwapped ? (
                            // When swapped: Right panel shows PDF viewer
                            <div className="h-full relative">
                                <iframe
                                    src="https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf"
                                    className="w-full h-full border-0"
                                    title="Sample PDF Document"
                                />
                            </div>
                        ) : (
                            // Default: Right panel shows extracted values
                            <div className="p-4 h-full overflow-auto">
                                <div className="space-y-3">
                                    <h3 className="text-lg font-semibold text-foreground mb-4">Extracted Values</h3>

                                    {/* Sample extracted values */}
                                    {extractedData.map((item) => (
                                        <div key={item.id} className={`p-4 border-2 rounded-lg transition-all duration-200 ${getCardBorderClass(item.id)}`}>
                                            <div className="flex items-center justify-between mb-2">
                                                <label className="text-sm font-medium text-muted-foreground">
                                                    {item.label}
                                                </label>
                                                {isFieldModified(item.id) && (
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleApprove(item.id)}
                                                            className={`px-3 py-1 text-xs rounded-md transition-colors ${fieldStatuses[item.id] === 'approved'
                                                                ? 'bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-200'
                                                                : 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900 dark:text-green-300 dark:hover:bg-green-800'
                                                                }`}
                                                        >
                                                            Approve
                                                        </button>
                                                        <button
                                                            onClick={() => handleReject(item.id)}
                                                            className={`px-3 py-1 text-xs rounded-md transition-colors ${fieldStatuses[item.id] === 'rejected'
                                                                ? 'bg-red-200 text-red-800 dark:bg-red-800 dark:text-red-200'
                                                                : 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800'
                                                                }`}
                                                        >
                                                            Reject
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="space-y-2">
                                                {fieldStatuses[item.id] === 'modified' && (
                                                    <div>
                                                        <label className="block text-xs font-medium text-muted-foreground mb-1">
                                                            Original Extracted Value:
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={item.originalValue}
                                                            disabled
                                                            className="w-full px-3 py-2 text-sm border border-input bg-muted text-muted-foreground rounded-md cursor-not-allowed"
                                                        />
                                                    </div>
                                                )}
                                                <div>
                                                    {fieldStatuses[item.id] === 'modified' && (
                                                        <label className="block text-xs font-medium text-muted-foreground mb-1">
                                                            Modified Value:
                                                        </label>
                                                    )}
                                                    <input
                                                        type="text"
                                                        value={item.value}
                                                        onChange={(e) => handleFieldChange(item.id, e.target.value)}
                                                        className="w-full px-3 py-2 text-sm border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}