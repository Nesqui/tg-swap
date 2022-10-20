import type { AxiosInstance } from 'axios'
import axios from 'axios'

let axiosClient: AxiosInstance
// let socketClient: Socket

export function initApi() {
  axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_URI,
  })

  axiosClient.interceptors.response.use(
    (response) => {
      debug('Response', response.data)
      const { code, error } = response.data
      if (error) {
        return Promise.reject(
          new Error(`code: ${code}, message: ${error}`),
        )
      }
      return response
    },
    async (error) => {
      const { response } = error
      debug('Error', response.data)
    },
  )
}

export function useApi() {
  if (!axiosClient) {
    throw new Error('axiosClient is not initialized, please use `initApi` first')
  }
  return { axiosClient }
}

function debug(...args) {
  import.meta.env.DEV && console.log('[API]', args)
}
