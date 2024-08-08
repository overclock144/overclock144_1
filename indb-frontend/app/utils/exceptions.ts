/** @module utils/exceptions
 * contains custom exception class for error handling
 */

export class AuthRequiredException extends Error {
    /**AuthRequiredException Class
     * handles sitautions when the auth is required
     * to view a certian page.
     * @param {string} message - the error message
     * which will defualt to "Authentication is required to access this page."
     */

    constructor(
        message: string = 'Authentication is required to access this page.'
    ) {
        super(message)
        this.name = 'AuthRequiredException'
    }
}

export class CredentialsException extends Error {
    /**CredentialsException Class
     * handles sitautions when the credentials are not passed
     * @param {string} message - the error message
     * which will defualt to "Credentials are required."
     */

    constructor(message: string = 'Credentials are required.') {
        super(message)
        this.name = 'CredentialsException'
    }
}
