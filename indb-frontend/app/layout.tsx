import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import { Toaster } from 'react-hot-toast'

import './globals.css'

const poppins = Poppins({
    weight: ['100', '400', '800', '900'],
    subsets: ['latin'],
})

export const metadata: Metadata = {
    title: 'INDB Data Platform',
    description: 'INDB Data Platform',
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
            <body className={poppins.className}>
                {children}
                <Toaster position="bottom-right" />
            </body>
        </html>
    )
}
