import type {
  FetchOptions
} from 'ofetch'

// export interface IApiConfig {
//   onRequest?: FetchOptions['onRequest']
//   onResponse?: FetchOptions['onResponse']
//   onResponseError?: FetchOptions['onResponseError']
// }

export type RequestOptions = FetchOptions<'json'>
