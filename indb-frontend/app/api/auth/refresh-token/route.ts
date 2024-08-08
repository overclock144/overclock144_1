/** @module refresh-token route that calls backend api
 * to refresh the auth access_token
 */

import { NextRequest, NextResponse } from 'next/server'

import { authenticatedApi } from '@/app/utils/api'
import { logger } from '@/app/utils/logger'

const log = logger.child({ module: 'refresh_token' })

async function handler(req: NextRequest) {
    if (req.method !== 'POST') {
        return NextResponse.json(
            { error: `Method ${req.method} Not Allowed` },
            { status: 405 }
        )
    }

    const { refreshToken } = await req.json()

    if (!refreshToken) {
        return NextResponse.json(
            { error: 'Refresh token is required' },
            { status: 400 }
        )
    }

    try {
        // add the refresh token in the headers
        authenticatedApi.defaults.headers.Authorization = `Bearer ${refreshToken}`
        const response = await authenticatedApi.post(`/security/refresh`, {})

        if (response.status !== 200) {
            throw new Error('Failed to refresh access token')
        }

        return NextResponse.json(
            {
                accessToken: response.data.access_token,
                refreshToken: response.data.refresh_token ?? refreshToken,
            },
            { status: 200 }
        )
    } catch (error: any) {
        log.error(`Failed to refresh access token: ${error.message}`)
        return NextResponse.json(
            { error: 'Failed to refresh access token' },
            { status: 500 }
        )
    }
}

export { handler as GET, handler as POST }
