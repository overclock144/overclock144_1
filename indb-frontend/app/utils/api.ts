/** @module utils/api Axios instances for communicating with
 * protected and unprotected api routes from the backend.
 */

import axios from 'axios'
import { Session } from 'next-auth'

import { auth } from './authOptions'
import { logger } from '@/app/utils/logger'
import { AuthRequiredException } from './exceptions'

const BASE_URL = process.env.NEXT_APP_API_URL
const log = logger.child({ module: 'api_instances' })

// create unauthenticated axios instance
const unAuthenticatedApi = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
})

// Create an authenticated  axios instance
const authenticatedApi = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
})

// Request interceptor for add the token to the headers
authenticatedApi.interceptors.request.use(async (request) => {
    const session:
        | (Session & { user: { access_token: string; username: string } })
        | null = await auth()
    if (session && session.user.access_token) {
        request.headers.Authorization = `Bearer ${session.user.access_token}`
    }
    return request
})

// Response interceptor for error handling.
authenticatedApi.interceptors.response.use(
    (response) => {
        return response
    },
    (error) => {
        if (error.response.status === 401) {
            log.error(error.response.data.msg)
            throw new AuthRequiredException(error.response.data.msg)
        }
        log.error(error.response.data.msg)
        return Promise.reject(error.response.data.msg)
    }
)

export { authenticatedApi, unAuthenticatedApi }
