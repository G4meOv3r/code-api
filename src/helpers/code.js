const code = {
    400: (message) => {
        return { error: 400, name: "Bad Request", message: message };
    },
    401: (message) => {
        return { error: 401, name: "Unauthorized", message: message };
    },

    500: (message) => {
        return { error: 500, name: "Internal Server Error", message: message };
    }
}