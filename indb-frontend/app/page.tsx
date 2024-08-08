import { getHealthCheckData } from '@/app/services/healthCheck'

export default async function Home() {
    const { message } = await getHealthCheckData()
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
                <h1>Home Page status: {message ? message : 'bad'}</h1>
            </div>
        </main>
    )
}
