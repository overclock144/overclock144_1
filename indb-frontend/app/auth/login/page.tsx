'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useState, ChangeEvent } from 'react'
import { z } from 'zod'
import { signIn } from 'next-auth/react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

import Button from '@/app/components/Button'
import TextInput from '@/app/components/Inputs/TextInput'

const schema = z.object({
    username: z.string().min(2, 'Username is not valid.'),
    password: z.string().min(2, 'Password must be at least 6 characters'),
})

const LoginPage: React.FC = () => {
    const [username, setUsername] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [validationErrors, setValidationErrors] = useState({
        username: Array<string>(),
        password: Array<string>(),
    })
    const router = useRouter()

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        if (name === 'username') {
            setUsername(value)
        } else if (name === 'password') {
            setPassword(value)
        }

        // Clear the validation error for the specific field
        setValidationErrors((prevErrors) => ({
            ...prevErrors,
            [name]: [],
        }))
    }

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const data: { username: string; password: string } = {
            username,
            password,
        }
        try {
            // Validate the form data
            const validatedData = schema.parse(data)
            const response = await signIn('credentials', {
                ...validatedData,
                redirect: false,
            })

            if (response?.error) {
                toast.error(response.error)
                return
            }

            if (response?.ok) {
                router.push('/')
            }
        } catch (error: any) {
            if (error instanceof z.ZodError) {
                // Handle validation errors
                setValidationErrors(
                    (error as z.ZodError).flatten().fieldErrors as {
                        username: string[]
                        password: string[]
                    }
                )
            }
        }
    }

    return (
        <div className="w-full h-screen flex justify-center items-center">
            <div className="w-full lg:w-1/4 md:w-1/2 p-6">
                <form
                    action=""
                    onSubmit={onSubmit}
                    className="w-full flex flex-col justify-center items-center space-y-10"
                >
                    <div className="w-full flex justify-center items-center">
                        <Image
                            src="/logo.png"
                            width="200"
                            height="200"
                            alt="INDB logo"
                        />
                    </div>
                    <div className="w-full flex flex-col justify-center items-center space-y-4">
                        <h1 className="text-3xl font-bold text-indbdark-950">
                            Login
                        </h1>
                        <p className="text-indblight-900">Welcome back</p>
                    </div>
                    <div className="w-full flex flex-col justify-center items-center space-y-4">
                        <TextInput
                            name="username"
                            placeholder="Username"
                            type="text"
                            onchange={handleInputChange}
                            errors={validationErrors.username || []}
                        />
                        <TextInput
                            name="password"
                            placeholder="Password"
                            type="password"
                            onchange={handleInputChange}
                            errors={validationErrors.password || []}
                        />
                    </div>
                    <div className="w-full">
                        <Button
                            type="submit"
                            primary={true}
                            fullWidth={true}
                            text="Submit"
                        />
                    </div>
                    <div className="w-full">
                        <p className="text-sm text-indblight-900 text-center">
                            By clicking submit, you agree to our
                            <Link
                                href="/terms"
                                className="text-indblight-700 cursor-pointer"
                            >
                                {' '}
                                Terms of Service
                            </Link>{' '}
                            and
                            <Link
                                href="/privacy"
                                className="text-indblight-700 cursor-pointer"
                            >
                                {' '}
                                Privacy Policy
                            </Link>
                            .
                        </p>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default LoginPage
