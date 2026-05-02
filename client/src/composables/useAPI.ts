import http from '@/api/http.ts'
import type {
  // IApiConfig,
  RequestOptions
} from '@/types'

export default () => {
  const request = <T>(url: string, options: RequestOptions): Promise<T> => {
    return http<T>(url, options)
  }

  return {
    get: <T>(url: string, options: RequestOptions = {}) => request<T>(url, {
      method: 'GET',

      ...options
    }),
    post: <T>(url: string, options: RequestOptions = {}) => request<T>(url, {
      body: options.body,
      method: 'POST',

      ...options
    }),
    put: <T>(url: string, options: RequestOptions = {}) => request<T>(url, {
      body: options.body,
      method: 'PUT',

      ...options
    }),
    patch: <T>(url: string, options: RequestOptions = {}) => request<T>(url, {
      body: options.body,
      method: 'PATCH',

      ...options
    }),
    delete: <T>(url: string, options: RequestOptions = {}) => request<T>(url, {
      method: 'DELETE',

      ...options
    })
  }
}
