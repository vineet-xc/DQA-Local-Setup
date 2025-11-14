import { useState } from "react"
import { Trash2, RotateCcw, Download } from "lucide-react"

interface PromptManagementPageProps { }

interface PromptItem {
    id: number
    field: string
    type: string
    prompt: string
    originalField?: string
    originalType?: string
    originalPrompt?: string
    status?: 'original' | 'new' | 'toDelete'
}

export function PromptManagementPage({ }: PromptManagementPageProps) {
    // Sample prompt data with 30 rows
    const initialPromptData: PromptItem[] = [
        { id: 1, field: "Company Name", type: "string", prompt: "Extract the company or organization name from the document header, letterhead, or billing information", originalField: "Company Name", originalType: "string", originalPrompt: "Extract the company or organization name from the document header, letterhead, or billing information", status: 'original' },
        { id: 2, field: "Invoice Number", type: "string", prompt: "Identify and extract the unique invoice number, reference number, or document ID", originalField: "Invoice Number", originalType: "string", originalPrompt: "Identify and extract the unique invoice number, reference number, or document ID", status: 'original' },
        { id: 3, field: "Invoice Date", type: "date", prompt: "Find and extract the invoice issue date in MM/DD/YYYY or similar format", originalField: "Invoice Date", originalType: "date", originalPrompt: "Find and extract the invoice issue date in MM/DD/YYYY or similar format", status: 'original' },
        { id: 4, field: "Due Date", type: "date", prompt: "Extract the payment due date or terms from the document", originalField: "Due Date", originalType: "date", originalPrompt: "Extract the payment due date or terms from the document", status: 'original' },
        { id: 5, field: "Customer Name", type: "string", prompt: "Identify the customer, client, or recipient name from the billing section", originalField: "Customer Name", originalType: "string", originalPrompt: "Identify the customer, client, or recipient name from the billing section", status: 'original' },
        { id: 6, field: "Customer Address", type: "string", prompt: "Extract the complete billing or shipping address including street, city, state, and ZIP code", originalField: "Customer Address", originalType: "string", originalPrompt: "Extract the complete billing or shipping address including street, city, state, and ZIP code", status: 'original' },
        { id: 7, field: "Total Amount", type: "number", prompt: "Find the final total amount due including all taxes and fees, usually in bold or highlighted", originalField: "Total Amount", originalType: "number", originalPrompt: "Find the final total amount due including all taxes and fees, usually in bold or highlighted", status: 'original' },
        { id: 8, field: "Tax Amount", type: "number", prompt: "Extract any tax amounts, VAT, or sales tax from the document itemization", originalField: "Tax Amount", originalType: "number", originalPrompt: "Extract any tax amounts, VAT, or sales tax from the document itemization", status: 'original' },
        { id: 9, field: "Subtotal", type: "number", prompt: "Identify the subtotal amount before taxes and additional charges", originalField: "Subtotal", originalType: "number", originalPrompt: "Identify the subtotal amount before taxes and additional charges", status: 'original' },
        { id: 10, field: "Payment Terms", type: "string", prompt: "Extract payment terms such as 'Net 30', 'Due on Receipt', or other payment conditions", originalField: "Payment Terms", originalType: "string", originalPrompt: "Extract payment terms such as 'Net 30', 'Due on Receipt', or other payment conditions", status: 'original' },
        { id: 11, field: "Purchase Order", type: "string", prompt: "Find any purchase order number, PO reference, or requisition number", originalField: "Purchase Order", originalType: "string", originalPrompt: "Find any purchase order number, PO reference, or requisition number", status: 'original' },
        { id: 12, field: "Vendor ID", type: "string", prompt: "Extract vendor identification number, supplier code, or merchant ID", originalField: "Vendor ID", originalType: "string", originalPrompt: "Extract vendor identification number, supplier code, or merchant ID", status: 'original' },
        { id: 13, field: "Account Number", type: "string", prompt: "Identify customer account number or client reference number", originalField: "Account Number", originalType: "string", originalPrompt: "Identify customer account number or client reference number", status: 'original' },
        { id: 14, field: "Currency", type: "string", prompt: "Determine the currency type (USD, EUR, GBP, etc.) from symbols or text", originalField: "Currency", originalType: "string", originalPrompt: "Determine the currency type (USD, EUR, GBP, etc.) from symbols or text", status: 'original' },
        { id: 15, field: "Description", type: "string", prompt: "Extract the main service or product description from line items", originalField: "Description", originalType: "string", originalPrompt: "Extract the main service or product description from line items", status: 'original' },
        { id: 16, field: "Quantity", type: "number", prompt: "Find quantity values for products or services listed in the invoice", originalField: "Quantity", originalType: "number", originalPrompt: "Find quantity values for products or services listed in the invoice", status: 'original' },
        { id: 17, field: "Unit Price", type: "number", prompt: "Extract individual unit prices for each line item or service", originalField: "Unit Price", originalType: "number", originalPrompt: "Extract individual unit prices for each line item or service", status: 'original' },
        { id: 18, field: "Discount", type: "number", prompt: "Identify any discount amounts, percentage discounts, or promotional reductions", originalField: "Discount", originalType: "number", originalPrompt: "Identify any discount amounts, percentage discounts, or promotional reductions", status: 'original' },
        { id: 19, field: "Shipping Cost", type: "number", prompt: "Extract shipping, delivery, or freight charges if applicable", originalField: "Shipping Cost", originalType: "number", originalPrompt: "Extract shipping, delivery, or freight charges if applicable", status: 'original' },
        { id: 20, field: "Billing Period", type: "string", prompt: "Find the billing cycle, service period, or subscription duration", originalField: "Billing Period", originalType: "string", originalPrompt: "Find the billing cycle, service period, or subscription duration", status: 'original' },
        { id: 21, field: "Contact Email", type: "email", prompt: "Extract email addresses for customer service, billing inquiries, or general contact", originalField: "Contact Email", originalType: "email", originalPrompt: "Extract email addresses for customer service, billing inquiries, or general contact", status: 'original' },
        { id: 22, field: "Phone Number", type: "phone", prompt: "Identify phone numbers for customer support, billing, or main office contact", originalField: "Phone Number", originalType: "phone", originalPrompt: "Identify phone numbers for customer support, billing, or main office contact", status: 'original' },
        { id: 23, field: "Payment Method", type: "string", prompt: "Extract accepted payment methods, credit card types, or payment instructions", originalField: "Payment Method", originalType: "string", originalPrompt: "Extract accepted payment methods, credit card types, or payment instructions", status: 'original' },
        { id: 24, field: "Bank Details", type: "string", prompt: "Find bank account information, routing numbers, or wire transfer details", originalField: "Bank Details", originalType: "string", originalPrompt: "Find bank account information, routing numbers, or wire transfer details", status: 'original' },
        { id: 25, field: "Terms & Conditions", type: "string", prompt: "Extract key terms, conditions, or legal disclaimers from the document", originalField: "Terms & Conditions", originalType: "string", originalPrompt: "Extract key terms, conditions, or legal disclaimers from the document", status: 'original' },
        { id: 26, field: "Late Fee", type: "number", prompt: "Identify late payment fees, penalty charges, or interest rates for overdue payments", originalField: "Late Fee", originalType: "number", originalPrompt: "Identify late payment fees, penalty charges, or interest rates for overdue payments", status: 'original' },
        { id: 27, field: "Reference Number", type: "string", prompt: "Extract any additional reference numbers, transaction IDs, or tracking codes", originalField: "Reference Number", originalType: "string", originalPrompt: "Extract any additional reference numbers, transaction IDs, or tracking codes", status: 'original' },
        { id: 28, field: "Department", type: "string", prompt: "Identify the department, division, or cost center associated with the transaction", originalField: "Department", originalType: "string", originalPrompt: "Identify the department, division, or cost center associated with the transaction", status: 'original' },
        { id: 29, field: "Project Code", type: "string", prompt: "Find project codes, job numbers, or work order references", originalField: "Project Code", originalType: "string", originalPrompt: "Find project codes, job numbers, or work order references", status: 'original' },
        { id: 30, field: "Approval Status", type: "boolean", prompt: "Extract approval indicators, authorization codes, or verification stamps", originalField: "Approval Status", originalType: "boolean", originalPrompt: "Extract approval indicators, authorization codes, or verification stamps", status: 'original' }
    ]

    const [promptData, setPromptData] = useState<PromptItem[]>(initialPromptData)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [newField, setNewField] = useState('')
    const [newType, setNewType] = useState('string')
    const [newPrompt, setNewPrompt] = useState('')
    const [hasChanges, setHasChanges] = useState(false)

    const handleFieldChange = (id: number, newField: string) => {
        setPromptData(prev => prev.map(item =>
            item.id === id ? { ...item, field: newField } : item
        ))
        setHasChanges(true)
    }

    const handlePromptChange = (id: number, newPrompt: string) => {
        setPromptData(prev => prev.map(item =>
            item.id === id ? { ...item, prompt: newPrompt } : item
        ))
        setHasChanges(true)
    }

    const handleTypeChange = (id: number, newType: string) => {
        setPromptData(prev => prev.map(item =>
            item.id === id ? { ...item, type: newType } : item
        ))
        setHasChanges(true)
    }

    const isFieldModified = (item: PromptItem) => {
        return item.field !== item.originalField
    }

    const isPromptModified = (item: PromptItem) => {
        return item.prompt !== item.originalPrompt
    }

    const isTypeModified = (item: PromptItem) => {
        return item.type !== item.originalType
    }

    const isRowModified = (item: PromptItem) => {
        return isFieldModified(item) || isTypeModified(item) || isPromptModified(item)
    }

    const handleDeletePrompt = (id: number) => {
        setPromptData(prev => prev.map(item =>
            item.id === id ? { ...item, status: item.status === 'toDelete' ? 'original' : 'toDelete' } : item
        ))
        setHasChanges(true)
    }

    const handleSaveChanges = () => {
        // Filter out items marked for deletion
        const updatedData = promptData
            .filter(item => item.status !== 'toDelete')
            .map(item => ({
                ...item,
                originalField: item.field,
                originalType: item.type,
                originalPrompt: item.prompt,
                status: 'original' as const
            }))

        setPromptData(updatedData)
        setHasChanges(false)
        alert('Changes saved successfully!')
    }

    const getRowBorderClass = (item: PromptItem) => {
        if (item.status === 'new') {
            return 'bg-green-50 dark:bg-green-950'
        }
        if (item.status === 'toDelete') {
            return 'bg-red-50 dark:bg-red-950'
        }
        if (isRowModified(item)) {
            return 'bg-yellow-50 dark:bg-yellow-950'
        }
        return ''
    }

    const handleAddPrompt = () => {
        if (newField.trim() && newPrompt.trim()) {
            const newId = Math.max(...promptData.map(p => p.id)) + 1
            const newPromptItem: PromptItem = {
                id: newId,
                field: newField.trim(),
                type: newType,
                prompt: newPrompt.trim(),
                originalField: newField.trim(),
                originalType: newType,
                originalPrompt: newPrompt.trim(),
                status: 'new'
            }
            setPromptData([newPromptItem, ...promptData])
            setNewField('')
            setNewType('string')
            setNewPrompt('')
            setIsDialogOpen(false)
            setHasChanges(true)
        }
    }

    const handleCancel = () => {
        setNewField('')
        setNewType('string')
        setNewPrompt('')
        setIsDialogOpen(false)
    }

    const handleDownloadExcel = () => {
        console.log('Downloading Excel with prompt data:', promptData)
        // In a real implementation, this would generate and download an Excel file
        alert('Excel download started!')
    }

    return (
        <div className="flex flex-col h-full min-h-0">
            {/* Title Bar */}
            <div className="flex items-center justify-between p-4 border-b border-border bg-background shrink-0">
                <h1 className="text-2xl font-bold text-foreground">Prompt Management</h1>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleDownloadExcel}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground bg-muted hover:bg-muted/80 rounded-md transition-colors"
                    >
                        <Download className="h-4 w-4" />
                        Download Excel
                    </button>
                    <button
                        onClick={() => setIsDialogOpen(true)}
                        className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground bg-muted hover:bg-muted/80 rounded-md transition-colors"
                    >
                        Add Prompt
                    </button>
                    {hasChanges && (
                        <button
                            onClick={handleSaveChanges}
                            className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 rounded-md transition-colors"
                        >
                            Save Changes
                        </button>
                    )}
                </div>
            </div>

            {/* Table Container */}
            <div className="flex-1 min-h-0 pt-6">
                <div className="h-full flex flex-col border border-border rounded-lg overflow-hidden">
                    {/* Table Header */}
                    <div className="bg-surface-secondary border-b border-border flex-shrink-0">
                        <div className="grid gap-0" style={{ gridTemplateColumns: '4rem 1fr 120px 2fr 80px' }}>
                            <div className="px-2 py-3 font-semibold text-sm text-foreground border-r border-border text-center">
                                S.No
                            </div>
                            <div className="px-4 py-3 font-semibold text-sm text-foreground border-r border-border">
                                Field Name
                            </div>
                            <div className="px-4 py-3 font-semibold text-sm text-foreground border-r border-border">
                                Type
                            </div>
                            <div className="px-4 py-3 font-semibold text-sm text-foreground border-r border-border">
                                Prompt Description
                            </div>
                            <div className="px-4 py-3 font-semibold text-sm text-foreground text-center">
                                Actions
                            </div>
                        </div>
                    </div>

                    {/* Table Body */}
                    <div className="flex-1 overflow-auto min-h-0">
                        {promptData.length === 0 ? (
                            <div className="flex items-center justify-center h-full min-h-[200px]">
                                <div className="text-center">
                                    <div className="text-4xl text-muted-foreground mb-2">📝</div>
                                    <div className="text-lg font-medium text-muted-foreground mb-1">No Prompts</div>
                                    <div className="text-sm text-muted-foreground">Click "Add Prompt" to create your first prompt</div>
                                </div>
                            </div>
                        ) : (
                            promptData.map((item, index) => {
                                return (
                                    <div
                                        key={item.id}
                                        className={`grid gap-0 border-b border-border last:border-b-0 hover:bg-surface-secondary/50 transition-colors min-h-[4rem] ${getRowBorderClass(item)}`}
                                        style={{ gridTemplateColumns: '4rem 1fr 120px 2fr 80px' }}
                                    >
                                        <div className="px-2 py-3 border-r border-border flex items-center justify-center">
                                            <span className="font-medium text-sm">{index + 1}</span>
                                        </div>
                                        <div className="px-4 py-3 border-r border-border flex items-center">
                                            <input
                                                type="text"
                                                value={item.field}
                                                onChange={(e) => handleFieldChange(item.id, e.target.value)}
                                                disabled={item.status === 'toDelete'}
                                                className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-colors ${item.status === 'toDelete'
                                                    ? 'border-red-500 bg-red-50 dark:bg-red-950 dark:border-red-400 opacity-50 cursor-not-allowed'
                                                    : item.status === 'new'
                                                        ? 'border-green-500 bg-green-50 dark:bg-green-950 dark:border-green-400'
                                                        : isFieldModified(item)
                                                            ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950 dark:border-yellow-400'
                                                            : 'border-input bg-background'
                                                    }`}
                                            />
                                        </div>
                                        <div className="px-4 py-3 border-r border-border flex items-center">
                                            <select
                                                value={item.type}
                                                onChange={(e) => handleTypeChange(item.id, e.target.value)}
                                                disabled={item.status === 'toDelete'}
                                                className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-colors ${item.status === 'toDelete'
                                                    ? 'border-red-500 bg-red-50 dark:bg-red-950 dark:border-red-400 opacity-50 cursor-not-allowed'
                                                    : item.status === 'new'
                                                        ? 'border-green-500 bg-green-50 dark:bg-green-950 dark:border-green-400'
                                                        : isTypeModified(item)
                                                            ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950 dark:border-yellow-400'
                                                            : 'border-input bg-background'
                                                    }`}
                                            >
                                                <option value="string">String</option>
                                                <option value="number">Number</option>
                                                <option value="date">Date</option>
                                                <option value="boolean">Boolean</option>
                                                <option value="email">Email</option>
                                                <option value="phone">Phone</option>
                                                <option value="url">URL</option>
                                                <option value="array">Array</option>
                                                <option value="object">Object</option>
                                            </select>
                                        </div>
                                        <div className="px-4 py-3 border-r border-border flex items-center">
                                            <textarea
                                                value={item.prompt}
                                                onChange={(e) => handlePromptChange(item.id, e.target.value)}
                                                disabled={item.status === 'toDelete'}
                                                rows={3}
                                                className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 resize-none transition-colors ${item.status === 'toDelete'
                                                    ? 'border-red-500 bg-red-50 dark:bg-red-950 dark:border-red-400 opacity-50 cursor-not-allowed'
                                                    : item.status === 'new'
                                                        ? 'border-green-500 bg-green-50 dark:bg-green-950 dark:border-green-400'
                                                        : isPromptModified(item)
                                                            ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950 dark:border-yellow-400'
                                                            : 'border-input bg-background'
                                                    }`}
                                            />
                                        </div>
                                        <div className="px-4 py-3 flex items-center justify-center">
                                            <button
                                                onClick={() => handleDeletePrompt(item.id)}
                                                className={`p-2 rounded-md transition-colors ${item.status === 'toDelete'
                                                    ? 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                                                    : 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800'
                                                    }`}
                                                title={item.status === 'toDelete' ? 'Restore' : 'Delete'}
                                            >
                                                {item.status === 'toDelete' ? (
                                                    <RotateCcw className="h-4 w-4" />
                                                ) : (
                                                    <Trash2 className="h-4 w-4" />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                )
                            })
                        )}
                    </div>
                </div>
            </div>

            {/* Add Prompt Dialog */}
            {isDialogOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-background border border-border rounded-lg shadow-lg w-full max-w-md mx-4">
                        <div className="p-6">
                            <h2 className="text-lg font-semibold text-foreground mb-4">Add New Prompt</h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                                        Field Name
                                    </label>
                                    <input
                                        type="text"
                                        value={newField}
                                        onChange={(e) => setNewField(e.target.value)}
                                        placeholder="Enter field name..."
                                        className="w-full px-3 py-2 text-sm border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                                        Type
                                    </label>
                                    <select
                                        value={newType}
                                        onChange={(e) => setNewType(e.target.value)}
                                        className="w-full px-3 py-2 text-sm border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                    >
                                        <option value="string">String</option>
                                        <option value="number">Number</option>
                                        <option value="date">Date</option>
                                        <option value="boolean">Boolean</option>
                                        <option value="email">Email</option>
                                        <option value="phone">Phone</option>
                                        <option value="url">URL</option>
                                        <option value="array">Array</option>
                                        <option value="object">Object</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                                        Prompt Description
                                    </label>
                                    <textarea
                                        value={newPrompt}
                                        onChange={(e) => setNewPrompt(e.target.value)}
                                        placeholder="Enter prompt description..."
                                        rows={4}
                                        className="w-full px-3 py-2 text-sm border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 resize-none"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 mt-6">
                                <button
                                    onClick={handleCancel}
                                    className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground bg-muted hover:bg-muted/80 rounded-md transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAddPrompt}
                                    disabled={!newField.trim() || !newPrompt.trim()}
                                    className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors"
                                >
                                    Add Prompt
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}