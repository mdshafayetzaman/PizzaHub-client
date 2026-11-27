import { toast as sonnerToast, type ExternalToast } from 'sonner'

const baseOptions: ExternalToast = {
  duration: 4000,
}

export const toast = {
  success(message: string, options?: ExternalToast) {
    return sonnerToast.success(message, { ...baseOptions, ...options })
  },
  error(message: string, options?: ExternalToast) {
    return sonnerToast.error(message, { ...baseOptions, duration: 5000, ...options })
  },
  warning(message: string, options?: ExternalToast) {
    return sonnerToast.warning(message, { ...baseOptions, ...options })
  },
  info(message: string, options?: ExternalToast) {
    return sonnerToast.info(message, { ...baseOptions, ...options })
  },
  loading(message: string, options?: ExternalToast) {
    return sonnerToast.loading(message, { ...baseOptions, ...options })
  },
  message(message: string, options?: ExternalToast) {
    return sonnerToast(message, { ...baseOptions, ...options })
  },
  dismiss(id?: string | number) {
    return sonnerToast.dismiss(id)
  },
  promise<T>(
    promise: Promise<T>,
    data: {
      loading: string
      success: string | ((data: T) => string)
      error: string | ((error: unknown) => string)
    },
    options?: ExternalToast
  ) {
    return sonnerToast.promise(promise, {
      ...baseOptions,
      ...options,
      loading: data.loading,
      success: data.success,
      error: data.error,
    })
  },
}

export default toast
