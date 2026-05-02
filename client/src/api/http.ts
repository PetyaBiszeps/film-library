import {
  $fetch
} from 'ofetch'

export default $fetch.create({
  baseURL: import.meta.env.VITE_APP_API_URL as string,
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
    // 'Authorization': `Bearer ${import.meta.env.VITE_APP_API_BEARER as string}`
  }

  // async onRequest(context) {},
  // async onResponse(context) {},
  // async onResponseError(context) {}
})
