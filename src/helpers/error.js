const error = (error, message) => {
    let name = "";
    switch (error) {
        case 400:
            name = "Bad Request";
            break;
        case 401:
            name = "Unauthorized";
            break;
        case 500:
            name = "Internal Server Error";
            break;
    }
    return { error, name, message };
}

export default error;