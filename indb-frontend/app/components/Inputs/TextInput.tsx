'use client'

import clsx from 'clsx'

import { ErrorMessages } from '@/app/components/ErrorMessage'

interface TextInputProps {
    label?: string
    name?: string
    placeholder?: string
    value?: string
    onchange: (e: React.ChangeEvent<HTMLInputElement>) => void
    errors?: string[]
    type?: 'text' | 'email' | 'password' | 'tel' | 'url'
}

const TextInput: React.FC<TextInputProps> = ({
    label,
    name,
    placeholder,
    value,
    onchange,
    errors = [],
    type,
}) => {
    return (
        <div className="w-full flex flex-col space-y-4">
            {label && (
                <label
                    htmlFor={name}
                    className="text-indbdark-950 font-medium mb-1"
                >
                    {label}
                </label>
            )}
            <input
                type={type}
                name={name}
                placeholder={placeholder}
                value={value}
                onChange={onchange}
                required={true}
                className={clsx(
                    `px-4 py-2 border border-indblight-300 rounded-md focus:outline-none focus:border-indblight-600 transition duration-200`
                )}
            />
            {errors.length > 0 && (
                <div className="w-full flex justify-center items-center">
                    <ErrorMessages errors={errors} />
                </div>
            )}
        </div>
    )
}

export default TextInput
