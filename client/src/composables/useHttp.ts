import axios from 'axios'
import type {
  AxiosInstance,
  AxiosResponse,
  AxiosRequestConfig
} from 'axios'

export default () => {
  const instance: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_APP_API_URL,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    timeout: 10000
  })

  const request = async <T, D = unknown>(config: AxiosRequestConfig<D>): Promise<T> => {
    const response: AxiosResponse<T> = await instance(config)

    return response.data
  }

  return {
    instance,

    get: <T, D = unknown>(url: string, config?: AxiosRequestConfig<D>) => request<T, D>({
      ...config,

      method: 'GET',
      url: url
    }),
    post: <T, D = unknown>(url: string, config?: AxiosRequestConfig<D>, data?: D) => request<T, D>({
      ...config,

      method: 'POST',
      data: data,
      url: url
    }),
    put: <T, D = unknown>(url: string, config?: AxiosRequestConfig<D>, data?: D) => request<T, D>({
      ...config,

      method: 'PUT',
      data: data,
      url: url
    }),
    patch: <T, D = unknown>(url: string, config?: AxiosRequestConfig<D>, data?: D) => request<T, D>({
      ...config,

      method: 'PATCH',
      data: data,
      url: url
    }),
    delete: <T, D = unknown>(url: string, config?: AxiosRequestConfig<D>) => request<T, D>({
      ...config,

      method: 'DELETE',
      url: url
    })
  }
}
