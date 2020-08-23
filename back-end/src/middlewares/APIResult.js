const errors = {
    // HTTP ERROR 5xx
    INTERNAL_SERVER_ERROR: {code: 500, message: "Internal server error."},
    // HTTP ERROR 4xx
    BAD_URI: {code: 400, message: "Bad URI"},
    WRONG_PARAMETERS: {code: 400, message: "Request contains wrong parameters."},
    MISSING_PARAMETERS: {code: 400, message: "Request is missing parameters."},
    
    NON_EXISTENT_CATEGORY: {code: 404, message: "The category doesn't exist."},
    NON_EXISTENT_ARTICLE: {code: 404, message: "The article doesn't exist."},
    NON_EXISTENT_REDACTOR: {code: 404, message: "The redactor doesn't exist."},
    
    // SUSCRIBER ERRORS
    SUBSCRIBER_DOESNT_EXIST: {code: 404, message: "The subscriber does not exist."},
    SUBSCRIBER_ALREADY_REGISTERED: {code: 409, message: "The email is already registered to newsletter."},
    INVALID_SUBSCRIBER_TOKEN: {code: 401, message: "Authentication token and email don't match."},

    // AUTHENTIFICATION ERROR
    NO_AUTHENTIFICATION_PROVIDED: {code: 401, message: "No authentification provided."},
    WRONG_AUTH_TYPE: {code: 401, message: "Wrong authentification type."},
    BAD_AUTHENTIFICATION_TYPE: {code: 403, message: "Bad authentication type."},
    BAD_AUTH_CREDENTIALS: {code: 403, message: "Bad authentification credentials."}
};

export const APIError = (req, res, next) => {
    /**
     * @param {String} reason Object Error reason
     */
    res.APIError = (reason) => {
        if(!errors[reason])
            reason = 'INTERNAL_SERVER_ERROR';

        return res.status(errors[reason].code).send({
            error: {
                status: errors[reason].code,
                message: errors[reason].message
                // message: reason,
            }
        });
    };
    
    next();
};

export const APISuccess = (req, res, next) => {
    /**
     * @param {Number} status HTTP status code
     * @param {Object} data HTTP response data
     */
    res.APISuccess = (status, data) => {
        return res.status(status).send({data});
    };

    next();
};