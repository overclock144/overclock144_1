import { authenticatedApi } from '@/app/utils/api'

export const getHealthCheckData = async () => {
    try {
        const resp = await authenticatedApi.get(`/healthcheck/health`)
        if (resp.status === 200) {
            return resp.data
        }
    } catch (error: any) {
        throw new Error(error.message)
    }
}
