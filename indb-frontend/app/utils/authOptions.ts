/** @module utils/authOptions
 * @description Provides authentication options, defines the providers, and custom logic such as token refresh rotation.
 */

import CredentialsProvider from 'next-auth/providers/credentials'
import { getServerSession, NextAuthOptions } from 'next-auth'
import { unAuthenticatedApi } from './api'
import { CredentialsException } from './exceptions'
import { logger } from './logger'
import {
    GetServerSidePropsContext,
    NextApiRequest,
    NextApiResponse,
} from 'next'

const log = logger.child({ module: 'auth_options' })

const MAX_JWT_EXPIRY = 1 * 60 * 1000

/**
 * Performs the refresh token process by calling the route that handles backend refresh token call.
 * @param {Object} token - The token object
 * @param {string} token.refresh_token - The refresh token
 * @returns {Object} - Refreshed token object
 */
async function refreshAccessToken(token: any) {
    try {
        const response = await fetch(
            'http://localhost:3000/api/auth/refresh-token',
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refreshToken: token.refresh_token }),
            }
        )

        const data = await response.json()

        if (!response.ok) {
            throw new Error(data.error)
        }
        return {
            ...token,
            access_token: data.accessToken,
            accessTokenExpires: new Date(Date.now() + MAX_JWT_EXPIRY),
            refresh_token: data.refreshToken,
        }
    } catch (error: any) {
        log.error(`Failed to refresh access token: ${error.message}`)
        return {
            ...token,
            error: 'Failed to refresh access token',
        }
    }
}

/** @type {NextAuthOptions} - Auth options object for next-auth */
export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                username: {
                    label: 'Username',
                    type: 'text',
                    placeholder: 'username',
                },
                password: { label: 'Password', type: 'password' },
            },

            async authorize(credentials) {
                if (credentials) {
                    
                    try {
                        const response = await unAuthenticatedApi.post(
                            `/security/login`,
                            {
                                username: credentials.username,
                                password: credentials.password,
                                provider: 'db',
                                refresh: true,
                            }
                        )
                        return {
                            username: credentials.username,
                            accessToken: response.data.access_token,
                            refreshToken: response.data.refresh_token,
                        }
                    } catch (e: any) {
                        log.error(e.response.data.message)
                        throw new Error(e.response.data.message)
                    }
                } else {
                    log.error('Credentials are required')
                    throw new CredentialsException()
                }
            },
        }),
    ],
    callbacks: {
        session: async ({ session, token }) => {
            session.user = {
                username: token.username,
                access_token: token.access_token,
                refresh_token: token.refresh_token,
                accessTokenExpires: token.accessTokenExpires,
                error: token.error,
            }
            return session
        },
        jwt: async ({ token, user }: { token: any; user: any }) => {
            // Initial sign in
            if (user) {
                return {
                    ...token,
                    username: user.username,
                    access_token: user.accessToken,
                    accessTokenExpires: new Date(Date.now() + MAX_JWT_EXPIRY),
                    refresh_token: user.refreshToken,
                }
            }

            // Return previous token if the access token has not expired yet
            if (new Date() < new Date(token.accessTokenExpires)) {
                return token
            }

            return await refreshAccessToken(token)
        },
    },
    session: {
        strategy: 'jwt',
    },
    secret: process.env.NEXTAUTH_SECRET,
    debug: process.env.NODE_ENV === 'development',
    pages: {
        signIn: '/auth/login',
        error: '/error',
    },
}

/**
 * Utility function to get server session in various server-side contexts.
 * @param {...(GetServerSidePropsContext['req']|NextApiRequest)} args - The request and response objects
 * @returns {Promise<import('next-auth').Session>} - The session object
 */
export function auth(
    ...args:
        | [GetServerSidePropsContext['req'], GetServerSidePropsContext['res']]
        | [NextApiRequest, NextApiResponse]
        | []
) {
    return getServerSession(...args, authOptions)
}

export default authOptions