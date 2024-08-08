const ErrorMessages = ({ errors }: { errors: string[] }) => {
    if (errors.length === 0) return null

    const text = errors.join(', ')

    return (
        <div className="w-full flex justify-start items-center p-2 rounded bg-red-200 text-red-900 peer">
            {text}
        </div>
    )
}

export { ErrorMessages }
