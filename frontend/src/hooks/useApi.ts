import { useState, useEffect, useCallback } from 'react'
import type { AxiosResponse, AxiosError } from 'axios'

// Generic API hook for handling async operations
export interface UseApiOptions {
    immediate?: boolean // Execute immediately on mount
    onSuccess?: (data: any) => void
    onError?: (error: any) => void
}

export interface UseApiState<T> {
    data: T | null
    loading: boolean
    error: string | null
    execute: (...args: any[]) => Promise<T>
    reset: () => void
}

export function useApi<T = any>(
    apiFunction: (...args: any[]) => Promise<AxiosResponse<T>>,
    options: UseApiOptions = {}
): UseApiState<T> {
    const [data, setData] = useState<T | null>(null)
    const [loading, setLoading] = useState(options.immediate ?? false)
    const [error, setError] = useState<string | null>(null)

    const execute = useCallback(async (...args: any[]): Promise<T> => {
        try {
            setLoading(true)
            setError(null)

            const response = await apiFunction(...args)
            const result = response.data

            setData(result)

            if (options.onSuccess) {
                options.onSuccess(result)
            }

            return result
        } catch (err: any) {
            const errorMessage = extractErrorMessage(err)
            setError(errorMessage)

            if (options.onError) {
                options.onError(err)
            }

            throw err
        } finally {
            setLoading(false)
        }
    }, [apiFunction, options.onSuccess, options.onError])

    const reset = useCallback(() => {
        setData(null)
        setLoading(false)
        setError(null)
    }, [])

    // Execute immediately if specified
    useEffect(() => {
        if (options.immediate) {
            execute()
        }
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    return {
        data,
        loading,
        error,
        execute,
        reset,
    }
}

// Hook for handling multiple API calls
export interface UseMultipleApiState<T extends Record<string, any>> {
    data: T
    loading: boolean
    errors: Record<keyof T, string | null>
    execute: (key: keyof T, ...args: any[]) => Promise<void>
    executeAll: () => Promise<void>
    reset: (key?: keyof T) => void
}

export function useMultipleApi<T extends Record<string, any>>(
    apis: Record<keyof T, (...args: any[]) => Promise<AxiosResponse<any>>>,
    options: UseApiOptions = {}
): UseMultipleApiState<T> {
    const [data, setData] = useState<T>({} as T)
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState<Record<keyof T, string | null>>({} as Record<keyof T, string | null>)

    const execute = useCallback(async (key: keyof T, ...args: any[]) => {
        try {
            setLoading(true)
            setErrors(prev => ({ ...prev, [key]: null }))

            const response = await apis[key](...args)
            const result = response.data

            setData(prev => ({ ...prev, [key]: result }))

            if (options.onSuccess) {
                options.onSuccess({ key, data: result })
            }
        } catch (err: any) {
            const errorMessage = extractErrorMessage(err)
            setErrors(prev => ({ ...prev, [key]: errorMessage }))

            if (options.onError) {
                options.onError({ key, error: err })
            }
        } finally {
            setLoading(false)
        }
    }, [apis, options.onSuccess, options.onError])

    const executeAll = useCallback(async () => {
        setLoading(true)
        setErrors({} as Record<keyof T, string | null>)

        const promises = Object.entries(apis).map(async ([key, apiFunction]) => {
            try {
                const response = await (apiFunction as Function)()
                return { key, data: response.data, error: null }
            } catch (err: any) {
                return { key, data: null, error: extractErrorMessage(err) }
            }
        })

        try {
            const results = await Promise.allSettled(promises)
            const newData = {} as T
            const newErrors = {} as Record<keyof T, string | null>

            results.forEach((result, index) => {
                if (result.status === 'fulfilled') {
                    const { key, data, error } = result.value
                    newData[key as keyof T] = data
                    newErrors[key as keyof T] = error
                } else {
                    const key = Object.keys(apis)[index]
                    newErrors[key as keyof T] = 'Failed to execute API call'
                }
            })

            setData(newData)
            setErrors(newErrors)
        } finally {
            setLoading(false)
        }
    }, [apis])

    const reset = useCallback((key?: keyof T) => {
        if (key) {
            setData(prev => ({ ...prev, [key]: undefined }))
            setErrors(prev => ({ ...prev, [key]: null }))
        } else {
            setData({} as T)
            setErrors({} as Record<keyof T, string | null>)
            setLoading(false)
        }
    }, [])

    return {
        data,
        loading,
        errors,
        execute,
        executeAll,
        reset,
    }
}

// Hook for pagination
export interface UsePaginationOptions extends UseApiOptions {
    initialPage?: number
    initialLimit?: number
}

export interface UsePaginationState<T> {
    data: T[]
    loading: boolean
    error: string | null
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
    fetchPage: (page: number) => Promise<void>
    nextPage: () => Promise<void>
    prevPage: () => Promise<void>
    setPageSize: (limit: number) => Promise<void>
    refresh: () => Promise<void>
    reset: () => void
}

export function usePagination<T = any>(
    apiFunction: (page: number, limit: number, ...args: any[]) => Promise<AxiosResponse<{
        data: T[]
        pagination: {
            page: number
            limit: number
            total: number
            totalPages: number
            hasNext: boolean
            hasPrev: boolean
        }
    }>>,
    options: UsePaginationOptions = {}
): UsePaginationState<T> {
    const [data, setData] = useState<T[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [page, setPage] = useState(options.initialPage ?? 1)
    const [limit, setLimit] = useState(options.initialLimit ?? 10)
    const [pagination, setPagination] = useState({
        total: 0,
        totalPages: 0,
        hasNext: false,
        hasPrev: false,
    })

    const fetchPage = useCallback(async (newPage: number, ...args: any[]) => {
        try {
            setLoading(true)
            setError(null)

            const response = await apiFunction(newPage, limit, ...args)
            const result = response.data

            setData(result.data)
            setPagination(result.pagination)
            setPage(newPage)

            if (options.onSuccess) {
                options.onSuccess(result)
            }
        } catch (err: any) {
            const errorMessage = extractErrorMessage(err)
            setError(errorMessage)

            if (options.onError) {
                options.onError(err)
            }
        } finally {
            setLoading(false)
        }
    }, [apiFunction, limit, options.onSuccess, options.onError])

    const nextPage = useCallback(async () => {
        if (pagination.hasNext) {
            await fetchPage(page + 1)
        }
    }, [fetchPage, page, pagination.hasNext])

    const prevPage = useCallback(async () => {
        if (pagination.hasPrev) {
            await fetchPage(page - 1)
        }
    }, [fetchPage, page, pagination.hasPrev])

    const setPageSize = useCallback(async (newLimit: number) => {
        setLimit(newLimit)
        await fetchPage(1) // Reset to first page when changing page size
    }, [fetchPage])

    const refresh = useCallback(async () => {
        await fetchPage(page)
    }, [fetchPage, page])

    const reset = useCallback(() => {
        setData([])
        setLoading(false)
        setError(null)
        setPage(options.initialPage ?? 1)
        setLimit(options.initialLimit ?? 10)
        setPagination({
            total: 0,
            totalPages: 0,
            hasNext: false,
            hasPrev: false,
        })
    }, [options.initialPage, options.initialLimit])

    // Execute immediately if specified
    useEffect(() => {
        if (options.immediate) {
            fetchPage(page)
        }
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    return {
        data,
        loading,
        error,
        page,
        limit,
        total: pagination.total,
        totalPages: pagination.totalPages,
        hasNext: pagination.hasNext,
        hasPrev: pagination.hasPrev,
        fetchPage,
        nextPage,
        prevPage,
        setPageSize,
        refresh,
        reset,
    }
}

// Utility function to extract error message
function extractErrorMessage(error: AxiosError | Error | any): string {
    if (error?.response?.data?.message) {
        return error.response.data.message
    }

    if (error?.response?.data?.error) {
        return error.response.data.error
    }

    if (error?.message) {
        return error.message
    }

    if (typeof error === 'string') {
        return error
    }

    return 'An unexpected error occurred'
}

// Hook for handling file uploads with progress
export interface UseUploadState {
    uploading: boolean
    progress: number
    error: string | null
    uploadedFile: any | null
    upload: (file: File) => Promise<any>
    reset: () => void
}

export function useUpload(
    uploadFunction: (file: File, onProgress?: (progress: number) => void) => Promise<AxiosResponse<any>>,
    options: UseApiOptions = {}
): UseUploadState {
    const [uploading, setUploading] = useState(false)
    const [progress, setProgress] = useState(0)
    const [error, setError] = useState<string | null>(null)
    const [uploadedFile, setUploadedFile] = useState<any | null>(null)

    const upload = useCallback(async (file: File) => {
        try {
            setUploading(true)
            setProgress(0)
            setError(null)

            const response = await uploadFunction(file, (progressEvent: any) => {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
                setProgress(percentCompleted)
            })

            const result = response.data
            setUploadedFile(result)

            if (options.onSuccess) {
                options.onSuccess(result)
            }

            return result
        } catch (err: any) {
            const errorMessage = extractErrorMessage(err)
            setError(errorMessage)

            if (options.onError) {
                options.onError(err)
            }

            throw err
        } finally {
            setUploading(false)
            setProgress(0)
        }
    }, [uploadFunction, options.onSuccess, options.onError])

    const reset = useCallback(() => {
        setUploading(false)
        setProgress(0)
        setError(null)
        setUploadedFile(null)
    }, [])

    return {
        uploading,
        progress,
        error,
        uploadedFile,
        upload,
        reset,
    }
}