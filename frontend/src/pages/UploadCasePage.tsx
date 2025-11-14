import { useState } from "react"
import { Upload, FileText, X } from "lucide-react"

interface UploadCasePageProps { }

export function UploadCasePage({ }: UploadCasePageProps) {
    const [formData, setFormData] = useState({
        caseTitle: "",
        clientName: "",
        caseType: "",
        priority: "",
        description: "",
        assignedTo: ""
    })
    const [uploadedFile, setUploadedFile] = useState<File | null>(null)
    const [isDragOver, setIsDragOver] = useState(false)

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            setUploadedFile(file)
        }
        // Reset the input value to allow selecting the same file again if needed
        event.target.value = ''
    }

    const handleDrop = (event: React.DragEvent) => {
        event.preventDefault()
        event.stopPropagation()
        setIsDragOver(false)
        const file = event.dataTransfer.files?.[0]
        if (file) {
            setUploadedFile(file)
        }
    }

    const handleDragOver = (event: React.DragEvent) => {
        event.preventDefault()
        event.stopPropagation()
        setIsDragOver(true)
    }

    const handleDragLeave = (event: React.DragEvent) => {
        event.preventDefault()
        event.stopPropagation()
        setIsDragOver(false)
    }

    const handleUploadClick = () => {
        const input = document.getElementById('fileInput') as HTMLInputElement
        if (input) {
            input.click()
        }
    }

    const removeFile = () => {
        setUploadedFile(null)
    }

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault()
        console.log('Submitting case:', { formData, file: uploadedFile })
        alert('Case uploaded successfully!')
        // Reset form
        setFormData({
            caseTitle: "",
            clientName: "",
            caseType: "",
            priority: "",
            description: "",
            assignedTo: ""
        })
        setUploadedFile(null)
    }

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes'
        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    return (
        <div className="flex flex-col h-full min-h-0">
            {/* Title Bar */}
            <div className="flex items-center justify-between p-6 border-b border-border bg-background shrink-0">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Upload DQA Case</h1>
                    <p className="text-muted-foreground mt-1">Create and upload new document quality assurance cases</p>
                </div>
                <button
                    type="submit"
                    form="upload-case-form"
                    className="px-6 py-2 text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors"
                    disabled={!formData.caseTitle || !formData.clientName || !formData.caseType || !formData.priority}
                >
                    Upload Case
                </button>
            </div>

            {/* Form Content */}
            <div className="flex-1 min-h-0 overflow-auto p-6">
                <form id="upload-case-form" onSubmit={handleSubmit} className="max-w-7xl mx-auto">
                    {/* Input Fields Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {/* Case Title */}
                        <div className="space-y-2">
                            <label htmlFor="caseTitle" className="block text-sm font-medium text-foreground">
                                Case Title *
                            </label>
                            <input
                                id="caseTitle"
                                type="text"
                                value={formData.caseTitle}
                                onChange={(e) => handleInputChange('caseTitle', e.target.value)}
                                placeholder="Enter case title..."
                                required
                                className="w-full px-3 py-2 text-sm border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-colors"
                            />
                        </div>

                        {/* Client Name */}
                        <div className="space-y-2">
                            <label htmlFor="clientName" className="block text-sm font-medium text-foreground">
                                Client Name *
                            </label>
                            <input
                                id="clientName"
                                type="text"
                                value={formData.clientName}
                                onChange={(e) => handleInputChange('clientName', e.target.value)}
                                placeholder="Enter client name..."
                                required
                                className="w-full px-3 py-2 text-sm border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-colors"
                            />
                        </div>

                        {/* Case Type */}
                        <div className="space-y-2">
                            <label htmlFor="caseType" className="block text-sm font-medium text-foreground">
                                Case Type *
                            </label>
                            <select
                                id="caseType"
                                value={formData.caseType}
                                onChange={(e) => handleInputChange('caseType', e.target.value)}
                                required
                                className="w-full px-3 py-2 text-sm border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-colors"
                            >
                                <option value="">Select case type...</option>
                                <option value="invoice">Invoice Processing</option>
                                <option value="contract">Contract Review</option>
                                <option value="receipt">Receipt Validation</option>
                                <option value="purchase-order">Purchase Order</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        {/* Priority */}
                        <div className="space-y-2">
                            <label htmlFor="priority" className="block text-sm font-medium text-foreground">
                                Priority *
                            </label>
                            <select
                                id="priority"
                                value={formData.priority}
                                onChange={(e) => handleInputChange('priority', e.target.value)}
                                required
                                className="w-full px-3 py-2 text-sm border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-colors"
                            >
                                <option value="">Select priority...</option>
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                                <option value="urgent">Urgent</option>
                            </select>
                        </div>

                        {/* Assigned To */}
                        <div className="space-y-2">
                            <label htmlFor="assignedTo" className="block text-sm font-medium text-foreground">
                                Assigned To
                            </label>
                            <select
                                id="assignedTo"
                                value={formData.assignedTo}
                                onChange={(e) => handleInputChange('assignedTo', e.target.value)}
                                className="w-full px-3 py-2 text-sm border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-colors"
                            >
                                <option value="">Select assignee...</option>
                                <option value="john-smith">John Smith</option>
                                <option value="sarah-johnson">Sarah Johnson</option>
                                <option value="mike-davis">Mike Davis</option>
                                <option value="lisa-wilson">Lisa Wilson</option>
                                <option value="tom-brown">Tom Brown</option>
                            </select>
                        </div>

                        {/* Description */}
                        <div className="space-y-2 md:col-span-2 lg:col-span-1">
                            <label htmlFor="description" className="block text-sm font-medium text-foreground">
                                Description
                            </label>
                            <textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => handleInputChange('description', e.target.value)}
                                placeholder="Enter case description..."
                                rows={3}
                                className="w-full px-3 py-2 text-sm border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 resize-none transition-colors"
                            />
                        </div>

                        {/* File Upload */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-foreground">
                                Document Upload
                            </label>

                            {!uploadedFile ? (
                                <div
                                    className={`relative w-full border-2 border-dashed rounded-md p-6 text-center transition-colors cursor-pointer ${isDragOver
                                        ? 'border-primary bg-primary/5'
                                        : 'border-muted-foreground/30 bg-background hover:border-primary/50 hover:bg-muted/20'
                                        }`}
                                    onDrop={handleDrop}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onClick={handleUploadClick}
                                >
                                    <div className="flex flex-col items-center space-y-3">
                                        <div className={`p-3 rounded-full ${isDragOver ? 'bg-primary/20' : 'bg-primary/10'}`}>
                                            <Upload className={`h-6 w-6 ${isDragOver ? 'text-primary' : 'text-primary'}`} />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium text-foreground">
                                                Browse file to upload
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                or drag and drop here
                                            </p>
                                        </div>
                                    </div>
                                    <input
                                        id="fileInput"
                                        type="file"
                                        onChange={handleFileUpload}
                                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                        className="hidden"
                                    />
                                </div>
                            ) : (
                                <div className="w-full p-3 text-sm border-2 border-dashed border-green-300 bg-green-50 dark:border-green-600 dark:bg-green-950/20 rounded-md">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <FileText className="h-5 w-5 text-green-600 dark:text-green-400" />
                                            <div>
                                                <span className="text-foreground font-medium">{uploadedFile.name}</span>
                                                <span className="text-xs text-muted-foreground ml-2">({formatFileSize(uploadedFile.size)})</span>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={removeFile}
                                            className="p-1 text-muted-foreground hover:text-destructive rounded transition-colors"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}