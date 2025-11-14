import { useState } from "react"
import { Download, FilterX } from "lucide-react"

interface ComparisonPageProps { }

export function ComparisonPage({ }: ComparisonPageProps) {
    // Sample data for Source 1 (Left Panel)
    const source1Data = [
        { id: 0, label: "Company Name", value: "TechCorp Solutions Inc." },
        { id: 1, label: "Invoice Number", value: "INV-2024-001234" },
        { id: 2, label: "Invoice Date", value: "2024-03-15" },
        { id: 3, label: "Due Date", value: "2024-04-14" },
        { id: 4, label: "Customer Name", value: "Global Industries Ltd." },
        { id: 5, label: "Customer Address", value: "123 Business Street, New York, NY 10001" },
        { id: 6, label: "Total Amount", value: "$15,847.50" },
        { id: 7, label: "Tax Amount", value: "$1,584.75" },
        { id: 8, label: "Subtotal", value: "$14,262.75" },
        { id: 9, label: "Payment Terms", value: "Net 30 Days" },
        { id: 10, label: "Purchase Order", value: "PO-2024-5678" },
        { id: 11, label: "Vendor ID", value: "VEN-789123" },
        { id: 12, label: "Account Number", value: "ACC-456789012" },
        { id: 13, label: "Currency", value: "USD" },
        { id: 14, label: "Description", value: "Software Development Services Q1 2024" }
    ]

    // Sample data for Source 2 (Right Panel) - Different values
    const source2Data = [
        { id: 0, label: "Company Name", value: "TechCorp Solutions Inc." },
        { id: 1, label: "Invoice Number", value: "INV-2024-001235" }, // Different
        { id: 2, label: "Invoice Date", value: "2024-03-16" }, // Different
        { id: 3, label: "Due Date", value: "2024-04-15" }, // Different
        { id: 4, label: "Customer Name", value: "Global Industries Limited" }, // Different
        { id: 5, label: "Customer Address", value: "123 Business St, New York, NY 10001" }, // Different
        { id: 6, label: "Total Amount", value: "$15,850.00" }, // Different
        { id: 7, label: "Tax Amount", value: "$1,585.00" }, // Different
        { id: 8, label: "Subtotal", value: "$14,265.00" }, // Different
        { id: 9, label: "Payment Terms", value: "Net 30" }, // Different
        { id: 10, label: "Purchase Order", value: "PO-2024-5678" },
        { id: 11, label: "Vendor ID", value: "VEN-789124" }, // Different
        { id: 12, label: "Account Number", value: "ACC-456789013" }, // Different
        { id: 13, label: "Currency", value: "USD" },
        { id: 14, label: "Description", value: "Software Development Services Q1 2024" }
    ]

    const [leftPanelData] = useState(source1Data)
    const [rightPanelData] = useState(source2Data)
    const [showDifferencesOnly, setShowDifferencesOnly] = useState(false)

    // Function to check if a field has different values between left and right panels
    const isFieldDifferent = (id: number) => {
        const leftItem = leftPanelData.find(item => item.id === id)
        const rightItem = rightPanelData.find(item => item.id === id)
        return leftItem?.value !== rightItem?.value
    }

    // Filter data based on showDifferencesOnly state
    const getFilteredData = (data: typeof leftPanelData) => {
        if (!showDifferencesOnly) return data
        return data.filter(item => isFieldDifferent(item.id))
    }

    const toggleDifferencesView = () => {
        setShowDifferencesOnly(!showDifferencesOnly)
    }

    const handleSubmit = () => {
        console.log('Submitting comparison data:', {
            source1: leftPanelData,
            source2: rightPanelData
        })
        alert('Submitted successfully!')
    }

    const handleDownloadExcel = () => {
        console.log('Downloading Excel with comparison data:', {
            source1: leftPanelData,
            source2: rightPanelData
        })
        alert('Excel download started!')
    }

    return (
        <div className="flex flex-col h-full">
            {/* Action Bar */}
            <div className="flex items-center justify-end px-6 py-4 border-b border-border bg-surface">
                <div className="flex items-center gap-3">
                    <button
                        onClick={toggleDifferencesView}
                        className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${showDifferencesOnly
                            ? 'text-primary-foreground bg-primary hover:bg-primary/90'
                            : 'text-muted-foreground hover:text-foreground bg-surface-secondary hover:bg-surface-tertiary'
                            }`}
                    >
                        <FilterX className="h-4 w-4" />
                        {showDifferencesOnly ? 'Show All Fields' : 'Show Differences Only'}
                    </button>
                    <button
                        onClick={handleDownloadExcel}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground bg-surface-secondary hover:bg-surface-tertiary rounded-lg transition-colors"
                    >
                        <Download className="h-4 w-4" />
                        Download Excel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 text-sm font-medium text-success-foreground bg-success hover:bg-success/90 rounded-lg transition-colors"
                    >
                        Submit
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 min-h-0 overflow-hidden">
                <div className="pt-6 h-full flex flex-col">
                    <div className="flex-1 flex flex-col border border-border rounded-lg overflow-hidden min-h-0">
                        {/* Table Header */}
                        <div className="bg-surface-secondary border-b border-border flex-shrink-0">
                            <div className="grid gap-0" style={{ gridTemplateColumns: '4rem 12rem 1fr 1fr' }}>
                                <div className="px-2 py-1.5 font-semibold text-sm text-foreground border-r border-border text-center">
                                    S.No
                                </div>
                                <div className="px-2 py-1.5 font-semibold text-sm text-foreground border-r border-border">
                                    Field Name
                                </div>
                                <div className="px-2 py-1.5 font-semibold text-sm text-foreground border-r border-border">
                                    Source 1
                                </div>
                                <div className="px-2 py-1.5 font-semibold text-sm text-foreground">
                                    Source 2
                                </div>
                            </div>
                        </div>

                        {/* Table Body */}
                        <div className="flex-1 overflow-auto min-h-0">
                            {getFilteredData(leftPanelData).length === 0 ? (
                                <div className="flex items-center justify-center h-full min-h-[200px]">
                                    <div className="text-center">
                                        <div className="text-4xl text-muted-foreground mb-2">📄</div>
                                        <p className="text-muted-foreground text-sm">
                                            {showDifferencesOnly ? 'No differences found' : 'No data available'}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                getFilteredData(leftPanelData).map((item, index) => {
                                    const rightItem = rightPanelData.find(right => right.id === item.id)
                                    const isDifferent = isFieldDifferent(item.id)

                                    return (
                                        <div
                                            key={item.id}
                                            className={`grid gap-0 border-b border-border last:border-b-0 hover:bg-surface-secondary/50 transition-colors min-h-[2.5rem] ${isDifferent ? 'bg-yellow-50 dark:bg-yellow-950/20' : ''
                                                }`}
                                            style={{ gridTemplateColumns: '4rem 12rem 1fr 1fr' }}
                                        >
                                            <div className="px-2 py-1.5 text-sm text-foreground border-r border-border flex items-center justify-center">
                                                <span className="font-medium">{index + 1}</span>
                                            </div>
                                            <div className="px-2 py-1.5 text-sm font-medium text-foreground border-r border-border flex items-center">
                                                <span className="break-words">{item.label}</span>
                                            </div>
                                            <div className={`px-2 py-1.5 text-sm text-foreground border-r border-border flex items-center ${isDifferent ? 'bg-red-50 dark:bg-red-950/20 font-medium' : ''
                                                }`}>
                                                <span className="break-words">{item.value}</span>
                                            </div>
                                            <div className={`px-2 py-1.5 text-sm text-foreground flex items-center ${isDifferent ? 'bg-red-50 dark:bg-red-950/20 font-medium' : ''
                                                }`}>
                                                <span className="break-words">{rightItem?.value || 'N/A'}</span>
                                            </div>
                                        </div>
                                    )
                                })
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}