'use client'

import clsx from 'clsx'

interface ButtonProps {
    text: string
    onclick?: () => void
    primary?: boolean
    outlined?: boolean
    fullWidth?: boolean
    secondary?: boolean
    type?: 'button' | 'submit' | 'reset'
}

const Button: React.FC<ButtonProps> = ({
    text,
    onclick,
    primary,
    outlined,
    fullWidth,
    secondary,
    type,
}) => {
    return (
        <button
            type={type}
            onClick={onclick}
            className={clsx(
                `text-indbdark-950 px-8 py-2 hover:bg-indblight-400 transition duration-200 rounded-md`,
                primary && `bg-indblight-400 text-white hover:bg-indblight-600`,
                secondary &&
                    `bg-indblight-600 text-white hover:bg-indblight-400`,
                outlined &&
                    `border border-indblight-400 hover:bg-indblight-600 text-white`,
                fullWidth && `w-full`
            )}
        >
            {text}
        </button>
    )
}

export default Button
