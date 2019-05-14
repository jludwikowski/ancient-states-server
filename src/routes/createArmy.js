import playerActions from '../doActions';

/* This is only for managing request and responces */
module.exports = {
    method: 'POST',
    path: '/api/players/{id}/armies',
    handler: async (request, responseToolkit) => {
        try {
            return playerActions.runAction('CreateArmy', request.payload, request.params.id);
        } catch (err) {
            /* We won't pass exact error due to security reasons */
            return responseToolkit.response({
                statusCode: 500,
                error: 'Server Error',
                message: 'Server Error. Please contact administrator',
            }).code(500);
        }
    },
    options: {
        auth: false,
    },
};
