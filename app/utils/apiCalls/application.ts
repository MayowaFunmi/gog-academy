import axios from 'axios'
import { getApiEndpoint } from './Environment.helpers'
import { getSession } from 'next-auth/react'

const apiClient = axios.create({
  // maxContentLength = 1000 * 1024 * 1024;
  baseURL: getApiEndpoint(),
  headers: {
    Accept: 'application/json'
  },
})

apiClient.interceptors.request.use(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async (config: any) => {
    try {
      const session = await getSession()
      if (session?.token) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${session.token}`,
        };
      }
    } catch (error) {
      console.error("Error in request interceptor:", error);
    }
    return config
  },
  function (error) {
    // Handle errors from the request setup
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
      return response
  },
  (error) => {      
      return Promise.reject(error)
  },
)

export { apiClient }