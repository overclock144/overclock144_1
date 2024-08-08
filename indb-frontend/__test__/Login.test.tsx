import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import LoginPage from '../app/auth/login/page'

vi.mock('next/navigation', () => {
    const actual = vi.importActual('next/navigation')
    return {
        ...actual,
        useRouter: vi.fn(() => ({
            push: vi.fn(),
        })),
        useSearchParams: vi.fn(() => ({
            get: vi.fn(),
        })),
        usePathname: vi.fn(),
    }
})

describe('Login page', () => {
    it('renders correctly', () => {
        render(<LoginPage />)

        // Check Header
        expect(screen.getByText('Login')).toBeInTheDocument()

        // Check Greeting Text
        expect(screen.getByText('Welcome back')).toBeInTheDocument()

        // Check Input Boxes
        expect(screen.getByPlaceholderText('Username')).toBeInTheDocument()
        expect(screen.getByPlaceholderText('Password')).toBeInTheDocument()

        // Check Submit Button
        expect(
            screen.getByRole('button', { name: 'Submit' })
        ).toBeInTheDocument()

        // Check Policies and Terms
        expect(screen.getByText('Terms of Service')).toBeInTheDocument()
        expect(screen.getByText('Privacy Policy')).toBeInTheDocument()
    })
})
