import { describe, it, expect, vi } from 'vitest'
import { authenticatedApi } from '../../app/utils/api'
import { getHealthCheckData } from '../../app/services/healthCheck'

// Mock the authenticatedApi.get method
vi.mock('../../app/utils/api', () => ({
    authenticatedApi: {
        get: vi.fn(),
    },
}))

describe('getHealthCheckData', () => {
    it('returns data when response is successful', async () => {
        const mockData = { message: 'Service is healthy' }
        vi.mocked(authenticatedApi.get).mockResolvedValue({
            status: 200,
            data: mockData,
        })

        const data = await getHealthCheckData()
        expect(data).toEqual(mockData)
    })

    it('throws an error when the request fails', async () => {
        const errorMessage = 'Network Error'
        vi.mocked(authenticatedApi.get).mockRejectedValue(
            new Error(errorMessage)
        )

        await expect(getHealthCheckData()).rejects.toThrow(errorMessage)
    })
})
