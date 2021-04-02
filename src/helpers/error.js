const error = (error, message) => {
    const parser = {
        400: 'Bad Request',
        401: 'Unauthorized',
        500: 'Internal Server Error'
    }
    const name = parser.error
    return { error, name, message }
}

export default error
