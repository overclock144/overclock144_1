/** @module catch all error page */

'use client'

import Link from 'next/link'
import { RiErrorWarningFill } from 'react-icons/ri'

import Button from '@/app/components/Button'

type CaseResult = { path: string; btnText: string }

/** Checks the error message and return
 * path to go.
 * @param {string} message - error message
 * @returns {CaseResult} result - Case result of the path and
 * button text
 */
const errorCase: (message: string) => CaseResult = (message) => {
    const authKeywords = ['Auth', 'Token']
    let result: CaseResult = {
        path: '',
        btnText: '',
    }

    authKeywords.map((keyword) => {
        if (message.toLocaleLowerCase().includes(keyword.toLowerCase())) {
            result = { ...result, path: '/auth/login', btnText: 'Go to Login' }
        } else {
            result = { ...result, path: '/', btnText: 'Go Home' }
        }
    })
    return result
}

const error = ({ error, reset }: { error: Error; reset: () => void }) => {
    const authCase: CaseResult = errorCase(error.message)
    return (
        <main className="w-full h-screen flex justify-center items-center">
            <div className="w-full lg:w-3/5 shadow-lg rounded flex flex-col justify-center items-center space-y-10 p-10">
                <div className="w-full flex justify-center items-center space-x-4">
                    <RiErrorWarningFill className="text-red-600 text-5xl " />
                    <h4 className="text-red-600 text-3xl font-bold ">Error!</h4>
                </div>
                <div className="w-full lg:w-1/2">
                    <h1 className="text-lg text-center text-indbdark-950">
                        {error.message}
                    </h1>
                </div>
                <div className="w-full flex flex-col lg:flex-row justify-center items-center space-y-4 lg:space-y-0 space-x-0 lg:space-x-4">
                    <Link href={authCase.path}>
                        <Button
                            text={authCase.btnText}
                            type="button"
                            primary={true}
                        />
                    </Link>
                    <Button
                        text="Try Again"
                        type="button"
                        secondary={true}
                        onclick={reset}
                    />
                </div>
            </div>
        </main>
    )
}

export default error
